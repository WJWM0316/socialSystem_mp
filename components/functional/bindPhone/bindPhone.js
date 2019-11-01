// components/functional/bindPhone/bindPhone.js
import {COMMON} from '../../../config.js'
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hide: {
      type: Boolean,
      value: true
    },
    hasClose: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached: function () {
    wx.checkSession({
      success () {
        console.log('还在有效期内')
      },
      fail () {
        app.login()
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        hide: true
      })
    },
    getPhoneNumber(e) {
      let url = ''
      let curPath = app.getCurrentPagePath()
      if (curPath.indexOf('/page/common/pages/homepage/homepage') !== -1) {
        app.quickLogin(e, 'cIndex')
      } else {
        app.quickLogin(e, 'curPath')
      }
    },
    phoneLogin() {
      this.close()
      let url = ''
      let curPath = app.getCurrentPagePath()
      if (curPath.indexOf('/page/common/pages/homepage/homepage') !== -1) {
        url = `${COMMON}bindPhone/bindPhone?backType=cIndex`
      } else {
        url = `${COMMON}bindPhone/bindPhone`
      }
      wx.navigateTo({
        url: url
      })
    },
    formSubmit(e) {
      getApp().postFormId(e.detail.formId)
    }
  }
})
