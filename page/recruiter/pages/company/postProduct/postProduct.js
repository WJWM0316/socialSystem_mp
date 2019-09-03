import {
	createCompanyProductApi,
	getCompanyProductInfosApi,
	editCompanyProductInfosApi,
  deleteCompanyProductInfosApi
} from '../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    product_name: '',
    company_id: '',
    logo: '',
    slogan: '',
    lightspot: '',
    site_url: '',
    upload: {
    	smallUrl: ''
    },
    cdnPath: app.globalData.cdnImagePath,
    options: {},
    number: 1
  },
  onLoad(options) {
    this.setData({options})
    if(options.productId) this.getCompanyProductInfos(options)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   获取产品信息
   * @return   {[type]}   [description]
   */
  getCompanyProductInfos(options) {
    getCompanyProductInfosApi({id: options.productId})
      .then(res => {
        const infos = res.data
        const formData = {
          company_id: infos.companyId,
          logo: infos.logo.id,
          slogan: infos.slogan,
          lightspot: infos.lightspot,
          site_url: infos.siteUrl,
          upload: infos.logo,
          product_name: infos.productName
        }
        Object.keys(formData).map(field => this.setData({[field]: formData[field]}))
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
  	const key = e.currentTarget.dataset.key
  	const value = e.detail.value
  	this.debounce(this.bindChange, null, 500, { [key]: value} )
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
/**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindChange(item) {
  	const params = Object.entries(item)[0]
  	this.setData({[params[0]]: params[1]})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   上传头像
   * @return   {[type]}       [description]
   */
  upload(e) {
  	this.setData({upload: e.detail[0]})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   提交编辑信息
   * @return   {[type]}   [description]
   */
  submit() {
    const action = this.data.options.productId ? 'edit' : 'post'
  	this[action]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   添加产品
   * @return   {[type]}   [description]
   */
  post() {
    const infos = this.data
    const formData = {}
    formData.product_name = infos.product_name
    formData.company_id = app.globalData.recruiterDetails.companyInfo.id
    formData.logo = infos.upload.id
    formData.slogan = infos.slogan
    formData.lightspot = infos.lightspot
    formData.site_url = infos.site_url
    createCompanyProductApi(formData)
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   编辑产品
   * @return   {[type]}   [description]
   */
  edit() {
    const infos = this.data
    const formData = {}
    formData.product_name = infos.product_name
    formData.company_id = app.globalData.recruiterDetails.companyInfo.id
    formData.logo = infos.upload.id
    formData.slogan = infos.slogan
    formData.lightspot = infos.lightspot
    formData.site_url = infos.site_url
    formData.id = infos.options.productId
    editCompanyProductInfosApi(formData)
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  },
  delete() {
    const options = this.data.options
    deleteCompanyProductInfosApi({id: options.productId})
      .then(() => {
        wx.navigateBack({delta: 1})
      })
  }
})