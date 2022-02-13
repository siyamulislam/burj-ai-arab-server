const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase-admin/app');

const port = 5000
const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))

var admin = require("firebase-admin");

var serviceAccount = require("./burj-al-arab-2023-firebase-adminsdk-pooc5-c98f0cb4df.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const userName = "arabian"
const password = 'xrts6HoIN'
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://arabian:xrts6HoIN@cluster0.7oely.mongodb.net/burjAlArabDB?retryWrites=true&w=majority";
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
                                res.send(documents);
                            })
                    }

                    // ...
                })
                .catch((error) => {
                    // Handle error
                });


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