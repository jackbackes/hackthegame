'use strict';

var Node = require('./nn_node');

function NeuralNetPopulation () {
    this.nodes = [];
    this.nodeNumber = 0;
}

NeuralNetPopulation.prototype.createNode = function() {
    this.nodes.push(new Node(this.nodeNumber))
    this.nodeNumber++;
}

module.exports = NeuralNetPopulation;
