Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '提示'
    },
    btnCancel: {
      type: String,
      value: '取消'
    },
    btnConfirm: {
      type: String,
      value: '确定'
    },
    showCancel: {
      type: Boolean,
      value: true
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
