import {putCompanyInfoApi} from '../../../../../api/pages/company.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = app.globalData.companyInfo
    this.setData({options, info})
  },
  changeVal(e) {
    let info = this.data.info
    info.website = e.detail.value
    this.setData({info})
  },
  getResult(e) {
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'staffMembers':
        info.employees = e.detail.propsResult
        info.employeesInfo = e.detail.propsDesc
        break
      case 'avatar':
        info.logoInfo = e.detail[0]
        break
    }
    this.setData({info})
  },
  disabled() {
    app.wxToast({title: '已认证不可修改'})
  },
  saveInfo() {
    let info = this.data.info
    let data = {
      id: info.id,
      employees: info.employees,
      logo: info.logoInfo.id,
      website: info.website
    }
    putCompanyInfoApi(data).then(res => {
      app.wxToast({
        title: '保存成功',
        icon: "success",
        callback() {
          app.globalData.companyInfo = info
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