/* jshint node: true */

'use strict';

var db = require('./db');
var Sequelize = require('sequelize');

var Node = db.define('node', {
    type: {
        type: Sequelize.STRING
    }
});

module.exports = Node;
