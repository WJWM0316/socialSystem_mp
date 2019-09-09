import {
  getRecruiterPositionListApi,
  getPositionListNumApi,
  getPositionCompanyTopListApi
} from '../../../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

let app = getApp()
let identityInfos = {},
    offLinePositionNum = 0,
    positionCard = '',
    detail = {}
Page({
  data: {
    navH: app.globalData.navHeight,
    positionStatus: '1',
    onLinePositionNum: 0,
    onBottomStatus: 0,
    offBottomStatus: 0,
    isSuper: 1,
    detail: {},
    onLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    offLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    hasReFresh: false,
    telePhone: app.globalData.telePhone,
    options: {},
    redDotInfos: {},
    detail: app.globalData.recruiterDetails
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    if(Reflect.has(options, 'positionStatus')) this.setData({positionStatus: options.positionStatus})
  },
  onShow() {
    let onLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    let offLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    let redDotInfos = {}
    this.selectComponent('#bottomRedDotBar').init()
    getPositionListNumApi({
      recruiter: app.globalData.recruiterDetails.uid,
      ...app.getSource()
    }).then(res => {
      offLinePositionNum = res.data.offline
      redDotInfos = app.globalData.redDotInfos
      this.setData({
        onLinePosition,
        offLinePosition,
        onLinePositionNum: res.data.online,
        redDotInfos
      }, () => this.getLists())
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.positionStatus) {
      case '1':
        return this.getOnlineLists()
        break;
      case '2':
        return this.getOffLineLists()
        break;
      default:
        break;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getOnlineLists(hasLoading = true) {
    let Api = this.data.detail.isCompanyTopAdmin ? getPositionCompanyTopListApi : getRecruiterPositionListApi
    return new Promise((resolve, reject) => {
      let onLinePosition = this.data.onLinePosition
      let onBottomStatus = this.data.onBottomStatus
      let orgData = wx.getStorageSync('orgData')
      let params = {
        is_online: 1,
        count: onLinePosition.count,
        page: onLinePosition.pageNum,
        hasLoading
      }

      //加个机构id
      if(orgData) params = Object.assign(params, {company_id: orgData.id})
      Api(params).then(res => {
        onLinePosition.list = onLinePosition.list.concat(res.data || [])
        onLinePosition.pageNum++
        onLinePosition.isRequire = true
        if (!res.meta || !res.meta.nextPageUrl) {
          onLinePosition.isLastPage = true
          onBottomStatus = 2
        } else {
          onBottomStatus = 0
        }
        this.setData({onLinePosition, onBottomStatus}, () => resolve(res))
      })
    })
  },
  getOffLineLists(hasLoading = true) {
    let Api = this.data.detail.isCompanyTopAdmin ? getPositionCompanyTopListApi : getRecruiterPositionListApi
    return new Promise((resolve, reject) => {
      let offLinePosition = this.data.offLinePosition
      let offBottomStatus = this.data.offBottomStatus
      let orgData = wx.getStorageSync('orgData')
      let params = {
        is_online: 2,
        count: offLinePosition.count,
        page: offLinePosition.pageNum,
        hasLoading
      }

      //加个机构id
      if(orgData) params = Object.assign(params, {company_id: orgData.id})
      Api(params).then(res => {
        offLinePosition.list = offLinePosition.list.concat(res.data || [])
        offLinePosition.pageNum++
        offLinePosition.isRequire = true
        if (!res.meta || !res.meta.nextPageUrl) {
          offLinePosition.isLastPage = true
          offBottomStatus = 2
        } else {
          offBottomStatus = 0
        }
        this.setData({offLinePosition, offBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   detail
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    let params = e.currentTarget.dataset
    switch(params.action) {
      case 'add':
        wx.navigateTo({url: `${RECRUITER}position/post/post`})
        break
      case 'detail':
        wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionId}`})
        break
      case 'mechanism':
        wx.navigateTo({url: `${RECRUITER}mechanism/list/list`})
        break
      case 'fail':
        wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionId}&type=clear_red_dot`})
        break
      case 'poster-position':
        wx.navigateTo({
          url: `${COMMON}poster/createPost/createPost?type=positionMin&positionId=${params.positionId}`
        })
        break
      case 'poster-position-long':
        wx.navigateTo({
          url: `${COMMON}poster/createPost/createPost?type=position&positionId=${params.positionId}`
        })
        break
      case 'share':
        let detail = this.data.onLinePosition.list.find((field, index) => index === params.index)
        this.setData({detail}, () => detail = detail)
        break
      default:
        break
    }
  },
  /* 子级tab栏切换 */
  onClickTab(e) {
    let positionStatus = e.currentTarget.dataset.status
    this.selectComponent('#bottomRedDotBar').init()
    if(positionStatus === '2') {
      if(!this.data.offLinePosition.isRequire) this.getOffLineLists()
    } else {
      if(!this.data.onLinePosition.isRequire) this.getOnlineLists()
    }
    this.setData({positionStatus})
  },
  getResult(e) {
    this.setData({redDotInfos: e.detail})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   detail
   * @return   {[type]}     [description]
   */
  onReachBottom(e) {
    if (this.data.positionStatus === '1') {
      let onLinePosition = this.data.onLinePosition
      if(!onLinePosition.isLastPage) this.setData({onBottomStatus: 1}, () => this.getOnlineLists(false))
    } else {
      let offLinePosition = this.data.offLinePosition
      if(!offLinePosition.isLastPage) this.setData({offBottomStatus: 1}, () => this.getOffLineLists(false))
    }
  },
  onPullDownRefresh(e) {
    let callback = () => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    }
    let onLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    let offLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    if(this.data.positionStatus === '1') {
      this.setData({onLinePosition, onBottomStatus: 0, hasReFresh: true})
      this.getOnlineLists(false).then(res => callback()).catch(e => callback())
    } else {
      this.setData({offLinePosition, offBottomStatus: 0, hasReFresh: true})
      this.getOffLineLists(false).then(res => callback()).catch(e => callback())
    }
    app.getBottomRedDot()
  },
//   onShareAppMessage(options) {
// 　　return app.wxShare({options})
//   },
  onShareAppMessage(options) {
    let detail = this.data.detail
    console.log(detail, 'fffffff')
　　return app.wxShare({
      options,
      title: sharePosition(),
      path: `${COMMON}positionDetail/positionDetail?positionId=${that.data.query.positionId}&sCode=${detail.sCode}&sourceType=shp`,
      imageUrl: positionCard
    })
  }
})
