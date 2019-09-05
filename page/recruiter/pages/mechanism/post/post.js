import {
  createCompanyProductApi,
  getCompanyProductInfosApi,
  editCompanyProductInfosApi,
  deleteCompanyProductInfosApi
} from '../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    formData: {
      product_name: '',
      company_id: '',
      logo: '',
      slogan: '',
      lightspot: '',
      site_url: '',
      upload: {
        smallUrl: ''
      }
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
    getCompanyProductInfosApi({id: options.productId}).then(res => {
      let infos = res.data
      let formData = {
        company_id: infos.companyId,
        logo: infos.logo.id,
        slogan: infos.slogan,
        lightspot: infos.lightspot,
        site_url: infos.siteUrl,
        upload: infos.logo,
        product_name: infos.productName
      }
      this.setData({formData})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let formData = this.data.formData
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    formData[key] = value
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   上传头像
   * @return   {[type]}       [description]
   */
  upload(e) {
    let formData = this.data.formData
    formData['upload'] = e.detail[0]
    this.setData({ formData })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   提交编辑信息
   * @return   {[type]}   [description]
   */
  submit() {
    let formData = this.data.formData
    let params = {}
    let options = this.data.options

    // 验证机构logo
    let logoCheck = new Promise((resolve, reject) => {
      if(!formData.logo.id) {
         reject('请上传机构Logo')
      } else {
        params = Object.assign(params, {logo: formData.logo.id})
        resolve()
      }
    })

    // 验证机构名称
    let nameCheck = new Promise((resolve, reject) => {
      if(!formData.name) {
         reject('请输入机构名称')
      } else {
        params = Object.assign(params, {name: formData.name})
        resolve()
      }
    })

    // 验证手机号
    let mobileCheck = new Promise((resolve, reject) => {
      if(!formData.mobile) {
         reject('请输入登录账号')
      } else {
        params = Object.assign(params, {mobile: formData.mobile})
        resolve()
      }
    })

    // 验证机构地址
    let addressCheck = new Promise((resolve, reject) => {
      if(!formData.address) {
         reject('请输入机构地址')
      } else {
        params = Object.assign(params, {address: formData.address})
        resolve()
      }
    })

    let action = this.data.options.productId ? 'edit' : 'post'

    Promise.all([
      logoCheck,
      nameCheck,
      mobileCheck,
      addressCheck
    ]).then(() => this[action](params)).catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   添加产品
   * @return   {[type]}   [description]
   */
  post(params) {
    createCompanyProductApi(params).then(() => wx.navigateBack({delta: 1}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   编辑产品
   * @return   {[type]}   [description]
   */
  edit(params) {
    editCompanyProductInfosApi(params).then(() => wx.navigateBack({delta: 1}))
  },
  delete() {
    let options = this.data.options
    deleteCompanyProductInfosApi({id: options.productId}).then(() => wx.navigateBack({delta: 1}))
  }
})