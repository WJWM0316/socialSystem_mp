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
      intro: '',
      address: ''
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
    let addressInfos = wx.getStorageSync('addAddress')
    getLabelFieldApi().then(res => this.setData({companyLabelField: res.data}))
    getCompanyIdentityInfosApi({hasLoading: false}).then(res => {
      let infos = res.data.companyInfo
      let formData = this.data.formData
      formData.company_name = infos.companyName
      formData.company_shortname = storage.company_shortname || infos.companyName
      formData.industry_id = storage.industry_id || infos.industryId
      formData.industry_id_name = storage.industry_id_name || infos.industry
      formData.financing = storage.financing || infos.financing
      formData.financingName = storage.financingName || infos.financingInfo
      formData.employees = storage.employees || infos.employees
      formData.employeesName = storage.employeesName || infos.employeesInfo
      formData.intro = storage.intro || infos.intro
      formData.logo = storage.logo || infos.logoInfo
      formData.id = infos.id
      formData.organization_name = infos.organization_name
      // formData.business_license = storage.business_license || infos.businessLicenseInfo,
      // formData.on_job = storage.on_job || infos.onJobInfo,
      formData.organization_name = storage.organization_name || infos.organizationName
      if(addressInfos) {
        formData.address = addressInfos.address + addressInfos.doorplate
        wx.removeStorageSync('addAddress')
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
  checkInput() {
    let formData = this.data.formData,
        options = this.data.options,
        checkLists = [],
        checkCompanyShortName = '',
        checkIndustryId = '',
        checkFinancing = '',
        checkEmployees = '',
        logo = '',
        address = ''

    if(options.type === 'company') {
      // 验证公司简称
      // checkCompanyShortName = new Promise((resolve, reject) => {
      //   !formData.company_shortname.trim() ? reject('请输入公司简称') : resolve()
      // })

      // 验证行业选项
      checkIndustryId = new Promise((resolve, reject) => {
        !formData.industry_id ? reject('请选择所属行业') : resolve()
      })

      // 验证融资选项
      checkFinancing = new Promise((resolve, reject) => {
        !formData.financing ? reject('请选择融资情况') : resolve()
      })

      // 验证人员规模
      checkEmployees = new Promise((resolve, reject) => {
        !formData.employees ? reject('请选择人员规模') : resolve()
      })

      // formData.company_shortname = formData.company_shortname.trim()
      checkLists = [
        //checkCompanyShortName,
        checkIndustryId,
        checkFinancing,
        checkEmployees
      ]
    } else {
      logo = new Promise((resolve, reject) => {
        !formData.logo.id ? reject('请上传机构图片') : resolve()
      })
      address = new Promise((resolve, reject) => {
        !formData.address ? reject('请选择机构地址') : resolve()
      })
      checkLists = [logo, address]
    }

    Promise.all(checkLists)
    .then(res => this.submit(formData)).catch(err => app.wxToast({title: err}))
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
  routeAddress() {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${RECRUITER}position/address/address?type=addOrganization`})
  },
  savaBeforeUpload() {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
  },
  submit(formData) {
    let options = this.data.options
    let params = {}
    if(options.type === 'company') {
      params = Object.assign(params, {
        company_name: formData.company_name,
        industry_id: formData.industry_id,
        financing: formData.financing,
        employees: formData.employees,
        // company_shortname: formData.company_shortname,
        logo: formData.logo.id,
        intro: formData.intro,
        // business_license: this.data.formData.business_license.id,
        // on_job: this.data.formData.on_job.id,
        id: formData.id
      })
    } else {
      params = Object.assign(params, {
        logo: formData.logo.id,
        intro: formData.intro,
        id: formData.id,
        address: formData.address,
        company_name: formData.organization_name
      })
    }
    perfectCompanyApi(params).then(res => {
      wx.removeStorageSync('createdCompany')
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${options.type === 'company' ? 'company' : 'create_org'}`})
    })
    .catch(err => {
      if(err.code === 307) {
        app.wxToast({
          title: err.msg,
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
        return
      }

      if(err.code === 808) {
        app.wxToast({
          title: err.msg,
          callback() {
            wx.removeStorageSync('createdCompany')
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
        return
      }

      app.wxToast({ title: err.msg })
      
    })
  }
})