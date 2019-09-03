// page/applicant/pages/center/secondStep/secondStep.js
import { postSecondStepApi, postfirstStepApi } from '../../../../../api/pages/center'
import {APPLICANT,COMMON} from '../../../../../config.js'
let app = getApp()
let query = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    info: {
      companyName: '',
      positionType: {},
      startTimeDesc: '',
      endTimeDesc: '',
      duty: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let info = this.data.info
    let workContent = wx.getStorageSync('workContent')
    let createPosition = wx.getStorageSync('createPosition')
    let createUserSecond = wx.getStorageSync('createUserSecond')
    if (createUserSecond) {
      info = createUserSecond
    }
    info.duty = workContent
    info.positionType = createPosition
    this.setData({info})
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onHide: function () {
  },
  eidt () {
    wx.navigateTo({
     url: `${APPLICANT}center/workContent/workContent`
    })
  },
  jumpType() {
    wx.navigateTo({
     url: `${COMMON}category/category`
    })
  },
  getValue(e) {
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'companyName':
        info.companyName = e.detail.value
        break
      case 'position':
        info.position = e.detail.value
        break
    }
    this.setData({info})
  },
  getresult(val) {
    let info = this.data.info
    if (val.currentTarget.dataset.type === 'starTime') {
      info.starTime = val.detail.propsResult
      info.startTimeDesc = val.detail.propsDesc
    } else {
      info.endTime = val.detail.propsResult
      info.endTimeDesc = val.detail.propsDesc
    }
    this.setData({info})
  },
  submit() {
    let info = this.data.info
    let title = ''
    
    let data = {
      company: info.companyName,
      positionType: info.positionType.typeName,
      positionTypeId: info.positionType.type,
      position: info.position,
      startTime: info.starTime,
      endTime: info.endTime,
      duty: info.duty,
      apiVersion: 1
    }
    if (!info.companyName || info.companyName.length < 2) {
      title = '最近工作公司不能少于2个字'
    } else  if (info.companyName.length > 50) {
      title = '最近工作公司最多输入50字'
    } else if (!info.positionType.type) {
      title = '请选择职位类别'
    } else if (!info.position || info.position.length < 2) {
      title = '职位名称不能少于2个字'
    } else  if (info.position.length > 50) {
      title = '职位名称最多输入50字'
    } else if (!info.starTime) {
      title = '请选择开始时间'
    } else if (!info.endTime && info.endTime !== 0) {
      title = '请选择结束时间'
    } else if (!info.duty) {
      title = '请输入工作内容'
    }
    if (title) {
      app.wxToast({'title': title})
      return
    }
    postSecondStepApi(data).then(res => {
      wx.setStorageSync('createUserSecond', info)
      let path = ''
      if (query.directChat) {
        path = `${APPLICANT}center/educaExperience/educaExperience?directChat=${query.directChat}`
      } else {
        path = `${APPLICANT}center/educaExperience/educaExperience`
      }
      wx.navigateTo({
        url: path
      })
    })
  }
})