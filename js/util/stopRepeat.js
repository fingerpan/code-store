const preventRepeat = new Map()

/**
 * 防重factory
 * @example
 * const {isRepeat, releaseRepeat} = stopRepeat('test')
 * if(isRepeat) {
 *   return
 * }
 *
 * // all releaseRepeat function when async call
 * releaseRepeat()
 *
 * @param {string} repeatSign 标志
 * @return {Object} repeatObject 工厂对象
 * @return {Boolean} repeatObject.isRepeat 是否已经重复
 * @return {Function} repeatObject.releaseRepeat 释放锁定
 */
export default function stopRepeat(repeatSign) {
    if (!repeatSign) {
        return new Error('stop repeat must have a repeat sign')
    }

    if (preventRepeat[repeatSign]) {
        return preventRepeat[repeatSign]
    }

    function releaseRepeat() {
        preventRepeat.delete(repeatSign)
    }

    preventRepeat.set(repeatSign, {
        isRepeat: true,
        releaseRepeat
    })

    return {
        isRepeat: false,
        releaseRepeat
    }
}
