import {
  createPositionApi,
  editPositionApi,
  getPositionApi
} from '../../../../../api/pages/position.js'

import {
  applyInterviewApi
} from '../../../../../api/pages/interview.js'

import {realNameReg, emailReg, positionReg} from '../../../../../utils/fieldRegular.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    formData: {
      position_name: '',
      lng: '',
      lat: '',
      area_id: '',
      address: '',
      doorplate: '',
      address_id: '',
      type: '',
      typeName: '',
      labels: [],
      emolument_min: '',
      emolument_max: '',
      emolument_range: '请选择薪资范围',
      work_experience: '',
      work_experience_name: '请选择经验要求',
      education: '25',
      educationName: '本科',
      describe: '',
      company_id: ''
    },
    query: {},
    pageTitle: '',
    canClick: false,
    showScanBox: false,
    options: {},
    detail: app.globalData.recruiterDetails
  },
  onLoad(options) {
    this.setData({pageTitle: options.positionId ? '编辑职位' : '发布职位', query: options})
  },
  onShow() {
    this.getUpdateInfos()
  },
  backEvent() {
    if(this.data.query.positionId) {
      app.wxConfirm({
        title: '放弃修改',
        content: '你编辑的职位尚未保存，确定放弃编辑吗？',
        cancelText: '放弃',
        confirmText: '继续编辑',
        cancelBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        },
      })
    } else {
      app.wxConfirm({
        title: '温馨提示',
        content: '离开当前页面，已填写的数据将会丢失，确认放弃发布吗？',
        cancelText: '放弃',
        confirmText: '继续编辑',
        cancelBack() {
          wx.removeStorageSync('createPosition')
          wx.navigateBack({delta: 1})
        }
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   获取编辑页面的信息
   * @param    {[type]}   options [description]
   * @return   {[type]}           [description]
   */
  getUpdateInfos() {
    let options = this.data.query
    let formData = this.data.formData
    let storage = Object.assign(wx.getStorageSync('createPosition'))
    let orgData = wx.getStorageSync('orgData')
    if(orgData) formData.company_id = orgData.id
    if(
      storage.position_name
      || storage.area_id
      || storage.type
      || storage.typeName
      || storage.emolument_min
      || storage.emolument_max
      || storage.doorplate
      || storage.address
      || storage.describe
      || storage.work_experience
      || storage.lat
      || storage.lng
      || storage.address_id
      || storage.parentType
      || storage.company_id
    ) {
      formData.position_name = storage.position_name
      formData.area_id = storage.area_id
      formData.type = storage.type
      formData.typeName = storage.typeName
      formData.emolument_min = storage.emolument_min
      formData.emolument_max = storage.emolument_max
      formData.emolument_range =  storage.emolument_range
      formData.doorplate = storage.doorplate
      formData.address = storage.address
      formData.describe = storage.describe
      formData.work_experience = storage.work_experience
      formData.work_experience_name = storage.work_experience_name
      formData.lat = storage.lat
      formData.lng = storage.lng
      formData.address_id = storage.address_id
      formData.parentType = storage.parentType
      formData.company_id = storage.company_id
      this.setData({ formData }, () => this.bindButtonStatus())
      return
    }
    if(!Reflect.has(options, 'positionId')) return
    getPositionApi({id: options.positionId}).then(res => {
      let formData = {}
      let infos = res.data
      formData.position_name = storage.position_name || infos.positionName
      formData.area_id = storage.area_id || infos.areaId
      formData.type = storage.type || infos.type
      formData.typeName = storage.typeName || infos.typeName
      formData.emolument_min = storage.emolument_min || infos.emolumentMin
      formData.emolument_max = storage.emolument_max || infos.emolumentMax
      formData.emolument_range =  storage.emolument_range || `${formData.emolument_min * 1000}~${formData.emolument_max * 1000}元/月`
      formData.doorplate = storage.doorplate || infos.doorplate
      formData.address = storage.address || infos.address
      formData.describe = storage.describe || infos.describe
      formData.education = storage.education || infos.education
      formData.educationName = storage.educationName || infos.educationName
      formData.work_experience = storage.work_experience || infos.workExperience
      formData.work_experience_name = storage.work_experience_name || infos.workExperienceName
      formData.lng = storage.lng || infos.lng
      formData.lat = storage.lat || infos.lat
      formData.address_id = storage.address_id || infos.addressId
      formData.parentType = storage.parentType || infos.topPid
      if(orgData) formData.company_id = orgData.id
      this.setData({ formData }, () => this.bindButtonStatus())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-06
   * @detail   获取机构信息
   * @return   {[type]}     [description]
   */
  getMechanism(e) {
    let companyId = app.globalData.recruiterDetails.companyInfo.id
    let url = this.data.query.positionId
      ? `${RECRUITER}mechanism/list/list?positionId=${this.data.query.positionId}&companyId=${companyId}`
      : `${RECRUITER}mechanism/list/list?companyId=${companyId}`

    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data.formData)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let url = this.data.query.positionId
      ? `${RECRUITER}position/${route}/${route}?positionId=${this.data.query.positionId}`
      : `${RECRUITER}position/${route}/${route}`

    if(route === 'skills' && !this.data.type) {
      app.wxToast({title: '请先选择职业类型别'})
    } else {
      wx.navigateTo({ url })
      wx.setStorageSync('createPosition', this.data.formData)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  getPositionAddress() {
    let url = this.data.query.positionId
      ? `${RECRUITER}position/addressList/addressList?positionId=${this.data.query.positionId}&type=position&selected=1`
      : `${RECRUITER}position/addressList/addressList?type=position&selected=1`
      
    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data.formData)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   离开当前页面
   * @return   {[type]}     [description]
   */
  getCategory() {
    let url = this.data.query.positionId
      ? `${COMMON}category/category?positionId=${this.data.query.positionId}`
      : `${COMMON}category/category`
      
    wx.navigateTo({ url })
    wx.setStorageSync('createPosition', this.data.formData)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取薪资范围
   * @return   {[type]}     [description]
   */
  getSalary(e) {
    let formData = this.data.formData
    formData['emolument_min'] = parseInt(e.detail.propsResult[0])
    formData['emolument_max'] = parseInt(e.detail.propsResult[1])
    formData['emolument_range'] = e.detail.propsDesc
    this.setData({ formData })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取工作经验
   * @return   {[type]}     [description]
   */
  getExperience(e) {
    let formData = this.data.formData
    formData['work_experience'] = e.detail.propsResult
    formData['work_experience_name'] = e.detail.propsDesc
    this.setData({ formData })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-26
   * @detail   获取教育经历
   * @return   {[type]}     [description]
   */
  getEducation(e) {
    let formData = this.data.formData
    formData['education'] = e.detail.propsResult
    formData['educationName'] = e.detail.propsDesc
    this.setData({ formData })
  },
  submit() {
    let formData = {}
    let labels = []
    let action = this.data.query.positionId ? 'editPositionApi' : 'createPositionApi'
    let orgData = wx.getStorageSync('orgData')

    let params = [
      'position_name',
      'type',
      'area_id',
      'address',
      'labels',
      'doorplate',
      'emolument_min',
      'emolument_max',
      'work_experience',
      'education',
      'describe',
      'lng',
      'lat',
      'address_id'
    ]

    params.map(field => formData[field] = this.data.formData[field])
    formData.labels = JSON.stringify(labels)

    // 编辑要加机构id
    if(this.data.query.positionId) formData.id = this.data.query.positionId

    if(this.data.formData.address_id) {
      delete formData.lng
      delete formData.lng
      delete formData.lat
      delete formData.area_id
      delete formData.address
      delete formData.doorplate
    } else {
      delete formData.address_id
    }

    // 验证是否已经选择机构id
    let companyId = new Promise((resolve, reject) => {
      if(!this.data.formData.company_id) {
        reject('请选择机构id')
      } else {
        formData.company_id = orgData.id
        resolve()
      }
    })

    // 验证职位名称是否已经完善
    let positionName = new Promise((resolve, reject) => {
      if(!this.data.formData.position_name) {
        reject('请填写职位名称')
      } else {
        resolve()
      }
    })

    // 验证职位类型是否已经选择
    let positionType = new Promise((resolve, reject) => {
      if(!this.data.formData.type) {
        reject('请选择职位类别')
      } else {
        resolve()
      }
    })


    // 验证地址是否已经选择
    let positionAddress = new Promise((resolve, reject) => {
      if(!this.data.formData.address_id) {
        reject('请选择地址')
      } else {
        resolve()
      }
    })

    // 验证薪资是否已经选择
    let positionEmolument = new Promise((resolve, reject) => {
      if(!this.data.formData.emolument_min) {
        reject('请选择薪资范围')
      } else {
        resolve()
      }
    })

    // 验证经验是否已经选择
    let positionExperience = new Promise((resolve, reject) => {
      if(!this.data.formData.work_experience) {
        reject('请选择经验要求')
      } else {
        resolve()
      }
    })

    // 验证学历是否已经选择
    let positionEducation = new Promise((resolve, reject) => {
      if(!this.data.formData.education) {
        reject('请选择学历要求')
      } else {
        resolve()
      }
    })

    // 验证职位描述是否已经完善
    let positionDescribe = new Promise((resolve, reject) => {
      if(!this.data.formData.describe) {
        reject('请填写职位描述')
      } else {
        resolve()
      }
    })

    let checkLists = [
      positionName, 
      positionType, 
      positionAddress,
      positionEmolument,
      positionExperience,
      positionEducation,
      positionDescribe
    ]

    // 超管要加机构id
    if(this.data.detail.isCompanyTopAdmin) {
      checkLists = [companyId].concat(checkLists)
    } else {
      formData.company_id = app.globalData.recruiterDetails.companyInfo.id
    }

    Promise.all(checkLists).then(res => this[action](formData)).catch(err => app.wxToast({title: err}))
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   创建职位
   * @return   {[type]}   [description]
   */
  createPositionApi(formData) {
    createPositionApi(formData).then(res => {
      let options = this.data.options
      let params = {}
      let recruiterChatFirst = wx.getStorageSync('recruiter_chat_first')
      wx.removeStorageSync('createPosition')

      if(recruiterChatFirst) {
        params.jobhunterUid = recruiterChatFirst.jobhunterUid
        params.positionId = res.data.id
        this.applyInterview(params)
      } else {
        app.wxToast({
          title: '创建成功',
          icon: 'success',
          callback() {
            wx.navigateBack({delta: 1 })
          }
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-28
   * @detail   编辑职位
   * @return   {[type]}   [description]
   */
  editPositionApi(formData) {
    editPositionApi(formData).then(res => {
      wx.removeStorageSync('createPosition')
      wx.reLaunch({url: `${RECRUITER}position/index/index`})
      app.wxToast({title: '编辑成功', icon: 'success'})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-13
   * @detail   绑定按钮状态
   * @return   {[type]}   [description]
   */
  bindButtonStatus() {
    let infos = this.data.formData
    let canClick = infos.position_name
      && infos.type
      && infos.address_id
      && infos.emolument_min
      && infos.work_experience
      && infos.education
      && infos.describe
      ? true : false
    this.setData({canClick})
  },
  showTips() {
    this.setData({showScanBox: !this.data.showScanBox})
  },
  copy() {
    wx.setClipboardData({data: 'https://lieduoduo.com' })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-15
   * @detail   招聘官申请开撩
   * @return   {[type]}   [description]
   */
  applyInterview(params) {
    applyInterviewApi(params).then(res => {
      wx.removeStorageSync('recruiter_chat_first')
      wx.redirectTo({url: `${COMMON}arrangement/arrangement?id=${res.data.interviewId}`})
    })
  }
})