import {COMMON,RECRUITER} from "../../../config.js"
let app = getApp()
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    roleType: {
      type: String
    },
    cardData: {
      type: Object
    },
    isMain: {
      type: Boolean,
      value: false
    },
    glass: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isCompanyAdmin: false,
    cdnImagePath: app.globalData.cdnImagePath
  },
  attached() {
    let isCompanyAdmin = app.globalData.recruiterDetails.isCompanyAdmin || 0
    this.setData({isCompanyAdmin})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.cardData.mobile
      })
    },
    setClipboardData() {
      wx.setClipboardData({
        data: this.data.cardData.wechat,
        success(res) {
          getApp().wxToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },
    jumpEditBase() {
      wx.redirectTo({
        url: `${RECRUITER}company/homepageEdit/homepageEdit?companyId=${this.data.cardData.id}`
      })
      // wx.navigateTo({
      //   url: `${RECRUITER}company/baseEdit/baseEdit`
      // })
    },
    jumpCompany() {
      if (this.data.isMain) { return }
      wx.navigateTo({
        url: `${COMMON}homepage/homepage?companyId=${this.data.cardData.id}`
      })
    },
    jumpApplicant() {
      wx.navigateTo({
        url: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.cardData.uid}`
      })
    },
    jumpRecruiter() {
      if (!this.data.isMain) {
        wx.navigateTo({
          url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.cardData.uid}`
        })
      }
    },
    jumpEdit() {
      wx.navigateTo({
        url: `${RECRUITER}user/userInfoEdit/userInfoEdit`
      })
    }
  }
})
