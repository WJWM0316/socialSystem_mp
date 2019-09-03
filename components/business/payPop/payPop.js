const app = getApp()
Component({

  
  /**
   * 组件的属性列表
   */
  properties: {
    openPayPop: {
      type: Boolean,
      value: false
    },
    chargeData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    telePhone: app.globalData.telePhone
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({openPayPop: !this.data.openPayPop})
      this.triggerEvent('close')
    },
    submit () {
      this.triggerEvent('submit')
    },
    callPhone () {
      wx.makePhoneCall({
        phoneNumber: this.data.telePhone
      })
    }
  }
})
