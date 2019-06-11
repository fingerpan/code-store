

// css
import './index.css'

class Loading {
  template = `
  <div class="loadingComp">
    <div class="loadingComp__circle"><i></i></div>
  </div>
  `

  constructor() {
      this.render()
  }
  render() {
      this.$el = $(this.template)
  }
  show() {
      if (!this._append) {
          this.append()
      }
      this.$el.show()
      return this.hide.bind(this)
  }
  hide() {
      this.$el.hide()
  }
  append() {
      this.$el.hide()
      this.$el.appendTo($(document.body))
      this._append = true
  }
}

export default new Loading()
