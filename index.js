
/**
 * Module dependencies.
 */

var parse = require('./lib/parser')
  , compile = require('./lib/compiler');

/**
 * Compile a whitespace significant
 * `str` of CSS to the valid CSS
 * equivalent.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

module.exports = function(str){
  var ast = parse(str);
  console.log(ast);
};