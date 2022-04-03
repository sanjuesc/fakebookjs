const bodyParser = require ('body-parser')
const admin = require("firebase-admin");
const express = require("express");
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

admin.initializeApp()
app.post('/firebase/notification', (req, res)=>{

    let  registrationToken = req.body.registrationToken;
    const message = req.body.message
    console.log(message)
    const options =  notification_options
    console.log(registrationToken)
    const payload= {
        'notification': {
            'title': "FakeBook",
            'body': message,
        },
    }
    admin.messaging().sendToDevice(registrationToken, payload, options)
        .then( response => {

            res.status(200).send("Notification sent successfully")

        })
        .catch( error => {
            console.log(error);
        });

})
app.listen(port, () =>{
    console.log("listening to port"+port)
})
