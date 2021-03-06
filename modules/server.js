/**
 * Load modules
 */
var createError = require('http-errors');
const https = require('https');
const fs = require('fs');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const usersRouter = require('../routes/users')
const positionRouter = require('../routes/position')
const indexRouter = require('../routes/index')
const alertRouter = require('../routes/alerts')
const assessmentRouter = require('../routes/assessments')
var cors = require('cors')

/**
 * Variables
 */

// Global variables
const port = 9000
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

// Create an authorization middleware to be used on the route to be secured
var jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    var token = req.get('authorization');
    if (!token) {
        return res.json({ success: false, error: "A token is mandatory to subscribe to this API." });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.json({ success: false, error: "Unable to parse token." });
        }
        if (decoded.exp <= Date.now()) {
            return res.json({ success: false, error: "Token has expired." });
        }
        req.token = decoded;
        next();
    });
}

var app = express();
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.use(cors());
// Configure routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/alerts', alertRouter);
app.use('/pos', positionRouter);
app.use('/assessments', assessmentRouter);
/**
 * Configuration
 */

// Configure server

// limit : it controls the maximum request body size. 
app.use(bodyParser.json({ limit: "1.1MB" }));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Configure routes
app.use(function (req, res, next) {
    console.log("[SERVER]" + req.method + " " + req.url)
    next();
});

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// Start server
var server = https.createServer(options, app);

var start = function (callback) {
    server.listen(port, () => {
        //console.info(`[Server] Listening on http://${host}:${port}`);
        console.info(`[Server] Listening on ${port}`)
        if (callback) callback(null)
    })
};



/**
 * Exports
 */
exports.start = start