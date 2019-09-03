import {setManifestoApi,removeTopicApi } from '../../../../../api/pages/recruiter.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    options: {},
    info: {},
    limitNum: 1000
  },
  changeVal(e) {
    this.setData({
      content: e.detail.value
    })
  },
  backEvent() {
    if (this.data.content && this.data.content.length > 0) {
      app.wxConfirm({
        title: '放弃发布',
        content: '你编辑的招聘宣言尚未保存，确定放弃编辑吗？',
        confirmBack() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  remove() {
    let id = this.data.info.id
    getApp().wxConfirm({
      title: '删除招聘宣言',
      content: '招聘宣言删除后将无法恢复，是否确定删除？',
      confirmBack() {
        removeTopicApi({id}).then(res => {
          getApp().wxToast({
            title: '删除成功',
            icon: "success",
            callback() {
              let recruiterDetails = app.globalData.recruiterDetails
              recruiterDetails.manifestos.map((item, index) => {
                if (item.id === id) {
                  app.globalData.recruiterDetails.manifestos.splice(index, 1)
                  return
                }
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        })
      }
    })
  },
  saveInfo() {
    let that = this
    let data = {
      content: this.data.content
    }
    if (!this.data.content.trim()) {
      app.wxToast({
        title: `请填写面试官宣言`
      })
      return
    }
    if (this.data.content && this.data.content.length > this.data.limitNum) {
      app.wxToast({
        title: `招聘宣言不能少于${this.data.limitNum}个字`
      })
      return
    }
    if (this.data.options.topicId) {
      data.topicId = this.data.options.topicId
    } else {
      data.id = this.data.info.id
      data.topicId = this.data.info.topicId
    }
    setManifestoApi(data).then(res => {
      getApp().wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          wx.removeStorageSync('choseTopicData')
          let recruiterDetails = app.globalData.recruiterDetails
          if (data.id) {
            recruiterDetails.manifestos.map((item, index) => {
              if (item.id === data.id) {
                recruiterDetails.manifestos[index].content = data.content
                app.globalData.recruiterDetails = recruiterDetails
                return
              }
            })
          } else {
            recruiterDetails.manifestos.push(res.data)
          }
          let backPageNum = 1
          if (that.data.options.topicId) {
            backPageNum = 2
          } else {
            backPageNum = 1
          }
          wx.navigateBack({
            delta: backPageNum
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.topicId) {
      let info = this.data.info
      info.topicTitle = options.title
      this.setData({options, info})
    } else {
      let info = wx.getStorageSync('choseTopicData')
      let content = info.content
      this.setData({info, content})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})