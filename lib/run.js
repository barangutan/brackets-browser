
var db = require('lowdb')('themes_raw.json');
var xtend = require('xtend');

var input = require('..//registry.json');
var n = 0;
Object.keys(input).forEach(function(key) {
    var val = input[key];
    
    if(val.metadata && val.metadata.theme) {
        
        console.log('%d - %s', ++n, key);
        db('themes').push(xtend(val.metadata, 
            {
                totalDownloads: val.totalDownloads, 
                owner: val.owner,
                versions: val.versions.length
            }
        ));
    }
});

