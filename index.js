var supplant = require('store-supplant');
var marked = require('marked');
var trim = require('trim');
var Store = require('datastore');
		

/**
 * Expose 'marc'
 */

module.exports = function(data) {


	/**
	 * Partials.
	 * @type {Object}
	 */
	
  var partials = {};


  /**
   * Data
   * @type {Store}
   */
  
  var store = marc.data = new Store(data);
	store.use(supplant);


	/**
	 * Replace partial.
	 * 
	 * @api private
	 */
	
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
	 * Generates html from mardown.
	 * If the second argument is truethy, marc will substitute
	 * the markdown variables with data.
	 * example:
	 *
	 *   marc('hello __world__');
	 *   marc('hello __{{ label }}__', true);
	 *   marc('hello __{{ label }}__', function(val) {
	 *     //do something
	 *   });
	 * 
	 * @param {String} markdown 
	 * @param {Boolean|Function} fn
	 * @return {String} escaped html
	 * @api public
	 */

	function marc(str, fn) {
		var result = marked(str);
		if(fn) {
			result = store.supplant(partial(result), typeof fn === 'function' ? fn : false);
		}
		return result;
	}


	/**
	 * Set data.
	 * @see http://github.com/bredele/store
	 * 
	 * @param {String|Object} name n]
	 * @param {Any} val
	 * @api public
	 */
	
	marc.set = function(name, val) {
		store.set(name, val);
		return this;
	};


	/**
	 * Get data.
	 * @see http://github.com/bredele/store
	 * 
	 * @param {String} name n]
	 * @return {Any} val
	 * @api public
	 */
	
	marc.get = function(name) {
		return store.get(name);
	};


	/**
	 * Add template filters.
	 * example:
	 *
	 *   marc.filter('hello', function(str) {
	 *     return 'hello ' + str + '!'; 
	 *   });
	 * 
	 * @param {String} name
	 * @param {Function} fn
	 * @api public
	 */
	
	marc.filter = function(name, fn) {
		store.filter(name, fn);
		return this;
	};


	/**
	 * Set/get markdown options.
	 * example:
	 *
	 *   //set
	 *   marc.config('sanitize', true);
	 *   marc.config({
	 *     sanitize: true,
	 *     gfm: true
	 *   });
	 *   //get
	 *   marc.config('sanitize');
	 *   
	 * @param  {String|Object} name 
	 * @param  {Any} val 
	 * @api public
	 */
	
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


	/**
	 * Add template partial.
	 * A partial is called everytime there is {> }
	 * example:
	 *
	 *   marc.partial('hello', 'hello __{{ label }}__');
	 * 
	 * @param {String} name
	 * @param {String} str
	 * @api public
	 */
	
	marc.partial = function(name, str) {
		partials[name] = str;
	};



	return marc;

};


