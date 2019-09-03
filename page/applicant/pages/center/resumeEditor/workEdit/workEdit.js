import { editCareerApi, addCareerApi, deleteCareerApi } from '../../../../../../api/pages/center.js'

import { APPLICANT, COMMON } from '../../../../../../config.js'

let target = null
let title = null
let info = null
//let list = []
const app = getApp()
let toToday = false // 是否至今
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '', // 旧工作经历的数据
    nowInputNum: 0,
    showCase: false, // 是否展示例子
    jobCategories: '',
    company: '',
    positionName: '',
    starTime: '',
    endTime: '',
    isAdd: false,
    duty: '',
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    positionTypeTopPid: '',
    positionTypeId: '' // 职位类别标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({options})
    if (!options.id || app.globalData.resumeInfo.careers.length === 1) {
      this.setData({
        isAdd: true
      })
    }
    if (this.data.options.id) {
      this.init()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (wx.getStorageSync('createPosition')) {
      let positionTypeTopPid = wx.getStorageSync('createPosition').parentType || []
      this.setData({jobCategories: wx.getStorageSync('createPosition'), positionTypeTopPid: positionTypeTopPid})
    }
  },
  onUnload: function () {
    if (!this.data.options.id) {
      wx.removeStorageSync('createPosition')
    }
  },
  /* 展示或关闭例子 */
  showPopups () {
    this.setData({
      showCase: !this.data.showCase
    })
  },
  /* 实时监听输入 */
  WriteContent (e) {
    this.setData({
      duty: e.detail.value,
      nowInputNum: e.detail.cursor
    })
  },
  // 修改编辑页标题
  setTitle (target) {
    switch (target) {
      case '3':
        title = "选择职位类别"
        break;
    }
  },
  /* 去选择页面(3、职位类别，4:技能标签) */
  choose (e) {
    target = e.currentTarget.dataset.type
    this.setTitle(target)
    if (target === '4') {
      if (!this.data.positionTypeTopPid) {
        app.wxToast({title: '请先选择职位类别'})
        return
      }
      wx.navigateTo({
        url: `${APPLICANT}center/resumeEditor/skills/skills?positionTypeTopPid=${this.data.positionTypeTopPid}`
      })
    } else {
      wx.navigateTo({
        url: `${COMMON}category/category?title=${title}`
      })
    }
  },
  // 输入公司名字
  inpCompany (e) {
    let company = e.detail.value
    this.setData({company})
  },
  // 输入职位
  inpPosition (e) {
    let positionName = e.detail.value
    this.setData({positionName})
    this.data.positionName = e.detail.value
  },
  getresult (e) {
    if (e.currentTarget.dataset.time === 'start') {
      this.data.starTime = e.detail.propsResult
    } else {
      this.data.endTime = e.detail.propsResult
      if (!this.data.endTime) {
        toToday = true
      }
    }
  },
  // 保存编辑
  save () {
    const param = {
      id: this.data.options.id,
      company: this.data.company,
      position: this.data.positionName,
      positionTypeId: this.data.jobCategories.type || this.data.positionTypeId,
      startTime: this.data.starTime,
      endTime: this.data.endTime,
      duty: this.data.duty
    }
    let itemName = ''
    if (!param.company) {
      itemName = '请填写公司名称'
    } else if (param.company && (param.company.length < 2 || param.company.length > 50)) {
      itemName = '公司名称需为2-50个字'
    } else if (!param.positionTypeId) {
      itemName = '请选择职位类型'
    } else if (!param.position) {
      itemName = '请填写职位名称'
    } else if (param.position && (param.position.length < 2 || param.position.length > 20)) {
      itemName = '职位名称需为2-20个字'
    } else if (!param.startTime) {
      itemName = '请选择开始时间'
    } else if (!param.endTime && !toToday) {
      itemName = '请选择结束时间'
    } else if (param.endTime && param.startTime > param.endTime) {
      itemName = '开始时间不得晚于结束时间'
    } else if (!param.duty) {
      itemName = '请填写工作内容'
    }
    if (itemName) {
      app.wxToast({
        title: itemName
      })
      return
    }
    if (this.data.options.id) {
      editCareerApi(param).then(res => {
        wx.removeStorageSync('createPosition')
        app.globalData.resumeInfo.careers.map((item,index) => {
          if (item.id === res.data.id) {
            app.globalData.resumeInfo.careers[index] = res.data
          }
        })
        app.wxToast({
          title: '保存成功',
          icon: 'success',
          callback() {
            wx.navigateBack({delta: 1}) 
          }
        })
      })
    } else {
      addCareerApi(param).then(res => {
        wx.removeStorageSync('createPosition')
        app.globalData.resumeInfo.careers.push(res.data)
        app.wxToast({
          title: '保存成功',
          icon: 'success',
          callback() {
            wx.navigateBack({delta: 1}) 
          }
        })
      })
    }
  },
  // 删除
  del () {
    let that = this
    app.wxConfirm({
      title: '删除工作经历',
      content: '工作经历删除后将无法恢复，是否确定删除？',
      confirmBack() {
        deleteCareerApi({id: that.data.options.id}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.careers.map((item, index) => {
                if (item.id === parseInt(that.data.options.id)) {
                  app.globalData.resumeInfo.careers.splice(index,1)
                  wx.navigateBack({delta: 1})
                  return
                }
              })
            }
          })
          
        })
      }
    })
  },
  /* 进入为编辑时初始化数据 */
  init () {
    app.globalData.resumeInfo.careers.map((item, index) => {
      if (item.id === parseInt(this.data.options.id)) {
        this.setData({
          company: item.company,
          positionName: item.position,
          duty: item.duty,
          starTime: item.startTime,
          endTime: item.endTime,
          jobCategories: item.positionType,
          positionTypeId: item.positionTypeId,
          positionTypeTopPid: item.positionTypeTopPid,
          info: item
        })
        if (item.endTimeDesc === '至今') {
          toToday = true
        }
      }
    })
  },
  onUnload() {
    wx.removeStorageSync('createPosition')
  }
})