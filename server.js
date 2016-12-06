var http = require('http');
var port = process.env.PORT || 5000;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var hoganExpress = require('hogan-express');
var path = require('path');
var app = express();

// view engine setup
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cache');
app.engine('html', hoganExpress);

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// initialize routes for web
var web = require('./routes.js')(app);

// start web server
var server = app.listen(port, function() {
  console.log('Webserver started at http://localhost:%d/', server.address().port);
})

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}