// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editEducationApi, addEducationApi, deleteEducationApi } from '../../../../../../api/pages/center.js'
let target = null
let title = null
let nowEducateId = null // 当前编辑的意向数据id
const app = getApp()
let toToday = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    schoolName: '', // 学校名称
    subject: '', // 专业名
    startTime: '',
    endTime: '',
    description: '', // 学校经历描述
    education: '', // 学历
    degreeDesc: '', // 学历描述
    isAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id || app.globalData.resumeInfo.educations.length === 1) {
      this.setData({
        isAdd: true
      })
    }
    nowEducateId = parseInt(options.id)
    if (nowEducateId) {
      this.init()
    }
  },
  // 修改学校名字
  schoolName (e) {
    this.setData({schoolName: e.detail.value})
  },
  // 修改专业名称
  subject (e) {
    this.setData({subject: e.detail.value})
  },
  getresult (e) {
    if (e.currentTarget.dataset.time === 'start') {
      this.setData({startTime: e.detail.propsResult})
    } else if (e.currentTarget.dataset.time === 'end') {
      this.setData({endTime: e.detail.propsResult})
      if (!this.data.endTime) {
        toToday = true
      }
    } else {
      this.setData({education: e.detail.propsResult, degreeDesc: e.detail.propsDesc})
    }
  },
  // 编辑学校经历
  WriteContent (e) {
    this.setData({description: e.detail.value})
  },
  // 编辑保存
  save () {
    const param = {
      id: nowEducateId,
      school: this.data.schoolName,
      degree: this.data.education,
      major: this.data.subject,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      experience: this.data.description
    }
    let itemName = ''
    if (!param.school) {
      itemName = '请填写学校名称'
    } else if (param.school && (param.school.length < 2 || param.school.length > 50)) {
      itemName = '学校名称需为2-50个字'
    } else if (!param.degree) {
      itemName = '请选择学历'
    } else if (!param.major) {
      itemName = '请填写专业名称'
    } else if (param.major && (param.major.length < 2 || param.major.length > 50)) {
      itemName = '专业名称需为2-50个字'
    } else if (!param.startTime) {
      itemName = '请选择开始时间'
    } else if (!param.endTime && !toToday) {
      itemName = '请选择结束时间'
    } else if (param.endTime && param.startTime > param.endTime) {
      itemName = '开始时间不得晚于结束时间'
    } else if (param.experience && param.experience.length > 1000) {
      itemName = '在校经历输入需为1~1000字'
    }
    if (itemName) {
      app.wxToast({
        title: itemName
      })
      return
    }
    if (nowEducateId) {
      editEducationApi(param).then(res => {
        app.wxToast({
          title: '保存成功',
          icon: 'success',
          callback() {
            app.globalData.resumeInfo.educations.map((item, index) => {
              if (item.id === param.id) {
                app.globalData.resumeInfo.educations[index] = res.data
              }
            })
            wx.navigateBack({delta: 1}) 
          }
        }) 
      })
    } else {
      addEducationApi(param).then(res => {
        app.wxToast({
          title: '保存成功',
          icon: 'success',
          callback() {
            app.globalData.resumeInfo.educations.push(res.data)
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
        deleteEducationApi({id: nowEducateId}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.educations.map((item, index) => {
                if (item.id === nowEducateId) {
                  app.globalData.resumeInfo.educations.splice(index,1)
                  wx.navigateBack({delta: 1})
                }
              })
            }
          })
          
        })
      }
    })
  },
  init () {
    if (!nowEducateId) return
    app.globalData.resumeInfo.educations.map((item, index) => {
      if (item.id === nowEducateId) {
        this.setData({
          schoolName: item.school,
          subject: item.major,
          description: item.experience,
          startTime: item.startTime,
          endTime: item.endTime,
          education: item.degree,
          info: item,
          // degreeDesc: '中专/中技'
        })
        console.log(this.data)
        if (item.endTimeDesc === '至今') {
          toToday = true
        }
        return
      }
    })
  }
})