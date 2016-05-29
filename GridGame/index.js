
const args   = ...process.argsv;
const env    =    process.env;

const Engine = require('./modules/GameEngine')
const Model  = require('./GameModel');
const Logic  = require('./GameLogic');

var game = Engine(Model, Logic);
