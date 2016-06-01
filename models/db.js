/* jshint node: true */

'use strict';

var Sequelize = require('sequelize');

var database = process.env.NODE_ENV === 'test' ? 'neatdbtest' : 'neatdb'

module.exports = new Sequelize('postgres://localhost:5432/' + database, {
    logging: false
});
