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
