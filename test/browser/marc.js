var constructor = require('marc'),
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


describe("Markdown", function() {

  describe("Basic", function() {
    var marc;
    beforeEach(function() {
      marc = constructor();
    });

    it('should render html', function() {
      var result = marc('I am using __markdown__.');
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
      var result = marc('I am using __{{label}}__.', true);
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


