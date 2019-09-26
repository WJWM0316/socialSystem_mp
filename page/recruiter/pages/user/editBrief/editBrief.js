import {setBriefApi} from '../../../../../api/pages/recruiter.js'
import {othersBriefTxtB} from '../../../../../utils/randomCopy.js'

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    randomCopy: {}
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
        content: '你编辑的个人简介尚未保存，确定放弃编辑吗？',
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
  next() {
    this.setData({randomCopy: othersBriefTxtB()})
  },
  saveInfo() {
    if (this.data.content && this.data.content.length < 6) {
      app.wxToast({
        title: '个人简介不能少于6个字'
      })
      return
    }
    setBriefApi({brief: this.data.content}).then(res => {
      let that = this
      getApp().wxToast({
        title: '保存成功',
        icon: 'success',
        callback() {
          app.globalData.recruiterDetails.brief = that.data.content
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let content = app.globalData.recruiterDetails.brief
    this.setData({content, randomCopy: othersBriefTxtB()})
  },
  copyText() {
    wx.setClipboardData({data: this.data.randomCopy.txt })
  }
})