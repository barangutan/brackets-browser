var express = require('express');
var router = express.Router();

var low = require('lowdb')
var db = low('themes.json')

router.get('/', function(req, res, next) {
 
    var top5 = db('themes')
                .chain()
                .sortByOrder('totalDownloads', 'desc')
                .take(15)
                .value();

    res.render('index', { title: 'Top 15 Brackets.io Themes', top: top5});
});

router.get('/light', function(req, res, next) {
 
    var top5light = db('themes')
                    .chain()
                    .where({theme: {dark: false}})
                    .sortByOrder('totalDownloads', 'desc')
                    .take(15)
                    .value();

    res.render('index', { title: 'Top 15 \'light\' Brackets.io Themes', top: top5light});
});

module.exports = router;
