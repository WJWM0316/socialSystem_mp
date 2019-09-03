const app = getApp()

Component({
  data: {
    showBindMobile: false,
    telePhone: app.globalData.telePhone
  },
  methods: {
    changeMobile() {
      wx.makePhoneCall({
        phoneNumber: app.globalData.telePhone
      })
    },
    hunterJob() {
      app.wxConfirm({
        title: '身份切换',
        content: `是否继续前往求职端？`,
        confirmBack() {
          app.toggleIdentity()
        }
      })
    }
  }
})
