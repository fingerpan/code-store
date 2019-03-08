


/**
 * 格式化千分位，保留两位小数
 * 原生函数 Number.prototype.toLocaleString
 * 
 * @param {string|number} value 待格式
 * @returns {string} 格式后的值
 * @example 
 * // return '100,000.00',
 * toLocaleString(100000)
 * 
 * // return '1.00'
 * toLocaleString(100000)
 */
export function toLocaleString(value) {
    return parseFloat(value).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
}

// export const toLocaleString = i => parseFloat(i).toFixed(2).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")