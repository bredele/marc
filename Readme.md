
# marc

  > Markdown as a dynamic template engine


## Installation


  Install with [component](http://component.io):

    $ component install bredele/marc

  Install with [nodejs](http://nodejs.org):

    $ npm install marc


## Usage

  `marc` can be initialized with an optional data.

```js
var marc = require('marc')(data);
```

### Basic

  `marc` generates html from markdown.

```js
marc('I am using __markdown__.');
//<p>I am using <strong>markdown</strong>.</p>
```

### Templating

  `marc` is also a template engine! It makes markdown less static and allows you to substitute variables (double brackets `{{}}` with any data.

```js
marc.set('label', 'marc!');
marc('I am using __{{label}}__.', true);
//<p>I am using <strong>marc!</strong>.</p>
```

### Dynamic

  `marc` makes your markdown dynamic! It updates automatically when the underlying data changes.

```js
marc('I am using __{{ label }}__.', function(val) {
  //<p>I am using <strong>marc!</strong>.</p>
  //<p>I am using <strong>github</strong>.</p>  
});

marc.set('label', 'marc!');
marc.set('label', 'github');
```

## Features

### Filters

  `marc` allows you to apply filter(s) to your markdown in a unix-like fashion.

```js
marc.filter('hello', function(str) {
  return 'hello ' + str + '!';
});
marc('__{{ name } | hello}__.', true);
//<p><strong>hello world!</strong>.</p>
```

  > filters can be chained and reused multiple times.

<!-- ### Expressions

  You can use grouping, binary operators, identifiers, comparators and ternary operators...

```js
marc.set('items', ['item1', 'item2']);
marc('There is __{{items.length}}__ item{{ items.length !== 1 ? 's' : '' }}.', true);
//<p>There is <strong>2</strong> items.</p>
```

  ...directly from your markdown. -->

### Config

  `marc` use [marked](https://github.com/chjj/marked) and allows to set markdown options as following:

```js
//single options
marc.config('sanitize', true);

//multiple options
marc.config({
  gfm:true,
  smartypants:true
})
```

  or get options:

```js
marc.config('sanitize');
```



## License

  The MIT License (MIT)

  Copyright (c) 2014 <Olivier Wietrich>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.