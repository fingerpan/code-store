

// @flow

import isFunction from './isFunction'

/**
 *
 * @param {Function} fn
 * @param {Object} cx
 * @param {} args
 */
const isFunctionAndCall = (fn:Function, cx:Object, ...args:[any]):any => isFunction(fn) && fn.call(cx, ...args)

export default isFunctionAndCall
