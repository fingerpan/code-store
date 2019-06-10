
/**
 * 
 * 微任务
 * 微任务队列在EventLoop中会在一个（宏）任务 完成之后会执行清空。
 * 可以在频繁操作dom时将操作动作放在微任务中。
 * 操作dom会触发浏览器的重排重绘（render），这个是一个（宏）任务。
 * 所以在多个操作dom是可以在当前（宏）任务执行后，在触发render（宏）任务之前，触发一系列对DOM的操作动作。
 * 减少render次数。
 * 
 */

import {isNative, isIOS} from './util'
const noop = () => {}
/**
 * 是否支持promise
 */
export const isSupportPromise = () => typeof Promise !== 'undefined' && isNative(window.Promise)


// 是否支持RequestAnimationFrame
export const isSupportRequestAnimationFrame  = () => {
  var prefixes = 'webkit,moz,ms,o'.split(',');
  for(let i = 0; i < prefixes.length; i++ ) {
    if (requestAnimationFrame) {
      return true
    }
    let prefix = prefixes[i];
    window.requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
  }
  return false
}

export default  function microFunctor() {
  let microTimerFunc = null
  // promise 属于微任务
  if (isSupportPromise()) {
    microTimerFunc = (fn) => {
      Promise.resolve().then(fn)
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop)
    }
  } else if (isSupportRequestAnimationFrame()){
    // 如果不绑定window，会导致报错 TypeError: Illegal invocation
    microTimerFunc = requestAnimationFrame.bind(this)
  } else {
    microTimerFunc = fn => fn()
  }
  return microTimerFunc
}
 