const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase-admin/app');
var admin = require("firebase-admin");
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const port = 5000
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


console.log(process.env.DB_USER)

var serviceAccount = require("./configs/burj-al-arab-2023-firebase-adminsdk-pooc5-c98f0cb4df.json");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7oely.mongodb.net/burjAlArabDB?retryWrites=true&w=majority`;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookingCollection = client.db("burjAlArabDB").collection("bookings");
    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        console.log(newBooking);
        bookingCollection.insertOne(newBooking)
            .then(result => res.send(result.acknowledged))
    })

    app.get('/bookings', (req, res) => {
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith("Bearer ")) {
            const idToken = bearer.split(' ')[1]
            // console.log(idToken);
            admin.auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const uid = decodedToken.uid;
                    const emailToken = decodedToken.email;
                    if (emailToken === req.query.email) {
                        console.log(uid);
                        bookingCollection.find({ email: req.query.email })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                            })
                    }
                    else{
                        res.status(401).send('Unauthorize Access! user not match');
                    }
                })
                .catch((error) => {
                    res.status(401).send('Unauthorize Access! Token not match');
                });
        }
        else{
            res.status(401).send('Unauthorize Access!');
        }

    })







    console.log('db connected');
});



app.get('/', (req, res) => {
    res.send("Hlw NODE JS");
})




// app.listen(port);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})