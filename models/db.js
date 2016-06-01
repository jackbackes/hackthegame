'use strict';

var config = require('../config.json');
var Sequelize = require('sequelize');

module.exports = new Sequelize('postgres://localhost:5432/neatdb',{logging: false});
