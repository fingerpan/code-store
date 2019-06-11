/**
 * 将query对象序列化为字符串
 * @example
 * // return 'a=1&b=2'
 * normalizeQuery({a:1,b:2})
 * @param {Object} query
 * @returns {String} 序列化结果
 */
export function normalizeQuery(query) {
    return Object.keys(query).reduce((queryList, key) => {
        queryList.push(`${key}=${query[key]}`)
        return queryList
    }, []).join('&')
}
