
var chalk = require('chalk');
var db = require('./lib/db.js');

db.forEach(function(theme) {
    console.log('%s - %s', theme.name, theme.homepage);
});
