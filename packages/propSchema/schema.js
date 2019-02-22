/*
 * Modified from https://github.com/vuejs/vue/blob/dev/src/core/util/props.js
 * @Author: youngpan.chen 
 * @Date: 2018-10-22 16:48:12 
 * @Last Modified by: youngpan.chen
 */


const hasOwnProperty = Object.prototype.hasOwnProperty
const _toString = Object.prototype.toString

/**
 * 获取对象自己的属性
 * @param {Object} obj 
 * @param {String} key 
 */
const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

/**
 * 获取数据的数据类型
 * @param {*} v 
 * @returns {String}
 */
const  getRawType = v => _toString.call(v).slice(8, -1)

/**
 * 判断一个对象是否是纯对象
 * @param {Object} obj 
 * @param {Boolean}
 */
const isPlainObject = (obj) => _toString.call(obj) === '[object Object]'



const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/
function getType(fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1] : ''
}

/**
 * 报错函数
 * @param {*} m 
 */
const warn = m => console && console.error(msg)

/**
 * @class Schema
 */
export default class Schema {
    /**
     * @constructor
     * @param {Object} config
     * @param {Object} [data]
     */
    constructor(config, data) {
        // must be an object
        if (!config || typeof config !== 'object') {
            return
        }

        // init Config
        this.initConfig(config)

        // validate data right now if
        if (data && isPlainObject(data)) {
            this.validateData(data)
        }
    }

    /**
     * normalize config and set prototype
     * @param {Object} config
     */
    initConfig(config) {
        this.config = this._normalizeConfig(config)
    }

    /**
     * validate datae
     * @param {Object} data
     * @return {Object} data
     */
    validateData(data) {
        const config = this.config
        if (!config) {
            warn('init config first')
            return data
        }
        if (!isPlainObject(data)) {
            warn('data must be an object')
            return data
        }
        this.data = data
        for (const key in config) {
            const value = this._validateProp(data, key, config[key])
            if (data[key] !== value) {
                data[key] = value
            }
        }
        return data
    }

    /**
     * valiedte prototype by data source
     * @private
     * @param {Object} data validate target
     * @param {key} key validate prototype
     * @param {Object} propConf prototype config
     */
    _validateProp(
        data,
        key,
        propConf
    ) {
        let value = data[key]
        // return check default value
        if (value === undefined) {
            value = this._getPropDefaultValue(propConf)
        }

        this._assertProp(key, value, propConf, !hasOwn(data, key))

        return value
    }

    /**
     * asset prototype
     * @private
     * @param {string} name asset prototype
     * @param {any} value
     * @param {Object} propConf
     * @param {boolean} absent is own proyotype of data
     */
    _assertProp(
        name,
        value,
        propConf,
        absent
    ) {
        // valid required prototype
        if (propConf.required && absent) {
            warn(`[Missing required prototype]: "${name}"`)
            return
        }

        // Stop checking if not required
        if (value == null && !propConf.required) {
            return
        }

        const { type, validator } = propConf
        let expectedTypes = propConf._expectedTypes || []
        let valid = type.length !== 0

        if (type) {
            const validMap = type.map(i => this._assertType(value, i))
            valid = validMap.some(i => i.valid === true)
            expectedTypes = validMap.map(i => i.expectedType)
        }

        if (!valid && type.length > 0) {
            warn(
                `[Invalid data]: type check failed for prototype "${name}".` +
        ` Expected ${expectedTypes.join(', ')}` +
        `, got ${getRawType(value)}.`
            )
            return
        }
        if (validator) {
            if (!validator.call(this.data, value)) {
                warn(`[Invalid prototype]: custom validator check failed for prototype "${name}".`)
            }
        }
    }

    /**
     * Get the default value of a prop.
     * @private
     * @param {Object} propConf prototype Config
     */
    _getPropDefaultValue(propConf) {
        // no default, return undefined
        if (!hasOwn(propConf, 'default')) {
            return undefined
        }
        const def = propConf.default
        if (typeof def === 'object') {
            // TODO: cope object
            return def
        }
        // call factory function for non-Function types
        return typeof def === 'function' && getType(propConf.type) !== 'Function'
            ? def.call(this.data)
            : def
    }

    /**
     * assert type
     * @param {any} value
     * @param {Function} type
     */
    _assertType(value, type) {
        let valid
        const expectedType = getType(type)
        if (simpleCheckRE.test(expectedType)) {
            const t = typeof value
            valid = t === expectedType.toLowerCase()
            // for primitive wrapper objects
            if (!valid && t === 'object') {
                valid = value instanceof type
            }
        } else if (expectedType === 'Object') {
            valid = isPlainObject(value)
        } else if (expectedType === 'Array') {
            valid = Array.isArray(value)
        } else {
            valid = value instanceof type
        }
        return {
            valid,
            expectedType
        }
    }

    /**
     * normalize config
     * @param {Object} config
     * @param {Object} config normalized
     */
    _normalizeConfig(config) {
        if (!config) { return null }
        const res = {}
        let i
        let val
        let name
        if (Array.isArray(config)) {
            i = config.length
            /* eslint-disable no-plusplus */
            while (i--) {
                name = config[i]
                if (typeof name === 'string') {
                    res[name] = { type: null }
                }
            }
        } else if (isPlainObject(config)) {
            for (const key in config) {
                // propConf must be an object
                val = config[key]
                let propConf = null
                let type = null
                if (isPlainObject(val)) {
                    propConf = val
                    type = val.type
                } else {
                    type = val
                    propConf = {
                        type: val
                    }
                }
                // type prototype must be an array
                if (!Array.isArray(type)) {
                    propConf.type = type ? [type] : []
                }
                res[key] = propConf
            }
        }
        return res
    }
}
