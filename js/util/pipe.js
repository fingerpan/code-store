

/**
 *
 * 对函数进行从前到后执行，每一个函数执行返回结果向后传递。
 * {@link './compose.js'}
 * @example
 * // console.log(4)
 * // console.log(1)
 * // console.log(2)
 * // return 3
 * pipe(
 *  (i) => {
 *    console.log(i)
 *    return 1
 *  },
 *  (i) => {
 *    console.log(i)
 *    return 2
 *  },
 *  (i) => {
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
export function pipe(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => b(a(...args)))
}

