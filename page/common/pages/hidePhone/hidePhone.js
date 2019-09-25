import {
  showMobileRecruiterApi,
  hideMobileRecruiterApi
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
  }
})