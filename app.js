var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config/config.js');



var routes = require('./routes/index');
var users = require('./routes/users');


//create the app , the server and socket io setup
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});


// html view engine
var cons = require('consolidate');
app.engine('html', cons.swig);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
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


io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

//database
var URL = 'mongodb://' + config.development.database.host + ':' + config.development.database.port + '/' + config.development.database.db;
MongoClient.connect(URL, function (err, db) {
    if (err) {
        console.log('there is a connection problem !');
        return;
    }

    var MongoWatch = require ('mongo-trigger');

    var watcher = new MongoWatch ({format: 'pretty'});
    watcher.watch('users',function (event) {
        console.log('event triggerd',event);
    });


    console.log('connected to db !');
    var collection = db.collection('users');

    //insert test document
    collection.insert({user: 'sabri', age: 25}, function (err, result) {


        console.log(err,result);

        //fetch the document and display it !
        collection.find({user: 'sabri'}).toArray(function (err, docs) {

                console.log(docs[0]);
                console.log('all good', docs);

            //we dont need it anymore
                collection.remove({user:'sabri'},function (err) {
                if (!err){
                    console.log('all deleted !!');
                }
            });

                db.close()
            });


    });

});


module.exports = app;
