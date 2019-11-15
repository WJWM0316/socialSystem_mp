import {getCompanyAddressListApi, getPositionAddressListApi} from "../../../../../api/pages/company.js"
import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    pageCount: app.globalData.pageCount,
    hasReFresh: false,
    onBottomStatus: 0,
    addressList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    options: {
      selected: false
    }
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let detail = app.globalData.recruiterDetails
    let options = this.data.options
    let action = options.type === 'position' ? 'getPositionAddressList' : 'getCompanyAddressList'
    let addressList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({addressList, detail})
    this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取公司地址列表
   * @return   {[type]}   [description]
   */
  getCompanyAddressList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {id: app.globalData.recruiterDetails.companyInfo.id,  count: this.data.pageCount, page: this.data.addressList.pageNum, hasLoading}
      let options = this.data.options
      getCompanyAddressListApi(params).then(res => {
        let addressList = this.data.addressList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        addressList.list = addressList.list.concat(res.data)
        addressList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        addressList.pageNum = addressList.pageNum + 1
        addressList.isRequire = true
        addressList.list.map(field => field.active = field.id === parseInt(options.addressId) ? true : false)
        this.setData({addressList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取职位地址列表
   * @return   {[type]}   [description]
   */
  getPositionAddressList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let orgData = wx.getStorageSync('orgData')
      let params = {count: this.data.pageCount, page: this.data.addressList.pageNum, hasLoading}
      // 超管要加机构id
      if(this.data.detail.isCompanyTopAdmin) {
        params = Object.assign(params, {company_id: orgData.id})
      } else {
        params = Object.assign(params, {company_id: app.globalData.recruiterDetails.companyInfo.id})
      }
      getPositionAddressListApi(params).then(res => {
        let addressList = this.data.addressList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        addressList.list = addressList.list.concat(res.data)
        addressList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        addressList.pageNum = addressList.pageNum + 1
        addressList.isRequire = true
        addressList.list.map(field => field.active = field.id === parseInt(options.addressId) ? true : false)
        this.setData({addressList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   选择一个地址
   * @return   {[type]}     [description]
   */
  onClick(e) {
    let params = e.currentTarget.dataset
    let addressList = this.data.addressList
    let storage = wx.getStorageSync('createPosition') || {}
    addressList.list.map((field, index) => {
      if(params.id === index) {
        field.active = true
        storage.address_id = field.id
        storage.address = field.address
        wx.setStorageSync('createPosition', storage)
      } else {
        field.active = false
      }
    })
    this.setData({addressList}, () => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   添加地址
   */
  add() {
    // 判断是公司地址还是职位地址
    let options = this.data.options
    wx.navigateTo({url: `${RECRUITER}position/address/address?type=${options.type}&selected=${options.selected}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   编辑地址
   * @return   {[type]}     [description]
   */
  edit(e) {
    let params = e.currentTarget.dataset
    // 判断是公司地址还是职位地址
    let options = this.data.options
    // 缓存的历史记录页面 好像超过了最大数
    wx.redirectTo({url: `${RECRUITER}position/address/address?id=${params.id}&type=${options.type}&selected=${options.selected}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    let addressList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    let options = this.data.options
    let action = options.type === 'position' ? 'getPositionAddressList' : 'getCompanyAddressList'
    this.setData({addressList, hasReFresh: true})
    this[action]().then(res => {
        let addressList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        addressList.list = res.data
        addressList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        addressList.pageNum = 2
        addressList.isRequire = true
        this.setData({addressList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
      }).catch(e => {
        wx.stopPullDownRefresh()
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let addressList = this.data.addressList
    let options = this.data.options
    let action = options.type === 'position' ? 'getPositionAddressList' : 'getCompanyAddressList'
    if (!addressList.isLastPage) {
      this[action](false).then(() => this.setData({onBottomStatus: 1}))
    }
  }
})