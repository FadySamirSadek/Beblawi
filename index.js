const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const token = "EAAURZBaIUs8oBACJjFZAdR7u01MZAsIGTphEDqPzZCTWHveUfKePhsxwbASZCeJIDbZC1GjsD9LYQL6WdfeiZCeWZAjPLGqZBuQ7JLev9onRcaFuZB8cpjp2aBUGLZBRkiRr0tNJ8pQR4TZB7ZC8R52Uphiy1f9IoFryDZACk58XZBrE2vYwAZDZD";

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
});

// for Facebook verification

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i];
	    let sender = event.sender.id;
	    if (event.message && event.message.text) {
		    let text = event.message.text ;
				if (text == "location"){
					sendTextMessage(sender, "https://www.google.com/maps/d/viewer?mid=1I4WHzVNnJfpqbA7eAoD9ubetN0s&hl=en&ll=30.067756999999997%2C31.020659000000023&z=17");
				}
		    sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
	    }
    }
    res.sendStatus(200);
})
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
});
