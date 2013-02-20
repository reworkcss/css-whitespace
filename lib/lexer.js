
/**
 * Pesudo selectors.
 */

var pseudos = [
  ':selection',
  'fullscreen',
  'nth-child',
  'first-child',
  'last-child',
  'link',
  'visited',
  'hover',
  'active',
  'focus',
  'first-letter',
  'first-line',
  'before',
  'after',
  'lang',
  'enabled',
  'disabled',
  'only-child',
  'only-of-type',
  'first-of-type',
  'last-of-type',
  'nth-last-of-type',
  'nth-of-type',
  'root',
  'empty',
  'target',
  'not',
  '-o',
  '-ms',
  '-moz',
  '-webkit'
]

/**
 * Property regexp.
 */

pseudos = pseudos.join('|');
var propre = new RegExp('^ *([-\\w]+):(?!' + pseudos + ') *([^\n]*)');

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
      || blank()
      || comment()
      || indentation()
      || parent()
      || prop()
      || rule();
  }

  /**
   * Deferred tokens.
   */

  function stashed() {
    return stash.shift();
  }

  /**
   * Blank line.
   */

  function blank() {
    var m = str.match(/^\n *\n/);
    if (!m) return;
    str = str.slice(m[0].length - 1);
    return next();
  }

  /**
   * Comment.
   */

  function comment() {
    var m = str.match(/^\/\/([^\n]*)/);
    if (!m) return;
    str = str.slice(m[0].length);
    return next();
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
   * Parent reference.
   */

  function parent() {
    var m = str.match(/^ *&([^\n]*)/);
    if (!m) return;
    str = str.slice(m[0].length);
    var ret = ['rule', [m[1]]];
    ret.parent = true;
    return ret;
  }

  /**
   * Property.
   */

  function prop() {
    var m = str.match(propre);
    if (!m) return;
    str = str.slice(m[0].length);
    return ['prop', m[1], m[2]];
  }

  /**
   * Rule.
   */

  function rule() {
    var m = str.match(/^([^\n,]+, *\n|[^\n]+)+/);
    if (!m) return;
    str = str.slice(m[0].length);
    m = m[0].split(/\s*,\s*/);
    return ['rule', m];
  }
}
