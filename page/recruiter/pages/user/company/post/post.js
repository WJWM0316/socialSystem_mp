import {
  getCompanyIdentityInfosApi,
  perfectCompanyApi
} from '../../../../../../api/pages/company.js'

import {
  getLabelFieldApi
} from '../../../../../../api/pages/common.js'

import {realNameReg, emailReg, positionReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
    formData: {
      company_name: '',
      industry_id: 0,
      industry_id_name: '请选择行业范围',
      financing: 0,
      employees: 0,
      company_shortname: '',
      logo: {},
      intro: ''
    },
    companyLabelField: [],
    options: {},
    isFocus: false,
    cdnPath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let storage = wx.getStorageSync('createdCompany') || {}
    getLabelFieldApi().then(res => this.setData({companyLabelField: res.data}))
    getCompanyIdentityInfosApi({hasLoading: false}).then(res => {
      let infos = res.data.companyInfo
      let formData = {
        company_name: infos.companyName,
        company_shortname: storage.company_shortname || infos.companyShortname,
        industry_id: storage.industry_id || infos.industryId,
        industry_id_name: storage.industry_id_name || infos.industry,
        financing: storage.financing || infos.financing,
        financingName: storage.financingName || infos.financingInfo,
        employees: storage.employees || infos.employees,
        employeesName: storage.employeesName || infos.employeesInfo,
        intro: storage.intro || infos.intro,
        logo: storage.logo || infos.logoInfo,
        id: infos.id,
        business_license: storage.business_license || infos.businessLicenseInfo,
        on_job: storage.on_job || infos.onJobInfo
      }
      this.setData({formData})
    })
  },
  onHide() {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-16
   * @detail   detail
   */
  setFocusByFocus() {
    this.setData({isFocus: true})
  },
  setFocusByBlur() {
    this.setData({isFocus: false})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   保存当前页面的数据
   * @return   {[type]}   [description]
   */
  submit() {
    let formData = this.data.formData

    // 验证公司简称
    let checkCompanyShortName = new Promise((resolve, reject) => {
      !formData.company_shortname.trim() ? reject('请输入公司简称') : resolve()
    })

    // 验证行业选项
    let checkIndustryId = new Promise((resolve, reject) => {
      !formData.industry_id ? reject('请选择所属行业') : resolve()
    })

    // 验证融资选项
    let checkFinancing = new Promise((resolve, reject) => {
      !formData.financing ? reject('请选择融资情况') : resolve()
    })

    // 验证人员规模
    let checkEmployees = new Promise((resolve, reject) => {
      !formData.employees ? reject('请选择人员规模') : resolve()
    })

    Promise.all([
      checkCompanyShortName,
      checkIndustryId,
      checkFinancing,
      checkEmployees
    ])
    .then(res => {
      formData.company_shortname = formData.company_shortname.trim()
      wx.setStorageSync('createdCompany', formData)
      wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?companyId=${formData.id}`})
      // perfectCompanyApi(params).then(res => {
      //   wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?companyId=${res.data.companyId}`})
      // })
    })
    .catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   下拉选项绑定
   * @return   {[type]}     [description]
   */
  bindChange(e) {
    let index = parseInt(e.detail.value)
    let companyLabelField = this.data.companyLabelField
    let formData = this.data.formData
    formData.industry_id = companyLabelField[index].labelId
    formData.industry_id_name = companyLabelField[index].name
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-16
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let formData = this.data.formData
    let value = e.detail.value
    if(value.charAt(0) === ' ') value = value.trim()
    formData.company_shortname = value
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取人员规模
   * @return   {[type]}   [description]
   */
  getStaffMembers(res) {
    let formData = this.data.formData
    formData.employees = res.detail.propsResult
    formData.employeesName = res.detail.propsDesc
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-03
   * @detail   获取融资情况
   * @return   {[type]}   [description]
   */
  getFinancing(res) {
    let formData = this.data.formData
    formData.financing = res.detail.propsResult
    formData.financingName = res.detail.propsDesc
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
    formData.logo = e.detail[0]
    this.setData({formData})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-16
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump() {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${RECRUITER}company/introducingEdit/introducingEdit`})
  },
  savaBeforeUpload() {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
  }
})