import {
	addCompanyApi,
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
    cdnPath: app.globalData.cdnImagePath,
  },
  onLoad(options) {
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
    addCompanyApi(params).then(res => {
      app.wxToast({
        title: '创建成功',
        icon: 'success',
        callback () {
          wx.navigateBack({delta: 1})
        }
      })
    })
  }
})