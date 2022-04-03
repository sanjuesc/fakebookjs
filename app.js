var admin = require("firebase-admin");

var serviceAccount = require("./fakebook-73d4b-firebase-adminsdk-zfbpb-62692b2083.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports.admin = admin
