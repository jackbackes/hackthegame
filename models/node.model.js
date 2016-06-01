/* jshint node: true */

'use strict';

var db = require('./db');
var Sequelize = require('sequelize');

var allowedTypes = ['bias', 'input', 'output', 'hidden'];

var Node = db.define('node', {
    type: {
        type: Sequelize.STRING,
        defaultValue: 'hidden',
        validate: {
            isIn: {
                args: allowedTypes,
                msg: "Must be one of " + allowedTypes.join(', ')
            }
        }
    }
});

module.exports = Node;
