var Store = require('store-component'),
		supplant = require('store-supplant'),
		marked = require('marked'),
		trim = require('trim');


/**
 * Expose 'marc'
 */

module.exports = function(data) {

  var store = new Store(data);
  store.use(supplant);

  var partials = {};

	function partial(str, fn) {
		return str.replace(/\{&gt;([^}]+)\}/g, function(_, expr) {
			var name = trim(expr),
			val = partials[name];
			if(val){
				val = marc(val);
				if(val.substring(0, 3) === '<p>') val = val.substring(3, val.length - 5);
				return val;
			}
		});
	}

	/**
	 * marc constructor.
	 * @api public
	 */

	function marc(str, fn) {
		var result = marked(str);
		if(fn) {
			result = store.supplant(partial(result), typeof fn === 'function' ? fn : false);
		}
		return result;
	}

	marc.set = function(name, val) {
		store.set(name, val);
		return this;
	};

	marc.get = function(name) {
		return store.get(name);
	};

	marc.filter = function(name, fn) {
		store.filter(name, fn);
		return this;
	};

	marc.config = function(name, val) {
		if(typeof name === 'string') {
			if(val) {
				var obj = {};
				obj[name] = val;
				marked.setOptions(obj);
			} else {
				return marked.defaults[name];
			}
		} else {
			marked.setOptions(name);
		}
		return this;
	};

	marc.partial = function(name, str) {
		partials[name] = str;
	};

	return marc;

};


