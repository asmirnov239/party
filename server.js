var express = require('express');
var app = express();
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ocpartyreg');
var bodyParser = require('body-parser');
var port = 3000;

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
    db.get('parties').find({}, {
        sort: {
            startTime: -1
        }
    }, function (err, docs) {
        res.json(docs);
    });
});

// REST API to register a party
app.post('/api/registerParty', function (req, res) {
    var message= "Hi there " + req.body.name.split()[0] + "! Thanks for registering your party. You will be notified at this number of any noise complaints.";
    
    var coord = getCoordinates(req.body.location);
    var loggedTime = Date.now();
    db.get('parties').insert({
        "loggedTime": loggedTime,
        "name": req.body.name,
        "location": req.body.location,
        "latitude": coord.latitude,
        "longitude": coord.longitude,
        "number": req.body.number,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime
    }, function (err, doc) {
        if (err) {
            throw err;
        }
        res.json({});
    });

   sendText(req.body.number, message);
});

function getCoordinates(address){
    // address should be a non formatted address string
    url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + address;
    var request = http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        return {
            latitude: json.results[0].geometry.location.lat,
            longitude: json.results[0].geometry.location.lng 
        };
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