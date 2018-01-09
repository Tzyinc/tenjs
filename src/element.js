export const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
* @param {object} type
* @param {object} config
* @return {object}
*/
export default function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  // if props has children, concat arguments to an empty array
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter((child) => child != null && child !== false)
    // if its an object just put it back, else replace it with text element
    .map((child) => child instanceof Object? child : createTextElement(child));
  return {type, props};
}

/**
 * @param {text} value
 * @return {function}
 */
function createTextElement(value) {
  return createElement(TEXT_ELEMENT, {nodeValue: value});
}
