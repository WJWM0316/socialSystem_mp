// components/business/choose/choose.js
import {RECRUITER, COMMON, APPLICANT} from '../../../config.js'
let identity = 'APPLICANT'
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
    isChose: false,
    cdnImagePath: getApp().globalData.cdnImagePath
  },
  attached: function () {
    let check = () => {
      wx.checkSession({
        success () {
          console.log('sessionToken: ', wx.getStorageSync('sessionToken'),  '未过期')
        },
        fail () {
          app.login()
        }
      })
    }
    if (app.loginInit) {
      check()
    } else {
      app.loginInit = () => {
        check()
      }
    }
    
    let choseType = wx.getStorageSync('choseType') || null
    if (choseType) {
      this.setData({
        isChose: true
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },
    jump(e) {
      if (e.currentTarget.dataset.identity === 'APPLICANT') {
        identity = 'APPLICANT'
      } else {
        identity = 'RECRUITER'
      }
      wx.setStorageSync('choseType', identity)
    },
    onGotUserInfo(e) {
      getApp().onGotUserInfo(e, true).then(res => {
        if (identity === 'RECRUITER') {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        } else {
          wx.reLaunch({
            url: `${COMMON}homepage/homepage`
          })
          this.setData({
            isChose: true
          })
        }
      })
    }
  }
})
