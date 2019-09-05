import {RECRUITER, COMMON, APPLICANT} from '../../../../../config.js'

import {
  getScheduleListApi,
  getScheduleNumberApi,
  getNewScheduleNumberApi,
  clearDayInterviewRedDotApi,
  getInterviewRedDotBarApi
} from '../../../../../api/pages/interview.js'

let app = getApp()

let chooseTime = parseInt(new Date().getTime() / 1000)

Page({
  data: {
    navH: app.globalData.navHeight,
    hasReFresh: false,
    interviewData: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    dateList: [],
    interviewBottomStatus: 0,
    options: {},
    redDotInfos: {}
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-05
   * @detail   查看面试历史
   */
  jumpInterviewPage() {
    wx.navigateTo({url: `${RECRUITER}interview/history/history`})
  },
  getResult(e) {
    let params = e.currentTarget.dataset
    let dateList = this.data.dateList
    let interviewData = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    dateList.map((field, index) => {
      if(index === params.index) {
        field.active = true
        field.number = 0
      } else {
        field.active = false
      }
    })
    chooseTime = params.time
    this.clearDayInterviewRedDot(params.time)
    this.initTabRedDot()
    this.setData({interviewData, interviewBottomStatus: 0, dateList}, () => this.getScheduleList())
  },
  // 面试日程
  getScheduleList(hasLoading = true) {
    let interviewData = this.data.interviewData
    let interviewBottomStatus = 0
    return getScheduleListApi({count: interviewData.count, page: interviewData.pageNum, time: chooseTime}, hasLoading).then(res => {
      let list = res.data
      list.map(field => {
        let time = field.arrangementInfo.appointment.split(' ')[1].slice(0, 5)
        field.createdAtTime = time
      })
      interviewData.list.push(...list)
      interviewData.isRequire = true
      interviewData.total = res.meta.total
      interviewData.pageNum++
      if(!res.meta || !res.meta.nextPageUrl) {
        interviewData.isLastPage = true
        interviewBottomStatus = 2
      }
      this.setData({interviewData, interviewBottomStatus})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-28
   * @detail   获取面试日程的列表
   * @return   {[type]}   [description]
   */
  getNewScheduleNumber() {
    getNewScheduleNumberApi().then(res => {
      let dateList = res.data
      if(!dateList.length) return
      chooseTime = dateList[0].time
      dateList.map((field, index) => field.active = index === 0 ? true : false)
      this.setData({dateList}, () => this.getScheduleList())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-05
   * @detail   初始化页面
   * @return   {[type]}   [description]
   */
  init() {
    this.initTabRedDot()
    if(app.globalData.isRecruiter) {
      let interviewData = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false,
        total: 0
      }
      this.setData({interviewData}, () => this.getNewScheduleNumber())
    }
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    this.setData({options})
  },
  initDefault() {
    let applyData = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    let receiveData = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    let interviewData = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    let applyBottomStatus = 2
    let receiveBottomStatus = 2
    let interviewBottomStatus = 2
    this.setData({applyData, receiveData, interviewData, applyBottomStatus, receiveBottomStatus, interviewBottomStatus})
  },
  onShow () {
    this.initDefault()
    if (app.globalData.isRecruiter) {
      this.init()
    } else {
      app.getRoleInit = () => {
        this.init()
      }
    }
  },
  // 初始化tab红点
  initTabRedDot() {
    this.selectComponent('#bottomRedDotBar').init()
    this.getInterviewRedDotBar().then(res => {
      let redDotInfos = res.data
      let tabLists = this.data.tabLists
      tabLists.map(field => field.showRedDot = redDotInfos[field.flag])
      this.setData({tabLists, redDotInfos})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-19
   * @detail   清除红点
   */
  clearDayInterviewRedDot(date) {
    return new Promise((resolve, reject) => {
      clearDayInterviewRedDotApi({date}).then(() => {
        resolve()
        this.selectComponent('#bottomRedDotBar').init()
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-25
   * @detail   获取tab红点情况
   */
  getInterviewRedDotBar() {
    return new Promise((resolve, reject) => getInterviewRedDotBarApi().then(res => resolve(res)))
  },
  onReachBottom(e) {
    let interviewData = this.data.interviewData
    if(!interviewData.isLastPage) {
      this.setData({interviewBottomStatus: 1})
      this.getScheduleList(false)
    }
  },
  onPullDownRefresh () {
    let dateList = this.data.dateList
    let callback = () => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    }
    let interviewData = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    }
    this.selectComponent('#bottomRedDotBar').init()
    if(!dateList.length) {
      callback()
      return
    }
    this.setData({interviewData, interviewBottomStatus: 0, hasReFresh: true})
    this.getScheduleList(false).then(res => callback())
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-01
   * @detail   detail
   */
  routeJump(e) {
    let params = e.currentTarget.dataset
    switch(params.status) {
      case 12:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 11:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 51:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      case 52:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 53:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 54:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 55:
        wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
        break
      case 57:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      case 58:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      case 59:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      case 60:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      case 61:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
      default:
        wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${params.itemId}`})
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})
