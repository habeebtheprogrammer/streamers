// require("babel-core/register")
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var mongoose = require('mongoose');
var index = require('./routes/index');
var cors = require("cors")
var app = express();
var http = require("http");
// var Users = require("./users")
mongoose.Promise = global.Promise
//cors
require('dotenv').load();

//helmet setup
app.use(cors());  
app.use(helmet());  
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname,"..", 'build'));
app.set('view engine', "html");

app.engine('html', require('hbs').__express);
// app.use((req,res)=>console.log(req.ip))
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'build/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use('/', index);
app.get('*',function(req, res){
  res.sendFile(path.join(__dirname,"build/index.html"))
}); 
app.listen(process.env.PORT || 4000,()=>console.log(`Server running on port ${process.env.PORT||4000}`));
module.exports = app;