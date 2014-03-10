var constructor = require('..'),
    assert = require('assert');


describe("Markdown", function() {

	describe("Basic", function() {
		var marc;
		beforeEach(function() {
			marc = constructor();
		});

		it('should render html', function() {
			console.time('basic');
			var result = marc('I am using __markdown__.');
			console.timeEnd('basic');
			assert.equal(result,'<p>I am using <strong>markdown</strong>.</p>\n');
		});

	});

	describe("Dynamic", function() {
		var marc;
		beforeEach(function() {
			marc = constructor({
				label: 'markdown'
			});
		});

		it('should render html with data', function() {
			console.time('dynamic');
			var result = marc('I am using __{{label}}__.', true);
			console.timeEnd('dynamic');
			assert.equal(result,'<p>I am using <strong>markdown</strong>.</p>\n');
		});

		it('should update rendered html', function(done) {
			var expected = '<p>I am using <strong>other</strong>.</p>\n';
			var result = marc('I am using __{{label}}__.', function(val) {
				if(val === expected) done();
			});
			assert.equal(result, '<p>I am using <strong>markdown</strong>.</p>\n');
			marc.set('label', 'other');
		});

		it('should update html everytime data changes', function(done) {
			var i = 0, 
			expected = '<p>I am using <strong>bredele</strong>.</p>\n';
			var result = marc('I am using __{{label}}__.', function(val) {
				i++;
				if(i === 2 && val === expected) done();
			});
			marc.set('label', 'other');
			marc.set('label', 'bredele');
		});

		it('should filter markdown', function() {
			marc.filter('upper', function(str) {
				return str.toUpperCase();
			});
			var result = marc('I am using __{{label} | upper}__.', true);
			assert.equal(result,'<p>I am using <strong>MARKDOWN</strong>.</p>\n');
		});

		// console.log(marc('__{{>partial}}__.'));

	});
	
	
	
});