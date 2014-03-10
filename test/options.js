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


	it("should set and get option", function() {
		marc.config('sanitize', true);
		assert.equal(marc.config('sanitize'), true);
	});

	it('should set multiple options', function() {
		marc.config({
			sanitize: true,
			escaped:false
		});
		assert.equal(marc.config('sanitize'), true);
		assert.equal(marc.config('escaped'), false);
	});

});
