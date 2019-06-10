
/**
 * 声明：
 * 思路来自于Vue.nextTick[https://github.com/vuejs/vue/blob/dev/src/core/util/next-tick.js]
 */

import macroFunctor from "./macroFunctor";
import microFunctor, { isSupportPromise, isSupportRequestAnimationFrame } from "./microFunctor";


// 是否支持微任务
// 浏览器中，属于微任务中的有：promise,MutationObserver,requestAnimationFrame
// 1. promise兼容性比MutationObserver更好，所以优先选择promise
// 2. requestAnimationFrame比promise会有一帧延迟，不支持promise可以尝试采用requestAnimationFrame
const isSupportMicro =  isSupportPromise() || isSupportRequestAnimationFrame()


/**
 * @class NextTick
 */
export default class NextTick {
  /**
   * macroQueue
   * @static
   * @param {Function}
   */
  static pushToMacroQueue = macroFunctor();

  /**
   * microQueue
   * fallback to macro
   * @static
   * @param {Function}
   */
  static pushToMicroQueue = isSupportMicro
    ? microFunctor() 
    : NextTick.pushToMacroQueue;

  /**
   * 是否支持微任务
   * @static
   * @type {Boolean}
   */
  static isSupportMicro = isSupportMicro

  /**
   * @constructor
   */
  constructor() {
    this.callbacks = []
    this.pending = false
  }
  /**
   * 将函数插入到微队列中
   * @public
   * @param {Function} cb 回调函数
   * @param {Object} ctx context 回调函数上下文
   * @param {...any} 回调函数参数
   * @returns {Promise|undefined} 如果callback不存在就返回promise
   */
  push(cb, ctx, ...agrs) {
    let _resolve
    let isRemove = false

    function microCallback() {
      if(isRemove || microCallback.__isRemove) return;
      // cb is Function
      if (cb) {
        try {
          // cb must be function
          cb.apply(ctx, agrs)
          // release
          cb.__nextTick = null
        } catch (e) {
          throw e
        }
      } else if (_resolve) {
        // resolve promise
        _resolve(ctx)
      }
    }
    // 加入到执行队列中
    this.callbacks.push(microCallback)

    // 刷新队列，执行队列
    if (!this.pending) {
      this.pending = true
      NextTick.pushToMicroQueue(this._flushCallbacks.bind(this))
    }

    if(cb) {
      // 将执行函数存储，为了做阻止移除
      cb.__nextTick = microCallback
    } else if (isSupportPromise()) {
      // retrun promise
      return new Promise(resolve => _resolve = resolve)
    }

    // remove
    return () => isRemove = true
  }
  /**
   * 阻止异步回调
   * @param {Function} cb 
   * @returns {Boolean} 是否已经移除
   */
  cancel(cb) {
    if(cb && cb.__nextTick) {
      cb.__nextTick.__isRemove = true
      return true
    }
    return false
  }

  /**
   * @private
   * 开始执行任务队列
   */
  _flushCallbacks () {
    this.pending = false
    const copies = this.callbacks.slice(0)
    this.callbacks.length = 0 // 清空
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
}
