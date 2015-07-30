var db = require('../lib/db.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
 
    var themes = db
                .chain()
                .where({saved: true})
                .sortByOrder('totalDownloads', 'desc')
                .value();

    res.render('index', { themes: themes, partials: {sidebar: 'sidebar'}});
});

router.get('/:darklight', function(req, res, next) {
    var isDark = (req.params.darklight === 'dark') ? true : false;
    
    var local = db
                .chain()
                .where({theme: {dark: isDark}})
                .sortByOrder('totalDownloads', 'desc')
                .value();

    res.render('index', { themes: local, partials: {sidebar: 'sidebar'}});
});

router.get('/theme/:name', function(req, res, next) {
    
    var themes = db
                .chain()
                .where({saved: true})
                .sortByOrder('totalDownloads', 'desc')
                .value();
 
    var theme = db.chain().where({name: req.params.name}).first().value();
    var style = theme.name + '.' + theme.version;
    

    res.render('theme', { theme: theme, themes: themes, stylesheet: style, partials: {sidebar: 'sidebar'}});
});

module.exports = router;
