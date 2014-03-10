var constructor = require('..'),
    assert = require('assert');


describe("Options", function() {

	var marc;
	beforeEach(function() {
		marc = constructor();
	});
	
	it("should have a options handler", function() {
		assert.equal(typeof marc.config, 'function');
	});

	it("should set option", function() {

	});

	describe("set options", function() {

	});

});
