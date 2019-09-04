import {
  getBrowseMySelfApi,
  getCollectMySelfApi
} from '../../../../api/pages/browse.js'

import {
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON} from '../../../../config.js'

let app = getApp()

Page({
  data: {
    hasReFresh: false,
    tab: 'interestList',
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    pageCount: 20,
    options: {},
    isJobhunter: app.globalData.isJobhunter,
    interestList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    viewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    indexShowCount: {
      interestedNum: 0,
      viewNum: 0
    }
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
  },
  onShow() {
    this.getIndexShowCount()
    this.getLists()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.tab
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    this.setData({[key]: value, hasReFresh: true})
    this.getIndexShowCount()
    this.getLists().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let key = this.data.tab
    this.setData({onBottomStatus: 1})
    if (!this.data[key].isLastPage) this.getLists()
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    clearReddotApi({jobHunterUid: params.jobhunteruid, reddotType: params.type}).then(() => {
      wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
    })
  },
  onClickTab(e) {
    let tab = e.currentTarget.dataset.tab
    let indexShowCount = this.data.indexShowCount
    let interestList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    let viewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    if(tab === 'viewList') {
      indexShowCount.interestedNum = 0
    } else {
      indexShowCount.viewNum = 0
    }
    this.setData({tab, indexShowCount, interestList, viewList}, () => this.getLists())
  },
  routeJump(e) {
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    if(this.data.tab === 'interestList') {
      return this.getViewList()
    } else {
      return this.getInterestList()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}   [description]
   */
  getInterestList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.interestList.pageNum}
      getBrowseMySelfApi(params, hasLoading).then(res => {
        let interestList = this.data.interestList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        interestList.list = interestList.list.concat(res.data)
        interestList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        interestList.pageNum = interestList.pageNum + 1
        interestList.isRequire = true
        interestList.total = res.meta.total
        this.setData({interestList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getViewList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.viewList.pageNum}
      getCollectMySelfApi(params, hasLoading).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let viewList = this.data.viewList
        viewList.isLastPage = res.meta.nextPageUrl ? false : true
        viewList.pageNum = viewList.pageNum + 1
        viewList.isRequire = true
        viewList.list = viewList.list.concat(res.data)
        this.setData({viewList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({indexShowCount: res.data}, () => resolve(res))
      })
    })
  }
})