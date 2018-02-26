"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var express = require("express");
var https = require("https");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var index_1 = require("./routes/index");
var db_1 = require("./db");
var db_2 = require("./db");
var util_1 = require("./util");
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
/* MAP SPEICHERN */
// app.post("/mapsavetrytes", function (request, response) {
//     blobSvc.createBlockBlobFromText("pixmapcontainer", "pixmapblobtrytes", JSON.stringify(request.body), function (error, result, servResponse) {
//         if (error) { console.log(error) }
//     });
// })
// app.post("/savemap", function (request, response) {
//     writeMap(request.body, function (err, res) {
//         if (err) return;
//         console.log(res);
//     });
// })
app.get("/getGuid", function (request, response) {
    var guid = util_1.newGuid();
    response.send(guid);
});
app.get("/getMessageNum", function (request, response) {
    var clientID = request.query.clientID;
    var x = request.query.x;
    var y = request.query.y;
    if (!util_1.isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "") {
        response.sendStatus(400);
        return;
    }
    var message = new db_2.Message(x, y, null, clientID, null, null);
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
app.post("/storeMessage", function (request, response) {
    var x = request.body.x;
    var y = request.body.y;
    var num = Number(request.body.num);
    var clientID = request.body.clientID;
    if (!util_1.isGuid(clientID) ||
        x == undefined || x == "" ||
        y == undefined || y == "" ||
        num == NaN) {
        response.sendStatus(400);
        return;
    }
    var message = new db_2.Message(request.body.x, request.body.y, Number(request.body.num), request.body.clientID, request.body.message, request.body.link);
    db_1.writeMessage(message, function (err) {
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
    db_1.readMap(function (err, res) {
        if (err) {
            util_1.logError(err);
            response.sendStatus(400);
        }
        else {
            response.send(res);
        }
    });
});
// app.get("/loadMessage", function (request, response) {
//     let x = request.query.x;
//     let y = request.query.y;
//     let num: number = Number(request.query.num);
//     if (num == NaN ||
//         x == undefined || x == "" ||
//         y == undefined || y == "") {
//         response.sendStatus(400);
//         return;
//     }
//     readMessage(new Message(x, y, num, null, null, null), function (err, message, link) {
//         if (err) {
//             logError(err);
//             response.sendStatus(404);
//         } else {
//             response.send({ message, link });
//         }
//     });
// });
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
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.use(express.static('public'));
app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
https.createServer({
    cert: fs.readFileSync('./Pixmap/sslcert/fullchain.pem'),
    key: fs.readFileSync('./Pixmap/sslcert/privkey.pem')
}, app).listen(443);
app.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
});
//# sourceMappingURL=app.js.map