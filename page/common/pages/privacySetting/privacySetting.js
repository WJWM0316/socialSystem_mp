import {
  showMobileRecruiterApi,
  hideMobileRecruiterApi,
  showWechatRecruiterApi,
  hideWechatRecruiterApi
} from '../../../../api/pages/recruiter.js'

let app = getApp()
Page({
  data: {
    detail: app.globalData.recruiterDetails
  },
  onShow() {
    this.setData({detail: app.globalData.recruiterDetails})
  },
  toggleShowPhone() {
    let funcApi = this.data.detail.hideMobile ? hideMobileRecruiterApi : showMobileRecruiterApi
    funcApi().then(() => {
      app.globalData.recruiterDetails.hideMobile = this.data.detail.hideMobile ? 0 : 1
      this.setData({detail: app.globalData.recruiterDetails})
    })
  },
  toggleWechat() {
    let funcApi = this.data.detail.hideWechat ? hideWechatRecruiterApi : showWechatRecruiterApi
    funcApi().then(() => {
      app.globalData.recruiterDetails.hideWechat = this.data.detail.hideWechat ? 0 : 1
      this.setData({detail: app.globalData.recruiterDetails})
    })
  }
})