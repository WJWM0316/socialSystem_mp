import{getCompanyOrglistApi} from '../../../../../api/pages/company.js'
import {COMMON} from '../../../../../config.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '\ue635 请输入机构名称',
    navH: app.globalData.navHeight,
    orgList: {
      list: [],
      pageNum: 0,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList () {
    let orgList = this.data.orgList,
        pageNum = orgList.pageNum++,
        parmas = {
          company_id: 1, // app.globalData.recruiterDetails.companyTopId
          page: orgList.pageNum
        }
    getCompanyOrglistApi(parmas).then(res => {
      orgList.list = orgList.list.concat(res.data)
      orgList.isRequire = true
      orgList.pageNum = parmas
      this.setData({orgList})
    })
  },
  roouteJump (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
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