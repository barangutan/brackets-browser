var fs = require('fs');
var schedule = require('node-schedule');
var http = require('http');
var xtend = require('xtend');
var chalk = require('chalk');
var request = require('request');
var db = require('lowdb')('themes_raw.json');

var checksum = "";
var options = {host: 's3.amazonaws.com', port: 80, path: '/extend.brackets/registry.json'};

// Every 10 minutes rules
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);

var updateRegistry = schedule.scheduleJob(rule, function() {
    console.log(chalk.grey('Task running...' + new Date()));
    
    var req = http.request(xtend(options, {method: 'HEAD'}), function(res) {
        var modified = res.headers['last-modified'];
        
        //console.log('Checksum: %s, Content-length: %s\n', checksum, modified);
        
        if(checksum === "") {
            checksum = modified;
        } else
        if(checksum !== modified) { // registry has changed
            compileDatabase(checksum, modified);
            checksum = modified;
        }
    });
    req.end();
});

function compileDatabase(checksum, modified) {
    
    console.log(chalk.green('1. Need to recompile db! %s v %s\n'), checksum, modified);
    
    var req = request({
        method: 'GET', 
        uri: 'http://s3.amazonaws.com/extend.brackets/registry.json', 
        gzip: true
    }).pipe(fs.createWriteStream('registry.json'));
    
    req.on('error', function(err) {
        console.log(chalk.red('Error with pipe! ' + err));
    });
    
    req.on('end', function(err) {
        console.log(chalk.green('2. Saved registry.json');
        var input = require('./registry.json');
        
        var n = 0;
        console.log(chalk.green('3. Iterating through each item in new registry!');
        Object.keys(input).forEach(function(key) {
            var val = input[key];
            
            if(val.metadata && val.metadata.theme) {
                
                var same = db('themes').find({ title: val.name });
                
                if(same.versions !== val.versions.length) {
                    
                }
            

                console.log('%d - %s', ++n, key);
                db('themes').push(xtend(val.metadata, {totalDownloads: val.totalDownloads}));
            }
        });
    });
            
}