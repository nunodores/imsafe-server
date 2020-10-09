/**
 * Load modules
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const usersRouter = require('../routes/users')
const indexRouter = require('../routes/index')

/**
 * Variables
 */

// Global variables
const port = 9000

var app = express();
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/**
 * Configuration
 */

// Configure server

// limit : it controls the maximum request body size. 
app.use(bodyParser.json({limit:"1.1MB"}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Configure routes
app.use(function (req, res, next) {
    console.log("[SERVER]"+req.method+ " " +req.url)
    console.log("zefz")
    next();
});

// Configure routes
app.use('/users', usersRouter)
app.use('/index', indexRouter)

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Start server
var start = function (callback) {
    app.listen(port,  () => {
        //console.info(`[Server] Listening on http://${host}:${port}`);
        console.info(`[Server] Listening on ${port}`)
        if (callback) callback(null)
    })
};



/**
 * Exports
 */
exports.start = start