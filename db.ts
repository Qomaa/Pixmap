let mongo = require('mongodb');
import {log, logError} from "./util";

let connectionString = "mongodb://127.0.0.1:27017"; //process.env.DB_CONNECTION_STRING;
let dbName = "pixdb"; //process.env.DB_NAME;
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
        if (err) { return; }

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

export function printDB() {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) { return; }

        let dbo = db.db(dbName);

        dbo.collection("map")
            .find({})
            .toArray(function (err, res) {
                db.close();
                console.log(res);
            });
    });
}

function query(collection: string, query: any, projection: any, sort: any, limit: number, callback: (error: Error, result: any) => void) {
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

function insert(collection: string, message: any, callback: (error: Error, result: any) => void) {
    mongoClient.connect(connectionString, function (err, db) {
        if (err) {
            callback(err, undefined);
            return;
        }

        let dbo = db.db(dbName);

        dbo.collection(collection)
            .insert(message, function (err, res) {
                db.close();
                callback(err, res);
            });
    });
}

function update(collection: string, query: any, update: any, callback: (error: Error, result: any) => void) {
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

export function getNextMessageNum(messageReq: Message, callback: (error: Error, result: number) => void) {
    let q = {
        x: messageReq.x,
        y: messageReq.y,
    };
    let projection = { _id: 0 };
    let message: Message = new Message(messageReq.x, messageReq.y, 1, messageReq.clientID, messageReq.text, messageReq.link);
    let sort = [["num", "desc"]];
    let limit: number = 1;

    query("message", q, projection, sort, limit, function (error: Error, result: Message) {
        if (result != null) {
            //gefunden? ==> num erhöhen
            message = result as Message;
            message.num++;
        }

        insert("message", message, function (err, res) {
            callback(err, message.num);
        });
        log("insert attempt: x:" + message.x + " y:" + message.y + " text:" + message.text + " link:" + message.link);
    });
}

export function writeMap(map: any, callback: (error: Error, result: string) => void) {
    insert("map", map, callback);
}

export function readMap(callback: (error: Error, result: any) => void) {
    query("map", {}, { _id: 0 }, {}, 1, callback);
}

export function writeMessage(message: Message, callback: (error: Error) => void) {
    let q = {
        x: message.x,
        y: message.y,
        num: message.num,
        clientID: message.clientID
    };
    let fields = { text: 1 };
    let sort;

    update("message", q, { $set: { text: message.text, link: message.link } }, callback);
    log("update attempt: x:" + message.x + " y:" + message.y + " text:" + message.text + " link:" + message.link);
}

export class Message {
    constructor(x: string, y: string, num: number, clientID: string, text: string, link: string) {
        this.x = x;
        this.y = y;
        this.num = num;
        this.clientID = clientID;
        this.text = text;
        this.link = link;
    }

    x: string;
    y: string;
    num: number;
    clientID: string;
    text: string;
    link: string;
}