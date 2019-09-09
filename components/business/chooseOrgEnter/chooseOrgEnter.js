const app = getApp()
import{getCompanyOrglistApi} from '../../../api/pages/company.js'

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
    choseItem: wx.getStorageSync('orgData'),
    detail: app.globalData.recruiterDetails
  },
  pageLifetimes: {
    show: function () {
      let choseItem = wx.getStorageSync('orgData')
      getCompanyOrglistApi({company_id: this.data.detail.companyTopId}).then(res => {
        if (!choseItem && res.data.length) {
          choseItem = res.data[0]
          wx.setStorageSync('orgData', choseItem)
        }
        this.setData({choseItem})
      })
    }
  },
  attached () {
    if (app.pageInit) {
      this.setData({detail: app.globalData.recruiterDetails})
    } else {
      app.pageInit = () => {
        this.setData({detail: app.globalData.recruiterDetails})
      }
    }
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
