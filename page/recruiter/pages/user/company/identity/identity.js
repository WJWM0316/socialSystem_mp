import {
  identityCompanyApi,
  getCompanyIdentityInfosApi,
  editCompanyIdentityInfosApi,
  joinidentityApi,
  editIdentityJoinApi
} from '../../../../../../api/pages/company.js'

import {realNameRegB, idCardReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

let app = getApp()

Page({
  data: {
    formData: {
      real_name: '',
      identity_num: '',
      passport_front: {
        url: '',
        loading: false
      },
      passport_reverse: {
        url: '',
        loading: false
      },
      validity_start: '',
      validity_end: ''
    },
    cdnImagePath: app.globalData.cdnImagePath,
    canClick: false,
    options: {},
    applyJoin: false,
    cardInfo_front: {
      type: 'idCard',
      side: 1
    },
    cardInfo_back: {
      type: 'idCard',
      side: 0
    },
    companyInfo: {},
    identityInfo: {}
  },
  onLoad(options) {
    this.setData({options})
    this.getCompanyIdentityInfos()
  },
  // onShow() {
  //   this.getCompanyIdentityInfos()
  // },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取认证详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let formData = {}
      let options = this.data.options
      let applyJoin = res.data.applyJoin
      let identityInfo = res.data
      let companyInfo = res.data.companyInfo

      if(applyJoin) {
        // 身份姓名 > 加入公司填写的姓名
        formData.real_name = identityInfo.realName || companyInfo.realName || ''
        formData.identity_num = identityInfo.identityNum || ''
      } else {
        // 身份姓名 > 加入公司填写的姓名
        formData.real_name = identityInfo.realName || companyInfo.realName || ''
        formData.identity_num = identityInfo.identityNum || ''
        formData.passport_front = identityInfo.passportFrontInfo
        formData.passport_front.hasUpload = true
      }
      
      this.setData({formData: Object.assign(this.data.formData, formData), applyJoin, identityInfo, companyInfo}, () => this.bindBtnStatus())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    let applyJoin = this.data.applyJoin
    let bindKeys = []
    let canClick = false
    let hasUpload = false

    if(applyJoin) {
      bindKeys = ['real_name', 'identity_num']
      canClick = bindKeys.every(field => this.data.formData[field])
    } else {
      bindKeys = ['real_name', 'identity_num']
      canClick = bindKeys.every(field => this.data.formData[field])
      hasUpload = this.data.formData.passport_front.url
      canClick = canClick && hasUpload
    }

    this.setData({ canClick })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   日期选择
   * @return   {[type]}     [description]
   */
  getStartDate(e) {
    let validity_start = e.detail.value.replace(/-/g, '.')
    let formData = this.data.formData
    formData.validity_start = validity_start
    this.setData({ formData }, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-21
   * @detail   图片上传
   * @return   {[type]}     [description]
   */
  upload_front(e) {
    if(!e.detail.length) return
    let infos = e.detail[0]
    let idCardInfo = infos.idCardInfo
    let formData = this.data.formData
    formData.passport_front.loading = false
    formData.passport_front.hasUpload = true
    formData.passport_front = Object.assign(formData.passport_front, infos.file)
    formData.real_name = idCardInfo.name
    formData.identity_num = idCardInfo.num
    this.setData({formData}, () => this.bindBtnStatus())
  },
  submit() {
    if(!this.data.canClick) return;

    let formData = this.data.formData
    let companyInfo = this.data.companyInfo
    let identityInfo = this.data.identityInfo
    let applyJoin = this.data.applyJoin

    // 验证姓名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameRegB.test(formData.real_name) ? reject('姓名需为2-20个中文字符') : resolve()
    })
    
    // 验证身份证
    let checkIdCard = new Promise((resolve, reject) => {
      !idCardReg.test(formData.identity_num) ? reject('请填写有效的身份证号') : resolve()
    })

    Promise
    .all([checkRealName, checkIdCard]).then(res => {
      let action = ''
      let infos = this.data.infos

      if(applyJoin) {
        if(identityInfo.haveIdentity) {
          action = 'editIdentityJoin'
        } else {
          action = 'identityJoin'
        }
      } else {
        if(identityInfo.haveIdentity) {
          action = 'editIdentityCompany'
        } else {
          action = 'identityCompany'
        }
      }
      this[action]()
    })
    .catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   获取提交信息
   * @return   {[type]}   [description]
   */
  getParams() {
    let rtn = {}
    let applyJoin = this.data.applyJoin
    let formData = this.data.formData
    if(applyJoin) {
      rtn.real_name = formData.real_name
      rtn.identity_num = formData.identity_num
    } else {
      rtn.real_name = formData.real_name
      rtn.identity_num = formData.identity_num
      rtn.passport_front = formData.passport_front.id
      rtn.passport_reverse = formData.passport_reverse.id
      rtn.validity_end = formData.validity_end.replace(/-/g, '.')
      rtn.validity_start = formData.validity_start.replace(/-/g, '.')
    }
    return rtn
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   创建身份认证
   * @return   {[type]}   [description]
   */
  identityCompany() {
    let formData = this.getParams()
    let options = this.data.options
    identityCompanyApi(formData).then((res) => {
      if(this.data.options.from === 'identity') {
        wx.navigateBack({delta: 1})
        // wx.redirectTo({url: `${RECRUITER}user/company/status/status?from=identity`})
      } else {
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${options.from}`})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   加入公司身份认证
   * @return   {[type]}   [description]
   */
  identityJoin() {
    let formData = this.getParams()
    let options = this.data.options
    joinidentityApi(formData).then((res) => {
      if(this.data.options.from === 'identity') {
        wx.navigateBack({delta: 1})
        // wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity&reBack=2`})
      } else {
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${options.from}`})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   创建公司身份认证 编辑
   * @return   {[type]}   [description]
   */
  editIdentityCompany() {
    let formData = this.getParams()
    let options = this.data.options
    editCompanyIdentityInfosApi(formData).then((res) => {
      if(this.data.options.from === 'identity') {
        wx.navigateBack({delta: 1})
        // wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity&reBack=2`})
      } else {
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${options.from}`})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   加入公司身份认证 编辑
   * @return   {[type]}   [description]
   */
  editIdentityJoin() {
    let formData = this.getParams()
    let options = this.data.options
    editIdentityJoinApi(formData).then((res) => {
      if(this.data.options.from === 'identity') {
        wx.navigateBack({delta: 1})
        // wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity&reBack=2`})
      } else {
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${options.from}`})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-30
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let field = e.currentTarget.dataset.field
    let formData = this.data.formData
    let value = e.detail.value
    value = value.replace(/\s+/g,'')
    formData[field] = value
    this.setData({formData}, () => this.bindBtnStatus())
  },
  beforeUpload(e) {
    let type = e.currentTarget.dataset.type
    let formData = this.data.formData
    formData[type].loading = true
    this.setData({ formData })
  },
  failUpload(e) {
    let type = e.currentTarget.dataset.type
    let formData = this.data.formData
    formData[type].loading = false
    this.setData({ formData })
  }
})