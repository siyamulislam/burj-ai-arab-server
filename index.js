const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 5000
const app = express();
 app.use(cors());
 app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))


const userName = "arabian"
const password = 'xrts6HoIN'
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://arabian:xrts6HoIN@cluster0.7oely.mongodb.net/burjAlArabDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookingCollection = client.db("burjAlArabDB").collection("bookings");
    app.post('/addBooking',(req,res)=>{
        const newBooking = req.body;
        console.log(newBooking);
        bookingCollection.insertOne(newBooking)
        .then(result=>res.send(result.acknowledged))
    })

    app.get('/bookings',(req,res)=>{
        bookingCollection.find({})
        .toArray((err,documents)=>{
                res.send(documents);
        })
    })







    console.log('db connected');
});



app.get('/',(req,res)=>{ 
    res.send("Hlw NODE JS");
  })




// app.listen(port);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })