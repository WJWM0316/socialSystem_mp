import { editExpectApi, addExpectApi, removeExpectApi } from '../../../../../../api/pages/center.js'
import {COMMON, APPLICANT} from '../../../../../../config.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    index: 0,
    options: {},
    isAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = this.data.info
    const id = parseInt(options.id)
    wx.removeStorageSync('createPosition')
    wx.removeStorageSync('result')
    if (id) {
      app.globalData.resumeInfo.expects.map((item, index) => {
        if (item.id === parseInt(options.id)) {
          this.setData({info: item, options, index})
          return
        }
      })
    }
    if (!id || app.globalData.resumeInfo.expects.length === 1) {
      this.setData({
        isAdd: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let result = wx.getStorageSync('skillsLabel')
    let info = this.data.info
    let position = wx.getStorageSync('createPosition')
    let addIntention = wx.getStorageSync('addIntention')
    if (result) {
      info.fields = result
      wx.removeStorageSync('skillsLabel')
    }
    if (position) {
      info.position = position.typeName
      info.positionId = position.type
      wx.removeStorageSync('createPosition')
    }
    if (info.fields) {
      wx.setStorageSync('skillsLabel', info.fields)
    }
    if (addIntention) {
      if (addIntention.positionType && addIntention.positionType !== 0) {
        info.position = addIntention.positionName
        info.positionId = addIntention.positionType
      }
      info.salaryFloor = addIntention.salaryFloor
      info.salaryCeil = addIntention.salaryCeil
      info.province = addIntention.provinceName
      info.city = addIntention.cityName
      info.cityNum = addIntention.city
      wx.removeStorageSync('addIntention')
    }
    this.setData({info})
  },
  onUnload: function () {
  },
  /* 去选择页面(0、选择城市，1、选择职位，2、选择领域) */
  choose (e) {
    let target = e.currentTarget.dataset.type
    if (target === '2') {
      wx.navigateTo({
        url: `${APPLICANT}center/resumeEditor/skills/skills?target=${target}`
      })
    } else if (target === '1') {
      wx.navigateTo({
        url: `${COMMON}category/category`
      })
    }
  },
  
  getresult (e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === "salaryRangeC") {
      info.salaryCeil = parseInt(e.detail.propsResult[1])
      info.salaryFloor = parseInt(e.detail.propsResult[0])
    } else {
      info.cityNum = e.detail.propsResult[1]
      info.city = e.detail.propsDesc[1]
      this.setData({info})
    }
  },
  // 保存修改
  save () {
    let info = this.data.info
    let fields = []
    let title = ''
    if (!info.cityNum) {
      title = '请选择期望城市'
    } else if (!info.positionId) {
      title = '请选择期望职位'
    } else if (!info.salaryCeil) {
      title = '请选择期望薪资'
    } else if (!info.fields || info.fields.length === 0) {
      title = '请选择期望领域'
    } 
    if (title) {
      app.wxToast({title})
      return
    }
    info.fields.map((item) => {
      if (item.fieldId) {
        fields.push(item.fieldId)
      } else {
        fields.push(item.labelId)
      }
    })
    const param = {
      id: this.data.options.id,
      cityNum: info.cityNum,
      positionId: info.positionId,
      salaryCeil: info.salaryCeil,
      salaryFloor: info.salaryFloor,
      fieldIds: fields.join(',')
    }
    if (!this.data.options.id) {
      addExpectApi(param).then(res => {
        if (!app.globalData.resumeInfo.expects) app.globalData.resumeInfo.expects = []
        app.globalData.resumeInfo.expects.push(res.data)
        app.wxToast({
          title: '发布成功',
          icon: 'success',
          callback() {
            app.globalData.hasExpect = 1
            wx.navigateBack({delta: 1}) 
          }
        })
      })
    } else {
      editExpectApi(param).then(res => {
        app.globalData.resumeInfo.expects[this.data.info] = info
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
      title: '删除求职意向',
      content: '求职意向删除后将无法恢复，是否确定删除？',
      confirmBack() {
        removeExpectApi({id: that.data.options.id}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.expects.map((item, index) => {
                if (item.id === parseInt(that.data.options.id)) {
                  app.globalData.resumeInfo.expects.splice(index,1)
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
  onUnload() {
  }
})