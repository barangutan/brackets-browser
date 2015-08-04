var db = require('./lib/db.js');

var xtend = require('xtend');
var request = require('request');
var fs = require('fs');


var top5 = db.chain().sortByOrder('totalDownloads', 'desc').take(25).value();
db.forEach(function(theme, index) {
    
    if(typeof theme.homepage !== 'undefined')  {
        var repo_array = theme.homepage.split('/');
        var repository = repo_array[3] + '/' + repo_array[4];

        if(repo_array[2] === 'github.com') {

            var url = 'https://raw.githubusercontent.com/' + repository + '/master/' + theme.theme.file;

            request(url, function(err, res, body) {
                if(err || res.statusCode !== 200) {
                    console.log('[%d] %s (%s)', res.statusCode, err, theme.name);
                } else {
                    db.update(theme.name, {saved: true});
                    console.log('Saved \'%s\'', theme.name);
                }

            }).on('error', function(err) {
                console.log('ERrror: ' + err);

            }).pipe(fs.createWriteStream(__dirname + '/public/styles/assets/' + theme.name + '.' + theme.version + '.less'));

        }

    }
    //var repo = github.repo('pksunkara/hub');
    //console.log(nameRepo);
    //console.log('%d. %s - %d', index+1, theme.title, theme.totalDownloads);
});



//title, name, description, version, homepage, theme.file, theme.dark, totalDownloads

/*

TODO: population


var input = require('./registry.json');
var n = 0;
Object.keys(input).forEach(function(key) {
    var val = input[key];
    
    if(val.metadata && val.metadata.theme) {
        
        console.log('%d - %s', ++n, key);
        db('themes').push(xtend(val.metadata, {totalDownloads: val.totalDownloads}));
    }
});

*/


/*

TODO: store checksum

var http = require('http');
var options = {method: 'HEAD', host: 's3.amazonaws.com', port: 80, path: '/extend.brackets/registry.json'};
var req = http.request(options, function(res) {
    console.log(res.headers['content-length']);
  }
);
req.end();
*/