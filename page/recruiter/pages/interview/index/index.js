import {RECRUITER, COMMON, APPLICANT} from '../../../../../config.js'

import {
  getInviteListApi,
  getApplyListApi,
  getScheduleListApi,
  getScheduleNumberApi,
  getNewScheduleNumberApi,
  clearTabInterviewRedDotApi,
  clearDayInterviewRedDotApi,
  getInterviewRedDotBarApi
} from '../../../../../api/pages/interview.js'

import {getRecruiterPositionListApi} from '../../../../../api/pages/position.js'

const app = getApp()

let chooseTime = parseInt(new Date().getTime() / 1000)

import {getSelectorQuery} from "../../../../../utils/util.js"

let positionList = []

Page({
  data: {
    navH: app.globalData.navHeight,
    fixedBarHeight: 0,
    tabIndex: 0,
    hasReFresh: false,
    cdnPath: app.globalData.cdnImagePath,
    applyData: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    receiveData: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    interviewData: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false,
      total: 0
    },
    dateList: [],
    applyIndex: 0,
    receiveIndex: 0,
    positionIndex: 0,
    applyBottomStatus: 0,
    receiveBottomStatus: 0,
    interviewBottomStatus: 0,
    options: {},
    applyScreen: [
      {key: '所有状态', value: 0},
      {key: '我邀请的', value: 12},
      {key: '待安排', value: 21},
      {key: '待对方确认', value: 31},
      {key: '待我修改', value: 32},
      {key: '对方暂不考虑', value: 54},
      {key: '不合适', value: 52},
      {key: '已安排', value: 41},
      {key: '已结束', value: 51},
    ],
    receiveScreen: [
      {key: '所有状态', value: 0},
      {key: '未处理', value: 11},
      {key: '待安排', value: 21},
      {key: '待对方确认', value: 31},
      {key: '待我修改', value: 32},
      {key: '不合适', value: 52},
      {key: '已安排', value: 41},
      {key: '已结束', value: 51}
    ],
    positionList: [],
    tabLists: [
      {
        text: '收到意向',
        active: true,
        showRedDot: 0,
        flag: 'recruiterIntentionList',
        type: 'intention_list'
      },
      {
        text: '我的邀请',
        active: false,
        showRedDot: 0,
        flag: 'recruiterInviteList',
        type: 'invite_list'
      },
      {
        text: '面试日程',
        active: false,
        showRedDot: 0,
        flag: 'recruiterScheduleList',
        type: ''
      }
    ],
    redDotInfos: {}
  },
  // 查看面试历史
  jumpInterviewPage() {
    wx.navigateTo({url: `${RECRUITER}interview/history/history`})
  },
  bindChange(e) {
    let type = ''
    let value = 0
    switch(e.currentTarget.dataset.type) {
      case 'applyStatus':
        type = 'applyIndex'
        value = parseInt(e.detail.value)
        let applyData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({applyData, [type]: value},  function() {
          this.getApplyList()
        })
        break
      case 'receiveStatus':
        type = 'receiveIndex'
        value = parseInt(e.detail.value)
        let receiveData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({receiveData, [type]: value})
        this.getInviteList()
        break
      case 'position':
        type = 'positionIndex'
        value = parseInt(e.detail.value)
        let data = {}
        let dataValue = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        if (this.data.tabIndex === 1) {
          data = 'applyData'
          this.setData({[type]: value, [data]: dataValue}, function() {
            this.getApplyList()
          })
        } else if (this.data.tabIndex === 0) {
          data = 'receiveData'
          this.setData({[type]: value, [data]: dataValue}, function() {
            this.getInviteList()
          })
        }
        break
    }
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
    //模拟时时请求红点接口
    this.initTabRedDot()
    this.setData({interviewData, interviewBottomStatus: 0, dateList}, () => this.getScheduleList())
  },
  // 我的邀请
  getApplyList(hasLoading = true) {
    let applyData = this.data.applyData
    let status = this.data.applyScreen[this.data.applyIndex].value
    let positionId = this.data.positionList[this.data.positionIndex].id
    let applyBottomStatus = 0
    return getApplyListApi({count: applyData.count, page: applyData.pageNum, status, positionId}, hasLoading).then(res => {
      applyData.list.push(...res.data)
      applyData.isRequire = true
      applyData.total = res.meta.total
      applyData.pageNum++
      if (!res.meta || !res.meta.nextPageUrl) {
        applyData.isLastPage = true
        applyBottomStatus = 2
      }
      this.setData({applyData, applyBottomStatus})
    })
  },
  // 收到意向
  getInviteList(hasLoading = true) {
    let receiveData = this.data.receiveData
    let status = this.data.receiveScreen[this.data.receiveIndex].value
    let positionId = this.data.positionList[this.data.positionIndex].id
    let receiveBottomStatus = 0
    return getInviteListApi({count: receiveData.count, page: receiveData.pageNum, status, positionId}, hasLoading).then(res => {
      receiveData.list.push(...res.data)
      receiveData.isRequire = true
      receiveData.total = res.meta.total
      receiveData.pageNum++
      if (!res.meta || !res.meta.nextPageUrl) {
        receiveData.isLastPage = true
        receiveBottomStatus = 2
      }
      this.setData({receiveData, receiveBottomStatus})
    })
  },
  // 面试日程
  getScheduleList(hasLoading = true) {
    let interviewData = this.data.interviewData
    let interviewBottomStatus = 0
    return getScheduleListApi({count: interviewData.count, page: interviewData.pageNum, time: chooseTime}, hasLoading).then(res => {
      const list = res.data
      list.map(field => {
        const time = field.arrangementInfo.appointment.split(' ')[1].slice(0, 5)
        field.createdAtTime = time
      })
      interviewData.list.push(...list)
      interviewData.isRequire = true
      interviewData.total = res.meta.total
      interviewData.pageNum++
      if (!res.meta || !res.meta.nextPageUrl) {
        interviewData.isLastPage = true
        interviewBottomStatus = 2
      }
      this.setData({interviewData, interviewBottomStatus})
    })
  },
  chooseParentTab(e) {
    let index = e.currentTarget.dataset.index
    let tabIndex = this.data.tabIndex
    let tabLists = this.data.tabLists
    let dateList = this.data.dateList
    tabLists.map((item, i) => {
      if(item.active && item.showRedDot && item.type) {
        item.showRedDot = 0
        this.clearTabInterviewRedDot(item.type)
      }
      tabLists[i].active = false
    })
    tabLists[index].active = true
    tabLists[index].showRedDot = false
    tabIndex = index
    // 当前tab位于面试日程，并且面试日程下面的日期列表的第一个有红点，则离开父级tab 则把首个日期列表的红点清除
    if(index === 2 && dateList.length && dateList[0].number > 0) this.clearDayInterviewRedDot(dateList[0].time)
    this.setData({tabLists, tabIndex}, () => this.initTabRedDot())
    let data = {}
    switch(index) {
      case 0:
        data = this.data.receiveData
        if (!data.isRequire) {
          this.getInviteList()
        }
        break
      case 1:
        data = this.data.applyData
        if (!data.isRequire) {
          this.getApplyList()
        }
        break
      case 2:
        data = this.data.interviewData
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
  init () {
    let options = this.data.options
    this.initTabRedDot()
    if (app.globalData.isRecruiter) {
      getRecruiterPositionListApi({is_online: 1, count: 50, page: 1}).then(res => {
        positionList = res.data
        positionList.unshift({positionName: '所有职位', id: 0})
        switch(this.data.tabIndex) {
          case 0:
            let receiveData = {
              list: [],
              pageNum: 1,
              count: 20,
              isLastPage: false,
              isRequire: false,
              total: 0
            }
            this.setData({positionList, receiveData})
            this.getInviteList()
            break
          case 1:
            let applyData = {
              list: [],
              pageNum: 1,
              count: 20,
              isLastPage: false,
              isRequire: false,
              total: 0
            }
            this.setData({positionList, applyData})
            this.getApplyList()
            break
          case 2:
            let interviewData = {
              list: [],
              pageNum: 1,
              count: 20,
              isLastPage: false,
              isRequire: false,
              total: 0
            }
            this.setData({positionList, interviewData}, () => this.getNewScheduleNumber())
        }
      })
    }
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    let tabIndex = this.data.tabIndex
    let tabLists = this.data.tabLists

    if(Reflect.has(options, 'tabIndex')) {
      tabIndex = parseInt(options.tabIndex)
      tabLists.map((item, i) => tabLists[i].active = false)
      tabLists[tabIndex].active = true
      tabLists[tabIndex].showRedDot = false
    }
    
    this.setData({options, tabIndex, tabLists})
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
   * @return   {[type]}        [description]
   */
  clearTabInterviewRedDot(type) {
    return new Promise((resolve, reject) => {
      clearTabInterviewRedDotApi({type}).then(() => {
        resolve(res)
        this.selectComponent('#bottomRedDotBar').init()
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-19
   * @detail   清除红点
   * @return   {[type]}        [description]
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
   * @return   {[type]}   [description]
   */
  getInterviewRedDotBar() {
    return new Promise((resolve, reject) => {
      getInterviewRedDotBarApi().then(res => resolve(res))
    })
  },
  onReachBottom(e) {
    switch(this.data.tabIndex) {
      case 0:
        let receiveData = this.data.receiveData
        if (!receiveData.isLastPage) {
          this.setData({receiveBottomStatus: 1})
          this.getInviteList(false)
        }
      break
      case 1:
        let applyData = this.data.applyData
        if (!applyData.isLastPage) {
          this.setData({applyBottomStatus: 1})
          this.getApplyList(false)
        }
      break
      case 2:
        let interviewData = this.data.interviewData
        if (!interviewData.isLastPage) {
          this.setData({interviewBottomStatus: 1})
          this.getScheduleList(false)
        }
      break
    }
  },
  onPullDownRefresh () {
    this.selectComponent('#bottomRedDotBar').init()
    switch(this.data.tabIndex) {
      case 0:
        let receiveData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({receiveData, receiveBottomStatus: 0, hasReFresh: true})
        this.getInviteList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 1:
        let applyData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({applyData, applyBottomStatus: 0, hasReFresh: true})
        this.getApplyList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 2:
        let interviewData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        let dateList = this.data.dateList
        if(!dateList.length) {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
          return
        }
        this.setData({interviewData, interviewBottomStatus: 0, hasReFresh: true})
        this.getScheduleList(false).then(res => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
    }
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
    const params = e.currentTarget.dataset
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
