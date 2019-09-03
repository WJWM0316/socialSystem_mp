const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: app.globalData.userInfo
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    isIphoneX: app.globalData.isIphoneX,
    showPop: false,
    authPop: false,
  },

  attached () {
  },
  methods: {
    close (e) {
      if (e.currentTarget.dataset.type !== 'authPop') {
        let userInfo = this.data.userInfo
        userInfo.officialId = true
        app.globalData.userInfo = userInfo
        this.setData({userInfo, showPop: false})
      } else {
        this.setData({authPop: false})
      }
    },
    show () {
      app.wxReportAnalytics('btn_report', {
        btn_type: 'follow_Wechat'
      })
      if (app.globalData.userInfo && app.globalData.userInfo.nickname) {
        this.setData({showPop: true})
      } else {
        this.setData({authPop: true})
      }
    },
    onGotUserInfo (e) {
      let that = this
      app.onGotUserInfo(e, 'closePop').then(res => {
        that.setData({authPop: false})
        app.wxToast({
          title: '关联成功',
          icon: 'success',
          callback () {
            that.setData({showPop: true})
          }
        })
      })
    }
  }
})
