

/**
 *
 * 对函数进行从后到前执行，每一个函数执行返回结果向前传递。
 * {@link './pipe.js'}
 * @example
 * // console.log(4)
 * // console.log(3)
 * // console.log(2)
 * // return 1
 * compose(
 *  (i) => {
 *    console.log(i)
 *    return 1
 *  },
 *  () => {
 *    console.log(i)
 *    return 2
 *  },
 *  () => {
 *    console.log(i)
 *    return 3
 *  }
 * )(4)
 *
 *
 * @param  {...Function} funcs 函数
 * @returns {Function} 执行函数
 *
 */
export function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


