var express = require('express');
var router = express.Router();

/* Display an index of the books and links to files. */
router.get('/', function (req, res, next) {
    var coverPhotos_array = [];
    var mode = req.query.mode;
    //console.log("mode: " + mode);
    //edit this for exporting to epub so that paths match up
    //specifically for head.js with the CSS
    var pathMode = '../../';
    if (mode === 'export') {
        pathMode = '';
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
router.get('/book/:bookNum/content.opf', function (req, res, next) {
    var bookNumber = parseInt(req.params.bookNum);

    var d = new Date().toISOString();
    d = d.replace(/\..*Z/, 'Z'); //Removes decimal values that throw errors.
    var originalPubDate = global.book.config[0].originalpubdate;
    originalPubDateFormatted = new Date(originalPubDate).toISOString();
    originalPubDateFormatted = originalPubDateFormatted.replace(/\..*Z/, 'Z');

    var photos_array = [];
    var photos_bookNumber_array = []; //Used to link to the subfolders for the images in .opf

    for (var i = 0; i < global.book.photos.length; i++) {
        if (bookNumber + 1 == global.book.photos[i].book) {
            var photo = global.book.photos[i].filename;
            var photo_bookNumber = global.book.photos[i].book;
            photos_bookNumber_array.push(photo_bookNumber);
            photos_array.push(photo);
        } else if (global.book.photos[i].book == 0) {
            var photo = global.book.photos[i].filename;
            var photo_bookNumber = global.book.photos[i].book;
            photos_bookNumber_array.push(photo_bookNumber);
            photos_array.push(photo);
            
        }
    }
    console.log(photos_array[0]);
    res.render('content', {
        book: bookNumber,
        photos: photos_array,
        photos_bookNumber: photos_bookNumber_array,
        date: d,
        pubDate: originalPubDateFormatted
    });
});

/* Display cover.xhtml. */
router.get('/book/:bookNum/cover.xhtml', function (req, res, next) {
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
router.get('/book/:bookNum/titlepage.xhtml', function (req, res, next) {
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
router.get('/book/:bookNum/toc.xhtml', function (req, res, next) {
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
    //console.log('Isolating this book.')
    for (var i = 0; i < global.book.chapters.length; i++) {
        if (global.book.chapters[i].book - 1 == bookNumber) {
            currentBook.push(global.book.chapters[i]);
        }
    }
    //split the book into a 'chapters' array of chapters. Each chapter has an array of subchapter objects.
    //console.log('Splitting the book into chapters.')
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
    //console.log(chapters);
    res.render('toc', {
        book: bookNumber,
        bookIntro: currentBook[0],
        chapters: chapters,
        pathPrefix: pathMode
    });
});

/* Display toc.ncx. */
router.get('/book/:bookNum/toc.ncx', function (req, res, next) {
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
    //console.log('Isolating this book.')
    for (var i = 0; i < global.book.chapters.length; i++) {
        if (global.book.chapters[i].book - 1 == bookNumber) {
            currentBook.push(global.book.chapters[i]);
        }
    }
    //console.log(currentBook);

    var playOrder = [];
    for (var j = 0; j < currentBook.length; j++) {
        playOrder.push(parseInt(currentBook[j].subchapter) + 3);
    }
    //console.log(playOrder);
    //process.exit(0);

    res.render('tocncx', {
        book: bookNumber,
        pathPrefix: pathMode,
        currentBook: currentBook,
        playOrder: playOrder
        /*numberOfChapters: numberOfChapters,
        currentSubchapter: currentSubchapter,
        subchapters: subchapter_array*/
    });
});

/* Display introduction.xhtml. */
router.get('/book/:bookNum/introduction.xhtml', function (req, res, next) {
    var bookNumber = parseInt(req.params.bookNum);
    var picture_array = [];
    //edit this for exporting to epub so that paths match up
    //specifically for head.js with the CSS
    var mode = req.query.mode;
    var pathMode = '../../';
    if (mode == 'export') {
        pathMode = ''
    }
    //create code snippets for each photo, alt tag, caption and credit.
    for (var i = 0; i < global.book.photos.length; i++) {
        if (global.book.photos[i].book == 0) {
            var picture = '<div class="img_fs_cap"><div><img src="' + pathMode + 'images/v2_' + (bookNumber + 1) + "/" + global.book.photos[i].filename + '" alt="' + global.book.photos[i].alttext + '" /></div><p class="caption">' + global.book.photos[i].cutline + ' ' + global.book.photos[i].credit + '</p></div>';
            picture_array.push(picture);
        }
    }
    //console.log('PICTURE ARRAY: ')
    //console.log(picture_array);
    res.render('introduction', {
        book: bookNumber,
        picture: picture_array,
        pathPrefix: pathMode
    });
});

/* Display bodymatter.xhtml. */
router.get('/book/:bookNum/bodymatter.xhtml', function (req, res, next) {
    var bookNumber = parseInt(req.params.bookNum);
    var partials_array = [];
    var photos_array = [];
    var titles_array = [];
    var chapterID_array = [];
    //EDIT THIS FOR EXPORTING TO EPUB SO THAT PATHS MATCH UP
    //SPECIFICALLY FOR HEAD.JS WITH THE CSS
    var mode = req.query.mode;
    var pathMode = '../../';
    if (mode == 'export') {
        pathMode = ''
    }
    //SET VARIABLES FOR THE INTRODUCTION TO EACH BOOK
    var intro = "partials/content/book" + (bookNumber + 1) + "/overview.ejs";
    
    //CREATE A CUSTOM OBJECT FOR EACH BOOK.
    var currentBook = [];
    //console.log('Isolating book number ' + (bookNumber + 1))
    for (var i = 0; i < global.book.chapters.length; i++) {
        if (global.book.chapters[i].book - 1 == bookNumber) {
            currentBook.push(global.book.chapters[i]);
        }
    }
    //console.log('-------------')
    //console.log(currentBook);
    //console.log('-------------')
    //console.log('global.book.chapters.length: ' + global.book.chapters.length)
    
    //SPLIT THE BOOK INTO A 'CHAPTERS' ARRAY OF CHAPTERS. EACH CHAPTER HAS AN ARRAY OF SUBCHAPTER OBJECTS.
    //console.log('Splitting book into chapters.')
    //console.log(currentBook.length)
    var currentChapter = 1;
    var chapters = [];
    var chapter = [];
    for (i = 1; i < currentBook.length; i++) {
        if (currentBook[i].chapter == currentChapter) {
            chapter.push(currentBook[i]);
            //console.log(chapter)
        } else {
            chapters.push(chapter);
            currentChapter++;
            //console.log(currentChapter);
            chapter = [];
            chapter.push(currentBook[i]);
        }
    }
    chapters.push(chapter);
    //console.log('-------------');
    //console.log('chapters length: ' + chapters.length);
    //console.log('-------------')
    //console.log(chapters);
    //console.log('-------------')
    
    //LOOP THROUGH ALL THE OBJECTS IN THE CHAPTERS ARRAY
    for (i = 0; i < chapters.length; i++) {
        for (y = 0; y < chapters[i].length; y++) {
            //populate array of chapter titles
            titles_array.push(chapters[i][y].chaptertitle);
            //populate array of title anchor tags for toc
            chapterID_array.push(chapters[i][y].htmlid);
            //create code snippets for each chapter's content
            if (chapters[i][y].indent == 1) {
                var copy = 'partials/content/book' + (bookNumber + 1) + '/chapter' + (chapters[i][y].chapter) + '.ejs';
                //console.log('-------------');
                //console.log(copy);
                partials_array.push(copy);
            }
            //console.log("Book#" + chapters[i][y].book + " :: section#" + chapters[i][y].subchapter + " :: " + chapters[i][y].chaptertitle);
        }
        //console.log(i + ": " + partials_array[i]);
    }
    //console.log('partials_array')
    //console.log(partials_array);
    //console.log(titles_array.length);
    
    //CREATE CODE SNIPPETS FOR EACH PHOTO, ALT TAG, CAPTION AND CREDIT.
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
        titles: titles_array,
        chapter_ID: chapterID_array,
        partials: partials_array,
        photo: photos_array,
        pathPrefix: pathMode
    });
});

/* Display the backmatter.xhtml. */
router.get('/book/:bookNum/backmatter.xhtml', function (req, res, next) {
    var bookNumber = parseInt(req.params.bookNum);
    var endnotes_array = [];
    var thischapter_array = [];
    //edit this for exporting to epub so that paths match up
    //specifically for head.js with the CSS
    var mode = req.query.mode;
    var pathMode = '../../';
    if (mode == 'export') {
        pathMode = ''
    }
    
    //SET VARIABLES FOR THE INTRO ENDNOTES
    //var intro = "partials/content/book" + (bookNumber + 1) + "/overviewBacknotes.ejs";
    //console.log(intro);
    
    //CREATE A CUSTOM OBJECT FOR EACH BOOK.
    var currentBook = [];
    var thisBookNo = 0;
    console.log('Isolating book number ' + (bookNumber + 1));
    
    for (var i = 0; i < global.book.chapters_meta.length; i++) {
        thisBookNo = global.book.chapters_meta[i].booknumber;
        if (thisBookNo - 1 == bookNumber) {
            currentBook.push(global.book.chapters_meta[i]);
        }
    }
    //console.log('******************')
    //console.log(currentBook);
    //console.log('-------------');
    //console.log('global.book.chapters.length: ' + global.book.chapters.length);
    
    //LOOP THROUGH ALL THE OBJECTS IN THE CURRENT BOOK ARRAY
    for (i = 0; i < currentBook.length; i++) {
        //var this_book = parseInt(global.book.chapters_meta[i].booknumber);
        var this_chapter = parseInt(global.book.chapters_meta[i].chapternumber);
        //console.log(this_chapter);
        if (this_chapter == 0) {
            //set variables for the introduction to each book
            var endnotes = 'partials/content/book' + (bookNumber + 1) + '/overviewBacknotes.ejs';
            endnotes_array.push(endnotes);
            thischapter_array.push(this_chapter);
        } else {
            var endnotes = 'partials/content/book' + (bookNumber + 1) + '/back' + (this_chapter) + '.ejs';
            endnotes_array.push(endnotes);
            thischapter_array.push(this_chapter);
        }
    }
    //console.log('ENDNOTES ARRAY -------------');
    //console.log(endnotes_array);
    //console.log('CHAPTER ARRAY -------------');
    //console.log(thischapter_array);

     //process.exit(0);
    res.render('backmatter', {
        book: bookNumber,
        endnotes: endnotes_array,
        thischapter: thischapter_array,
        pathPrefix: pathMode
    });
});

module.exports = router;