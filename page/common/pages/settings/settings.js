import {uploginApi} from "../../../../api/pages/auth.js"
import {COMMON,RECRUITER,APPLICANT} from '../../../../config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "面试官"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      this.setData({identity: "求职者"})
    } else {
      this.setData({identity: "面试官"})
    }
  },
  upLogin() {
    app.wxConfirm({
      title: '退出登录',
      content: `确定退出当前账号吗？`,
      confirmBack() {
        app.uplogin()
      }
    })
  },
  changeMobile() {
    wx.navigateTo({
      url: `${COMMON}changeMobile/changeMobile`
    })
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为${this.data.identity}身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
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

  }
})