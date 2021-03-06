
import {
  getSearchPositionListApi,
  getSearchMatchListApi
} from '../../../../api/pages/search.js'
import {COMMON, RECRUITER, APPLICANT} from '../../../../config.js'

const app = getApp()
let keyword = '',
    lastWord = '记录上一条搜索词',
    lock = false
Page({
  data: {
    tabIndex: 0,
    navH: app.globalData.navHeight,
    keyword: '',
    historyList: [],
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    pageCount: 20,
    thinkList: [],
    onBottomStatus: 0,
    hasFocus: false,
    focus: false,
  },
  onLoad() {
    this.setData({focus: true,historyList: wx.getStorageSync('searchPositionRecord')})
  },
  bindblur () {
    this.setData({hasFocus: false})
  },
  bindfocus () {
    this.setData({hasFocus: true})
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
  bindInput (e) {
    let positionList = this.data.positionList
    positionList.pageNum = 1
    keyword = e.detail.value.trim()
    this.setData({ keyword, positionList}, () => {
      if(!keyword) {
        this.setData({ thinkList: [], onBottomStatus: [], historyList: wx.getStorageSync('searchPositionRecord')})
      } else {
        this.debounce(this.getSearchMatchList, null, 100, null)
      }
    })
  },
  check(e) {
    let positionList = this.data.positionList
    keyword = e.currentTarget.dataset.name
    if(!keyword) return
    positionList.pageNum = 1
    positionList.list = []
    this.setData({ keyword, thinkList: [], positionList}, () => this.getPositionList())
  },
  getSearchMatchList() {
    if (!this.data.hasFocus) return
    getSearchMatchListApi({name: this.data.keyword}).then(res => {
      let thinkList = res.data
      thinkList.map(field => {
        field.html = field.name.replace(new RegExp(this.data.keyword,'g'),`<span style="color: #652791;">${this.data.keyword}</span>`)
        field.html = `<div>${field.html}</div>`
      })
      this.setData({ thinkList })
    })
  },
  getPositionList() {
    let params = {
      count: this.data.pageCount,
      page: this.data.positionList.pageNum,
      name: this.data.keyword,
      ...app.getSource()
    }
    return getSearchPositionListApi(params, false).then(res => {
      let positionList = this.data.positionList
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      positionList.list = positionList.list.concat(res.data)
      positionList.isLastPage = res.data.length === params.count || (res.meta && res.meta.nextPageUrl) ? false : true
      positionList.pageNum = positionList.pageNum + 1
      positionList.isRequire = true
      this.updateHistory(this.data.keyword)
      this.setData({positionList, onBottomStatus, thinkList: []})
    })
  },
  bindconfirm() {
    this.search()
  },
  updateHistory (word) {
    if (!this.data.keyword) return
    let searchPositionRecord = this.data.historyList || [],
        isRecordIndex= null
    // 判断该关键字是否已经存在，存在则位置提前，不存在则加到第一个
    searchPositionRecord.forEach((item, index) => { if (item.word === word) isRecordIndex = index })
    if (!isRecordIndex && isRecordIndex !== 0) {
      searchPositionRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    } else {
      searchPositionRecord.splice(isRecordIndex, 1)
      searchPositionRecord.unshift({word, type: !this.data.tabIndex ? 1 : 2})
    }
    if (searchPositionRecord.length > 7)  searchPositionRecord.pop(1)
    if (searchPositionRecord.length) {
      wx.setStorageSync('searchPositionRecord', searchPositionRecord)
      this.setData({historyList: searchPositionRecord})
    }
  },
  choseKeyWord (e) {
    let word = e.currentTarget.dataset.item.word,
        positionList = this.data.positionList
    keyword = word
    positionList.pageNum = 1
    this.updateHistory(keyword)
    this.setData({keyword, positionList}, () => this.getPositionList())
  },
  search () {
    let positionList = this.data.positionList
    keyword = this.data.keyword
    positionList.pageNum = 1
    positionList.list = []
    if(!keyword) {
      return
    }
    this.updateHistory(keyword)
    this.setData({keyword, positionList, thinkList: [], onBottomStatus: 0}, () => this.getPositionList())
  },
  removeHistory () {
    this.setData({historyList: []}, () => wx.removeStorageSync('searchPositionRecord'))
  },
  removeWord () {
    let positionList = this.data.positionList
    positionList.pageNum = 1
    positionList.list = []
    if (!keyword) return
    lastWord = keyword
    keyword = ''
    this.setData({keyword, focus: true, positionList, historyList: wx.getStorageSync('searchPositionRecord'), onBottomStatus: 0})
  },
  routeJump (e) {
    let route = e.currentTarget.dataset.route,
        item  = e.currentTarget.dataset.item
    switch (route) {
      case 'specialJob':
        wx.reLaunch({url: `${APPLICANT}specialJob/specialJob`})
        break
      case 'company':
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
        break
      case 'position':
        wx.navigateTo({
          url: `${COMMON}positionDetail/positionDetail?positionId=${item.id}`
        })
        break
    }
  },
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { positionList } = this.data
    if(!positionList.isLastPage) {
      this.setData({onBottomStatus: 1}, () => this.getPositionList())
    }    
  }
})