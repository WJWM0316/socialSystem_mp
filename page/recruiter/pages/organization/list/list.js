import{getCompanyOrglistApi} from '../../../../../api/pages/company.js'
import {COMMON, RECRUITER} from '../../../../../config.js'
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
    cdnImagePath: app.globalData.cdnImagePath,
    isTopAdmin: app.globalData.isTopAdmin,
    choseType: wx.getStorageSync('choseType'),
    orgList: [],
    options: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
    this.getList()
  },
  bindInput (e) {
    clearTimeout(timer)
    let value = e.detail.value
    keyword = value
    timer = setTimeout(() => {
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
    getCompanyOrglistApi(parmas).then(res => {
      if (!res.data.length) return
      orgList = res.data
      this.setData({orgList})
    })
  },
  roouteJump (e) {
    let item = e.currentTarget.dataset.item,
        type = e.currentTarget.dataset.type
    switch (type) {
      case 'preview':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
        break
      case 'add':
        wx.navigateTo({url: `${RECRUITER}organization/add/add`})
        break
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
    timer = null
    keyword = null
  },

  onShareAppMessage(options) {
    let imageUrl = `${this.data.cdnImagePath}shareC.png`,
        companyInfos = options.target.dataset.item
    app.shareStatistics({type: 'company', infos: companyInfos, forwardType: 2})
　　return app.wxShare({
      options,
      btnTitle: `${companyInfos.companyName}正在招人，马上约面，极速入职！我在这里等你！`,
      btnPath: `${COMMON}homepage/homepage?companyId=${companyInfos.id}&sCode=${companyInfos.sCode}&sourceType=shc`,
      btnImageUrl: imageUrl
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})