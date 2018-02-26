import debug = require('debug');
import express = require('express');
import https = require('https');
import http = require('http');
import fs = require('fs');
import path = require('path');
import bodyParser = require('body-parser');
import mongo = require('mongodb');
import routes from './routes/index';
import { writeMessage, printDB, readMap, writeMap, getNextMessageNum } from "./db";
import { Message } from "./db";
import { log, logError, newGuid, isGuid } from "./util";

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
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
    let guid = newGuid();
    response.send(guid);
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

app.use(express.static('public'));

app.set('port', process.env.PORT || 80);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

https.createServer({
    cert: fs.readFileSync('./Pixmap/sslcert/fullchain.pem'),
    key: fs.readFileSync('./Pixmap/sslcert/privkey.pem')
}, app).listen(443);

http.createServer(function (req, res) {
    res.writeHead(307, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
