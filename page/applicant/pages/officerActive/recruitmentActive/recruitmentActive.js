import {
  getBrowseMySelfApi,
  getMyBrowseUsersApi,
  getCollectMySelfApi
} from '../../../../../api/pages/active'
import { APPLICANT } from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    watchedList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    interestList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    active: 'watchedList',
    // pageCount: app.globalData.pageCount,
    pageCount: 8,
    hasReFresh: false,
    onBottomStatus: 0
  },
  onLoad() {
    wx.setStorageSync('choseType', 'APPLICANT')
  },
  onShow() {
    const watchedList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    const interestList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({watchedList, interestList})
    this.getLists()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   tab切换
   * @return   {[type]}     [description]
   */
  onTabClick (e) {
    const key = e.target.dataset.active
    const value = this.data[key]
    this.setData({active: key}, () => {
      if(!value.isRequire) this.getLists()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.active) {
      case 'watchedList':
        return this.getWatchedList()
        break;
      case 'interestList':
        return this.getInterestList()
        break;
      default:
        break;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取对我感兴趣的列表数据
   * @return   {[type]}              [description]
   */
 getInterestList (hasLoading = true) {
  return new Promise((resolve, reject) => {
    getCollectMySelfApi({page: this.data.interestList.pageNum, count: this.data.pageCount, ...app.getSource()}, hasLoading)
    .then(res => {
      const interestList = this.data.interestList
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      interestList.list = interestList.list.concat(res.data)
      interestList.pageNum = interestList.pageNum + 1
      interestList.list.isRequire = true
      interestList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      this.setData({interestList, onBottomStatus}, () => resolve(res))
    })
  })
 },
 /**
  * @Author   小书包
  * @DateTime 2019-01-22
  * @detail   获取看过我的列表数据
  * @return   {[type]}              [description]
  */
 getWatchedList (hasLoading = true) {
  return new Promise((resolve, reject) => {
    getBrowseMySelfApi({page: this.data.watchedList.pageNum, count: this.data.pageCount, ...app.getSource()}, hasLoading)
    .then(res => {
      const watchedList = this.data.watchedList
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      watchedList.list = watchedList.list.concat(res.data)
      watchedList.pageNum = watchedList.pageNum + 1
      watchedList.list.isRequire = true
      watchedList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      this.setData({watchedList, onBottomStatus}, () => resolve(res))
    })
  })
 },
 /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.active
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true})
    this.getLists()
        .then(res => {
          const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          value.list = res.data
          value.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          value.pageNum = 2
          value.isRequire = true
          this.setData({[key]: value, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
        }).catch(e => {
        wx.stopPullDownRefresh()
      })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const key = this.data.active
    const value = this.data[key]
    if (!value.isLastPage) {
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  
  jump () {
    wx.navigateTo({url: `${APPLICANT}officerActive/more/more`})
//  console.log('page/applicant/pages/officerActive/more/more')
  }
})