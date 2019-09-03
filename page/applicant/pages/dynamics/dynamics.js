import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import {getUserInfoApi} from '../../../../api/pages/user.js'

import { geBrowseMySelfApi, geMyBrowseUsersApi, getAvartListApi } from '../../../../api/pages/active.js'

import {getCollectMySelfApi} from '../../../../api/pages/collect.js'

import { getMyCollectUsersApi } from '../../../../api/pages/browse.js'

const app = getApp()

Page({
  data: {
    pageList: 'myBrowse',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    isJobhunter: app.globalData.isJobhunter,
    myBrowse: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    myCollect: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    moreRecruiter: [],
    recruiterDynamic: [],
    pageCount: 20,
    hasReFresh: false,
    isFixed: true,
    background: 'transparent',
    fixedDomPosition: 0,
    fixedDom: false,
    isIphoneX: app.globalData.isIphoneX,
    redDot: {}
  },
  onShow() {
    if (wx.getStorageSync('choseType') !== 'APPLICANT') {
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    this.clearListsData()
    if (app.getRoleInit) {
      this.init()
    } else {
      app.getRoleInit = () => {
        this.init()
      }
    }
  },
  init() {
    this.selectComponent('#bottomRedDotBar').init()
    this.setData({isJobhunter: app.globalData.isJobhunter, redDot: app.globalData.redDotInfos})
    this.getLists().then(() => this.getDomNodePosition())
  },
  getDomNodePosition() {
    getSelectorQuery('.ul-tab-bar').then(res => this.setData({fixedDomPosition: res.top - this.data.navH}))
  },
  clearListsData() {
    const myBrowse = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    const myCollect = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({myBrowse, myCollect})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.pageList) {
      case 'myBrowse':
        return this.getMyBrowseList()
        break;
      case 'myCollect':
        return this.getMyCollectList()
        break;
      default:
        break;
    }
  },
  getMyBrowseList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.myBrowse.pageNum, ...app.getSource()}
      geBrowseMySelfApi(params, hasLoading).then(res => {
        const myBrowse = this.data.myBrowse
        myBrowse.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        myBrowse.list = myBrowse.list.concat(res.data)
        myBrowse.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        myBrowse.pageNum++
        myBrowse.isRequire = true
        this.setData({myBrowse}, () => resolve(res))
      })
    })
  },
  getMyCollectList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.myCollect.pageNum, ...app.getSource()}
      getCollectMySelfApi(params, hasLoading).then(res => {
        const myCollect = this.data.myCollect
        myCollect.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        myCollect.list = myCollect.list.concat(res.data)
        myCollect.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        myCollect.pageNum = myCollect.pageNum + 1
        myCollect.isRequire = true
        this.setData({myCollect}, () => resolve(res))
      })
    })
  },
  jumpMy (e) {
    let url = ''
    switch (e.currentTarget.dataset.type) {
      case 'myBrowse':
        url = `${APPLICANT}dynamicsList/dynamicsList?type=myBrowse`
        break
      case 'myCollect':
        url = `${APPLICANT}jobs/like/like`
        break
      case 'create':
        url = `${APPLICANT}createUser/createUser`
        break
    }
    wx.navigateTo({url})
  },
  jump(e) {
    let type = e.currentTarget.dataset.type
    if(type === 'positionList') {
      wx.reLaunch({url: `${COMMON}homepage/homepage`})
    } else if (type === 'rank') {
      wx.navigateTo({url: `${COMMON}rank/rank`})
    } else if (type === 'create') {
      wx.navigateTo({url: `${APPLICANT}createUser/createUser`})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   tab切换
   * @return   {[type]}     [description]
   */
  onTabClick(e) {
    const pageList = e.currentTarget.dataset.key
    const key = e.currentTarget.dataset.key
    const value = this.data[key]
    this.selectComponent('#bottomRedDotBar').init()
    this.setData({pageList}, () => {
      if(!value.isRequire) this.getLists()
    })
  },
  getResult(e) {
    this.setData({redDot: e.detail})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.pageList
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    this.setData({[key]: value, hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
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
    const key = this.data.pageList
    const value = this.data[key]
    if (!value.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    let isFixed = e.scrollTop > this.data.navH
    if(e.scrollTop > this.data.navH - 5) {
      if (!this.data.isFixed) this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.isFixed) this.setData({isFixed: false, background: 'transparent'})
    }

    if(e.scrollTop > this.data.fixedDomPosition) {
      if (!this.data.fixedDom) this.setData({fixedDom: true})
    } else {
      if (this.data.fixedDom) this.setData({fixedDom: false})
    }
  }
})
