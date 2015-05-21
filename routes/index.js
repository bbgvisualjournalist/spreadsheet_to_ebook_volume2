var express = require('express');
var router = express.Router();


/* Display an index of the books and links to files. */
router.get('/', function(req, res, next) {
	var coverPhotos_array = [];

	var mode = req.query.mode;
	console.log("mode: " + mode);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export') {
		pathMode = ''
	}

	for (var i = 0; i < global.book.photos.length; i++) {
		if (global.book.photos[i].imagenumber == 0) {
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
	d = d.replace(/\..*Z/, 'Z'); //Removes decimal values that throw errors.

	var originalPubDate = global.book.config[0].originalpubdate;
	originalPubDateFormatted = new Date(originalPubDate).toISOString();
	originalPubDateFormatted = originalPubDateFormatted.replace(/\..*Z/, 'Z');

	var photos_array = [];
	for (var i = 0; i < global.book.photos.length; i++) {
		if (bookNumber + 1 == global.book.photos[i].book) {
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
	if (mode == 'export') {
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
	if (mode == 'export') {
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
	if (mode == 'export') {
		pathMode = ''
	}

	//Create a custom object for each book.
	var currentBook = [];
	console.log('Isolating this book.')
	for (var i = 0; i < global.book.chapters.length; i++) {
		if (global.book.chapters[i].book - 1 == bookNumber) {
			currentBook.push(global.book.chapters[i]);
		}
	}

	//split the book into a 'chapters' array of chapters. Each chapter has an array of subchapter objects.
	console.log('Splitting the book into chapters.')
	var currentChapter = 1;
	var chapters = [];
	var chapter = [];
	var book = []
	for (i = 1; i < currentBook.length; i++) {
		if (currentBook[i].chapter == currentChapter) {
			chapter.push(currentBook[i])
		} else {
			chapters.push(chapter);
			currentChapter++;
			chapter = [];
			chapter.push(currentBook[i]);
		}
	}
	chapters.push(chapter);
	console.log(chapters);


	res.render('toc', {
		book: bookNumber,
		bookIntro: currentBook[0],
		chapters: chapters,
		pathPrefix: pathMode
	});
});


/* Display toc.ncx. */
router.get('/book/:bookNum/toc.ncx', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var numberOfChapters = 0;


	for (var i = 0; i < global.book.chapters.length; i++) {
		if (global.book.chapters[i].book - 1 == bookNumber) {
			numberOfChapters++;
		}
	}



	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export') {
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
	if (mode == 'export') {
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
	var titles_array = [];
	var body_array = [];
	var intro_array = [];
	var photos_array = [];
	var chapters_array = [];
	var chapterID_array = [];

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export') {
		pathMode = ''
	}

	//create an array of book titles
	for (var i = 0; i < global.book.meta.length; i++) {
		if (bookNumber + 1 == global.book.meta[i].booknumber) {
			var book_title = global.book.meta[i].booktitle;
			titles_array.push(book_title);
		}
	}

	//Create a custom object for each book.
	var currentBook = [];
	console.log('Isolating this book.')
	for (var i = 0; i < global.book.chapters.length; i++) {
		if (global.book.chapters[i].book - 1 == bookNumber) {
			currentBook.push(global.book.chapters[i]);
		}
	}

	//split the book into a 'chapters' array of chapters. Each chapter has an array of subchapter objects.
	console.log('Splitting the book into chapters.')
	var currentChapter = 1;
	var chapters = [];
	var chapter = [];
	for (i = 1; i < currentBook.length; i++) {
		if (currentBook[i].chapter == currentChapter) {
			chapter.push(currentBook[i]);
		} else {
			chapters.push(chapter);
			currentChapter++;
			chapter = [];
			chapter.push(currentBook[i]);
		}
	}

	chapters.push(chapter);
	console.log(chapters[0][0].chaptertitle);
	
	//loop through all the objects in the chapters array
	for (i = 0; i < chapters.length; i++) {
		for (y = 0; y < chapters[i].length; y++) {
			//populate array of chapter titles
			chapters_array.push(chapters[i][y].chaptertitle);
			//populate array of title anchor tags for toc
			chapterID_array.push(chapters[i][y].htmlid);
			//create code snippets for each chapter's content
			if (chapters[i][y].indent == 1) {
				var copy = 'partials/content/chapter' + chapters[i][y].chapter + '.ejs';
				//console.log(copy);
				body_array.push(copy);
			}
		}
		//console.log(i + ": " + body_array[i]);
	}

	//console.log(chapters_array.length);
	//console.log(body_array);

	//set variables for the introduction to each specific book
	var intro = "partials/content/book" + (bookNumber + 1) + "_overview.ejs";
	
	//create code snippets for each photo, alt tag, caption and credit.
	for (var i = 0; i < global.book.photos.length; i++) {
		if (bookNumber + 1 == global.book.photos[i].book) {
			var photo = '<div class="img_fs_cap"><div><img src="' + pathMode + 'images/v2_' + (bookNumber + 1) + "/" + global.book.photos[i].filename + '" alt="' + global.book.photos[i].alttext + '" /></div><p class="caption">' + global.book.photos[i].cutline + ' ' + global.book.photos[i].credit + '</p></div>';
			photos_array.push(photo);
		}
	}
	//console.log(photos_array);

	res.render('bodymatter', {
		book: bookNumber,
		intro: intro,
		chapters: chapters,
		chapter_title: chapters_array,
		chapter_ID: chapterID_array,
		body_text: body_array,
		photo: photos_array,
		pathPrefix: pathMode
	});

});


/* Display the backmatter.xhtml. */
router.get('/book/:bookNum/backmatter.xhtml', function(req, res, next) {
	var bookNumber = parseInt(req.params.bookNum);
	var concat = "partials/content/back" + (bookNumber + 1) + ".ejs"

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export') {
		pathMode = ''
	}

	res.render('backmatter', {
		book: bookNumber,
		chapter: concat,
		pathPrefix: pathMode
	});
});

module.exports = router;