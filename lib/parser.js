/**
 * Module dependencies.
 */

var scan = require('./lexer')
  , util = require('util')
  , debug = require('debug')('css-whitespace:lexer');

/**
 * Parse the given `str`, returning an AST.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

module.exports = function(str) {
  var toks = scan(str);

  if (debug.enabled) {
    console.log(util.inspect(toks, false, 12, true));
  }

  return stmts();

  /**
   * Grab the next token.
   */

  function next() {
    return toks.shift();
  }

  /**
   * Check if the next token is `type`.
   */

  function is(type) {
    if (type == toks[0][0]) return true;
  }

  /**
   * Expect `type` or throw.
   */

  function expect(type) {
    if (is(type)) return next();
    throw new Error('expected "' + type + '", but got "' + toks[0][0] + '"');
  }

  /**
   * stmt+
   */

  function stmts() {
    var stmts = [];
    while (!is('eos')) stmts.push(stmt());
    return ['root', stmts];
  }

  /**
   * INDENT stmt+ OUTDENT
   */

  function block() {
    var props = [];
    expect('indent');
    while (!is('outdent')) props.push(stmt());
    expect('outdent');
    return ['block', props];
  }

  /**
   *   rule
   * | prop
   */

  function stmt() {
    if (is('rule')) return rule();
    if (is('prop')) return next();
  }

  /**
   * rule block?
   */

  function rule() {
    var rule = next();
    if (is('indent')) rule.push(block());
    return rule;
  }
}