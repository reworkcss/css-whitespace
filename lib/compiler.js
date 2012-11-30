
/**
 * Module dependencies.
 */

var debug = require('debug')('css-whitespace:parser')
  , util = require('util');

/**
 * Compile the given `node`.
 *
 * @param {Array} node
 * @return {String}
 * @api private
 */

module.exports = function(node){
  var indents = 1;
  var rules = [];
  var stash = [];
  var level = 0;
  var nest = 0;

  if (debug.enabled) {
    console.log(util.inspect(node, false, 12, true));
  }

  return visit(node);

  /**
   * Visit `node`.
   */

  function visit(node) {
    switch (node[0]) {
      case 'root':
        return root(node);
      case 'rule':
        if ('@' == node[1][0]) ++nest;
        var ret = rule(node);
        if ('@' == node[1][0]) --nest;
        return ret;
      case 'block':
        ++level;
        var ret = block(node);
        --level;
        return ret;
      case 'prop':
        return prop(node);
      default:
        throw new Error('invalid node "' + node[0] + '"');
    }
  }

  /**
   * Visit block.
   */

  function block(node) {
    var buf = [];
    var nodes = node[1];
    
    for (var i = 0; i < nodes.length; ++i) {
      buf.push(visit(nodes[i]));
    }

    return buf.join('');
  }

  /**
   * Visit prop.
   */

  function prop(node) {
    var prop = node[1];
    var val = node[2];
    return indent() + prop + ': ' + val + ';\n';
  }

  /**
   * Visit rule.
   */

  function rule(node) {
    var rule = node[1];
    var block = node[2];
  
    if (!block) return rule + ';';

    rules.push(node);

    if ('@' == rule[0]) {
      var buf = join(rules) + '{\n'
      visit(block);
      buf += stash.join('\n');
      buf += '\n}';
      stash = [];
    } else if (nest) {
      indents = 2;
      var buf = '  ' + join(rules, 1) + '{\n';
      buf += visit(block);
      buf += '  }';
      indents = 1;
    } else {
      var buf = join(rules) + '{\n'
        + visit(block)
        + '}';
    }

    if (rules.length > 1) {
      if (hasProperties(block)) stash.push(buf);
      buf = '';
    }
    
    rules.pop();
  
    return buf;
  }

  /**
   * Visit root.
   */

  function root(node) {
    var buf = [];
    for (var i = 0; i < node[1].length; ++i) {
      buf.push(visit(node[1][i]));
      if (stash.length) {
        buf = buf.concat(stash);
        stash = [];
      }
    }
    return buf.join('\n\n');
  }

  /**
   * Return indent.
   */
  
  function indent() {
    return Array(indents + 1).join('  ');
  }
};

/**
 * Join the given rules.
 *
 * @param {Array} rules
 * @param {Number} [offset]
 * @return {String}
 * @api private
 */

function join(rules, offset) {
  var buf = '';
  var curr;
  var next;

  for (var i = offset || 0; i < rules.length; ++i) {
    curr = rules[i];
    next = rules[i + 1];
    buf += curr[1];
    if (next && next.parent) continue;
    buf += ' ';
  }

  return buf;
}

/**
 * Check if `block` has properties.
 *
 * @param {Array} block
 * @return {Boolean}
 * @api private
 */

function hasProperties(block) {
  var nodes = block[1];
  for (var i = 0; i < nodes.length; ++i) {
    if ('prop' == nodes[i][0]) return true;
  }
  return false;
}

/**
 * Blank string filter.
 *
 * @api private
 */

function blank(str) {
  return '' != str;
}