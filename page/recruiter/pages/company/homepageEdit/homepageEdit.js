
import {
  getCompanyInfosApi,
  getRecruitersListApi
} from '../../../../../api/pages/company.js'

import {RECRUITERHOST, COMMON, RECRUITER} from '../../../../../config.js'
import {getPositionListApi} from "../../../../../api/pages/position.js"

const app = getApp()

Page({
  data: {
    tab: 'about',
    query: {},
    companyInfos: {},
    recruitersList: [],
    detail: app.globalData.recruiterDetails,
    companyList: [],
    jobList: []
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    this.setData({query: options})
  },
  onShow() {
    this.getCompanyDetail()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-15
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    const params = e.currentTarget.dataset
    switch(params.route) {
      case 'address-post':
        wx.navigateTo({url: `${RECRUITER}position/addressList/addressList?type=company&selected=0`})
        break
      case 'base':
        if (this.data.query.type === 'org') {
          wx.navigateTo({url: `${RECRUITER}organization/add/add?companyId=${this.data.query.companyId}`})
        } else {
          wx.navigateTo({url: `${RECRUITER}company/baseEdit/baseEdit?type=${this.data.query.type}`})
        }
        break
      case 'product':
        wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct?companyId=${app.globalData.recruiterDetails.companyInfo.id}`})
        break
      case 'product-edit':
        let url = ''
        if(this.data.query.from) {
          url += `${RECRUITER}company/productList/productList?companyId=${this.data.query.companyId}&from=${this.data.query.from}&topId=${app.globalData.recruiterDetails.companyInfo.id}`
        } else {
          url = `${RECRUITER}company/productList/productList?companyId=${app.globalData.recruiterDetails.companyInfo.id}`
        }
        wx.navigateTo({url})
        break
      case 'image':
        wx.navigateTo({url: `${RECRUITER}company/postImages/postImages?companyId=${app.globalData.recruiterDetails.companyInfo.id}`})
        break
      case 'introduction':
        wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit?companyId=${app.globalData.recruiterDetails.companyInfo.id}&type=${this.data.query.type}`})
        break
      case 'editCompanyAddress':
        // console.log(params)
        // wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${app.globalData.recruiterDetails.uid}`})
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail() {
    getCompanyInfosApi({id: this.data.query.companyId}).then(res => {
      const companyInfos = res.data
      if(companyInfos.intro) companyInfos.intro = companyInfos.intro.replace(/\\n/g, '\n')
      this.setData({companyInfos})
    })
  }
})