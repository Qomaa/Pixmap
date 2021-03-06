﻿import debug = require('debug');
import express = require('express');
import https = require('https');
import http = require('http');
import fs = require('fs');
import path = require('path');
import bodyParser = require('body-parser');
import mongo = require('mongodb');
import routes from './routes/index';
import { writeMessage, printDB, readMap, writeMap, getNextMessageNum, writeBatch, getNextBatchTag } from "./db";
import { Message, Batch } from "./db";
import { log, logError, newGuid, isGuid } from "./util";

var app = express();

app.all('*', function (req, res, next) {
    // console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));

    if (req.secure) {
        return next();
    }
    res.redirect('https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get("/getGuid", function (request, response) {
    let ip = request.connection.remoteAddress;
    let guid = newGuid();
    response.send(guid);
    log("Guid created: " + guid + " (" + ip + ")");
});

app.get("/getMessageNum", function (request, response) {
    let clientID = request.query.clientID;
    let x = request.query.x;
    let y = request.query.y;

    if (!isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "") {
        response.sendStatus(400);
        return;
    }

    let message = new Message(x, y, null, clientID, null, null);

    getNextMessageNum(message, function (err, result) {
        if (err) {
            logError(err);
            response.sendStatus(400);
        } else {
            response.send(String(result));
        }
    });
});

app.get("/getNextBatchTag", async function (request, response) {
    let clientID = request.query.clientID;
    let tag: string;

    if (!isGuid(clientID)) {
        response.sendStatus(400);
        return;
    }

    getNextBatchTag(clientID, function (err, result) {
        if (err) {
            logError(err);
            response.sendStatus(400);
            return;
        }

        response.send(result);
    });
});

app.post("/storeBatch", function (request, response) {
    let clientID = request.body.clientID;
    let tag: string = request.body.tag;
    let changeFields: MapField[] = request.body.changedFields;

    let invalidAddValue = changeFields.find((changedField, index) => {
        let fieldValue = Number(changedField.value);
        return fieldValue === undefined || fieldValue === NaN || fieldValue < 1;
    });

    if (!isGuid(clientID) || invalidAddValue) {
        response.sendStatus(400);
        return;
    }

    let batch = new Batch(clientID, tag, changeFields);
    writeBatch(batch, err => {
        if (err) {
            logError(err);
            response.sendStatus(400);
        } else {
            response.sendStatus(200);
        }
    });
});

app.post("/storeMessage", function (request, response) {
    let x = request.body.x;
    let y = request.body.y;
    let num: number = Number(request.body.num);
    let clientID = request.body.clientID;

    if (!isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "" ||
        num == NaN) {
        response.sendStatus(400);
        return;
    }

    let message: Message = new Message(request.body.x, request.body.y, Number(request.body.num), request.body.clientID, request.body.message, request.body.link);

    writeMessage(message, err => {
        if (err) {
            logError(err);
            response.sendStatus(400);
        } else {
            response.sendStatus(200);
        }
        // printDB();
    });
});

app.get("/loadMap", function (request, response) {
    // printDB();
    readMap((err, res) => {
        if (err) {
            logError(err);
            response.sendStatus(400);
        }
        else {
            response.send(res);
        }
    });
});

app.get("/address", function (request, response) {
    response.send(process.env.IOTA_ADDRESS);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 80);
app.set('secPort', process.env.PORT || 443);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

https.createServer({
    cert: fs.readFileSync(process.env.SSLCHAIN),
    key: fs.readFileSync(process.env.SSLKEY)
}, app).listen(app.get('secPort'));
