'use strict';

var Node = require('./nn_node');

function NeuralNetPopulation () {
    this.nodes = [];
}

NeuralNetPopulation.prototype.createNode = function() {
    this.nodes.push(new Node())
}

module.exports = NeuralNetPopulation;
