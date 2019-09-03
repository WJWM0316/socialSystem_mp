const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPop: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 组件的方法列表
   */
  attached() {
  },
  methods: {
    close() {
      this.setData({showPop: false})
    },
    back() {
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.reLaunch({
          url: '/page/common/pages/homepage/homepage'
        })
      }
    }
  }
})
