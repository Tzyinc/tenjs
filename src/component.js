import {reconcile} from './reconciler';
/**
*/
export class Component {
  /**
   *  @param {object} props
   */
   constructor(props) {
     this.props = props;
     this.state = this.state || {};
   }

   /**
   * @param {object} partialState
   */
   setState(partialState) {
     this.state = Object.assign({}, this.state, partialState);
     updateInstance(this._internalInstance);
   }
}

/**
 * @param {object} internalInstance
 */
function updateInstance(internalInstance) {
  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;
  reconcile(parentDom, internalInstance, element);
}

/**
 * @param {object} element
 * @param {object} internalInstance
 * @return {object}
 */
export function createPublicInstance(element, internalInstance) {
  const {type, props} = element;
  const publicInstance = new type(props);
  publicInstance._internalInstance = internalInstance;
  return publicInstance;
}
