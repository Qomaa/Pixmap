import debug = require('debug');
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');

import routes from './routes/index';
import users from './routes/user';

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.post("/mapsave", function (request, response) {
    let fs = require("fs");
    
    fs.writeFile("../Storage/map.txt", JSON.stringify(request.body), function (err)
    {
        if (err) { }
    });   
})

app.get("/mapload", function (request, response) {
    let fs = require('fs');

    fs.readFile("../Storage/map.txt", "utf8", function (err, mapString)
    {
        if (err) { }
        response.send(JSON.parse(mapString));
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

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});