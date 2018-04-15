"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let mongo = require('mongodb');
const util_1 = require("./util");
let connectionString = process.env.DB_CONNECTION_STRING;
let dbName = process.env.DB_NAME;
let mongoClient = mongo.MongoClient;
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
        let dbo = db.db(dbName);
        for (let i = 0; i < 20; i++) {
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
        let dbo = db.db(dbName);
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
        let dbo = db.db(dbName);
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
function insert(collection, toInsert, callback) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }
        let dbo = db.db(dbName);
        dbo.collection(collection)
            .insert(toInsert, function (err, res) {
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
        let dbo = db.db(dbName);
        dbo.collection(collection)
            .updateOne(query, update, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
function getNextMessageNum(messageReq, callback) {
    let q = {
        x: messageReq.x,
        y: messageReq.y,
    };
    let projection = { _id: 0 };
    let message = new Message(messageReq.x, messageReq.y, 1, messageReq.clientID, messageReq.text, messageReq.link);
    let sort = [["num", "desc"]];
    let limit = 1;
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
    let q = {
        x: message.x,
        y: message.y,
        num: message.num,
        clientID: message.clientID
    };
    let fields = { text: 1 };
    let sort;
    update("message", q, { $set: { text: message.text, link: message.link } }, callback);
    util_1.log("update attempt: x:" + message.x + " y:" + message.y + " text:" + message.text + " link:" + message.link);
}
exports.writeMessage = writeMessage;
function getNextBatchTag(clientID, callback) {
    let projection = { _id: 0 };
    let batchNum = { num: 0 };
    let sort = ["tag", "desc"];
    let limit = 1;
    let batch;
    query("batch", {}, projection, sort, limit, (err, res) => {
        let tag;
        let num;
        if (res == undefined)
            num = 1;
        else
            num = util_1.trytesToNumber(res.tag.substring(2)) + 1;
        tag = "ZZ" + util_1.pad(util_1.numberToTrytes(num), 25, "9");
        batch = new Batch(clientID, tag, []);
        insert("batch", batch, function (error, result) {
            callback(err, tag);
        });
    });
}
exports.getNextBatchTag = getNextBatchTag;
function writeBatch(batch, callback) {
    let fieldToStore = batch.changedFields;
    let q = {
        tag: batch.tag
    };
    let projection = { _id: 0 };
    let sort;
    let limit = 1;
    //Suche Batch mit übergebenen Tag
    query("batch", q, projection, sort, limit, (err, res) => {
        if (err) {
            callback(err);
            return;
        }
        if (res == undefined) {
            err = new Error("Didn't find Batch under Tag " + batch.tag + ".");
            return;
        }
        //Prüfe ClientID 
        if (res.clientID != batch.clientID) {
            callback(new Error("ClientID doesn't match."));
            return;
        }
        update("batch", q, { $set: { changedFields: batch.changedFields } }, callback);
    });
}
exports.writeBatch = writeBatch;
function replace(collection, query, update, callback) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }
        let dbo = db.db(dbName);
        dbo.collection(collection)
            .replaceOne(query, update, function (err, res) {
            db.close();
            callback(err, res);
        });
    });
}
class Message {
    constructor(x, y, num, clientID, text, link) {
        this.x = x;
        this.y = y;
        this.num = num;
        this.clientID = clientID;
        this.text = text;
        this.link = link;
    }
}
exports.Message = Message;
class Batch {
    constructor(clientID, tag, changedFields) {
        this.clientID = clientID;
        this.tag = tag;
        this.changedFields = changedFields;
    }
}
exports.Batch = Batch;
//# sourceMappingURL=db.js.map