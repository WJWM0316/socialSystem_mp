import {
  showMobileRecruiterApi,
  hideMobileRecruiterApi,
  showWechatRecruiterApi,
  hideWechatRecruiterApi
} from '../../../../../api/pages/recruiter.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

let app = getApp()
Page({
  data: {
    defaultOrgInfo: {}
  },
  onShow() {
    if(wx.getStorageSync('choseType') !== 'APPLICANT') {
      this.setData({defaultOrgInfo: app.globalData.recruiterDetails.companyInfo.defaultOrgInfo})
    }
  },
  routeJump() {
    const companyTopId = app.globalData.recruiterDetails.companyTopId
    const companyId = this.data.defaultOrgInfo.id
    const url = `${RECRUITER}organization/choose/choose?type=setOrg&companyId=${companyTopId}&orgId=${companyId}`
    wx.navigateTo({url})
  }
})