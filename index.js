

var express = require("express");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log("Hi evryone");
var cors= require("cors")
var mongodb = require("mongodb");
var monk = require("monk");
var app = express();
// var router = express.Router();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));//giai ma
app.use(function (req, res, next) {
        req.db = db;
        next();
});

var db = monk('mongodb://admin:269khanhvy@clusterhung-shard-00-00-1s9ya.mongodb.net:27017,clusterhung-shard-00-01-1s9ya.mongodb.net:27017,clusterhung-shard-00-02-1s9ya.mongodb.net:27017/hungdatabase?ssl=true&replicaSet=ClusterHung-shard-0&authSource=admin&retryWrites=true&w=majority')
// app.use(function (req, res, next) {
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//         res.header('Access-Control-Allow-Headers', 'Content-Type');

//         next();
// })
app.use(cors())
app.post('/register', function (req, res) {
        console.log(req.body);
        
        req.db.collection('users').find({ username: req.body.username }, function (e, docs) {
                if (docs.length === 0) {
                        req.db.collection('users').insert(req.body, function (e, docs) {
                                res.json({ "registration": "successful" })
                        })
                }
                else {
                        res.json({ "registration": "failed" })
                }
        })
})

app.post('/login', function (req, res) {
       
        
        req.db.collection('users').find({ username: req.body.username, password: req.body.password }, function (err, docs) {
                console.log(docs)
                if (docs.length == 0) {
                        console.log("Sai roi")
                        res.json({ "authorize": false })
                }
                else {

                        res.json({ "authorize": true })
                }
        })
})

app.get('/users', function (req, res) {
        req.db.collection('users').find({}, { "limit": 100000000 }, function (e, docs) {
                res.json(docs);
        });
});
app.delete('/users/:id', function (req, res) {
        console.log(req);
        
        console.log(req.params.id);
        
        req.db.collection('users').find({ _id: req.params.id }, function (err, docs) {
                if (docs.length > 0) {
                        req.db.collection('users').remove({ _id: req.params.id }, function (e, data) {
                                if (e) throw e;
                                res.json({ "delete": "successful" })
                        })
                }
                else{
                        res.json({ "delete": "fail" })
                }
        })
        
})
app.put('/users', function (req, res) {
        if (req.body.user) {
                req.db.collection('users').find({username: req.body.user.username }, function (err, docs) {
                        if(docs.length > 0){
                                res.json({"Update" : "Username conflict"})
                        }
                        else{
                                req.db.collection('users').update({ _id: req.body.user.id }, {
                                        username:req.body.user.username,
                                        password:req.body.user.password
                                 }, function(e,result){
                                         res.json({"update":"successful"})
                                 });

                 
                                //  req.db.collection('users').findOne({ _id: req.body.id }, function (e, doc) {
                                //          res.json(
                                //                  {"edit":"successful"}
                                //          );
                                //  })
                        }
                })
               
        }
        else {
                res.json("Unauthorized access")
        }
});

app.listen(4000);