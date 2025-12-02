/**
 * XPath Autocomplete Module - Static Data
 * Contains XPath axes and functions definitions
 */

import type { Suggestion } from './types'

/** XPath axes with descriptions */
export const XPATH_AXES: Suggestion[] = [
  {
    value: 'ancestor::',
    label: 'ancestor::',
    type: 'axis',
    description: 'Selects all ancestors (parent, grandparent, etc.)',
    priority: 80,
  },
  {
    value: 'ancestor-or-self::',
    label: 'ancestor-or-self::',
    type: 'axis',
    description: 'Selects all ancestors and the current node',
    priority: 70,
  },
  {
    value: 'attribute::',
    label: 'attribute::',
    type: 'axis',
    description: 'Selects all attributes (shorthand: @)',
    priority: 75,
  },
  {
    value: 'child::',
    label: 'child::',
    type: 'axis',
    description: 'Selects all children (default axis)',
    priority: 90,
  },
  {
    value: 'descendant::',
    label: 'descendant::',
    type: 'axis',
    description: 'Selects all descendants (children, grandchildren, etc.)',
    priority: 85,
  },
  {
    value: 'descendant-or-self::',
    label: 'descendant-or-self::',
    type: 'axis',
    description: 'Selects all descendants and the current node',
    priority: 75,
  },
  {
    value: 'following::',
    label: 'following::',
    type: 'axis',
    description: 'Selects everything after the closing tag',
    priority: 60,
  },
  {
    value: 'following-sibling::',
    label: 'following-sibling::',
    type: 'axis',
    description: 'Selects all siblings after the current node',
    priority: 80,
  },
  {
    value: 'namespace::',
    label: 'namespace::',
    type: 'axis',
    description: 'Selects all namespace nodes',
    priority: 30,
  },
  {
    value: 'parent::',
    label: 'parent::',
    type: 'axis',
    description: 'Selects the parent node (shorthand: ..)',
    priority: 85,
  },
  {
    value: 'preceding::',
    label: 'preceding::',
    type: 'axis',
    description: 'Selects everything before the opening tag',
    priority: 60,
  },
  {
    value: 'preceding-sibling::',
    label: 'preceding-sibling::',
    type: 'axis',
    description: 'Selects all siblings before the current node',
    priority: 80,
  },
  {
    value: 'self::',
    label: 'self::',
    type: 'axis',
    description: 'Selects the current node',
    priority: 70,
  },
]

/** XPath functions with descriptions */
export const XPATH_FUNCTIONS: Suggestion[] = [
  // String functions
  {
    value: 'contains(',
    label: 'contains(string, substr)',
    type: 'function',
    description: 'Returns true if the string contains the substring',
    priority: 95,
  },
  {
    value: 'starts-with(',
    label: 'starts-with(string, prefix)',
    type: 'function',
    description: 'Returns true if the string starts with the prefix',
    priority: 90,
  },
  {
    value: 'ends-with(',
    label: 'ends-with(string, suffix)',
    type: 'function',
    description: 'Returns true if the string ends with the suffix',
    priority: 85,
  },
  {
    value: 'text()',
    label: 'text()',
    type: 'function',
    description: 'Selects all text node children',
    priority: 95,
  },
  {
    value: 'normalize-space(',
    label: 'normalize-space(string?)',
    type: 'function',
    description: 'Strips leading/trailing whitespace and collapses internal spaces',
    priority: 75,
  },
  {
    value: 'string(',
    label: 'string(object?)',
    type: 'function',
    description: 'Converts an object to a string',
    priority: 60,
  },
  {
    value: 'string-length(',
    label: 'string-length(string?)',
    type: 'function',
    description: 'Returns the length of the string',
    priority: 65,
  },
  {
    value: 'substring(',
    label: 'substring(string, start, length?)',
    type: 'function',
    description: 'Returns a substring starting at position',
    priority: 70,
  },
  {
    value: 'substring-before(',
    label: 'substring-before(string, substr)',
    type: 'function',
    description: 'Returns the part before the substring',
    priority: 55,
  },
  {
    value: 'substring-after(',
    label: 'substring-after(string, substr)',
    type: 'function',
    description: 'Returns the part after the substring',
    priority: 55,
  },
  {
    value: 'concat(',
    label: 'concat(string, string, ...)',
    type: 'function',
    description: 'Concatenates strings together',
    priority: 65,
  },
  {
    value: 'translate(',
    label: 'translate(string, from, to)',
    type: 'function',
    description: 'Replaces characters in a string',
    priority: 50,
  },
  
  // Boolean functions
  {
    value: 'not(',
    label: 'not(boolean)',
    type: 'function',
    description: 'Returns the negation of the argument',
    priority: 90,
  },
  {
    value: 'true()',
    label: 'true()',
    type: 'function',
    description: 'Returns true',
    priority: 50,
  },
  {
    value: 'false()',
    label: 'false()',
    type: 'function',
    description: 'Returns false',
    priority: 50,
  },
  {
    value: 'boolean(',
    label: 'boolean(object)',
    type: 'function',
    description: 'Converts an object to boolean',
    priority: 45,
  },
  
  // Number functions
  {
    value: 'position()',
    label: 'position()',
    type: 'function',
    description: 'Returns the position of the current node in the node set',
    priority: 90,
  },
  {
    value: 'last()',
    label: 'last()',
    type: 'function',
    description: 'Returns the number of nodes in the current node set',
    priority: 90,
  },
  {
    value: 'count(',
    label: 'count(node-set)',
    type: 'function',
    description: 'Returns the number of nodes in the node set',
    priority: 85,
  },
  {
    value: 'sum(',
    label: 'sum(node-set)',
    type: 'function',
    description: 'Returns the sum of numeric values',
    priority: 55,
  },
  {
    value: 'floor(',
    label: 'floor(number)',
    type: 'function',
    description: 'Returns the largest integer not greater than the number',
    priority: 40,
  },
  {
    value: 'ceiling(',
    label: 'ceiling(number)',
    type: 'function',
    description: 'Returns the smallest integer not less than the number',
    priority: 40,
  },
  {
    value: 'round(',
    label: 'round(number)',
    type: 'function',
    description: 'Rounds to the nearest integer',
    priority: 45,
  },
  {
    value: 'number(',
    label: 'number(object?)',
    type: 'function',
    description: 'Converts an object to a number',
    priority: 50,
  },
  
  // Node functions
  {
    value: 'name(',
    label: 'name(node-set?)',
    type: 'function',
    description: 'Returns the name of the node',
    priority: 65,
  },
  {
    value: 'local-name(',
    label: 'local-name(node-set?)',
    type: 'function',
    description: 'Returns the local name without namespace prefix',
    priority: 60,
  },
  {
    value: 'namespace-uri(',
    label: 'namespace-uri(node-set?)',
    type: 'function',
    description: 'Returns the namespace URI',
    priority: 35,
  },
  
  // Node set functions
  {
    value: 'id(',
    label: 'id(value)',
    type: 'function',
    description: 'Selects elements by their ID',
    priority: 70,
  },
]

/** Common HTML tag names for fallback when DOM info unavailable */
export const COMMON_TAGS: string[] = [
  'a', 'abbr', 'article', 'aside', 'audio',
  'b', 'blockquote', 'body', 'br', 'button',
  'canvas', 'caption', 'code', 'col', 'colgroup',
  'data', 'datalist', 'dd', 'del', 'details', 'dialog', 'div', 'dl', 'dt',
  'em', 'embed',
  'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
  'i', 'iframe', 'img', 'input', 'ins',
  'kbd',
  'label', 'legend', 'li', 'link',
  'main', 'map', 'mark', 'menu', 'meta', 'meter',
  'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'param', 'picture', 'pre', 'progress',
  'q',
  'rp', 'rt', 'ruby',
  's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
  'u', 'ul',
  'var', 'video',
  'wbr',
]

/** Common HTML attribute names for fallback */
export const COMMON_ATTRIBUTES: string[] = [
  'id', 'class', 'name', 'type', 'value', 'href', 'src', 'alt', 'title',
  'style', 'data-*', 'aria-*', 'role', 'tabindex', 'disabled', 'readonly',
  'placeholder', 'required', 'checked', 'selected', 'hidden', 'target',
  'rel', 'action', 'method', 'for', 'max', 'min', 'step', 'pattern',
  'autocomplete', 'autofocus', 'multiple', 'size', 'maxlength', 'minlength',
  'width', 'height', 'loading', 'crossorigin', 'integrity', 'async', 'defer',
]

