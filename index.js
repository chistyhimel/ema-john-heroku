const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.7ntnx.mongodb.net:27017,cluster0-shard-00-01.7ntnx.mongodb.net:27017,cluster0-shard-00-02.7ntnx.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-87jhz3-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});

const app = express();
app.use(bodyParser.json());
app.use(cors());



client.connect(err => {
  const collection = client.db("ema-john").collection("products");
  const orderCollection = client.db("ema-john").collection("orders");

  app.post('/addProduct',(req, res) => {
      const product = req.body ;
      collection.insertMany(product)
      .then((result) =>{
          console.log(result)
      })
  })

  app.get('/products',(req, res) => {
    collection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.get('/product/:key',(req, res) => {
    collection.find({key: req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/getProducts',(req, res) => {
    collection.find({key: {$in : req.body}})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.post('/addOrder',(req, res) => {
    const order = req.body ;
    orderCollection.insertOne(order)
    .then((result) =>{
        console.log(result)
    })
})

});

app.listen(5000)