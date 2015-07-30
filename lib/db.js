var db = require('lowdb')('themes.json');
var _ = require('lodash');

db._.mixin({
    update: function(array, name, value) {
        return _.chain(array)
            .where({name: name})
            .first()
            .assign(value)
            .value();
    }
});

module.exports = db('themes');