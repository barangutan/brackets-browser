
var fs = require('fs');
var request = require('request');
var xtend = require('xtend');

var db = require('./db.js');

var fileName = '_registry.json';

var tasks = {
    
    downloadRegistry: function (callback) {
        // delete the original registry file if one exists
        fs.unlink(fileName, function (err) {
            // we skip over a 'No such file or directory' error
            if(err && err.code !== 'ENOENT') {
                return callback(err, null);
            }

            download();
        });

        // main function that downloads the registry.json file
        var download = function() {
            var req = request({
                method: 'GET', 
                uri: 'http://s3.amazonaws.com/extend.brackets/registry.json', 
                gzip: true
            })
            .on('error', function(err) {
                return callback(err, null);
            })
            .on('end', function() {
                return callback(null, fileName);
            }) 
            .pipe(fs.createWriteStream(fileName)); // write out to the fs
        }
    },
    
    buildDatabase: function (callback) {
        var registry = require('../' + fileName); // import registry file

        var totalThemes = 0;
        var totalExtensions = Object.keys(registry).length;
        
        Object.keys(registry).forEach(function(key) {
            var val = registry[key];

            // we only care about extensions that are themes!
            if(val.metadata && val.metadata.theme) {

                db.push(xtend(val.metadata, 
                    {
                        totalDownloads: val.totalDownloads, 
                        owner: val.owner,
                        versions: val.versions.length
                    }
                ));
                totalThemes++;
            }
        });
        
        // return success with the ratio of themes to extensions
        callback(null, totalThemes + ':' + totalExtensions);
    }
}

module.exports = tasks;
