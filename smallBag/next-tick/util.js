

const UA = window.navigator.userAgent.toLowerCase()

/**
 * 是否是在ios中
 */
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)


/**
 * 是否是原生函数
 * @param {Function} Ctor 
 */
export const isNative = (Ctor) => typeof Ctor === 'function' && /native code/.test(Ctor.toString())

