const bodyParser = require ('body-parser')
const admin = require("firebase-admin");
const express = require("express");
const app = express()
const mysql = require('mysql');
const fs = require('fs');

const pool = mysql.createPool({
    host: "SERVODPR",
    user: "USUARIO",
    password: "PASS.",
    database: "BBDD"
});


app.use(express.text());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

const port = 8888
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};


admin.initializeApp()

app.get('/firebase/notification/:usuario', async (req, res) => {

    let actual = req.params.usuario;
    await pool.query("select * from usuario where user != ? and token is not null", [actual], function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(result)
            result.forEach(function (elemento, indice, array){
                let registrationToken = elemento['token'];
                const options =  notification_options;
                const payload= {
                    'notification': {
                        'title': "FakeBook",
                        'body': actual + " ha subido una nueva foto!",
                    },
                }
                admin.messaging().sendToDevice(registrationToken, payload, options)
                    .then( response => {
                    })
                    .catch( error => {
                        console.log(error);
                    });
            })
            res.send("Bien");
        }
    });
})

app.put('/user/add', async (req, res) => {

    const usuario = req.body.usuario;
    const pass = req.body.pass;

    await pool.query("insert into usuario (user, pass) values (?, ?)", [usuario, pass], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        } else {
            res.send("Bien");
        }
    });

})

app.post('/user/login', async (req, res) => {

    const usuario = req.body.usuario;
    const pass = req.body.pass;
    const token = req.body.registrationToken;
    console.log("aaaaaaa");
    await pool.query("select 1 from usuario where  user = ? and pass = ?", [usuario, pass], async function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).json({'respuesta': err});
        } else {
            console.log('bbbb')
	    console.log(result)
            if (result.length >= 1) {
                await pool.query("update usuario set token = ? where user=?", [token, usuario], function (err, result2) {
                    console.log(result2)
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.send('Ok');
                    }
                })
            }else{
		console.log("mal");
                res.status(400);
		res.send("mal");
            }
        }
    });

})


app.get("/obtenerImagenes", async (req, res)=>{
    const resultado = await pool.query("select * from imagen order by fecha desc",[], function (err, result){
        let respuesta = ''
        result.forEach(function (elemento, indice, array){
            respuesta+=elemento['nombre']+',';
        })
        console.log(respuesta)
        res.send(respuesta)
    })
})


app.get("/fotos/:nombre", async (req, res)=>{

    let actual = req.params.nombre;
    console.log(actual);
    const resultado = await pool.query("select * from imagen where nombre=?",[actual,], function (err, result){
      res.send(result)
    })
})

app.listen(port, () =>{
    console.log("listening to port"+port)
})
