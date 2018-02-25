var mongo = require('mongodb');

let u = "mongodb://localhost:27017/pixdb";
let c = mongo.MongoClient;

c.connect(u, function(err, db){
    if (err) throw err;
    console.log("Database created!");
    db.close();
});