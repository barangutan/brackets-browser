var fs = require('fs');
var chalk = require('chalk');
var diff = require('changeset');

var _old = "";
var _new = "";

fs.readFile('oldreg.json', 'utf8', function (err,olddata) {
    if (err) {
        return console.log(err);
    }
    
    _old = olddata;
  
    fs.readFile('newreg.json', 'utf8', function (err,newdata) {
        if (err) {
            return console.log(err);
        }

        _new = newdata;
        
        var changes = diff(_old, _new);
        

        console.log(changes);

    });
});