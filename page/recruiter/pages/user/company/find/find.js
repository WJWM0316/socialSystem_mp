import {
  applyCompanyApi,
  getCompanyNameListApi,
  justifyCompanyExistApi,
  editApplyCompanyApi,
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

import {companyNameReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

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
    const storage = wx.getStorageSync('createdCompany')
    const formData = this.data.formData
    let canClick = this.data.canClick
    canClick = storage.company_name ? true : false
    formData.company_name = storage.company_name
    this.setData({formData, canClick, options})
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
    const name = e.detail.value
    this.debounce(this.getCompanyNameList, null, 300, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   获取公司名字列表
   * @return   {[type]}     [description]
   */
  getCompanyNameList(name) {
    const formData = this.data.formData
    formData.company_name = name
    this.setData({formData, canClick: true}, () => this.bindButtonStatus())
    getCompanyNameListApi({name: name, ...app.getSource()}).then(res => {
      const nameList = res.data
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
    const params = e.currentTarget.dataset
    const formData = this.data.formData
    formData.company_name = params.name
    this.setData({canClick: true, formData, nameList: []})
  },
  submit() {
    let company_name = this.data.formData.company_name
    let storage = wx.getStorageSync('createdCompany')
    if(!this.data.canClick) return;
    company_name = company_name.trim()
    storage.company_name = company_name
    wx.setStorageSync('createdCompany', storage)
    wx.navigateBack({delta: 1 })
  }
})