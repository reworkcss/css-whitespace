
/**
 * Compile the given `node`.
 *
 * @param {Array} node
 * @return {String}
 * @api private
 */

module.exports = function(node){
  console.log(JSON.stringify(node, null, 2));
  return visit(node);

  function visit(node) {
    switch (node[0]) {
      case 'root':
        return root(node);
      case 'rule':
        return rule(node);
      case 'block':
        return block(node);
      default:
        throw new Error('invalid node "' + node[0] + '"');
    }
  }

  function block(node) {
    // console.log(node);
  }

  function rule(node) {
    // console.log(node);
  }

  function root(node) {
    var buf = [];
    for (var i=0; i < node[1].length; ++i) {
      buf.push(visit(node[1][i]));
    }
    return buf.join('\n');
  }
};