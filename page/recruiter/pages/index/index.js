import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi,
  getCollectMySelfApi,
  getMyCollectUsersApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi,
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON, APPLICANT, WEBVIEW, VERSION} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'


import {
  getAdBannerApi
} from '../../../../api/pages/common'

let app = getApp()
let fixedDomPosition = 0,
    positionCard = null

Page({
  data: {
    pageList: 'collectMySelf',
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    choseType: '',
    browseMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    collectMySelf: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false,
      loading: false
    },
    pageCount: 20,
    background: 'transparent',
    hasReFresh: false,
    onBottomStatus: 0,
    isFixed: true,
    fixedDom: false,
    detail: {},
    welcomeWord: '',
    indexShowCount: {
      jobHunterInterestedToR: 0,
      recentInterview: 0,
      onlinePosition: 0,
      moreRecruiter: [],
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      },
      recruiterInterestedToJ: 0
    },
    banner: {},
    bannerIndex: 0,
    companyInfos: {}
  },
  // onLoad() {
  //   let choseType = wx.getStorageSync('choseType') || ''
  //   this.setData({ choseType})
  //   let that = this
  //   if (choseType === 'APPLICANT') {
  //     let that = this
  //     app.wxConfirm({
  //       title: '提示',
  //       content: '检测到你是求职者，是否切换求职者',
  //       confirmBack() {
  //         wx.reLaunch({url: `${COMMON}homepage/homepage`})
  //       },
  //       cancelBack() {
  //         wx.setStorageSync('choseType', 'RECRUITER')
  //         app.getAllInfo().then(res => {
  //           that.init()
  //         })
  //       }
  //     })
  //   }
  // },
  // onShow() {
  //   if (app.loginInit) {
  //     if (!app.globalData.hasLogin) {
  //       wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
  //       return
  //     }
  //     this.init()
  //   } else {
  //     app.loginInit = () => {
  //       if (!app.globalData.hasLogin) {
  //         wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
  //         return
  //       }
  //       this.init()
  //     }
  //   }
  // },
  init () {
    if (wx.getStorageSync('choseType') === 'APPLICANT') return
    let collectMySelf = this.data.collectMySelf
    let browseMySelf = this.data.browseMySelf
    let userInfo = app.globalData.userInfo
    let pageList = this.data.pageList
    let value = this.data[pageList]
    if (app.pageInit) {
      userInfo = app.globalData.userInfo
      let companyInfos = app.globalData.recruiterDetails.companyInfo
      this.getDomNodePosition()
      this.getMixdata()
      if(!wx.getStorageSync('isReback') && !value.list.length) this.getLists()
      wx.removeStorageSync('isReback')
      this.setData({userInfo, companyInfos})
      this.selectComponent('#bottomRedDotBar').init()
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        let companyInfos = app.globalData.recruiterDetails.companyInfo
        this.getDomNodePosition()
        this.getMixdata()
        if(!wx.getStorageSync('isReback') && !value.list.length) this.getLists()
        wx.removeStorageSync('isReback')
        this.setData({userInfo, companyInfos})
        this.selectComponent('#bottomRedDotBar').init()
      }
    }
  },
  getMixdata() {
    this.getIndexShowCount().then(() => this.getBanner())
    this.getWelcomeWord()
  },
  getBanner () {
    return getAdBannerApi({location: 'recruiter_index', hasLoading: false}).then(res => {
      let banner = res.data
      this.setData({banner})
    })
  },
  getDomNodePosition() {
    return getSelectorQuery('.default').then(res => {
      if(!fixedDomPosition) fixedDomPosition = res.top - this.data.navH
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists(hasLoading) {
    if(this.data.pageList !== 'collectMySelf') {
      return this.getBrowseMySelf(hasLoading)
    } else {
      return this.getCollectMySelf(hasLoading)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}   [description]
   */
  getBrowseMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.browseMySelf.pageNum, ...app.getSource()}
      getBrowseMySelfApi(params, hasLoading).then(res => {
        let browseMySelf = this.data.browseMySelf
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        browseMySelf.list = browseMySelf.list.concat(res.data)
        browseMySelf.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        // if(browseMySelf.pageNum === res.meta.currentPage) return
        browseMySelf.pageNum = browseMySelf.pageNum + 1
        browseMySelf.isRequire = true
        browseMySelf.total = res.meta.total
        this.setData({browseMySelf, onBottomStatus}, () => resolve(res))
      }).catch(() => reject())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getCollectMySelf(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.collectMySelf.pageNum, ...app.getSource()}
      let collectMySelf = this.data.collectMySelf
      collectMySelf.loading = true
      this.setData({collectMySelf})
      getCollectMySelfApi(params, hasLoading).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data
        collectMySelf.isLastPage = res.meta.nextPageUrl ? false : true
        collectMySelf.pageNum = collectMySelf.pageNum + 1
        collectMySelf.isRequire = true
        collectMySelf.loading = false
        list = this.appendData(list, collectMySelf)
        collectMySelf.list = collectMySelf.list.concat(list)
        this.setData({collectMySelf, onBottomStatus}, () => resolve(res))
      }).catch(() => reject())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-14
   * @detail   追加数据
   * @return   {[type]}   [description]
   */
  appendData(list, collectMySelf) {
    let detail = this.data.detail
    let data = list
    let item = {}
    if(!collectMySelf.isUse) {
      if(data.length) {
        if(!detail.positionNum) item.myType = 1
        if(detail.positionNum) item.myType = 2
        if(data.length <= 7) {
          collectMySelf.isUse = true
          this.setData({collectMySelf})
          data.push(item)
        } else {
         if(collectMySelf.isLastPage) {
          data.push(item)
          collectMySelf.isUse = true
          this.setData({collectMySelf})
         }
        }
      }
    }
    return data
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-13
   * @detail   tqb切换
   * @return   {[type]}     [description]
   */
  ontabClick(e) {
    let pageList = e.currentTarget.dataset.key
    let browseMySelf = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    let collectMySelf = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      isUse: false
    }
    wx.pageScrollTo({scrollTop: 0})
    this.setData({ pageList }, () => {
      let indexShowCount = this.data.indexShowCount
      if(pageList === 'browseMySelf') {
        if(!this.data.browseMySelf.isRequire || indexShowCount.viewCount) {
          indexShowCount.viewCount = 0
          this.setData({browseMySelf, indexShowCount}, () => this.getLists(true))
        }
      } else if (!this.data.collectMySelf.isRequire) {
        this.getLists(true)
      }
    })
  },
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'APPLICANT') {
        resolve()
        return
      }
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({indexShowCount: res.data, detail: res.data.recruiterInfo}, () => resolve(res))
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
    let key = this.data.pageList
    let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false, isUse: false, loading: false}
    this.setData({[key]: value, hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
    Promise.all([this.getDomNodePosition(), this.getMixdata(), this.getLists()]).then(res => {
      let value = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      let onBottomStatus = res[2].meta && res[2].meta.nextPageUrl ? 0 : 2
      value.list = res[2].data
      value.isLastPage = res[2].meta && res[2].meta.nextPageUrl ? false : true
      value.pageNum = 2
      value.isRequire = true
      value.total = res[2].meta.total
      wx.stopPullDownRefresh()
      this.setData({[key]: value, onBottomStatus, fixedDom: false, hasReFresh: false})
    }).catch(() => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      btnTitle: `${this.data.companyInfos.companyShortname}正在招聘，马上约面，极速入职！我在店长多多等你！`,
      btnImageUrl: positionCard,
      btnPath: `${COMMON}homepage/homepage?companyId=${this.data.companyInfos.id}`
    })
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if(e.scrollTop > 10) {
      if (this.data.background !== '#652791') this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.background !== 'transparent') this.setData({isFixed: false, background: 'transparent'})
    }
    if(e.scrollTop > fixedDomPosition) {
      if(!this.data.fixedDom) this.setData({fixedDom: true})
    } else {
      if(this.data.fixedDom) this.setData({fixedDom: false})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    let uid = this.data.detail.uid
    if(!Object.keys(params).length) return;
    if(params.type === 1) {
      wx.reLaunch({url: `${RECRUITER}position/index/index`})
    } else if(params.type === 2) {
      wx.setStorageSync('isReback', 'yes')
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
    } else {
      wx.setStorageSync('isReback', 'yes')
      if(params.type === 'clearRedDot') {
        clearReddotApi({jobHunterUid: params.jobhunteruid, reddotType: 'red_dot_recruiter_view_item'}).then(() => {
          wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        })
      } else {
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
      }
    }
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    switch(route) {
      case 'interested':
        wx.navigateTo({url: `${RECRUITER}dynamics/dynamics?tab=viewList`})
        break
      case 'interview':
        wx.reLaunch({url: `${RECRUITER}interview/index/index?tabIndex=2`})
        break
      case 'position':
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        break
      case 'rank':
        wx.navigateTo({url: `${COMMON}rank/rank`})
        break
      case 'recruiter':
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.detail.uid}`})
        break
      case 'adviser':
        wx.navigateTo({url: `${RECRUITER}user/adviser/adviser`})
        break
      case 'companyPoster':
        this.share()
        wx.setStorageSync('companyPosterdata', app.globalData.recruiterDetails.companyInfo)
        break
      case 'receiveData':
        wx.reLaunch({url: `${RECRUITER}interview/index/index`})
        break
      case 'dynamics':
        wx.reLaunch({url: `${RECRUITER}dynamics/dynamics`})
        break
      case 'publicPosition':
        wx.reLaunch({url: `${RECRUITER}position/post/post`})
        break
      case 'qr-mechanism':
        wx.reLaunch({url: `${RECRUITER}createQr/createQr?type=qr-mechanism`})
        break
      case 'qr-position':
        wx.reLaunch({url: `${RECRUITER}createQr/createQr?type=qr-position`})
        break
      case 'qr-recruiter':
        wx.reLaunch({url: `${RECRUITER}createQr/createQr?type=qr-recruiter`})
        break
      default:
        break
    }
  },
  share() {
    this.selectComponent('#shareBtn').oper()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-10
   * @detail   根据时间显示不同的问候
   * @return   {[type]}   [description]
   */
  getWelcomeWord() {
    let d = new Date()
    if(d.getHours() >= 6 && d.getHours() < 12) {
      this.setData({welcomeWord: '早上好'})
    } else if(d.getHours() >= 12 && d.getHours() < 14) {
      this.setData({welcomeWord: '中午好'})
    } else if(d.getHours() >= 14 && d.getHours() < 18) {
      this.setData({welcomeWord: '下午好'})
    } else {
      this.setData({welcomeWord: '晚上好'})
    }
  },
  autoplay (e) {
    this.setData({bannerIndex: e.detail.current})
  },
  toJump(e) {
    let url = '/'+e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  todoAction(e) {
    let params = e.currentTarget.dataset
  }
})
