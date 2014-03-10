var constructor = require('..'),
    assert = require('assert');


describe("Partials", function() {
	var marc;
	beforeEach(function() {
		marc = constructor();
	});

	it("should add partials markdown", function() {
		assert.equal(typeof marc.partial, 'function');
	});

	describe("render:", function() {

		it("should render partials", function() {
			marc.partial('hello', '__hello world!__');
			var result = marc('This is a partial {> hello }', true);
			assert.equal(result, '<p>This is a partial <strong>hello world!</strong></p>\n');
		});

		it('should render partials with data', function() {
			marc.partial('hello', '__{{label}}!__');
			marc.set({
				label: 'hello world',
				name: 'hello'
			});
			var result = marc('This is the partial {{ name }}:{> hello }', true);
			assert.equal(result, '<p>This is the partial hello:<strong>hello world!</strong></p>\n');
		});

		it('should update partials on changes', function(done) {
			marc.partial('hello', '__{{label}}!__');
			var result = marc('This is a partial {> hello }', function(val) {
				if(val === '<p>This is a partial <strong>hello world!</strong></p>\n') done();
			});
			marc.set('label', 'hello world');
		});

		it('should update partials on changes', function(done) {
			marc.partial('hello', '__{{name}}!__');
			marc.set('name', 'hello world');
			var result = marc('This is a {{label}} {> hello }', function(val) {
				if(val === '<p>This is a partial <strong>hello world!</strong></p>\n') done();
			});
			marc.set('label', 'partial');
		});
		
	});


});
