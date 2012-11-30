
/**
 * Module dependencies.
 */

var fs = require('fs')
  , compile = require('..')
  , read = fs.readFileSync

var str = read('examples/nesting.css', 'utf8');
var css = compile(str);
console.log(css);