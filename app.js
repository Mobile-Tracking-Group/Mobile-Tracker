
/**
 * Module dependencies.
 */
require( './model/user' );

var express = require('express');
var bodyParser = require('body-parser')

var routes = require('./routes');
var signup=require('./routes/signup');
var login=require('./routes/login');
var devicedata=require('./routes/devicedata');
var admin=require('./routes/admin');
var mail=require('./routes/mail');


var nodemailer = require("nodemailer");
var http = require('http');
var path = require('path');
var engine  = require( 'ejs-locals' );
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo/es5')(session);



var secret = require('./config/secret');

var app = express();

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: secret.user,
        pass: secret.pass
    }
});

// all environments
app.set('port', process.env.PORT || secret.port);
app.engine( 'ejs', engine );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use( express.bodyParser({
        uploadDir: './public/images',
        keepExtensions: true
    }));
app.use(cookieParser());
app.use(session({
  secret: secret.secretKey,
  resave: true,
  saveUninitialized: true,
  
  }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sign', signup.sign);
app.get('/edit', routes.edit);
app.get('/logout', login.logout);
app.get('/signsame', signup.signsame);
app.get('/failed', login.failed);
app.get('/userpage', devicedata.userpage);
app.get('/adminpage', admin.adminpage);
app.get('/admin', admin.admin);
app.get('/info/:id', devicedata.info);
app.post('/create', signup.create );
app.post('/change', routes.change );
app.post('/valid', login.valid);
app.post( '/add_dev', admin.add_dev );
app.post( '/search', devicedata.search );
app.post( '/search1', devicedata.search1 );
app.get('/newdev', admin.newdev );
app.get('/forgot', login.forget )
app.get('/about', routes.about );
app.post('/returnmail/:id', mail.return );
app.post('/osmail', mail.reqos );
app.post('/recover', mail.recover );
app.get('/collect/:id', devicedata.collect );
app.get('/return/:id', devicedata.return );
app.get('/delete/:id', admin.delete );
app.get('/block/:id', admin.block );
app.get('/unblock/:id', admin.unblock );

app.use(function(req, res) {
     res.send('Sorry ! the Page is not Found', 404);
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
     res.send('500: Internal Server Error', 500);
  });
  
  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
