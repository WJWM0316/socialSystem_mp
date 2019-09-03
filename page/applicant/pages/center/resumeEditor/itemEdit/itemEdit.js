// page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit.js
import { editProjectApi, addProjectApi, deleteProjectApi } from '../../../../../../api/pages/center.js'
import { urlReg } from '../../../../../../utils/fieldRegular.js'
let target = null
let title = null
let nowItemId = null // 当前编辑的意向数据id
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '', // 当前编辑的项目旧数据
    itemName: '', //项目名称
    role: '', // 担任角色
    signory: '请选择领域',
    startTime: '',
    endTime: '',
    description: '', // 项目描述
    itemLink: '',
    isAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowItemId = parseInt(options.id)
    this.setData({options})
    if (!options.id || app.globalData.resumeInfo.projects.length === 1) {
      this.setData({
        isAdd: true
      })
    }
    if (options.id) {
      this.init()
    }
  },
  // 修改项目名称
  itemName (e) {
    this.data.itemName = e.detail.value
  },
  // 修改担任角色
  role (e) {
    this.data.role = e.detail.value
  },
  getresult (e) {
    if (e.currentTarget.dataset.time === 'start') {
      this.data.startTime = e.detail.propsResult
    } else {
      this.data.endTime = e.detail.propsResult
    }
  },
  writeContent (e) {
    this.setData({description: e.detail.value})
  },
  itemLink (e) {
    this.setData({itemLink: e.detail.value})
  },
  // 编辑保存
  save () {
    const param = {
      id: nowItemId,
      name: this.data.itemName,
      role: this.data.role,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      description: this.data.description,
      link: this.data.itemLink
    }
    let title = ''
    if (!param.name) {
      title = '请填写项目名称'
    } else if (param.name && (param.name.length < 2 || param.name.length > 50)) {
      title = '项目名称需为2-50个字'
    } else if (!param.role) {
      title = '请填写担任角色'
    } else if (param.role && (param.role.length < 2 || param.role.length > 50)) {
      title = '担任角色需为2-50个字'
    } else if (!param.startTime) {
      title = '请选择开始时间'
    } else if (!param.endTime && param.endTime !== 0) {
      title = '请选择结束时间'
    } else if (param.endTime && param.startTime > param.endTime) {
      title = '开始时间不得晚于结束时间'
    } else if (!param.description) {
      title = '请填写项目描述'
    } else if (param.description && (param.description.length < 6 || param.description.length > 1000)) {
      title = '项目描述需为6-1000个字'
    } else if (param.link && !urlReg.test(param.link)) {
      title = '请输入正确的链接'
    }
    if (title) {
      app.wxToast({title})
      return
    }
    if (nowItemId) {
      editProjectApi(param).then(res => {
        app.wxToast({
          title: '保存成功',
          icon: 'success',
          callback() {
            app.globalData.resumeInfo.projects.map((item, index) => {
              if (item.id === param.id) {
                app.globalData.resumeInfo.projects[index] = res.data
                return
              }
            })
            wx.navigateBack({delta: 1}) 
          }
        })
      })
    } else {
      addProjectApi(param).then(res => {
        app.globalData.resumeInfo.projects.push(res.data)
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
      title: '删除项目经历',
      content: '项目经历删除后将无法恢复，是否确定删除？',
      confirmBack() {
        deleteProjectApi({id: nowItemId}).then(res => {
          app.wxToast({
            title: '删除成功',
            icon: 'success',
            callback() {
              app.globalData.resumeInfo.projects.map((item, index) => {
                if (item.id === nowItemId) {
                  app.globalData.resumeInfo.projects.splice(index,1)
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
  init () {
    if (!nowItemId) return;
    app.globalData.resumeInfo.projects.map((item, index) => {
      if (item.id === nowItemId) {
        this.setData({
          itemName: item.name,
          role: item.role,
          description: item.description,
          itemLink: item.link,
          startTime: item.startTime,
          endTime: item.endTime,
          info: item
        })
        console.log(item)
        return
      }
    })
  }
})