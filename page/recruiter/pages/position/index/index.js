import {
  getRecruiterPositionListApi,
  getPositionListNumApi,
  getPositionCompanyTopListApi,
  getCompanyTopPositionListNumApi
} from '../../../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../../../config.js'
import {sharePosition} from '../../../../../utils/shareWord.js'
let app = getApp()
let positionCard = ''
    
Page({
  data: {
    navH: app.globalData.navHeight,
    positionStatus: '1',
    onLinePositionNum: 0,
    onBottomStatus: 0,
    offBottomStatus: 0,
    isSuper: 1,
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

    let setOrg = () => {
      if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
        if (app.setOrgInit) {
          this.getPositionListNum()
          this.getLists()
        } else {
          app.setOrgInit = () => {
            this.getPositionListNum()
            this.getLists()
          }
        }
      } else {
        this.getPositionListNum()
        this.getLists()
      }
    }

    if(app.pageInit) {
      this.setData({detail: app.globalData.recruiterDetails, onLinePosition, offLinePosition}, () => {
        this.selectComponent('#bottomRedDotBar').init()
        setOrg()
      })
    } else {
      app.pageInit = () => {
        this.setData({detail: app.globalData.recruiterDetails, onLinePosition, offLinePosition}, () => {
          this.selectComponent('#bottomRedDotBar').init()
          setOrg()
        })
      }
    }
    
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-10
   * @detail   获取各种职位的数量
   * @return   {[type]}   [description]
   */
  getPositionListNum() {
    let Api = this.data.detail.isCompanyTopAdmin ? getCompanyTopPositionListNumApi : getPositionListNumApi
    let orgData = wx.getStorageSync('orgData')
    let redDotInfos = {}
    let params = {
      recruiter: app.globalData.recruiterDetails.uid,
      ...app.getSource()
    }
    if(orgData) params = Object.assign(params, {companyId: orgData.id})
    return Api(params).then(res => {
      redDotInfos = app.globalData.redDotInfos
      this.setData({
        onLinePositionNum: res.data.online,
        redDotInfos
      })
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
  getLists(hasLoading = true) {
    let Api = this.data.positionStatus === '1' ? 'getOnlineLists' : 'getOffLineLists'
    return this[Api](hasLoading)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取在线职位
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
        count: 20,
        page: onLinePosition.pageNum,
        hasLoading
      }
      //加个机构id
      if(this.data.detail.isCompanyTopAdmin) {
        if(orgData) params = Object.assign(params, {company_id: orgData.id})
      }
      Api(params).then(res => {
        onLinePosition.list = onLinePosition.list.concat(res.data || [])
        onLinePosition.pageNum++
        onLinePosition.isRequire = true
        onLinePosition.isLastPage = !res.meta || !res.meta.nextPageUrl ? true : false
        onBottomStatus = !res.meta || !res.meta.nextPageUrl ? 2 : 0
        this.setData({onLinePosition, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-10
   * @detail   获取下线职位
   * @param    {Boolean}  hasLoading [description]
   * @return   {[type]}              [description]
   */
  getOffLineLists(hasLoading = true) {
    let Api = this.data.detail.isCompanyTopAdmin ? getPositionCompanyTopListApi : getRecruiterPositionListApi
    return new Promise((resolve, reject) => {

      let offLinePosition = this.data.offLinePosition
      let offBottomStatus = this.data.offBottomStatus
      let orgData = wx.getStorageSync('orgData')
      let params = {
        is_online: 2,
        count: 20,
        page: offLinePosition.pageNum,
        hasLoading
      }
      //加个机构id
      if(this.data.detail.isCompanyTopAdmin) {
        if(orgData) params = Object.assign(params, {company_id: orgData.id})
      }
      Api(params).then(res => {
        offLinePosition.list = offLinePosition.list.concat(res.data || [])
        offLinePosition.pageNum++
        offLinePosition.isRequire = true
        offLinePosition.isLastPage = !res.meta || !res.meta.nextPageUrl ? true : false
        offBottomStatus = !res.meta || !res.meta.nextPageUrl ? 2 : 0
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
  /**
   * @Author   小书包
   * @DateTime 2019-09-10
   * @detail   子级tab栏切换
   * @return   {[type]}     [description]
   */
  onClickTab(e) {
    let positionStatus = e.currentTarget.dataset.status
    let value = positionStatus === '2' ? this.data.offLinePosition : this.data.onLinePosition
    this.setData({positionStatus}, () => this.selectComponent('#bottomRedDotBar').init())
    if(!value.isRequire) this.getLists(false)
  },
  getResult(e) {
    this.setData({redDotInfos: e.detail})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载
   * @return   {[type]}     [description]
   */
  onReachBottom(e) {
    let key = this.data.positionStatus == '1' ? 'onLinePosition' : 'offLinePosition'
    let value = this.data[key]
    if(!value.isLastPage) this.setData({onBottomStatus: 1}, () => this.getLists(false))
  },
  onPullDownRefresh(e) {
    let callback = () => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    }

    let key = this.data.positionStatus == '1' ? 'onLinePosition' : 'offLinePosition'

    let value = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    
    this.setData({[key]: value, onBottomStatus: 0, hasReFresh: true}, () => app.getBottomRedDot())
    this.getLists(false).then(() => callback()).catch(() => callback())
    this.getPositionListNum()
  },
  onShareAppMessage(options) {
    let id = options.target.dataset.id
　　return app.wxShare({
      options,
      btnTitle: sharePosition(),
      btnPath: `${COMMON}positionDetail/positionDetail?positionId=${id}&sCode=${this.data.detail.sCode}&sourceType=shp`,
      btnImageUrl: positionCard
    })
  }
})
