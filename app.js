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
// app.post("/mapsave", function (request, response) {
//     blobSvc.createBlockBlobFromText("pixmapcontainer", "pixmapblob", JSON.stringify(request.body), function (error, result, servResponse) {
//         if (error) { console.log(error) }
//     });
// })
app.get("/address", function (request, response) {
    response.send(process.env.IOTA_ADDRESS);
    console.log(process.env.IOTA_ADDRESS);
});
app.get("/mapload", function (request, response) {
    blobSvc.getBlobToText("pixmapcontainer", "pixmapblob", function (error, text, servRespone) {
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
//# sourceMappingURL=app.js.map