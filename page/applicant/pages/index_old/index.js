import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import {getUserInfoApi} from '../../../../api/pages/user.js'

import { geMyBrowseUsersApi, getAvartListApi } from '../../../../api/pages/active.js'

import { getMyCollectUsersApi } from '../../../../api/pages/browse.js'

const app = getApp()

Page({
  data: {
    pageList: 'myBrowse',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    choseType: '',
    needLogin: false,
    myBrowse: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    myCollect: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    moreRecruiter: [],
    recruiterDynamic: [],
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    isFixed: true,
    background: 'transparent',
    fixedDomPosition: 0,
    fixedDom: false
  },
  onShow() {
    let choseType = wx.getStorageSync('choseType') || ''
    let that = this
    this.setData({choseType})
    if (choseType === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是面试官，是否切换面试官',
        confirmBack() {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack: () => {
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
          this.clearListsData()
          this.getLists().then(() => this.getDomNodePosition())
        }
      })
    }
    this.clearListsData()
    if (app.loginInit) {
      this.getLists().then(() => this.getDomNodePosition())
      this.getAvartList()
    } else {
      app.loginInit = () => {
        this.getLists().then(() => this.getDomNodePosition())
        this.getAvartList()
      }
    }
  },
  getDomNodePosition() {
    getSelectorQuery('.ul-tab-bar').then(res => {
      this.setData({fixedDomPosition: res.top - this.data.navH})
    })
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
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}              [description]
   */
  getMyBrowseList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.myBrowse.pageNum, ...app.getSource()}
      geMyBrowseUsersApi(params, hasLoading).then(res => {
        const myBrowse = this.data.myBrowse
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        myBrowse.list = myBrowse.list.concat(res.data)
        myBrowse.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        myBrowse.pageNum++
        myBrowse.isRequire = true
        this.setData({myBrowse, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   我感兴趣的
   * @return   {[type]}              [description]
   */
  getMyCollectList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.myCollect.pageNum, ...app.getSource()}
      getMyCollectUsersApi(params, hasLoading).then(res => {
        const myCollect = this.data.myCollect
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        myCollect.list = myCollect.list.concat(res.data)
        myCollect.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        myCollect.pageNum = myCollect.pageNum + 1
        myCollect.isRequire = true
        this.setData({myCollect, onBottomStatus}, () => resolve(res))
      })
    })
  },
  jump () {
    if (this.data.pageList === 'myBrowse') {
      wx.reLaunch({
        url: `${COMMON}careerChance/careerChance`
      })
    } else {
      wx.navigateTo({
        url: `${COMMON}rank/rank`
      })
    }
    
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取发现更多招聘官
   * @return   {[type]}   [description]
   */
  getAvartList() {
    getAvartListApi().then(res => {
      const moreRecruiter = res.data.moreRecruiter
      const recruiterDynamic = res.data.recruiterDynamic
      this.setData({moreRecruiter, recruiterDynamic})
    })
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
    this.setData({pageList}, () => {
      if(!value.isRequire) this.getLists()
    })
  },
  onShareAppMessage(options) {
　　return app.wxShare({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.pageList
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({[key]: value, hasReFresh: true})
    this.getLists().then(res => {
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
