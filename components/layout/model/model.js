Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '提示'
    }
  },
  methods: {
    stopPageScroll() {
      return false
    },
    cancel() {
      this.triggerEvent('cancel')
      this.setData({show: false})
    },
    confirm() {
      this.triggerEvent('confirm')
      this.setData({show: false})
    }
  }
})
