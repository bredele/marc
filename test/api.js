var constructor = require('..'),
    assert = require('assert');


describe("API", function() {

	describe("constructor", function() {

		it("should be a function", function() {
			assert.equal(typeof constructor, 'function');
		});

		it('should return a function', function() {
			assert.equal(typeof constructor(), 'function');
		});

	});

	describe("inherits from store", function() {
		var marc;
		beforeEach(function() {
			marc = constructor();
		});

		it('should mixin store api', function() {
			assert.equal(typeof marc.set, 'function');
			assert.equal(typeof marc.get, 'function');
		});
		
		it("should set/get data", function() {
			marc.set('template', 'marc');
			assert.equal(marc.get('template'), 'marc');
		});
		
	});
	

});
