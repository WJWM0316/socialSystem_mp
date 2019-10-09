import {
  getCompanyProductListsApi, 
  createCompanyProductApi,
  addCompanyProductSelApi
} from '../../../../../api/pages/company.js'

import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    productList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    onBottomStatus: 0,
    hasReFresh: false,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let productList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({productList}, () => this.getCompanyProductLists())    
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取公司产品列表
   * @return   {[type]}   [description]
   */
  getCompanyProductLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let productList = this.data.productList
      let params = {count: 20, page: productList.pageNum, id: options.companyId, hasLoading}
      let onBottomStatus = this.data.onBottomStatus
    	getCompanyProductListsApi(params).then(res => {
        let list = res.data
        list.map(v => v.active = false)
        productList.list = productList.list.concat(list)
        productList.isLastPage = res.data.length === params.count || (res.meta && res.meta.nextPageUrl) ? false : true
        productList.pageNum = productList.pageNum + 1
        productList.isRequire = true
        onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
  			this.setData({productList, onBottomStatus}, () => resolve(res))
  		})
    })
  },
  edit(e) {
    let productId = e.currentTarget.dataset.id
    wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct?productId=${productId}`})
  },
  add() {
    let options = this.data.options
    let result = this.data.productList.list.find(v => v.active)
    let orgData = wx.getStorageSync('orgData')
    let formData = {}
    let callback = () => {
      app.wxToast({
        title: '添加成功',
        callback() {
          wx.navigateBack({delta: 1 })
        }
      })
    }

    // 添加公司产品
    if(!options.from && options.type !== 'choose') {
      wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct`})
      return
    }

    if(options.type == 'choose') {
      if(result) {
        formData.company_id = orgData.id
        formData.product_ids = result.id
        addCompanyProductSelApi(formData).then(() => callback())
      } else {
        app.wxToast({title: '请选择一个产品'})
      }
    } else {
      // 判断是否有公司产品
      getCompanyProductListsApi({id: options.topId, hasLoading: false}).then(res => {
        if(res.meta.total) {
          this.selectComponent('#shareBtn').oper()
        } else {
          wx.navigateTo({url: `${RECRUITER}company/postProduct/postProduct`})
        }
      })
    }
  },
  onReachBottom() {
    if (!this.data.productList.isLastPage) {
      this.setData({onBottomStatus: 1}, () => this.getCompanyProductLists(false))
    }
  },
  onPullDownRefresh(hasLoading = true) {
    let productList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let callback = () => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }
    this.setData({productList, onBottomStatus: 0, hasReFresh: true}) 
    this.getCompanyProductLists(false).then(res => callback()).catch(e => callback())
  },
  getThis(e) {
    let index = e.currentTarget.dataset.index
    let productList = this.data.productList
    productList.list.map((v,i) => v.active = i === index ? true : false)
    this.setData({productList})
  }
})