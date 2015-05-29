var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

var Tabletop = require('tabletop');

//VOLUME 1: var spreadsheetURL = 'https://docs.google.com/spreadsheets/d/1dXbUkXlGb8GyVMdKpuJB__82MAI6-VWqhzcvq2A3rYY/pubhtml';

//VOLUME 2:
var spreadsheetURL = 'https://docs.google.com/spreadsheets/d/1b7l0h913IGWLmFzdwbEgeS4wl99qYq07KbFPikSFDjI/pubhtml';

//Add a simple function for reading files.
var fs = require('fs');
var jf = require('jsonfile');

function readJSONFile( path ){
	/*
	var binaryData = fs.readFileSync( path );
	return JSON.parse( binaryData.toString() );
	*/

	//Added a simple check to see if the JSON files exist.
	var binaryData;
	try {
		binaryData = fs.readFileSync( path);
		return JSON.parse( binaryData.toString() );
	} catch (e) {
		if (e.code === 'ENOENT') {
			console.log(path + ' not found!');
			console.log(path + ' needs to be created once before the site will work properly.')
			console.log("(Normally there's about a 1-minute delay.)")

			binaryData = {};
			return binaryData;
		} else {
			throw e;
		} 
	}
}


//Use namespaced global variable to keep data that will update.
global.book = {};
global.book.meta = readJSONFile('./data/meta.json');
global.book.chapters = readJSONFile('./data/chapters.json');
global.book.chapters_meta = readJSONFile('./data/chapters_meta.json');
global.book.photos = readJSONFile('./data/photos.json');
global.book.config = readJSONFile('./data/config.json');

//Toggle for offline use; ignores Google spreadsheet request.
var offlineMode=true;


//Add a timer to periodically update data for edits.
//20000 = 20 seconds; 60000 = 1 minute ; 300000 = 5 minutes
setInterval(fetchData, 60000);


//Load data from google spreadsheet and write it to the meta.json, photos.json and chapters.json files.
function fetchData(){
	if (!offlineMode){
		var myData;
		function onLoad(data, tabletop) {
			//console.log(data);
			console.log("loading, updating and saving data from spreadsheet");

			//
			jf.writeFile("data/chapters.json", data.chapters.elements, function(err) {
				global.book.chapters = readJSONFile('./data/chapters.json');
				console.log(err)
			})
			jf.writeFile("data/meta.json", data.meta.elements, function(err) {
				global.book.meta = readJSONFile('./data/meta.json');
				console.log(err)
			})
            jf.writeFile("data/chapters_meta.json", data.chapters_meta.elements, function(err) {
                global.book.chapters_meta = readJSONFile('./data/chapters_meta.json');
                console.log(err)
            })
			jf.writeFile("data/photos.json", data.photos.elements, function(err) {
				global.book.photos = readJSONFile('./data/photos.json');
				console.log(err)
			})
			jf.writeFile("data/config.json", data.config.elements, function(err) {
				global.book.config = readJSONFile('./data/config.json');
				console.log(err);
			})

		};

		var options = {
			key: spreadsheetURL,
			callback: onLoad
		};

		Tabletop.init(options);
	}
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


// error handlers

//When you're ready to be in production mode, uncomment this:
//app.set('env', 'production')

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



module.exports = app;