import {realNameRegB, emailReg, positionReg, companyNameReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../../../config.js'

import {getSelectorQuery} from "../../../../../../utils/util.js"

import {
  applyCompanyApi,
  createCompanyApi,
  getCompanyNameListApi,
  justifyCompanyExistApi,
  editApplyCompanyApi,
  getCompanyIdentityInfosApi,
  editCompanyFirstStepApi,
  hasApplayRecordApi
} from '../../../../../../api/pages/company.js'

let app = getApp()

Page({
  data: {
    formData: {
      real_name: '',
      user_email: '',
      user_position: '',
      position_type_id: '',
      positionTypeName: '',
      company_name: ''
    },
    canClick: false,
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    telePhone: app.globalData.telePhone,
    height: 0
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    this.getBannerHeight()
    this.getCompanyIdentityInfos(false)
  },
  backEvent() {
    wx.removeStorageSync('createdCompany')
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-05
   * @detail   获取banner高度
   * @return   {[type]}   [description]
   */
  getBannerHeight() {
    return getSelectorQuery('.banner').then(res => this.setData({height: res.height}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-12
   * @detail   获取编辑详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    let storage = wx.getStorageSync('createdCompany') || {}
    let options = this.data.options
    let formData = {}
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let companyInfo = res.data.companyInfo
      // 失败后重新创建一条记录
      if(companyInfo.status === 2) {
        formData = {
          real_name: storage.real_name,
          user_email: storage.user_email,
          user_position: storage.user_position,
          company_name: storage.company_name,
          position_type_id: storage.position_type_id,
          positionTypeName: storage.positionTypeName
        }
        this.setData({formData})
      } else {

        formData = {
          real_name: storage.real_name || companyInfo.realName,
          user_email: storage.user_email || companyInfo.userEmail,
          user_position: storage.user_position || companyInfo.userPosition,
          company_name: storage.company_name || companyInfo.companyName,
          position_type_id: storage.position_type_id || companyInfo.positionTypeId,
          positionTypeName: storage.positionTypeName || companyInfo.positionTypeName
        }
        // 重新编辑 加公司id 
        if(Reflect.has(options, 'action')) formData = Object.assign(formData, {id: companyInfo.id})
        let createPosition = wx.getStorageSync('createPosition')

        if (createPosition.type) {
          formData.position_type_id = createPosition.type
          formData.positionTypeName = createPosition.typeName
        }

        this.setData({formData, canClick: true})
        wx.removeStorageSync('createPosition')
        wx.setStorageSync('createdCompany', Object.assign(formData, this.data.formData))
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    let formData = this.data.formData
    let bindKeys = ['real_name', 'user_position', 'user_email', 'company_name']
    let canClick = bindKeys.every(field => this.data.formData[field])
    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let field = e.currentTarget.dataset.field
    let formData = this.data.formData
    let value = e.detail.value
    if(field === 'user_email' || field === 'real_name') value = value.replace(/\s+/g,'')
    formData[field] = value
    this.setData({formData: Object.assign(this.data.formData, formData)})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   保存当前页面的数据
   * @return   {[type]}   [description]
   */
  submit() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let options = this.data.options
    let storage = wx.getStorageSync('createdCompany') || {}
    let funcApi = Reflect.has(options, 'action') ? 'editCreateCompany' : 'createCompany'
    let params = {}

    // 编辑需要传id
    if(Reflect.has(options, 'action')) {
        params = Object.assign(params, {id: formData.id})
    }

    // 验证姓名
    let checkRealName = new Promise((resolve, reject) => {
      if(!realNameRegB.test(formData.real_name)) {
        reject('姓名需为2-20个中文字符')
      } else {
        params = Object.assign(params, {real_name: formData.real_name})
        resolve()
      }
    })

    // 验证公司名称
    let checkCompanyName = new Promise((resolve, reject) => {
      if(!companyNameReg.test(formData.company_name)) {
        reject('请输入有效的公司名称')
      } else {
        params = Object.assign(params, {company_name: formData.company_name})
        resolve()
      }
    })

    // 验证邮箱
    let checkUserEmail = new Promise((resolve, reject) => {
      if(!emailReg.test(formData.user_email)) {
        reject('请填写有效的邮箱')
      } else {
        params = Object.assign(params, {user_email: formData.user_email.trim()})
        resolve()
      }
    })

    // 验证职位
    let checkUserPosition = new Promise((resolve, reject) => {
      if(!positionReg.test(formData.user_position)) {
        reject('担任职务需为2-50个字')
      } else {
        params = Object.assign(params, {user_position: formData.user_position})
        resolve()
      }
    })

    Promise.all([
      checkRealName,
      checkCompanyName,
      checkUserEmail,
      checkUserPosition
    ])
    .then(res => this[funcApi](params))
    .catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.wxConfirm({
      title: '切换身份',
      content: '是否继续前往求职端？',
      confirmBack() {
        app.toggleIdentity()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   更改手机
   * @return   {[type]}   [description]
   */
  changePhone() {
    app.wxConfirm({
      title: '换个账号',
      content: '退出后不会删除任何历史数据，下次登录依然可以使用本账号',
      confirmBack() {
        app.uplogin()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   获取公司名称
   * @return   {[type]}   [description]
   */
  getCompanyName() {
    let storage = wx.getStorageSync('createdCompany') || {}
    let options = this.data.options
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${RECRUITER}user/company/find/find`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  createCompany(params) {
    createCompanyApi(params).then(res => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company`})
      wx.removeStorageSync('createdCompany')
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
      app.wxToast({ title: err.msg })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   编辑申请加入公司
   * @return   {[type]}   [description]
   */
  editCreateCompany(params) {
    editCompanyFirstStepApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company&action=edit`})
      wx.removeStorageSync('createdCompany')
    })
    .catch(err => {
      app.wxToast({
        title: err.msg,
        callback() {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
        }
      })
    })
  },
  toChooseType () {
    wx.navigateTo({url: `${COMMON}category/category`})
  }
})