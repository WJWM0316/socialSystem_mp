import{getCompanyOrglistApi} from '../../../../../api/pages/company.js'
import {COMMON} from '../../../../../config.js'
const app = getApp()
let timer = null,
    keyword = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '\ue635 请输入机构名称',
    navH: app.globalData.navHeight,
    keyword: '',
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
  bindInput (e) {
    clearTimeout(timer)
    let value = e.detail.value
    keyword = value

    timer = setTimeout(() => {
      console.log(keyword)
      this.getList()
      clearTimeout(timer)
    }, 100)
  },
  getList () {
    let orgList = this.data.orgList,
        parmas = {
          company_id: app.globalData.recruiterDetails.companyTopId,
          keyword: keyword || ''
        }
    let chooseItem = wx.getStorageSync('orgData')
    getCompanyOrglistApi(parmas).then(res => {
      if (!res.data.length) return
      orgList = res.data
      if (chooseItem) {
        orgList.filter(item => {
          if (item.id === chooseItem.id) item.active = true
        })
      }
      this.setData({orgList})
    })
  },
  choose (e) {
    let index = e.currentTarget.dataset.index,
        item  = e.currentTarget.dataset.item,
        orgList = this.data.orgList
    orgList.forEach((item) => {
      if (item.active) item.active = false
    })
    orgList[index].active = true
    this.setData({orgList}, () => {
      wx.setStorageSync('orgData', item)
      wx.navigateBack({delta: 1})
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
    timer = null
    keyword = null
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