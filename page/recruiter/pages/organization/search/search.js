import {COMMON, RECRUITER} from '../../../../../config.js'
import {
  getSearchMatchCompanyListApi,
  getCompanyListApi
} from '../../../../../api/pages/search.js'

const app = getApp()
let timer = null,
    keyword = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    isTopAdmin: app.globalData.isTopAdmin,
    choseType: wx.getStorageSync('choseType'),
    options: {},
    showBtn: false,
    onbottomStatus: 0,
    thinkList: [],
    keyword: '',
    historyList: [],
    canSearch: true,
    hasFocus: false,
    orgListData: {
      list: [],
      pageNum: 1,
      count: 10,
      isLastPage: false,
      isRequire: false
    }
  },
  bindblur () {
    this.setData({hasFocus: false})
  },
  bindfocus () {
    this.setData({hasFocus: true})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({options, historyList: wx.getStorageSync('searchCompanyRecord')})
  },
  updateHistory (word) {
    if (!keyword) return
    let searchCompanyRecord = this.data.historyList || [],
        isRecordIndex= null
    // 判断该关键字是否已经存在，存在则位置提前，不存在则加到第一个
    searchCompanyRecord.forEach((item, index) => { if (item.word === word) isRecordIndex = index })
    if (!isRecordIndex && isRecordIndex !== 0) {
      searchCompanyRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    } else {
      searchCompanyRecord.splice(isRecordIndex, 1)
      searchCompanyRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    }
    if (searchCompanyRecord.length > 7)  searchCompanyRecord.pop(1)
    if (searchCompanyRecord.length) {
      wx.setStorageSync('searchCompanyRecord', searchCompanyRecord)
      this.setData({historyList: searchCompanyRecord})
    }
  },
  bindconfirm() {
    this.search()
  },
  choseKeyWord (e) {
    let orgListData = this.data.orgListData
    let word = e.currentTarget.dataset.item.word
    keyword = word
    this.updateHistory(keyword)
    orgListData.pageNum = 1
    this.setData({keyword, keyWordList: [], orgListData}, () => this.getList())
  },
  check(e) {
    let orgListData = this.data.orgListData
    keyword = e.currentTarget.dataset.name
    orgListData.pageNum = 1
    this.setData({ keyword, thinkList: [], orgListData }, () => this.getList())
  },
  removeWord () {
    this.setData({keyword: '', focus: true})
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
    if (!this.data.hasFocus) return
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
    keyword = e.detail.value
    if(!keyword) return
    this.setData({ keyword, canSearch: false }, () => this.debounce(this.getSearchMatchCompanyList, null, 100, null))   
  },
  search () {
    let orgListData = this.data.orgListData
    keyword = this.data.keyword
    if(!keyword) {
      return
    }
    orgListData.pageNum = 1
    this.updateHistory(keyword)
    this.setData({keyword, orgListData,thinkList: []}, () => this.getList())
  },
  removeHistory () {
    this.setData({historyList: []}, () => wx.removeStorageSync('searchCompanyRecord'))
  },
  getList () {
    let orgListData = this.data.orgListData
    let parmas = {
      page: orgListData.pageNum,
      count: orgListData.count,
      name: this.data.keyword
    }
    getCompanyListApi(parmas).then(res => {
      let onbottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      orgListData.pageNum++
      orgListData.isRequire = true
      orgListData.isLastPage = !res.meta || !res.meta.nextPageUrl ? true : false
      orgListData.list = res.data
      this.setData({onbottomStatus, orgListData, thinkList: []})
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
  onUnload() {
    timer = null
    keyword = null
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let orgListData = this.data.orgListData
    this.setData({orgListData})
    if(!orgListData.isLastPage) this.getList(false).then(() => this.setData({onBottomStatus: 1}))
  }
})