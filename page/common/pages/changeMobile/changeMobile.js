import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, changePhoneApi} from "../../../../api/pages/auth.js"
let mobileNumber = 0

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    phone: '',
    code: '',
    second: 60,
    choseType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let choseType = wx.getStorageSync('choseType')
    let mobile = app.globalData.resumeInfo.mobile || app.globalData.recruiterDetails.mobile
    this.setData({mobile, choseType})
  },
  getPhone(e) {
    mobileNumber = e.detail.value
    this.setData({
      phone: e.detail.value
    })
    this.isBlured = true
    if (this.callback) {
      this.callback()
    }
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode() {
    let sendFun = () => {
      if (!mobileNumber) {
        app.wxToast({
          title: '请填写手机号'
        })
        return
      }
      let data = {
        mobile: mobileNumber,
        type: 'change'
      }
      sendCodeApi(data).then(res => {
        this.isBlured = false
        this.callback = null
        let second = 60
        let timer = null
        app.wxToast({
          title: '验证码发送成功',
          icon: 'success'
        })
        timer = setInterval(() => {
          second--
          if (second === 0) {
            second = 60
            clearInterval(timer)
          }
          this.setData({second})
        }, 1000)
      })
    }
    if (this.isBlured) {
      sendFun()
    } else {
      this.callback = () => {
        sendFun()
      }
    }
  },
  bindPhone() {
    let data = {
      mobile: this.data.phone,
      code: this.data.code,
    }
    changePhoneApi(data).then(res => {
      app.wxToast({
        title: '修改成功',
        icon: 'success',
        callback() {
          if (app.globalData.resumeInfo) app.globalData.resumeInfo.mobile = res.data.mobile
          if (app.globalData.recruiterDetails) app.globalData.recruiterDetails.mobile = res.data.mobile
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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