import {getCompanyProductListsApi} from '../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../config.js'

Page({
  data: {
    productList: [],
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    const options = this.data.options
    this.getCompanyProductLists(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取公司产品列表
   * @return   {[type]}   [description]
   */
  getCompanyProductLists(options) {
  	getCompanyProductListsApi({id: options.companyId})
  		.then(res => {
  			this.setData({productList: res.data})
  		})
  },
  edit(e) {
    const productId = e.currentTarget.dataset.id
    wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct?productId=${productId}`})
  },
  add() {
    wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct`})
  }
})