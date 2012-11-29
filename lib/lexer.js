
/**
 * Scan the given `str` returning tokens.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

module.exports = function(str) {
  var indents = [0]
    , stash = [];

  return scan();

  /**
   * tok+
   */

  function scan() {
    var toks = []
      , curr;

    while (str.length) {
      curr = next();
      curr && toks.push(curr);
      if (str.length && !curr) {
        throw new Error('syntax error near "' + str.slice(0, 10) + '"');
      }
    }

    toks = toks.concat(stash);
    while (indents.pop()) toks.push(['outdent']);
    toks.push(['eos']);
    return toks;
  }

  /**
   *   eos
   * | indentation
   * | rule
   */

  function next() {
    return stashed()
      || indentation()
      || rule();
  }

  /**
   * Deferred tokens.
   */

  function stashed() {
    return stash.shift();
  }

  /**
   *   INDENT
   * | OUTDENT
   */

  function indentation() {
    var spaces = str.match(/^\n( *)/);
    if (!spaces) return;
    str = str.slice(spaces[0].length);
    spaces = spaces[1].length;
    var prev = indents[indents.length - 1];

    // INDENT
    if (spaces > prev) return indent(spaces);

    // OUTDENT
    if (spaces < prev) return outdent(spaces);

    return next();
  }

  /**
   * Indent.
   */

  function indent(spaces) {
    indents.push(spaces);
    return ['indent'];
  }

  /**
   * Outdent.
   */

  function outdent(spaces) {
    while (indents[indents.length - 1] > spaces) {
      indents.pop();
      stash.push(['outdent']);
    }
    return stashed();
  }

  /**
   * (^ newline)+
   */

  function rule() {
    var line = str.match(/^[^\n]+/);
    if (!line) return;
    line = line[0];
    str = str.slice(line.length);
    return ['rule', line];
  }
}