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
    options: {},
    showBtn: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showBtn = ['recruiter-org'].includes(options.type) && app.globalData.recruiterDetails.isCompanyTopAdmin && wx.getStorageSync('choseType') === 'RECRUITER'
    this.setData({options, showBtn}, () => this.getList())
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
    let options = this.data.options
    let orgList = this.data.orgList,
        parmas = {company_id: options.companyId }
        if(keyword) parmas.keyword = keyword
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
        wx.setStorageSync('orgData', item)
        if(app.globalData.recruiterDetails.isCompanyTopAdmin) {
          wx.navigateTo({url: `${RECRUITER}company/indexEdit/indexEdit?type=org&from=organization&companyId=${item.id}`})
        } else {
          wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
        }
        break
      case 'add':
        // this.selectComponent('#shareBtn').oper()
        wx.navigateTo({url: `${RECRUITER}organization/add/add`})
        break
      case 'path-mechanism':
        let homepageUrl = `${COMMON}homepage/homepage?companyId=${item.id}`.slice(1)
        app.wxConfirm({
          title: '成功生成链接',
          content: `链接为：${homepageUrl}`,
          confirmText: '复制链接',
          showCancel: false,
          showCancel: true,
          cancelText: '取消',
          cancelBack: () => {},
          confirmBack: () => {
            wx.setClipboardData({
              data: homepageUrl,
              success: () => {
                app.wxToast({
                  title: '成功复制链接',
                  callback() {
                    wx.navigateBack({delta: 1 })
                  }
                })
              }
            })
          }
        })
        break
    }
  },
  search() {
    wx.navigateTo({url: `${RECRUITER}organization/search/search`})
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
  }
})
