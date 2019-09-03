import {workContentReg} from '../../../../../utils/fieldRegular.js'
import {othersworkConTxtC} from '../../../../../utils/randomCopy.js'

const app = getApp()
let workContent = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowInputNum: 0,
    content: '',
    cdnImagePath: app.globalData.cdnImagePath,
    randomCopy: {},
    showCase: false // 是否展示例子
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({randomCopy: othersworkConTxtC()})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let content = wx.getStorageSync('workContent')
    let nowInputNum = this.data.nowInputNum
    workContent = ''
    if (content) {
      workContent = content
      this.setData({content, nowInputNum: content.length}, () => {
        wx.removeStorageSync('workContent')
      })
    }
  },
  /* 切换例子 */
  next () {
    this.setData({randomCopy: othersworkConTxtC()})
  },
  copyText() {
    wx.setClipboardData({data: this.data.randomCopy.txt })
  },
  /* 展示或关闭例子 */
  showPopups () {
    this.setData({
      showCase: !this.data.showCase
    })
  },
  /* 实时监听输入 */
  WriteContent (e) {
    workContent = e.detail.value
   this.setData({
    nowInputNum: e.detail.value.length
   })
  },
  send () {
    if (workContent) {
      if (this.data.nowInputNum < 10) {
        app.wxToast({title: '工作内容最少需要10个字以上'})
        return
      }
      wx.setStorageSync('workContent', workContent)
    } else {
      app.wxToast({title:'工作内容不能为空'})
      return
    }
    wx.navigateBack({
      delta: 1
    })
  }
})