const app = getApp()
import {RECRUITER} from '../../../config.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    choseItem: wx.getStorageSync('orgData')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    routeJump () {
      wx.navigateTo({url: `${RECRUITER}organization/choose/choose`})
    }
  }
})
