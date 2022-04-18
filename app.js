var admin = require("firebase-admin");

var serviceAccount = require("JSON");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

module.exports.admin = admin
