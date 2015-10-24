var express = require('express');
var app = express();
var mongo = require('mongodb');
var monk = require('monk');
var dbJournal = monk('localhost:27017/journal');
var bodyParser = require('body-parser');
var port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', express.static(__dirname + '/'));
app.use('/bs', express.static(__dirname + '/lib/bootstrap-3.3.4-dist/css'));
app.use('/fonts', express.static(__dirname + '/lib/bootstrap-3.3.4-dist/fonts'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/api/getentries', function (req, res) {
    dbJournal.get('entries').find({}, {
        sort: {
            dateTime: -1
        }
    }, function (err, docs) {
        res.json(docs);
    });
});

// Connect to text service


// message =

app.post('/api/registerParty', function (req, res) {
    // TODO remove these
    var request = require('request');
    var phone = "19788864662";
    var message= "Hi there! Thanks for registering your party. You will be notified of any noise complaints.";

    // db.get('entries').insert({
    //     "loggedTime": Date.now(),
    //     "location": null,
    //     "text": null
    // }, function (err, doc) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.json({});
    // });
    console.log("hi");
    request.post(
    'https://www.textmagic.com/app/api?username=jonkepler&password=pokemon&cmd=send&text='+ message + '&phone=' + phone + '&unicode=0',
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
});


app.get('*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});