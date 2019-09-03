import {getCompanyInfosApi, getRecruitersListApi} from "../../../../../api/pages/company.js"
import {COMMON,RECRUITER} from "../../../../../config.js"

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    cdnImagePath: app.globalData.cdnImagePath
  },
  onShow(options) {
    this.init()
  },
  init() {
    let id = app.globalData.recruiterDetails.companyInfo.id
    let info = this.data.info
    getCompanyInfosApi({id}).then(res => {
      app.globalData.companyInfo = res.data
      getRecruitersListApi({id}).then(res0 => {
        app.globalData.companyInfo.recruiterList = res0.data
        this.setData({info: res.data})
      })
    })
  },
  jumpPage(e) {
    switch(e.currentTarget.dataset.type) {
      case 'main':
        wx.navigateTo({
          url: `${COMMON}homepage/homepage?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
        })
        // if (app.globalData.recruiterDetails.isCompanyAdmin) {
        //   wx.navigateTo({
        //     url: `${RECRUITER}company/homepageEdit/homepageEdit?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: `${COMMON}homepage/homepage?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
        //   })
        // }
      break
      case 'peoples':
        wx.navigateTo({
          url: `${RECRUITER}company/recruiterList/recruiterList?companyId=${app.globalData.companyInfo.id}`
        })
      break
      case 'bright':
        wx.navigateTo({
          url: `${RECRUITER}company/teamLabel/teamLabel`
        })
      break
    }
  }
})