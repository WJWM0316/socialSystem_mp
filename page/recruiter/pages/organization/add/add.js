import {
	addCompanyApi,
  putEditCompanyApi
} from '../../../../../api/pages/company.js'
import {RECRUITER} from '../../../../../config.js'
let app = getApp()

Page({
  data: {
    company_name : '',
    phoneNum: '',
    addressData: {},
    upload: {
    	smallUrl: '',
      id: ''
    },
    options: {},
    cdnPath: app.globalData.cdnImagePath,
  },
  onLoad(options) {
    this.setData({options})
    let orgList = wx.getStorageSync('orgList').data,
        companyData = {}
    if (options.companyId) {
      if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
        let orgData = orgList.find(item => item.id == options.companyId)
        companyData = orgData
      } else {
        companyData = app.globalData.recruiterDetails.companyInfo
      }
      let company_name = companyData.companyName,
          phoneNum     = companyData.mobile,
          addressData  = companyData.address[0],
          upload       = companyData.logo
      this.setData({company_name, phoneNum, addressData, upload})
    }
  },
  onShow () {
    let addAddress = wx.getStorageSync('addAddress')
    if (addAddress) {
      this.setData({addressData: addAddress}, () => {
        wx.removeStorageSync('addAddress')
      })
    }
  },
  bindInput(e) {
  	const key = e.currentTarget.dataset.key
  	const value = e.detail.value
  	this.debounce(this.bindChange, null, 100, { [key]: value} )
  },
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  bindChange(item) {
  	const params = Object.entries(item)[0]
  	this.setData({[params[0]]: params[1]})
  },
  upload(e) {
  	this.setData({upload: e.detail[0]})
  },
  addAddress () {
    wx.navigateTo({url: `${RECRUITER}position/address/address?type=addOrganization`})
  },
  post() {
    let data = this.data,
        params = {
          top_id: app.globalData.recruiterDetails.companyTopId,
          company_name: data.company_name,
          logo: data.upload.id,
          mobile: data.phoneNum,
          address: [data.addressData]
        }
    let funApi = null,
        title  = ''
    if (this.data.options.companyId) {
      funApi = putEditCompanyApi
      title  = '编辑成功'
      params.id = this.data.options.companyId
    } else {
      funApi = addCompanyApi
      title  = '创建成功'
    }
    funApi(params).then(res => {
      app.getAllInfo().then(res => {
        app.wxToast({
          title: title,
          icon: 'success',
          callback () {
            wx.navigateBack({delta: 1})
          }
        })
      })
    })
  }
})