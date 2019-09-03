import {APPLICANT,RECRUITER,COMMON} from "../../../config.js"

let app = getApp()
Component({
  properties: {
    msg: {
      type: String
    },
    title: {
      type: String
    },
    showHomeBtn: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    noReturn: false
  },
  attached () {
    if (getCurrentPages().length > 1) {
      this.setData({noReturn: true})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    backEvent() {
      wx.navigateBack({delta: 1})
    },
    jump() {
      let identity = wx.getStorageSync('choseType')
      let pages = getCurrentPages()
      let url = identity === 'RECRUITER' ? `${RECRUITER}index/index` : `${COMMON}homepage/homepage`
      if(pages.length > 1) {
        wx.navigateBack({delta: 1})
      } else {
        wx.reLaunch({url})
      }
    }
  }
})
