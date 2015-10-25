var express = require('express');
var app = express();
var mongo = require('mongodb');
var monk = require('monk');
var http = require('http');
var db = monk('localhost:27017/ocpartyreg');
var bodyParser = require('body-parser');
var port = 3000;
var max_distance = 150*0.3048; //metres


app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use('/', express.static(__dirname + '/'));
app.use('/bs', express.static(__dirname + '/lib/bootstrap-3.3.4-dist/css'));
app.use('/fonts', express.static(__dirname + '/lib/bootstrap-3.3.4-dist/fonts'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// REST API for notification
app.use('/api/notify', function (req, res) {
    // match loggedTime with db and use that element to send a text
    db.get('parties').find({
        loggedTime: parseInt(req.body.id)
    }, function (err, docs) {
        if (err) {
            throw err;
        }
        var message= "Hello " + docs[0].name + ". An anonymous complaint has been made about the noise level at your party. Please notify any parties at your residence of this warning.";
        sendText(docs[0].number, message);
    });
    res.end();
});


app.use('/api/getparties', function (req, res) {
    var today = new Date;
    string_date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    var query = { 
        $or: [
            {"startTime": new RegExp('^' + string_date)}, 
            {"endTime": new RegExp('^' + string_date)}
        ] 
    };
    db.get('parties').find(query, function (err, docs) {
		res.json(docs.filter(function(el) { return locations_within_distance(el.latitude, el.longitude, req.body.latitude, req.body.longitude);}));
    });
});

// REST API to register a party
app.post('/api/registerParty', function (req, res) {
    var message= "Hi there " + req.body.name.split()[0] + "! Thanks for registering your party. You will be notified at this number of any noise complaints.";
    
    
    var loggedTime = Date.now();
    db.get('parties').insert({
        "loggedTime": loggedTime,
        "name": req.body.name,
        "location": req.body.location,
        "number": req.body.number,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime
    }, function (err, doc) {
        if (err) {
            throw err;
        }
        res.json({});
    });
	setCoordinates(req.body.location, loggedTime);

   sendText(req.body.number, message);
});

function setCoordinates(address, loggedTime){
    // address should be a non formatted address string
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address;
    var request = http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
		res.on('end', function(){
			var json = JSON.parse(data);
			db.get('parties').update(
				{ "loggedTime" : loggedTime },
				{$set: {"latitude": json.results[0].geometry.location.lat, "longitude": json.results[0].geometry.location.lng }  }
			);	
        });			
    });
};

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

// Twilio Auth Details
var accountSid = 'ACc18ed767b2f3854884980ab9ec4b65fe'; 
var authToken = '8cdd99a052c309db5a5d3c4e94ebead6'; 
 
// Load the twilio module
var twilio = require('twilio');
// Will send messages via twilio API 
var sendText = function (number, message) {
         // Create a new REST API client to make authenticated requests against the
    // twilio back end
        var client = new twilio.RestClient(accountSid, authToken);
            // Pass in parameters to the REST API using an object literal notation. The
            // REST client will handle authentication and response serialzation for you.
            client.sms.messages.create({
                to: number,
                from:'4139926842',
                body: message
            }, function(error, message) {
                // The HTTP request to Twilio will run asynchronously. This callback
                // function will be called when a response is received from Twilio
                // The "error" variable will contain error information, if any.
                // If the request was successful, this value will be "falsy"
                if (!error) {
                    // The second argument to the callback will contain the information
                    // sent back by Twilio for the request. In this case, it is the
                    // information about the text messsage you just sent:
                    console.log('Success! The SID for this SMS message is:');
                    console.log(message.sid);
             
                    console.log('Message sent on:');
                    console.log(message.dateCreated);
                } else {
                    console.log('Oops! There was an error.');
                    console.log(error);
                }
            });
     }
	 

function toRadians(degrees){
    return degrees * Math.PI / 180;
}

function distance_between_coordinates(lat1, lon1, lat2, lon2){
  var earth_radius = 6371000; // metres
  //using Haversine formula calculates distance between geographic coordinate
  var phi1 = toRadians(lat1);
  var phi2 = toRadians(lat2);
  var deltaPhi = toRadians(lat2 - lat1);
  var deltaLambda = toRadians(lon2 - lon1);
  var haverSin = Math.pow(Math.sin(deltaPhi/2), 2) + Math.cos(phi1)*Math.cos(phi2)* Math.pow(Math.sin(deltaLambda/2), 2);
  var distance = 2*earth_radius* Math.atan2(Math.sqrt(haverSin), Math.sqrt(1-haverSin));
  return distance;
}

function locations_within_distance(lat1, lon1, lat2, lon2){
  var distance = distance_between_coordinates(lat1, lon1, lat2, lon2);
  return distance<max_distance;
}