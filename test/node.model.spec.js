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

    });

});
