import {
  getSocialDataCompanyApi,
  getSocialDataTypeApi
} from '../../../../api/pages/common'

let app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    echartData: {
      key: ['22', '23', '24', '25', '26', '27', '28'],
      value: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ]
    }
  },
  onShow() {
    let detail = app.globalData.recruiterDetails
    this.setData({detail}, () => this.getSocialDataCompany())
    setTimeout(() => this.selectComponent('#dataEchart').init(), 1000)
  },
  getSocialDataCompany() {
    let orgData = wx.getStorageSync('orgData')
    let params = {
      startDate: 1,
      endDate: 1
    }
    // 超管要加机构id
    if(this.data.detail.isCompanyTopAdmin) {
      params.companyId = orgData.id
    } else {
      params.companyId = app.globalData.recruiterDetails.companyInfo.id
    }
    return getSocialDataCompanyApi(params).then(res => {
      console.log(res)
    })
  },
  getSocialDataType() {
    return getSocialDataTypeApi().then(res => {
      console.log(res)
    })
  }
})