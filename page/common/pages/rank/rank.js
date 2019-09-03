import {
  getPostionApi,
  getCityLabelApi
} from '../../../../api/pages/common'

import {
  getRankApi,
  getOfficeRankApi,
  getCityRankApi
} from '../../../../api/pages/active'

import {shareRanking} from '../../../../utils/shareWord.js'

import {APPLICANT, COMMON} from '../../../../config.js'

import {getSelectorQuery} from "../../../../utils/util.js"

let app = getApp()
let identity = '',
    cityIndex = 0,
    cateIndex = 0
Page({
  data: {
    tab: 'rankAll',
    nowIndex: 0,
    jobLabel: [],
    cityLabel: [],
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    rankAll: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    },
    rankCate: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    },
    rankCity: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    },
    commonList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    },
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    area_id: '',
    cate_id: '',
    fixedHeight: '',
    showRules: false,
    identity: '',
    detail: {}
  },
  onLoad(options) {
    cityIndex = 0
    cateIndex = 0
    this.getFixedBoxHeight()
    identity = app.identification(options)
    this.setData({identity})
    if (app.loginInit) {
      this.setData({detail: app.globalData.recruiterDetails}, () => this.getLists().then(() => this.getSubmenuLists()))
    } else {
      app.loginInit = () => {
        this.setData({detail: app.globalData.recruiterDetails}, () => this.getLists().then(() => this.getSubmenuLists()))
      }
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-18
   * @detail   获取定位dom的高度
   * @return   {[type]}   [description]
   */
  getFixedBoxHeight() {
    getSelectorQuery('.fixed-box').then(res => {
      this.setData({fixedHeight: res.height})
    })
  },
  toRecruitment (e) {
    wx.navigateTo({
      url: `/page/common/pages/recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   父级菜单切换
   * @return   {[type]}     [description]
   */
  onTabClick(e) {
    let key = e.target.dataset.tab
    let value = this.data[key]
    let nowIndex = 0
    e.target.dataset.tab === 'rankCity' ? nowIndex = cityIndex : nowIndex = cateIndex
    this.setData({nowIndex, tab: key, commonList: value}, () => {
      if(!value.isRequire) {
        this.getLists()
      }
      this.getFixedBoxHeight()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   子菜单切换
   * @return   {[type]}         [description]
   */
  toggle(e) {
    let tab = this.data.tab === 'rankCity' ? 'area_id' : 'cate_id'
    let key = this.data.tab
    let value = this.data[key]
    value.pageNum = 1
    let params = e.currentTarget.dataset
    this.data.tab === 'rankCity' ? cityIndex = params.nowindex : cateIndex = params.nowindex
    this.setData({nowIndex: params.nowindex, [tab]: params.id, [key]: value}, () => {
      let key = this.data.tab
      let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      this.setData({[key]: value, commonList: value})
      this.getLists()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取职位榜单子菜单数据
   * @return   {[type]}   [description]
   */
  getJobLabelList () {
    return getPostionApi()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   获取城市榜单子菜单数据
   * @return   {[type]}   [description]
   */
  getCityLabel () {
    return getCityLabelApi()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取标签列表
   * @return   {[type]}   [description]
   */
  getSubmenuLists() {
    Promise.all([this.getCityLabel(), this.getJobLabelList()]).then(res => {
      this.setData({
        cityLabel: res[0].data,
        jobLabel: res[1].data,
        area_id: res[0].data[0].areaId,
        cate_id: res[1].data[0].labelId
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.tab) {
      case 'rankAll':
        return this.getRankAll()
        break;
      case 'rankCate':
        return this.getRankCate()
        break;
      case 'rankCity':
        return this.getRankCity()
        break;
      default:
        break;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职城市类型榜单列表
   * @return   {[type]}   [description]
   */
  getRankCity(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.rankCity.pageNum, area_id: this.data.area_id, ...app.getSource()}
      getCityRankApi(params, hasLoading).then(res => {
        let rankCity = this.data.rankCity
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        if (identity !== 'RECRUITER') {
          rankCity.list = rankCity.list.concat(res.data)
        } else {
          rankCity.list = rankCity.list.concat(res.data.data)
        }
        rankCity.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        rankCity.pageNum = rankCity.pageNum + 1
        rankCity.isRequire = true
        rankCity.rankDetail = res.data.rankDetail
        this.setData({rankCity, onBottomStatus, commonList: rankCity}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位类型榜单列表
   * @return   {[type]}   [description]
   */
  getRankCate(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.rankCate.pageNum, cate_id: this.data.cate_id, ...app.getSource()}
      getOfficeRankApi(params, hasLoading).then(res => {
        let rankCate = this.data.rankCate
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        if (identity !== 'RECRUITER') {
          rankCate.list = rankCate.list.concat(res.data)
        } else {
          rankCate.list = rankCate.list.concat(res.data.data)
        }
        rankCate.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        rankCate.pageNum = rankCate.pageNum + 1
        rankCate.isRequire = true
        rankCate.rankDetail = res.data.rankDetail
        this.setData({rankCate, onBottomStatus, commonList: rankCate}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取总榜单列表
   * @return   {[type]}   [description]
   */
  getRankAll(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.rankAll.pageNum, ...app.getSource()}
      getRankApi(params, hasLoading).then(res => {
        let rankAll = this.data.rankAll
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        if (identity !== 'RECRUITER') {
          rankAll.list = rankAll.list.concat(res.data)
        } else {
          rankAll.list = rankAll.list.concat(res.data.data)
        }
        rankAll.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        rankAll.pageNum = rankAll.pageNum + 1
        rankAll.isRequire = true
        rankAll.rankDetail = res.data.rankDetail
        this.setData({rankAll, onBottomStatus, commonList: rankAll}, () => resolve(res))
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
    let key = this.data.tab
    let value = {
      list: [], 
      pageNum: 1, 
      isLastPage: false, 
      isRequire: false,
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      }
    }
    this.setData({[key]: value, hasReFresh: true, commonList: value})
    this.getLists().then(res => {
      let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      if (identity !== 'RECRUITER') {
        value.list = res.data
      } else {
        value.list = res.data.data
        value.rankDetail = res.data.rankDetail
      }
      value.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      value.pageNum = 2
      value.isRequire = true
      this.setData({hasReFresh: false, [key]: value, onBottomStatus, commonList: value})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let key = this.data.tab
    let value = this.data[key]
    if (!value.isLastPage) {
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareRanking,
      path: `${COMMON}rank/rank`,
      imageUrl: `${this.data.cdnImagePath}ranking.png`
    })
  },
  toggleShowRules() {
    this.setData({showRules: !this.data.showRules})
  },
  stopPageScroll() {return false },
  viewYourself() {
    let detail = this.data.detail
    wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${detail.uid}`})
  }
})
