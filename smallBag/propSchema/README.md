## prop schema

### Wath
`propSchema` 是从vue的[prop.js](https://github.com/vuejs/vue/blob/dev/src/core/util/props.js)校验逻辑中抽离，重新组合成一个校验类，用来做简单的参数校验。


### Usage

>example 1:
``` js
  let config = {
    type: String
  }
  let validor = new Schema(config)

  // normal
  validor.validateData({
    type: 'expamle'
  })

  // error
  // output Error '[Invalid data]: type check failed for prototype "type", Expected String, got Number'
  validor.validateData({
    type: 1234
  })
```

``` js
  let config = {
    type: String
  }
  // error
  // output Error '[Invalid data]: type check failed for prototype "type", Expected String, got Number'
  new Schema(config, {
     type: 1234
  })

  // normal
  new Schema(config, {
     type: 'expamle'
  })
```

### Config

>example config
``` js
let config = {

  // type 
  // --------------------
  
  // only valid type
  example1: String,
  // support array
  example2: [Number, String],

  // defaule
  // --------------------
  example3: {
    type: Boolean,
    default: false
  }
  example3: {
    name: String,
    default() {
      return this.example3 ? 'example3是真值' : 'example3是假值'
    }
  }

  // required
  // --------------------
  example4: {
    name: String,
    required: true
  }

  // validator
  // --------------------
  example5: {
    name: String,
    // name 只能是 'youngpan' 或者 'code'
    validator(value) {
      return ['youngpan', 'code'].includes(value)
    }
  }
}
```
