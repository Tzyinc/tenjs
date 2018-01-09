import {TEXT_ELEMENT} from './element';
import {createPublicInstance} from './component';

let rootInstance = null;
/**
@param {object} element
@param {object} container
*/
export function render(element, container) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

/**
* @param {object} parentDom
* @param {object} instance
* @param {object} element
* @return {object}
*/
export function reconcile(parentDom, instance, element) {
  if (instance == null) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) {
    parantDom.removeChild(instance.dom);
    return null;
  } else if (instance.element.type === element.type) {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else if (typeof element.type === 'string') {
    // update dom instance
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.childInstances = reconcileChildren(instance, element);
    return instance;
  } else {
    // update composite instance
    instance.publicInstance.props = element.props;
    const childElement = instance.publicInstance.render();
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    instane.element = element;
    return instance;
  }
}

/**
* @param {object} instance
* @param {object} element
* @return {object}
*/
function reconcileChildren(instance, element) {
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = elements.props.children || [];
  const newChildInstances = [];
  const count = Math.max(childInstances.length, nextChildElements.length);
  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter((instance) => instance != null);
}

/**
 * @param {object} element
 * @return {object}
 */
function instantiate(element) {
  const {type, props} = element;

  const isTextElement = type === 'TEXT ELEMENT';
  // create dom
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(type);

  updateDomProperties(dom, [], props);

  // instantiate and append children
  const childElements = props.children || [];
  const childInstances = childElements.map(instantiate);
  const childDoms = childInstances.map((childInstance) => childInstance.dom);
  childDoms.forEach((childDom) => dom.appendChild(childDom));

  const instance = {dom, element, childInstances};
  return instance;
}

/**
 * dom utilities
 * @param {object} dom
 * @param {object} prevProps
 * @param {object} nextProps
 */
function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = (name) => name.startsWith('on');
  const isAttribute = (name) => !isEvent(name) && name != 'children';

    // Remove event listeners
    Object.keys(prevProps).filter(isEvent).forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove attributes
    Object.keys(prevProps).filter(isAttribute).forEach((name) => {
      dom[name] = null;
    });

    // Set attributes
    Object.keys(nextProps).filter(isAttribute).forEach((name) => {
      dom[name] = nextProps[name];
    });

    // Add event listeners
    Object.keys(nextProps).filter(isEvent).forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}