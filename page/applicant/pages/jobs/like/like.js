import {
  getMyCollectPositionsApi,
  getMyCollectUsersApi,
  deleteMycollectPositionApi,
  deleteMyCollectUserApi
} from '../../../../../api/pages/collect.js'

import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

const app = getApp()

Page({
  data: {
    hasReFresh: false,
    tab: 'positionList',
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    pageCount: 20,
    options: {},
    isJobhunter: app.globalData.isJobhunter,
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    recruiterList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
  },
  onLoad(options) {
    if (wx.getStorageSync('choseType') !== 'APPLICANT') {
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    if (options.tab ==='2') {
      this.setData({tab: 'recruiterList'})
    }
  },
  onShow() {
    let isJobhunter = this.data.isJobhunter
    if (app.getRoleInit) {
      isJobhunter = app.globalData.isJobhunter
    } else {
      app.getRoleInit = () => {
        isJobhunter = app.globalData.isJobhunter
      }
    }
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    const recruiterList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({positionList, recruiterList, isJobhunter}, () => this.getLists(false))
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   户取感兴趣列表
   * @return   {[type]}   [description]
   */
  getLists() {
    const api = this.data.tab === 'positionList' ? 'getCollectPositionsLists' : 'getCollectRecruiterListLists'
    return this[api]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的职位列表
   * @return   {[type]}   [description]
   */
  getCollectPositionsLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      getMyCollectPositionsApi(params).then(res => {
        const positionList = this.data.positionList
        positionList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的招聘官列表
   * @return   {[type]}   [description]
   */
  getCollectRecruiterListLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.recruiterList.pageNum, hasLoading}
      getMyCollectUsersApi(params).then(res => {
        const recruiterList = this.data.recruiterList
        recruiterList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        recruiterList.list = recruiterList.list.concat(res.data)
        recruiterList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        recruiterList.pageNum = recruiterList.pageNum + 1
        recruiterList.isRequire = true
        this.setData({recruiterList}, () => resolve(res))
      })
    })
  },
  onClickTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab}, () => {
      if(!this.data[tab].isRequire) this.getLists(false)
    })
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
    this.getLists().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
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
    const key = this.data.tab
    const value = this.data[key]
    if (!value.isLastPage) {
      if(this.data.tab === 'positionList') {
        let positionList = this.data.positionList
        positionList.onBottomStatus = 1
        this.setData({positionList})
      } else {
        let recruiterList = this.data.recruiterList
        recruiterList.onBottomStatus = 1
        this.setData({recruiterList})
      }
      this.getLists(false)
    }
  },
  routeJump(e) {
    let params = e.currentTarget.dataset
    if(this.data.tab === 'positionList') {
      wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
    } else {
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.uid}`})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  jump(e) {
    let type = e.currentTarget.dataset.type
    if(type === 'positionList') {
      wx.reLaunch({url: `${COMMON}homepage/homepage`})
    } else if (type === 'create') {
      wx.navigateTo({url: `${APPLICANT}createUser/createUser`})
    } else if (type === 'rank') {
      wx.navigateTo({url: `${COMMON}rank/rank`})
    }
  }
})