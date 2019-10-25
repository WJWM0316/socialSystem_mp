// components/business/auth/auth.js
import {loginApi} from '../../../api/pages/auth.js'
const app = getApp()
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
    cdnImagePath: app.globalData.cdnImagePath,
    confirmPop: false
  },

  /**
   * 组件的方法列表
   */
  
  attached: function () {
    wx.login({
      success: function (res0) {
        wx.setStorageSync('code', res0.code)
      }
    })
  }, 
  methods: {
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
    onGotUserInfo(e) {
      getApp().onGotUserInfo(e, 'closePop').then(res => {
        this.triggerEvent('authSuccess', true)
      }).catch(err => {
        console.log(err)
        this.setData({confirmPop: true})
      })
    }
  }
})
