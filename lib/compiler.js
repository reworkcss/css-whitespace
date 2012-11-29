
/**
 * Compile the given `node`.
 *
 * @param {Array} node
 * @return {String}
 * @api private
 */

module.exports = function(node){
  var indents = 1;

  return visit(node);

  /**
   * Visit `node`.
   */

  function visit(node) {
    switch (node[0]) {
      case 'root':
        return root(node);
      case 'rule':
        return rule(node);
      case 'block':
        return block(node);
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
    var props = node[1];
    ++indents;
    var ret = props.map(visit).join(';\n');
    --indents;
    return ret;
  }

  /**
   * Visit prop.
   */

  function prop(node) {
    var prop = node[1];
    var val = node[2];
    return indent() + prop + ': ' + val;
  }

  /**
   * Visit rule.
   */

  function rule(node) {
    var rule = node[1];
    var block = node[2];
  
    if (!block) return rule + ';';

    return indent() + rule + ' {\n'
      + visit(block)
      + '\n'
      + indent() + '}';
  }

  /**
   * Visit root.
   */

  function root(node) {
    var buf = [];
    for (var i=0; i < node[1].length; ++i) {
      buf.push(visit(node[1][i]));
    }
    return buf.join('\n\n');
  }

  /**
   * Return current indent.
   */
  
  function indent() {
    return Array(indents).join('  ');
  }
};