


import {isNative} from './util'

export default function macroFunctor() {
  let macroTimerFunc = null

  // 确保(宏)任务的延迟执行
  // 从技术上来说， setImmediate 是最合适的选择，但是他只在IE中有效
  // MessageChannel是唯一能够确保在同一个eventLoop中，回调队列在所有的dom事件触发之后执行的 polyfill

  // 以下是原注释 ---
  // Determine (macro) task defer implementation.
  // Technically setImmediate should be the ideal choice, but it's only available
  // in IE. The only polyfill that consistently queues the callback after all DOM
  // events triggered in the same loop is by using MessageChannel.
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = (fn) => {
      setImmediate(fn)
    }
  } else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) {
    // build channel
    const channel = new MessageChannel()
    const port = channel.port2
    macroTimerFunc = (fn) => {
      channel.port1.onmessage = fn
      port.postMessage(1)
    }
  } else {
    macroTimerFunc = (fn) => {
      setTimeout(fn, 0)
    }
  }
  return macroTimerFunc
}