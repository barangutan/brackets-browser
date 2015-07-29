var db = require('lowdb')('themes.json');
var xtend = require('xtend');
var github = require('octonode');
var request = require('request');
var fs = require('fs');

var client = github.client();

var top5 = db('themes').chain().sortByOrder('totalDownloads', 'desc').take(10).value();
top5.forEach(function(theme, index) {
    var repo_array = theme.homepage.split('/');
    var repository = repo_array[3] + '/' + repo_array[4];
    
    if(repo_array[2] === 'github.com') {
        
        var url = 'https://raw.githubusercontent.com/' + repository + '/master/' + theme.theme.file;

        request(url, function(err, res, body) {
            if(err || res.statusCode !== 200)
                console.log('[%d] %s', res.statusCode, err);

        }).on('error', function(err) {
            console.log('ERrror: ' + err);
            
        }).pipe(fs.createWriteStream(__dirname + '/assets/' + theme.name + '.' + theme.version + '.css'));


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