
/**
 *
 * @param {Object} source 对象
 * @param {String} path 路径
 */
export function get(source, path, defaultObj) {
    // TODO: normaliz path
    // TODO: source must be a Object
    const pathArr = path.split('.')
    for (let i = 0; i < pathArr.length; i++) {
        const keyName = pathArr[i]
        source = source[keyName]
        if (!source) {
            return defaultObj
        }
    }
    return source
}

// console.log(get({ a: { b: { c: { d: 1 } } } }, 'a.d.c'))
