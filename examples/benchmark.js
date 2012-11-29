
/**
 * Module dependencies.
 */

var fs = require('fs')
  , compile = require('..')
  , read = fs.readFileSync

var str = read('examples/benchmark.css', 'utf8');
var start = new Date;
var css = compile(str);

console.log();
console.log('  duration: %dms', new Date - start);
console.log('  lines: %d', str.split('\n').length);
console.log('  size: %dkb', str.length / 1024 | 0);
console.log();