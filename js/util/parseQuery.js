




/**
 * 解析出path的query对象
 * 
 * @param {String} path 解析的路径
 * @returns {Object} query对象
 * @example
 * // return {a: 1, b: 2};
 * parseQuery('https://to8to.com?a=1&b=2')
 * parseQuery('?a=1&b=2')
 * parseQuery('a=1&b=2')
 * 
 */
export function parseQuery (path) {
  path = String(path).replace(/.*\?/, '')
  let query = {}
  const SEARCH_REG = /([^=&\s]+)[=\s]*([^=&\s]*)/g
  while (SEARCH_REG.exec(path)) {
    query[RegExp.$1] = RegExp.$2
  }
  return query
}
