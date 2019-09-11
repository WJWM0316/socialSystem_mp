const app = getApp()
import{getCompanyOrglistApi} from '../../../api/pages/company.js'

import {RECRUITER} from '../../../config.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      value: {},
      observer (newVal, oldVal) {
        if (!newVal) return
        if (newVal.isCompanyTopAdmin) {
          let choseItem = wx.getStorageSync('orgData')
          if(choseItem) {
            app.setOrgInit = function () {}
            return
          }
          getCompanyOrglistApi({company_id: this.data.detail.companyTopId}).then(res => {
            if (res.data.length) {
              choseItem = res.data[0]
              wx.setStorageSync('orgData', choseItem)
              if (app.setOrgInit) {
                app.setOrgInit()
              } else {
                app.setOrgInit = function () {}
              }
            }
            this.setData({choseItem})
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    choseItem: wx.getStorageSync('orgData')
  },
  pageLifetimes: {
    show: function () {
      let choseItem = wx.getStorageSync('orgData')
      this.setData({choseItem})
    }
  },
  attached () {
    
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
