
/**
 * Compile the given `node`.
 *
 * @param {Array} node
 * @return {String}
 * @api private
 */

module.exports = function(node){

  return visit(node);

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

  function block(node) {
    var props = node[1];
    return props.map(visit).join(';\n');
  }

  function prop(node) {
    return '  ' + node[1];
  }

  function rule(node) {
    var rule = node[1];
    var block = node[2];
  
    if (!block) return rule + ';';

    return rule + ' {\n'
      + visit(block)
      + '\n}';
  }

  function root(node) {
    var buf = [];
    for (var i=0; i < node[1].length; ++i) {
      buf.push(visit(node[1][i]));
    }
    return buf.join('\n');
  }
};