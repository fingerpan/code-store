


const escapeCharMap = {
    '&': "&amp;",
    '<': "&lt;",
    '>': "&gt;",
    ' ': "&nbsp;",
    "'": "&#39;",
    '"': "&quot;",
}

/**
 * 将字符串中特殊字符替换为转义字符，防御xss攻击
 * @example 
 * // returns "&lt;script&gt;&lt;/script&gt;"
 * escape('<script></script>');
 * 
 * // returns '&nbsp;&nbsp;'
 * escape('  ');
 * 
 * @param {String} char 需要转移的字符串
 * @returns {String} 转义后的字符串
 */
export function escape(char){
    if(char.length === 0) return "";
    return Object.keys(escapeCharMap).reduce((newStr, element) => newStr.replace(new RegExp(element, 'g'), escapeCharMap[element]), String(char));
}