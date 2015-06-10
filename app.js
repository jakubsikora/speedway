/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var express = require("express")
  , path = require("path")
  , app = express()
  , server = require("http").createServer(app)
  , util = require("util");

server.listen(process.env.PORT || 3000);

app.use(express.static(path.join(__dirname,'public')));
app.use('/vendor',  express.static(__dirname + '/bower_components'));
app.use('/vendor',  express.static(__dirname + '/node_modules'));