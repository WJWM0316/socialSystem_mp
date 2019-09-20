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
      company_name: '',
      position_type_id: '',
      positionTypeName: ''
    },
    canClick: false,
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    telePhone: app.globalData.telePhone,
    height: 0,
    applyJoin: false
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    this.setData({options})
  },
  onShow() {
    let init = () => {
      this.getBannerHeight()
      this.getCompanyIdentityInfos(false)
    }
    
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
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
    getSelectorQuery('.banner').then(res => this.setData({height: res.height}))
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
    let applyJoin = this.data.applyJoin
    let formData = {}
    getCompanyIdentityInfosApi({hasLoading}).then(res => {
      let companyInfo = res.data.companyInfo
      let status = 0
      let createPosition = wx.getStorageSync('createPosition')
      applyJoin = Reflect.has(res.data, 'applyJoin') ? res.data.applyJoin : this.data.applyJoin
      // 重新创建一条记录
      if(companyInfo.status === 2) {
        formData = {
          real_name: storage.real_name,
          user_email: storage.user_email,
          user_position: storage.user_position,
          company_name: storage.company_name,
          company_name: storage.company_name,
          position_type_id: storage.position_type_id,
          positionTypeName: storage.positionTypeName
        }
        if(createPosition) {
          formData.position_type_id = createPosition.type
          formData.positionTypeName = createPosition.typeName
        }
        this.setData({formData, applyJoin})
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
        if(options.action && options.action === 'edit') formData = Object.assign(formData, {id: companyInfo.id, status: companyInfo.status})
        if(applyJoin) formData = Object.assign(formData, {applyId: companyInfo.applyId})
        if(createPosition) {
          formData.position_type_id = createPosition.type
          formData.positionTypeName = createPosition.typeName
        }
        this.setData({formData, canClick: true, applyJoin, status})
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
    let formData = this.data.formData
    let options = this.data.options
    let applyJoin = this.data.applyJoin
    let storage = wx.getStorageSync('createdCompany') || {} 

    // 验证姓名
    let checkRealName = new Promise((resolve, reject) => {
      !realNameRegB.test(formData.real_name) ? reject('姓名需为2-20个中文字符') : resolve()
    })

    // 验证公司名称
    let checkCompanyName = new Promise((resolve, reject) => {
      !formData.company_name.trim() ? reject('请输入有效的公司名称') : resolve()
    })

    // 验证邮箱
    let checkUserEmail = new Promise((resolve, reject) => {
      !emailReg.test(formData.user_email) ? reject('请填写有效的邮箱') : resolve()
    })

    // 验证职位
    let checkUserPosition = new Promise((resolve, reject) => {
      !positionReg.test(formData.user_position) ? reject('担任职务需为2-50个字') : resolve()
    })

    Promise.all([
      checkRealName,
      checkCompanyName,
      checkUserEmail,
      checkUserPosition
    ])
    .then(res => {
      if(options.action && options.action === 'edit') {
        // 对于已有的数据 直接编辑 编辑加入或者创建的信息
        if(applyJoin) {
          this.editJoinCompany()
        } else {
          this.editCreateCompany()
        }
      } else {
        this.createCompany()
      }
    })
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
  joinCompany() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let storage = wx.getStorageSync('createdCompany') || {}
    let params = {
      real_name: formData.real_name,
      user_email: formData.user_email.trim(),
      user_position: formData.user_position,
      company_name: formData.company_name,
      position_type_id: formData.position_type_id, 
      company_id: formData.id
    }
    hasApplayRecordApi().then(res => {
      // 当前公司已经申请过
      if(res.data.id) {
        this.editJoinCompany()
      } else {
        applyCompanyApi(params).then(res => {
          wx.removeStorageSync('createdCompany')
          if(res.data.emailStatus) {
            wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?from=join&suffix=${res.data.suffix}&companyId=${res.data.companyId}`})
          } else {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
          }
        })
        .catch(err => {
          if(err.code === 307) {
            app.wxToast({
              title: err.msg,
              callback() {
                wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
              }
            })
          } 
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   编辑申请加入公司
   * @return   {[type]}   [description]
   */
  editJoinCompany() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let storage = wx.getStorageSync('createdCompany') || {}
    let params = {
      id: formData.applyId,
      real_name: formData.real_name,
      user_email: formData.user_email.trim(),
      user_position: formData.user_position,
      company_name: formData.company_name,
      position_type_id: formData.position_type_id,
      company_id: formData.id
    }
    // 判断公司是否存在
    justifyCompanyExistApi({name: formData.company_name}).then(res0 => {
      if(res0.data.exist) {
        // 有可能编辑时  加入另一家公司
        params = Object.assign(params, {company_id: res0.data.id})
        // 被拒绝并且是新公司
        if(formData.id !== res0.data.id) {
          // 查看当前公司是否有申请记录
          hasApplayRecordApi().then(res1 => {
            // 当前公司已经申请过
            if(res1.data.id) {
              editApplyCompanyApi(params).then(res => {
                wx.removeStorageSync('createdCompany')
                if(res.data.emailStatus) {
                  wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?from=join&suffix=${res.data.suffix}&companyId=${res.data.companyId}`})
                } else {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
                }
              })
              .catch(err => {
                if(err.code === 307) {
                  app.wxToast({
                    title: err.msg,
                    callback() {
                      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
                    }
                  })
                } 
              })
            } else {
              formData.id = res0.data.id
              this.setData({formData}, () => this.joinCompany())
            }
          })
        } else {
          editApplyCompanyApi(params).then(res => {
            wx.removeStorageSync('createdCompany')
            if(res.data.emailStatus) {
              wx.navigateTo({url: `${RECRUITER}user/company/identityMethods/identityMethods?from=join&suffix=${res.data.suffix}&companyId=${res.data.companyId}`})
            } else {
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
            }
          })
          .catch(err => {
            if(err.code === 307) {
              app.wxToast({
                title: err.msg,
                callback() {
                  wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
                }
              })
            } 
          })
        }
      } else {
        this.createCompany()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   申请加入公司
   * @return   {[type]}   [description]
   */
  createCompany() {
    let formData = Object.assign(wx.getStorageSync('createdCompany'), this.data.formData)
    let params = {
      real_name: formData.real_name,
      user_email: formData.user_email.trim(),
      user_position: formData.user_position,
      position_type_id: formData.position_type_id, 
      company_name: formData.company_name
    }
    createCompanyApi(params).then(res => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company`})
      wx.removeStorageSync('createdCompany')
    })
    // 公司存在 直接走加入流程
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

      if(err.code === 990) {
        formData.id = err.data.companyId
        this.setData({formData}, () => this.joinCompany())
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
  editCreateCompany() {
    // 防止用户重新编辑
    let formData = Object.assign(wx.getStorageSync('createdCompany') || {}, this.data.formData)
    let params = {
      id: formData.id,
      real_name: formData.real_name,
      user_email: formData.user_email.trim(),
      user_position: formData.user_position,
      company_name: formData.company_name,
      position_type_id: formData.position_type_id
    }
    editCompanyFirstStepApi(params).then(() => {
      wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?from=company&action=edit`})
      wx.removeStorageSync('createdCompany')
    })
    // 创建公司后 重新编辑走加入公司逻辑  如果之前有一条加入记录 取之前的加入记录id
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

      hasApplayRecordApi().then(res => {
        let formData = this.data.formData
        if(res.data.id) {
          formData.applyId = res.data.id
          formData.id = res.data.companyId
          this.setData({formData}, () => this.editJoinCompany())
        } else {
          if(err.code === 990) {
            formData.id = err.data.companyId
            this.setData({formData}, () => this.joinCompany())
            return
          }
          app.wxToast({ title: err.msg })
        }
      })

    })
  },

  toChooseType () {
    let storage = wx.getStorageSync('createdCompany') || {}
    wx.setStorageSync('createdCompany', Object.assign(storage, this.data.formData))
    wx.navigateTo({url: `${COMMON}category/category`})
  }
})