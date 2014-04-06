# marc

  > Markdown as a dynamic template engine


Markdown is a text-to-HTML conversion tool for web writers. With a plain easy-to-write text you can create a website, a blog, a todo list, a slideshow or even a project presentation (like I've done here on github). However it is mostly used to generate static content.

`marc` makes markdown a dynamic conversion engine with integrated **templates** that **updates automatically** when the underlying data changes. It also allows you to create **filters** or **partials** and makes easy to create content dynamically from a database.

## Installation

`marc` works on both client and server side:
  
  with [component](http://component.io):

    $ component install bredele/marc

  with [nodejs](http://nodejs.org):

    $ npm install marc


### Command line

Install globally:

    $ npm install -g marc

```
Usage: marc [<input>] [<output>]

Examples:

  # pass an input and output file:
  $ marc input.md output.html
  
```

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
marc('I am using __markdown__ with {{label}}.', true);
//<p>I am using <strong>markdown</strong> with marc!.</p>
```

### Dynamic

  `marc` makes your markdown dynamic! It updates automatically when the underlying data changes.

```js
marc('I am using __narkdown__ with {{label}}.', function(val) {
  //<p>I am using <strong>markdown</strong> with marc!.</p>
  //<p>I am using <strong>markdown</strong> with github.</p> 
});

marc.set('label', 'marc!');
marc.set('label', 'github');
```

## Features

### Partials

  `marc` allows you to use partials (`{> name }`)


```js
marc.partial('hello', '__{{ label }}__!');
marc('This is a partial: {> hello }.', function(val){
  //<p>This is a partial: <strong>hello world</strong>!</p>
});

marc.set('label', 'hello world');
```

### Filters

  `marc` allows you to apply filter(s) to your markdown in a unix-like fashion.

```js
marc.filter('hello', function(str) {
  return 'hello ' + str + '!';
});
marc('# {{ name } | hello}.', true);
//<h1>hello world!.</h1>
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


## API

### General

#### marc(str, fn)

  Generate HTML from markdown.

```js
marc('I am using __markdown__.');
marc('hello __markdown__ with {{label}}', true);
marc('hello __markdown__ with {{label}}', function(val) {
  //do something on change
});
```

  Second argument is optional (substitute template variables if truethy).


#### marc.filter(str, fn)

  Add template filter. 

```js
marc.filter('hello', function(str) {
  return 'hello ' + str + '!';
});
marc('# {{ label } | hello}', true);

```

  Second argument is a function and takes the template variable as argument.

#### marc.partial(name, str)

  Add partial. 

```js
marc.partial('hello','__{{ name }}__');
marc('hello {> hello }', true);
```

#### marc.config(name, val)

  Set markdown options.

```js
marc.config('sanitize','true');
marc.config({
  sanitize: false,
  gfm: true
});
```

  or get options:


```js
marc.config('sanitize');
```

### Store

  `marc` is basically a mixin of [store](http://github.com/bredele/store) and exposes its entire api through the option `marc.data`. Here's an example of computed property:

```js
marc.data.compute('name',function() {
  return this.firstName + ' ' + this.lastName;
});
```

  However, `marc` overrides some of the most used store handler such as `get` and `set` just for the beauty of code.

#### .set(name, data)

 Set an attribute `name` with data object.

object store:
```js
marc.set('nickname','bredele');
```

 Or update data:

```js
marc.set({
  nickname: 'olivier',
  lastname: 'wietrich'
});
```

#### .get(name)

 Get an attribute `name`.

```js
marc.get('nickname');
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
