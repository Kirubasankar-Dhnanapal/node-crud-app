var MongoClient = require('mongodb').MongoClient;
var http = require('http');
// var url = "mongodb://kirubasankar:Kiruba123@cluster0-shard-00-00-vhnpc.mongodb.net:27017,cluster0-shard-00-01-vhnpc.mongodb.net:27017,cluster0-shard-00-02-vhnpc.mongodb.net:27017/table_data?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
var url = "mongodb+srv://kirubasankar:Kiruba12@cluster0.ag5xd.mongodb.net/table_data?retryWrites=true&w=majority";
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 3002
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(bodyParser.json())


const options = {
  keepAlive: 1,
  useUnifiedTopology: true,
  useNewUrlParser: true
};


app.get("/getreviews", (req, res) => {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("table_data");
    dbo.collection("sample_table").find({}).toArray((err, result) => {
      if (err) throw res.send(err)
      res.status(200).send({ success: true, data: result });
      db.close();
    })
  });
});



app.post('/insertdata', (req, res) => {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("table_data");
    var myobj = { id: req.body.id, name: req.body.name, mobilenumber: req.body.mobilenumber };
    dbo.collection("sample_table").insertOne(myobj, function (err, result) {
      if (err) {
        err;
      } else {
        dbo.collection("sample_table").find({}).toArray((err, result) => {
          return res.status(200).json({
            success: true,
            tabledata: result,
            message: "Successfully Inserted"
          });
        })
      }
    })
  })
})


app.post('/updatedata', (req, res) => {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("table_data");
    var myobj = { id: req.body.id }
    var updatedValue = { $set: { name: req.body.name, mobilenumber: req.body.mobilenumber, id: req.body.id } };
    dbo.collection("sample_table").updateOne(myobj, updatedValue, function (err) {
      if (err) {
        return res.status(412).send({
          success: false,
          message: err
        })
      }
      dbo.collection("sample_table").find({}).toArray((err, result) => {
        return res.status(200).json({
          success: true,
          tabledata: result,
          message: "Successfully Updated"
        });
      })
    })
  })
})

app.post('/deletedata', (req, res) => {
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("table_data");
    var myobj = { id: req.body.id };
    dbo.collection("sample_table").deleteOne(myobj, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        dbo.collection("sample_table").find({}).toArray((err, result) => {
          return res.status(200).json({
            success: true,
            tabledata: result,
            message: "Successfully Deleted"
          })
        })
      }
    })
  })
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
