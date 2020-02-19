
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
    thinkList: []
  },
  onLoad() {
    this.setData({historyList: wx.getStorageSync('searchPositionRecord')})
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
  bindblur () {
    this.setData({hasFocus: false})
  },
  bindfocus () {
    this.setData({hasFocus: true})
  },
  bindInput (e) {
    let positionList = this.data.positionList
    positionList.pageNum = 1
    keyword = e.detail.value.trim()
    if (lastWord === keyword) return
    this.setData({ keyword, positionList}, () => this.debounce(this.getSearchMatchList, null, 300, null))    
  },
  check(e) {
    keyword = e.currentTarget.dataset.name
    this.setData({ keyword, thinkList: [] }, () => this.getPositionList())
  },
  getSearchMatchList() {
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
      this.setData({positionList, onBottomStatus})
    })
  },
  updateHistory (word) {
    if (!keyword) return
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
    this.setData({keyword, keyWordList: [], positionList}, () => this.getPositionList())
  },
  search () {
    let positionList = this.data.positionList
    keyword = this.data.keyword
    positionList.pageNum = 1
    if(!keyword) {
      return
    }
    this.updateHistory(keyword)
    this.setData({keyword, keyWordList: [], positionList}, () => this.getPositionList())
  },
  removeHistory () {
    this.setData({historyList: []}, () => wx.removeStorageSync('searchPositionRecord'))
  },
  removeWord () {
    if (!keyword) return
    lastWord = keyword
    keyword = ''
    this.setData({keyword, focus: true})
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