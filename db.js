"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongo = require('mongodb');
var util_1 = require("./util");
var connectionString = "mongodb://127.0.0.1:27017"; //process.env.DB_CONNECTION_STRING;
var dbName = "pixdb"; //process.env.DB_NAME;
var mongoClient = mongo.MongoClient;
// let r = readMessageRef("1", "1", function (err, res) {
//     console.log("result: " + res);
// });
// let r = getNextMessageNum(new Message("1", "1", 4, "123", "msgtext"), (eer, res) => {
//     console.log("2: " + res);
// });
// let rr = writeMessage(new Message("1", "1", 2, "1234", "33TEXTETX??"), (err) => {
//     console.log();
//     printDB();
// });
//printDB();
function delet() {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            return;
        }
        var dbo = db.db(dbName);
        for (var i = 0; i < 20; i++) {
            dbo.collection("map")
                .remove({}, { justOne: true }, function (err, res) {
                db.close();
                console.log(res);
            });
        }
    });
}
function printDB() {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            return;
        }
        var dbo = db.db(dbName);
        dbo.collection("map")
            .find({})
            .toArray(function (err, res) {
            db.close();
            console.log(res);
        });
    });
}
exports.printDB = printDB;
function query(collection, query, projection, sort, limit, callback) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }
        var dbo = db.db(dbName);
        dbo.collection(collection)
            .find(query)
            .project(projection)
            .sort(sort)
            .limit(limit)
            .toArray(function (err, res) {
            db.close();
            callback(err, res[0]);
        });
    });
}
function insert(collection, message, callback) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }
        var dbo = db.db(dbName);
        dbo.collection(collection)
            .insert(message, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function update(collection, query, update, callback) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }
        var dbo = db.db(dbName);
        dbo.collection(collection)
            .updateOne(query, update, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function getNextMessageNum(messageReq, callback) {
    var q = {
        x: messageReq.x,
        y: messageReq.y,
    };
    var projection = { _id: 0 };
    var message = new Message(messageReq.x, messageReq.y, 1, messageReq.clientID, messageReq.text, messageReq.link);
    var sort = [["num", "desc"]];
    var limit = 1;
    query("message", q, projection, sort, limit, function (error, result) {
        if (result != null) {
            //gefunden? ==> num erhöhen
            message = result;
            message.num++;
        }
        insert("message", message, function (err, res) {
            callback(err, message.num);
        });
        util_1.log("insert attempt: x:" + message.x + " y:" + message.y + " text:" + message.text + " link:" + message.link);
    });
}
exports.getNextMessageNum = getNextMessageNum;
function writeMap(map, callback) {
    insert("map", map, callback);
}
exports.writeMap = writeMap;
function readMap(callback) {
    query("map", {}, { _id: 0 }, {}, 1, callback);
}
exports.readMap = readMap;
function writeMessage(message, callback) {
    var q = {
        x: message.x,
        y: message.y,
        num: message.num,
        clientID: message.clientID
    };
    var fields = { text: 1 };
    var sort;
    update("message", q, { $set: { text: message.text, link: message.link } }, callback);
    util_1.log("update attempt: x:" + message.x + " y:" + message.y + " text:" + message.text + " link:" + message.link);
}
exports.writeMessage = writeMessage;
var Message = /** @class */ (function () {
    function Message(x, y, num, clientID, text, link) {
        this.x = x;
        this.y = y;
        this.num = num;
        this.clientID = clientID;
        this.text = text;
        this.link = link;
    }
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=db.js.map