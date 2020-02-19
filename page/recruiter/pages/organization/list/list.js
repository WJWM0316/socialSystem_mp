import{getCompanyOrglistApi} from '../../../../../api/pages/company.js'
import {COMMON, RECRUITER} from '../../../../../config.js'
import {
  getSearchMatchCompanyListApi
} from '../../../../../api/pages/search.js'

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
    showBtn: false,
    onbottomStatus: 0,
    thinkList: [],
    keyword: '',
    historyList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let showBtn = ['recruiter-org'].includes(options.type) && app.globalData.recruiterDetails.isCompanyTopAdmin && wx.getStorageSync('choseType') === 'RECRUITER'
    this.setData({options, showBtn, historyList: wx.getStorageSync('searchRecord')}, () => {
      if( wx.getStorageSync('choseType') === 'RECRUITER') {
        this.getList()
      }
    })
  },
  updateHistory (word) {
    if (!keyword) return
    let searchRecord = this.data.historyList || [],
        isRecordIndex= null
    // 判断该关键字是否已经存在，存在则位置提前，不存在则加到第一个
    searchRecord.forEach((item, index) => { if (item.word === word) isRecordIndex = index })
    if (!isRecordIndex && isRecordIndex !== 0) {
      searchRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    } else {
      searchRecord.splice(isRecordIndex, 1)
      searchRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    }
    if (searchRecord.length > 7)  searchRecord.pop(1)
    if (searchRecord.length) {
      wx.setStorageSync('searchRecord', searchRecord)
      this.setData({historyList: searchRecord})
    }
  },
  choseKeyWord (e) {
    let word = e.currentTarget.dataset.item.word
    keyword = word
    this.updateHistory(keyword)
    this.setData({keyword, keyWordList: []}, () => this.getList())
  },
  check(e) {
    keyword = e.currentTarget.dataset.name
    this.setData({ keyword, thinkList: [] }, () => this.getList())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  getSearchMatchCompanyList() {
    getSearchMatchCompanyListApi({name: this.data.keyword}).then(res => {
      let thinkList = res.data
      thinkList.map(field => {
        field.html = field.name.replace(new RegExp(this.data.keyword,'g'),`<span style="color: #652791;">${this.data.keyword}</span>`)
        field.html = `<div>${field.html}</div>`
      })
      this.setData({ thinkList })
    })
  },
  bindInput (e) {
    let value = e.detail.value
    keyword = value
    this.setData({ keyword }, () => this.debounce(this.getSearchMatchCompanyList, null, 300, null))   
  },
  getList () {
    let options = this.data.options
    let orgList = this.data.orgList,
        parmas = {company_id: options.companyId },
        keyword = this.data.keyword
        if(keyword) parmas.keyword = keyword
    getCompanyOrglistApi(parmas).then(res => {
      let onbottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      orgList = res.data
      this.setData({orgList, onbottomStatus})
      this.updateHistory(this.data.keyword)
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