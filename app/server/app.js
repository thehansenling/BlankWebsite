var path = require('path');
var express = require('express');
var ReactDOMServer = require('react-dom/server');
var mysql = require('mysql2')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

import React from 'react';
const app = express();

const publicPath = express.static(path.join(__dirname, '../'));
const indexPath = path.join(__dirname, '../public/index.html');

import App from '../components/App.js';
import { StaticRouter } from "react-router-dom/server";


app.use(publicPath);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

//test database
// var connection = mysql.createConnection({
//   host     : 'us-cdbr-iron-east-01.cleardb.net',
//   user     : 'bc7ebf9f6de242',
//   password : 'aa9b1c1f',
//   database : 'heroku_cdc4ca7b10e1680',
//   multipleStatements: true
// });

//prod database
//var connection = mysql.createConnection({
//  host     : 'us-iron-auto-sfo-03-bh.cleardb.net',
//  user     : 'b82ff0c686544a',
//  password : '52ad3adb',
//  database : 'heroku_4df94195b1d1e6b',
//  multipleStatements: true
//});

//local database
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'qwertyman1',
   database : 'trendmarket',
   multipleStatements: true
 });

var context = {};
function renderPage(url, data) {
	var html = ReactDOMServer.renderToString(<StaticRouter location={url} context={context}><App data={data} /></StaticRouter>)
	html = ' <script>window.__DATA__ = ' + JSON.stringify(data) + '</script>' + html
	return html;
}

app.get('/', function (req, res) {
	var html = renderPage(req.url)
	res.send(html);
})


app.get('/login', function(req, res)
{
	var data = {
		login_message: "",
		username: req.cookies.username
	}
	var html = renderPage(req.url, data)
	res.send(html);
});

app.post('/login', function(req, res)
{
	var sql = "SELECT password FROM accounts where LOWER(username) = '" + req.body.username.toLowerCase() + "'";// + "' COLLATE utf8_bin";
	connection.query(sql, function (err, result, fields) {
	    if (err) throw err;
	    var login_message = "Login Failure";
	    if (result.length == 0)
	    {
			var data = {login_message:"Login Failed",
			}
			res.send(data);	    
			return	
	    }
	  	bcrypt.compare(req.body.password, result[0].password, function(err, decrypt_result) {
		    if (decrypt_result)
		    {
				res.cookie('username', req.body.username);
				var data = {login_message:"Login Successful"}
				res.send(data);			
		    }
		    else
		    {
				var data = {login_message:"Login Failed"}
				res.send(data);
		    }	  		
	  	});
  	});
});

app.post('/logout', function(req, res)
{
	res.clearCookie('username')
	res.send({data:1})
});


app.get('/register', function(req, res)
{
	var data = {username: req.cookies.username}
	var html = renderPage(req.url, data)
	res.send(html);
});

app.post('/register', function(req, res)
{
	if (req.body.password == req.body.password_confirm)
	{
		var username_check_sql = "SELECT * from accounts WHERE username = '" + req.body.username + "'";
		var data;
		if (req.body.username.indexOf(' ') != -1)
		{
	  		data = {
				message: "Username cannot contain spaces"
			}
			res.send(data);
			return
		}
		if (req.body.username.length > 32)
		{
	  		data = {
				message: "Username is too long, must be less than 32 characters"
			}
			res.send(data);
			return
		}
		connection.query(username_check_sql, function (err, result) {
			if (result == null || result.length == 0)
			{
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
				 	 // Store hash in your password DB.
					var sql = "INSERT INTO accounts (username, password, email) VALUES ('" + req.body.username + "', '" + hash + "', '" + req.body.email + "')";
					connection.query(sql, function (err, result) {
				    	if (err) throw err;
			  		});
			  		data = {
						message: "Registration Successful"
					}
					res.cookie('username', req.body.username);
			  		res.send(data);		
				});
	
			}
			else
			{
		  		data = {
					message: "Username already taken"
				}
				res.send(data);
			}
		});
	}
	else
	{
		data = {
			message: "Passwords don't match"
		}
		res.send(data)
	}
	
}); 

app.post('/', (req, res) => {

})

module.exports = app;