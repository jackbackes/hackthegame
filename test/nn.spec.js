'use strict';

var chai = require('chai');
chai.use(require('chai-spies'))
var expect = chai.expect;

var NNP = require('../src/nnp');
var Node = require('../src/nn_node');

describe("Node Constructor", function () {
    it("has an ID of 0 by default", function () {
        var node = new Node();
        expect(node.id).to.equal(0);
    });

    it("has an id that can be explicitly set", function () {
        var node;
        var expectedId = Math.floor(Math.random()*100);
        node = new Node(expectedId);
        expect(node.id).to.equal(expectedId);
    });
});

describe("NeuralNetPopulation Constructor", function () {

    describe("the .createNode method", function () {

        var nnp;

        beforeEach(function () {
            nnp = new NNP();
        });

        it("adds a node to a global array of nodes", function () {
            expect(nnp.nodes.length).to.equal(0);
            nnp.createNode();
            expect(nnp.nodes.length).to.equal(1);
        });

        it("increments the node number", function () {
            var numNodes = Math.floor(Math.random()*100);
            var createdNodes = 0
            while(createdNodes < numNodes) {
                nnp.createNode();
                expect(nnp.nodes.pop().id).to.equal(createdNodes);
                createdNodes++;
            }
        });

    });

});
