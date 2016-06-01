'use strict';

var chai = require('chai');
chai.use(require('chai-spies'))
var expect = chai.expect;

var Node = require('../src/nn_node');

describe("Node Constructor", function () {

    describe("Node ID", function () {

        it("is 0 by default", function () {
            var node = new Node();
            expect(node.id).to.equal(0);
        });

        it("can be explicitly set", function () {
            var node;
            var expectedId = Math.floor(Math.random() * 100);
            node = new Node(expectedId);
            expect(node.id).to.equal(expectedId);
        });

    });

    describe("Node Type", function () {

        it("is 'hidden' by default", function () {
            var node = new Node();
            expect(node.type).to.equal('hidden');
            node = new Node(213123)
            expect(node.type).to.equal('hidden');
        });

        it("can be explicitly set", function () {
            var node;
            ["bias", "input", "output", "hidden"].forEach(function (type) {
                node = new Node(1, type);
                expect(node.type).to.equal(type);
            })
        });

        it("throws an error if the type is not recognized", function () {
            ["definitely", "not", "real", "nodes"].forEach(function (type) {
                expect(function () {
                    new Node(1, type)
                }).to.throw(type + ' is not a recognized node type');
            })

        });

    });

});
