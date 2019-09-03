// page/applicant/pages/center/thirdStep/thirdStep.js
import { postThirdStepApi } from '../../../../../api/pages/center'
let degree = null,
    starTime = null,
    endTime = null,
    query = {},
    app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options
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

  },
  /* 学历选择结果 */
  getresult(val) {
    if (val.currentTarget.dataset.type === 'starTime') {
      starTime = val.detail.propsResult
    } else if (val.currentTarget.dataset.type === 'education') {
      degree = val.detail.propsResult
    } else {
      endTime = val.detail.propsResult
    }
  },
  formSubmit (e) {
    e.detail.value.degree = degree
    e.detail.value.startTime = starTime
    e.detail.value.endTime = endTime
    postThirdStepApi(e.detail.value).then(res => {
      app.globalData.isJobhunter = 1
      wx.removeStorageSync('createUserFirst')
      wx.removeStorageSync('createPosition')
      wx.removeStorageSync('workContent')
      wx.removeStorageSync('createUserSecond')
      app.getAllInfo().then(() => {
        app.wxToast({
          title: '创建成功',
          icon: 'success',
          callback() {
            let path = ''
            if (query.directChat) {
              path = `${decodeURIComponent(query.directChat)}&directChat=true`
            } else {
              path = '/page/applicant/pages/center/mine/mine'
            }
            wx.reLaunch({
              url: path
            })
          }
        })
        
      })
    })
  }
})