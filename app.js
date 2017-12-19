"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var azure = require("azure-storage");
var index_1 = require("./routes/index");
var app = express();
var blobSvc = azure.createBlobService();
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
app.post("/storeMessage", function (request, response) {
    var messageRef = request.body.messageRef;
    var message = request.body.message;
    var x = request.body.x;
    var y = request.body.x;
    if (x == undefined || x == "")
        return;
    if (y == undefined || y == "")
        return;
    if (Number(messageRef) == NaN)
        return;
    if (message == "undefined" || message == null || message == "")
        return;
    blobSvc.createBlockBlobFromText("pixmapcontainer", "message" + x + y + messageRef, message, function (error, result, servResponse) {
        if (error) {
            console.log(error);
        }
    });
    response.sendStatus(200);
});
app.post("/storeLink", function (request, response) {
    var linkRef = request.body.linkRef;
    var link = request.body.link;
    var x = request.body.x;
    var y = request.body.x;
    if (x == undefined || x == "")
        return;
    if (y == undefined || y == "")
        return;
    if (Number(linkRef) == NaN)
        return;
    if (link == "undefined" || link == null || link == "")
        return;
    blobSvc.createBlockBlobFromText("pixmapcontainer", "link" + x + y + linkRef, link, function (error, result, servResponse) {
        if (error) {
            console.log(error);
        }
    });
    response.sendStatus(200);
});
app.get("/loadMessage", function (request, response) {
    var x = request.query.x;
    var y = request.query.y;
    var messageRef = request.query.messageRef;
    if (messageRef == "undefined" || messageRef == "" ||
        x == undefined || x == "" ||
        y == undefined || y == "") {
        response.send("");
        return;
    }
    blobSvc.getBlobToText("pixmapcontainer", "message" + x + y + messageRef, function (error, message, servRespone) {
        if (error) {
            console.log(error);
        }
        ;
        //console.log(JSON.parse(text));
        response.send(message);
    });
});
app.get("/loadLink", function (request, response) {
    var x = request.query.x;
    var y = request.query.y;
    var linkRef = request.query.linkRef;
    if (linkRef == "undefined" || linkRef == "" ||
        x == undefined || x == "" ||
        y == undefined || y == "") {
        response.send("");
        return;
    }
    blobSvc.getBlobToText("pixmapcontainer", "link" + x + y + linkRef, function (error, link, servRespone) {
        if (error) {
            console.log(error);
        }
        ;
        //console.log(JSON.parse(text));
        response.send(link);
    });
});
app.get("/getMessageRef", function (request, response) {
    //max. 282429536480
    var x = request.query.x;
    var y = request.query.y;
    if (x == undefined || x == "")
        return;
    if (y == undefined || y == "")
        return;
    blobSvc.getBlobToText("pixmapcontainer", "messageref" + x + y, function (error, messageCount, servRespone) {
        if (error && error.statusCode == 404) {
            blobSvc.createBlockBlobFromText("pixmapcontainer", "messageref" + x + y, "1", function (error, result, servResponse) {
                if (error) {
                    console.error(error);
                    response.sendStatus(500);
                    return;
                }
                response.send("1");
            });
            return;
        }
        ;
        //console.log(JSON.parse(text));
        messageCount = String(Number(messageCount) + 1);
        blobSvc.createBlockBlobFromText("pixmapcontainer", "messageref" + x + y, messageCount, function (error, result, servResponse) {
            if (error) {
                console.error(error);
                response.sendStatus(500);
                return;
            }
            response.send(messageCount);
        });
    });
});
app.get("/getLinkRef", function (request, response) {
    //max. 282429536480
    var x = request.query.x;
    var y = request.query.y;
    if (x == undefined || x == "")
        return;
    if (y == undefined || y == "")
        return;
    blobSvc.getBlobToText("pixmapcontainer", "linkref" + x + y, function (error, linkCount, servRespone) {
        if (error && error.statusCode == 404) {
            blobSvc.createBlockBlobFromText("pixmapcontainer", "linkref" + x + y, "1", function (error, result, servResponse) {
                if (error) {
                    console.error(error);
                    response.sendStatus(500);
                    return;
                }
                response.send("1");
            });
            return;
        }
        ;
        if (error) {
            console.error(error);
            response.send(500);
            return;
        }
        //console.log(JSON.parse(text));
        linkCount = String(Number(linkCount) + 1);
        blobSvc.createBlockBlobFromText("pixmapcontainer", "linkref" + x + y, linkCount, function (error, result, servResponse) {
            if (error) {
                console.error(error);
                response.sendStatus(500);
                return;
            }
            response.send(linkCount);
        });
    });
});
app.get("/address", function (request, response) {
    response.send(process.env.IOTA_ADDRESS);
});
app.get("/maploadtrytes", function (request, response) {
    blobSvc.getBlobToText("pixmapcontainer", "pixmapblobtrytes", function (error, text, servRespone) {
        if (error) {
            console.log(error);
        }
        ;
        //console.log(JSON.parse(text));
        response.send(JSON.parse(text));
    });
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
app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
function getNextref(filepath) {
}
//# sourceMappingURL=app.js.map