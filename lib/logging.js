
var moment = require('moment');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(
        {
            'timestamp':function () { return moment().format('DD-MM-YY, H:mm:ss'); },
            'colorize':true
        })
    ]
});

module.exports = logger;