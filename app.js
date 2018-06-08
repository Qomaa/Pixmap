"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const index_1 = require("./routes/index");
const db_1 = require("./db");
const db_2 = require("./db");
const util_1 = require("./util");
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
app.use('/', index_1.default);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.get("/getGuid", function (request, response) {
    let ip = request.connection.remoteAddress;
    let guid = util_1.newGuid();
    response.send(guid);
    util_1.log("Guid created: " + guid + " (" + ip + ")");
});
app.get("/getMessageNum", function (request, response) {
    let clientID = request.query.clientID;
    let x = request.query.x;
    let y = request.query.y;
    if (!util_1.isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "") {
        response.sendStatus(400);
        return;
    }
    let message = new db_2.Message(x, y, null, clientID, null, null);
    db_1.getNextMessageNum(message, function (err, result) {
        if (err) {
            util_1.logError(err);
            response.sendStatus(400);
        }
        else {
            response.send(String(result));
        }
    });
});
app.get("/getNextBatchTag", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let clientID = request.query.clientID;
        let tag;
        if (!util_1.isGuid(clientID)) {
            response.sendStatus(400);
            return;
        }
        db_1.getNextBatchTag(clientID, function (err, result) {
            if (err) {
                util_1.logError(err);
                response.sendStatus(400);
                return;
            }
            response.send(result);
        });
    });
});
app.post("/storeBatch", function (request, response) {
    let clientID = request.body.clientID;
    let tag = request.body.tag;
    let changeFields = request.body.changedFields;
    let invalidAddValue = changeFields.find((changedField, index) => {
        let fieldValue = Number(changedField.value);
        return fieldValue === undefined || fieldValue === NaN || fieldValue < 1;
    });
    if (!util_1.isGuid(clientID) || invalidAddValue) {
        response.sendStatus(400);
        return;
    }
    let batch = new db_2.Batch(clientID, tag, changeFields);
    db_1.writeBatch(batch, err => {
        if (err) {
            util_1.logError(err);
            response.sendStatus(400);
        }
        else {
            response.sendStatus(200);
        }
    });
});
app.post("/storeMessage", function (request, response) {
    let x = request.body.x;
    let y = request.body.y;
    let num = Number(request.body.num);
    let clientID = request.body.clientID;
    if (!util_1.isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "" ||
        num == NaN) {
        response.sendStatus(400);
        return;
    }
    let message = new db_2.Message(request.body.x, request.body.y, Number(request.body.num), request.body.clientID, request.body.message, request.body.link);
    db_1.writeMessage(message, err => {
        if (err) {
            util_1.logError(err);
            response.sendStatus(400);
        }
        else {
            response.sendStatus(200);
        }
        // printDB();
    });
});
app.get("/loadMap", function (request, response) {
    // printDB();
    db_1.readMap((err, res) => {
        if (err) {
            util_1.logError(err);
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
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
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
//# sourceMappingURL=app.js.map