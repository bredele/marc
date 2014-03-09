var Store = require('..'),
    assert = require('assert');


describe('General', function(){

  it('should initialize with an object', function(){
    var other = new Store({
      name : 'olivier'
    });
    assert('olivier' === other.get('name'));
  });

  it('should initialize with a store', function(){
    var other = new Store({
      name : 'olivier'
    });
    var store = new Store(other);
    assert('olivier' === store.get('name'));
  });

  describe('setter/getter', function(){
    var store = null;

    beforeEach(function(){
      store = new Store();
    });

    it('should set the data', function(){
      store.set('name', 'olivier');
      assert('olivier' === store.get('name'));
    });

    //SHould we clone the result?
    // it('should get a clone of a data attribute', function() {
    //   store.set('github', {
    //     repo: 'store'
    //   });
    //   var cp = store.get('github');
    //   cp.repo = 'bredele';

    //   assert.deepEqual(store.get('github'), {
    //     repo: 'store'
    //   });
    // });

    it('should update an existing store attribute', function(){
      store.set('name', 'olivier');
      store.set('name', 'bredele');
      assert('bredele' === store.get('name'));
    });

    it("should return undefined if attribute doesn't exist", function(){
      assert(undefined === store.get('name'));
    });

    describe('setter emitter', function(){
      var store = null;
      beforeEach(function(){
        store = new Store();
      });

      it('should emit a change event when set attribute', function(){
        var obj = {};
        store.on('change', function(name, value){
          obj[name] = value;
        });
        store.set('name', 'olivier');
        assert(obj.name === 'olivier');
      });

      it('should only emit event whwn attribute has changed', function(){
        var hasChanged = false;
        store.set('name', 'olivier');
        store.on('change', function(name, value){
          hasChanged = true;
        });
        store.set('name', 'olivier');
        assert(false === hasChanged);
      });

      it('should emit a change event with the current and previous value of an attribute', function(){
        var obj = {};
        store.set('name', 'olivier');
        store.on('change', function(name, value, prev){
          obj[name] = [value, prev];
        });
        store.set('name', 'bredele');
        assert(obj.name[0] === 'bredele');
        assert(obj.name[1] === 'olivier');    
      });

    });
  });

  describe('delete', function(){
    var store = null;

    beforeEach(function(){
      store = new Store();
    });

    it('should delete a model attribute', function(){
      store.set('name', 'olivier');
      store.del('name');
      assert(undefined === store.get('name'));
    });

    it("should not delete a model attribute that doesn't exist", function(){
      store.del('name');
      assert(undefined === store.get('name'));
    });

    describe('delete emitter', function(){ //NOTE: is that necessary?
      it('should emit a deleted event when delete an attribute', function(){
        var store = new Store();
        var isDeleted = false;
        var deletedAttr = '';
        store.set('name', 'olivier');
        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert(isDeleted === true);
        assert(deletedAttr === 'name');
      });

      it("should not emit the deleted event if attribute doesn't exist", function(){
        var store = new Store();
        var isDeleted = false;
        var deletedAttr = '';
        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert(isDeleted === false);
        assert(deletedAttr === '');
      });
    });

  });

  describe('reset', function(){
    describe("reset store-object", function() {
      var store = null;
      beforeEach(function(){
        store = new Store({
          name: 'olivier',
          twitter: 'bredeleca'
        });
      });

      it('should reset store', function(){
        store.reset({
          github:'bredele'
        });
        assert(undefined === store.get('name'));
        assert(undefined === store.get('twitter'));
        assert('bredele' === store.get('github'));
      });

      it('should notify on change', function(){
        var isDeleted = false;
        store.on('deleted name', function() {
          isDeleted = true;
        }); //TODO: may be spy 
        store.reset({
          github:'bredele'
        });

        assert.equal(true, isDeleted);
      });
    });
    
    describe("reset store-array", function() {

      it("should delete and change items", function() {
        var index = 0,
           store = new Store([]);
        for(var i = 0; i < 1000; i++) {
          store.set(i, 'item' + i);
        }

        store.on('deleted', function() {
          index++;
        });

        store.reset([
          'store',
          {
            github: 'store'
          }
        ]);

        assert.deepEqual(store.data, [
          'store', 
          {
            github: 'store'
          }
        ]);
        //998 deleted and 2 changed
        assert.equal(index, 998);
      });

      it("should add and change items", function() {
        var index = 0,
            store = new Store([]);

        for(var i = 0; i < 1000; i++) {
          store.set(i, {
            item: 'item'+ i
          });
        }

        var copy = store.data.slice(0);
        for(var j = 1000; j < 2000; j++) {
          copy.push('item' + j);
        }

        store.on('change', function(idx, val, prev) {
          if(!prev) {
            index++;
          } else {
            index--;
          }
        });
        store.reset(copy);
        assert.equal(store.data.length, 2000);
        assert.equal(index, 1000);

      });
      
      
    });
    
  });

  describe("update", function() {
    it('should update store-object', function() {
      var githubChanged = false,
        projectAdded = false,
        store = new Store({
          github: 'bredele',
          repo: 'store'
        });

      store.on('change github', function(val) {
        if(val === 'leafs') githubChanged = true;
      });

      store.on('change project', function(val, prev) {
        if(!prev) projectAdded = true;
      });

  
      store.set({
        github: 'leafs',
        project: 'maple'
      });

      assert.deepEqual(store.data, {
        github: 'leafs',
        repo: 'store',
        project: 'maple'
      });
      assert.equal(githubChanged, true);
      assert.equal(projectAdded, true);



    });

    it("should update store-array", function() {
      var changed = false,
        added = false,
      store = new Store(['hello']);

      store.on('change 0', function() {
        changed = true;
      });
      store.on('change 1', function() {
        added = true;
      });
      store.set(['world', {
        github: 'bredele'
       }]);
      
      assert.deepEqual(store.data, ['world', {
        github: 'bredele'
       }]);
      assert.equal(changed, true);
      assert.equal(added, true);

    });
    
  });
  

});

describe('formatter', function(){
  //NOTE: could we have formatter as plugin in the set function
  it('should return the formatted data', function(){
    var store = new Store();
    store.format('name', function(value){
      return value.toUpperCase();
    });
    store.set('name', 'olivier');
    assert('OLIVIER' === store.get('name'));
  });
});

describe('computed attributes', function(){
  var store = null;
  beforeEach(function(){
    store = new Store();
    store.set('firstname', 'olivier');
    store.set('lastname', 'wietrich');
  });
  it('should compute multiple attributes', function(){
    store.compute('name', function(){
      return this.firstname + ' ' + this.lastname;
    });
    assert('olivier wietrich' === store.get('name'));
  });

  it('should listen change on a computed attribute', function(){
    var obj = {};
    store.compute('name', function(){
      return this.firstname + ' ' + this.lastname;
    });

    store.on('change name', function(value){
      obj.hasChanged = true;
      obj.value = value;
    });

    store.set('firstname', 'nicolas');

    assert('nicolas wietrich' === store.get('name'));
  });
});

describe("pipe", function() {

  describe("pipe full store", function() {
    var store;
    beforeEach(function() {
      store = new Store({
        repo: 'store',
        github: 'bredele'
      });
    });

    it("should pipe two stores", function() {
      var child = new Store();
      store.pipe(child);
      assert.equal(child.get('repo'), 'store');
      assert.equal(child.get('github'), 'bredele');
      assert.deepEqual(child.data, store.data);
    });

    it('should update the piped store', function() {
      var child = new Store({
        hello: 'world'
      });
      store.pipe(child);
      assert.equal(child.get('repo'), 'store');
      assert.equal(child.get('github'), 'bredele');
      assert.equal(child.get('hello'), 'world'); 
    });

    it("should update piped store on changes", function() {
      var child = new Store();
      store.pipe(child);
      store.set('repo', 'brick');
      assert.equal(child.get('repo'), 'brick');
    });

    it('should update piped store when deleted', function() {
      var child = new Store();
      store.pipe(child);
      store.del('repo');
      assert.equal(child.get('repo'), undefined);
      assert.deepEqual(child.data, store.data);
    });

    it('should reset piped store on reset', function() {
      var child = new Store();
      store.pipe(child);
      store.reset({
        repo:'brick'
      });
      assert.equal(child.get('repo'), 'brick');
      assert.deepEqual(child.data, store.data);
    });
    
  });
  
});


describe('utils', function(){

  describe('loop', function(){

    it('should loop through object data', function() {
      var keys = '';
      var values = '';
      var store = new Store({
        name : 'olivier',
        github: 'bredele'
      });
      store.loop(function(key, val) {
        keys += key;
        values += val;
      });
      assert(keys === 'namegithub');
      assert(values === 'olivierbredele');
    });
  });

  describe("Localstore", function() {
    it("should persist data in local store", function() {
      var store = new Store({
        name: 'olivier'
      });
      store.local('bredele');
      assert.equal(localStorage.getItem('bredele'), store.toJSON());
    });

    it("should synchronize data with local store", function() {
      var store = new Store();
      store.local('bredele', true);
      assert.equal(store.get('name'), 'olivier');
    });
    
    
  });

  it('should extend store with middlewares', function() {
    var store = new Store();
    store.use(function(obj) {
      obj.save = function(){};
    });
    assert.equal(typeof store.save, 'function');
  });

  it('should serialize data .toJSON()', function(){
    var store = new Store({
      name : 'olivier',
      github: 'bredele'
    });
    store.set('twitter', 'bredeleca');
    var json = store.toJSON();
    assert( '{"name":"olivier","github":"bredele","twitter":"bredeleca"}' === json);
  });
});

describe('array like', function(){
  it('should remove an item properly', function(){
    var store = new Store(['item1', 'item2', 'item3']);
    store.del(0);
    assert(2 === store.data.length);
  });

});



