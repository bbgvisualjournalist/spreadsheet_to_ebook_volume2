var express = require('express');
var router = express.Router();



/* Display an index of the books and links to files. */
router.get('/', function(req, res, next) {
	var coverPhotos_array = [];

	var mode = req.query.mode;
	console.log("mode: "+mode);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	for (var i=0; i<global.book.photos.length; i++){
		if (global.book.photos[i].imagenumber==0){
			var coverPhoto = global.book.photos[i].filename;
			coverPhotos_array.push(coverPhoto);
		}
	}

	res.render('index', { 
		title: 'Books',
		cover: coverPhotos_array,
		pathPrefix: pathMode
	});
});


/* Create content.opf. (This is an xml document so look at the source code)*/
router.get('/book/:bookNum/content.opf', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var d = new Date().toISOString();
	d = d.replace(/\..*Z/, 'Z');//Removes decimal values that throw errors.

	var originalPubDate=global.book.config[0].originalpubdate;
	originalPubDateFormatted = new Date(originalPubDate).toISOString();
	originalPubDateFormatted = originalPubDateFormatted.replace(/\..*Z/, 'Z');

	var photos_array = [];
	for (var i=0; i<global.book.photos.length; i++){
		if (bookNumber+1==global.book.photos[i].book){
			var photo = global.book.photos[i].filename;
			photos_array.push(photo);
		}
	}

	res.render('content', { 
		book: bookNumber,
		photos: photos_array,
		date: d,
		pubDate: originalPubDateFormatted
	});
});


/* Display cover.xhtml. */
router.get('/book/:bookNum/cover.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('cover', { 
		book: bookNumber,
		pathPrefix: pathMode
	});
});


/* Display titlepage.xhtml. */
router.get('/book/:bookNum/titlepage.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('titlepage', { 
		book: bookNumber,
		pathPrefix: pathMode
	});
});


/* Display toc.xhtml. */
router.get('/book/:bookNum/toc.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('toc', { 
		book: bookNumber,
		pathPrefix: pathMode
	});
});


/* Display toc.ncx. */
router.get('/book/:bookNum/toc.ncx', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var numberOfChapters = 0;


	for (var i=0; i<global.book.chapters.length; i++){
		if (global.book.chapters[i].book - 1 == bookNumber){
			numberOfChapters++;
		}
	}



	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('tocncx', { 
	book: bookNumber,
	pathPrefix: pathMode,
	numberOfChapters: numberOfChapters
	});
});


/* Display introduction.xhtml. */
router.get('/book/:bookNum/introduction.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('introduction', { 
		book: bookNumber,
		pathPrefix: pathMode
	});
});


/* Display bodymatter.xhtml. */
router.get('/book/:bookNum/bodymatter.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var concat = "partials/content/chapter"+ (bookNumber + 1) +".ejs";
	var photos_array = [];
	var chapters_array = [];


	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	//create code snippets for each photo, alt tag, caption and credit.
	for (var i=0; i<global.book.photos.length; i++){
		if (bookNumber+1==global.book.photos[i].book){
			var photo ='<div class="img_fs_cap"><div><img src="'+ pathMode +'images/' + global.book.photos[i].filename +'" alt="' + global.book.photos[i].alttext +'" /></div><p class="caption">' + global.book.photos[i].cutline + ' ' + global.book.photos[i].credit + '</p></div>';
			photos_array.push(photo);
		}
	}

	//create an array of the chapters for this book.
	for (var i=0; i<global.book.chapters.length; i++){
		if (bookNumber+1==global.book.chapters[i].book){
			var chapter =global.book.chapters[i].chaptertitle;
			chapters_array.push(chapter);
		}
	}

	res.render('bodymatter', { 
		book: bookNumber,
		chapter: concat,
		photo: photos_array,
		chapter_title: chapters_array,
		pathPrefix: pathMode
	});
});


/* Display the backmatter.xhtml. */
router.get('/book/:bookNum/backmatter.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var concat = "partials/content/back"+ (bookNumber + 1) +".ejs"

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('backmatter', { 
		book: bookNumber,
		chapter: concat,
		pathPrefix: pathMode
	});
});

module.exports = router;