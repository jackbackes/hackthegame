/* jshint node: true, mocha: true */

'use strict';

var expect = require('chai').expect;
var Bluebird = require('bluebird');
var db = require('../models/db');
var Node = require('../models/node.model');

describe("Node", function () {

    //clear the database before all tests
    before(function () {
        return db.sync({
            force: true
        });
    });

    // erase the database after each spec
    afterEach(function () {
        return db.sync({
            force: true
        });
    });

    describe("Type Field", function () {

        it("is of type String", function () {
            var node = Node.build({
                type: 'input'
            });
            expect(node.type).to.equal('input');
        });

        it("is required", function () {
            var node = Node.build();
            return node.validate()
                .then(function (result) {
                    expect(result).to.be.an('object');
                    expect(result.message).to.equal('notNull Violation: type cannot be null');
                });
        });

        it("can only be one of the approved types", function () {
            var node;
            var allowedTypes = ['bias', 'input', 'output', 'hidden'];
            allowedTypes.forEach(function (type) {
                node = Node.build({
                    type: type
                });
                expect(node.type).to.equal(type);
            });

            node = Node.build({
                type: 'definitelynotarealtype'
            });
            return node.validate()
                .then(function (result) {
                    expect(result).to.be.an('object');
                    expect(result.message).to.equal('Validation error: Must be one of ' + allowedTypes.join(', '));
                });
        });

    });

});
