import {
  getApplyjoinListApi
} from '../../../../../api/pages/recruiter.js'

import {RECRUITER} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    navH: app.globalData.navHeight,
    tab: 'list0',
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    list0: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    list1: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    list2: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    redDotInfos: {}
  },
  onLoad() {
    wx.setStorageSync('choseType', 'RECRUITER')
  },
  onShow() {
    let list0 = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let list1 = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    let list2 = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    app.getBottomRedDot().then(res => this.setData({redDotInfos: res.data}))
    this.setData({list0, list1, list2}, () => this.getLists())
  },
  onClickTab(e) {
    let tab = e.currentTarget.dataset.tab
    let redDotInfos = this.data.redDotInfos
    app.getBottomRedDot().then(res => this.setData({redDotInfos: res.data}))
    if(redDotInfos.applyAuditBar && tab !== 'list0') redDotInfos.applyAuditBar = 0
    this.setData({tab, redDotInfos})
    if(!this.data[tab].isRequire) this.getLists(false)
  },
  getLists() {
  	return this[`getApplyjoin${this.data.tab}`]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取待审核列表
   */
  getApplyjoinlist0(hasLoading = true) {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list0.pageNum, hasLoading, status: 0}
      getApplyjoinListApi(params).then(res => {
        const list0 = this.data.list0
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list0.list = list0.list.concat(res.data)
        list0.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list0.pageNum = list0.pageNum + 1
        list0.isRequire = true
        this.setData({list0, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取未通过列表
   */
  getApplyjoinlist2(hasLoading = true) {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list2.pageNum, hasLoading, status: 2}
      getApplyjoinListApi(params).then(res => {
        const list2 = this.data.list2
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list2.list = list2.list.concat(res.data)
        list2.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list2.pageNum = list2.pageNum + 1
        list2.isRequire = true
        this.setData({list2, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-02
   * @detail   获取已通过列表
   */
  getApplyjoinlist1(hasLoading = true) {
  	return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.list1.pageNum, hasLoading, status: 1}
      getApplyjoinListApi(params).then(res => {
        const list1 = this.data.list1
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list1.list = list1.list.concat(res.data)
        list1.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        list1.pageNum = list1.pageNum + 1
        list1.isRequire = true
        this.setData({list1, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const tab = this.data.tab
    const value = this.data[tab]
    if (!value.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    const key = this.data.tab
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true})
    app.getBottomRedDot().then(res => this.setData({redDotInfos: res.data}))
    this[`getApplyjoin${this.data.tab}`](false).then(res => {
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
  routeJump(e) {
    const params = e.currentTarget.dataset
    const list = this.data[this.data.tab].list
    const result = list.find((field, index, arr) => index === params.index)
    wx.navigateTo({url: `${RECRUITER}company/verifyResult/verifyResult?id=${result.id}`})
  }
})