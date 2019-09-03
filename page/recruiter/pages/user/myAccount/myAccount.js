import {getMyAccoutApi, getOrdersListApi} from "../../../../../api/pages/recruiter.js"
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasReFresh: false,
    cdnPath: app.globalData.cdnImagePath,
    navHeight: app.globalData.navHeight,
    myAccount: {},
    ordersData: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      count: app.globalData.pageCount,
      onBottomStatus: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.setStorageSync('choseType') !== 'RECRUITER') wx.setStorageSync('choseType', 'RECRUITER')
    if (app.loginInit) {
      this.init()
    } else {
      app.loginInit = () => {
        this.init()
      }
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
  init () {
    this.getMyAccout()
    let ordersData = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      count: app.globalData.pageCount,
      onBottomStatus: 0
    }
    this.setData({ordersData})
    this.getOrdersList()
  },
  getMyAccout () {
    getMyAccoutApi().then(res => {
      this.setData({myAccount: res.data})
    })
  },
  getOrdersList (hasloding = true) {
    let ordersData = this.data.ordersData
    let parmas = {
      page: ordersData.pageNum,
      count: ordersData.count
    }
    return getOrdersListApi(parmas, hasloding).then(res => {
      ordersData.list = ordersData.list.concat(res.data)
      ordersData.pageNum++
      ordersData.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      ordersData.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      this.setData({ordersData})
    })
  },
  getMore () {
    app.wxConfirm({
      title: '获取多多币',
      content: '获取多多币，欢迎联系我们~',
      confirmText: '联系我们',
      confirmColor: '#652791',
      confirmBack () {
        wx.makePhoneCall({
          phoneNumber: app.globalData.telePhone
        })
      }
    })
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
    this.setData({hasReFresh: true}, () => {
      this.getMyAccout()
      let ordersData = {
        list: [],
        pageNum: 1,
        isLastPage: false,
        count: app.globalData.pageCount,
        onBottomStatus: 0
      }
      this.setData({ordersData})
      this.getOrdersList().then(res => {
        this.setData({hasReFresh: false})
        wx.stopPullDownRefresh()
      }).catch(() => {
        this.setData({hasReFresh: false})
        wx.stopPullDownRefresh()
      })
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let ordersData = this.data.ordersData
    if (ordersData.isLastPage) return
    ordersData.onBottomStatus = 1
    this.setData({ordersData}, () => {
      this.getOrdersList(false)
    })
  }
})