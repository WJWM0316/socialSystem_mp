import {
  applyCompanyApi,
  getCompanyNameListApi,
  justifyCompanyExistApi,
  editApplyCompanyApi,
  getCompanyIdentityInfosApi,
  getCompanyNameList1Api
} from '../../../../../../api/pages/company.js'

import {companyNameReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
    formData: {
      company_name: ''
    },
    canClick: false,
    showMaskBox: false,
    options: {},
    nameList: [],
    type: 'create',
    infos: {}
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
   * @detail   初始化页面数据
   * @return   {[type]}           [description]
   */
  onLoad(options) {
    let storage = wx.getStorageSync('createdCompany')
    let formData = this.data.formData
    let canClick = this.data.canClick
    canClick = storage.company_name ? true : false
    formData.company_name = storage.company_name
    this.setData({formData, canClick, options}, () => this.getCompanyNameList(formData.company_name))
  },
/**
 * @Author   小书包
 * @DateTime 2019-01-11
 * @detail   绑定按钮的状态
 * @return   {[type]}   [description]
 */
  bindButtonStatus() {
    this.setData({canClick: this.data.formData.company_name ? true : false})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let name = e.detail.value
    this.debounce(this.getCompanyNameList, null, 300, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   获取公司名字列表
   * @return   {[type]}     [description]
   */
  getCompanyNameList(name) {
    let formData = this.data.formData
    formData.company_name = name
    this.setData({formData, canClick: true}, () => this.bindButtonStatus())
    let params = {name: name, ...app.getSource()}
    if(this.data.options.type === 'company') {
      params = Object.assign(params, {is_org: 0})
    }
    getCompanyNameList1Api(params).then(res => {
      let nameList = res.data
      nameList.map(field => {
        field.html = field.companyName.replace(new RegExp(name,'g'),`<span style="color: #652791;">${name}</span>`)
        field.html = `<div>${field.html}</div>`
      })
      this.setData({nameList})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   选择公司
   * @return   {[type]}   [description]
   */
  selectCompany(e) {
    let params = e.currentTarget.dataset
    let formData = this.data.formData
    let nameList = this.data.nameList
    formData.company_name = params.name
    nameList.map(field => {
      field.html = field.companyName
      field.html = field.companyName.replace(new RegExp(formData.company_name,'g'),`<span style="color: #652791;">${formData.company_name}</span>`)
      field.html = `<div>${field.html}</div>`
    })
    this.setData({canClick: true, formData, nameList})
  },
  submit() {
    if(!this.data.canClick) return;
    let company_name = this.data.formData.company_name
    let storage = wx.getStorageSync('createdCompany')
    let nameList = this.data.nameList
    let item = nameList.find(field => field.companyName == company_name)
    let cacheData = wx.getStorageSync('createdCompany')
    cacheData = Object.assign(cacheData, {company_name: company_name})
    if(item) {
      wx.setStorageSync('createdCompany', cacheData)
      wx.navigateTo({url: `${RECRUITER}organization/choose/choose?type=org&companyId=${item.id}`})
    } else {
      company_name = company_name.trim()
      storage.company_name = company_name
      wx.setStorageSync('createdCompany', storage)
      // wx.navigateBack({delta: 1 })
      wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
    }
  }
})