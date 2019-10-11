import {
  getApplyListApi,
  getInviteListApi,
  getScheduleListApi,
  getRedDotListApi,
  getNewScheduleNumberApi,
  clearTabInterviewRedDotApi,
  clearDayInterviewRedDotApi,
  getInterviewRedDotBarApi
} from '../../../../../api/pages/interview.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../../config.js'

import {getSelectorQuery} from "../../../../../utils/util.js"

let app = getApp()

let chooseTime = parseInt(new Date().getTime() / 1000)

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    hasLogin: app.globalData.hasLogin,
    isJobhunter: app.globalData.isJobhunter,
    fixedBarHeight: 0,
    dateList: [],
    hasReFresh: false,
    tabIndex: 0,
    applyScreen: [
      {key: '全部', value: 'all', active: true, showRedDot: 0, flag: 'all', type: 'all'},
      {key: '待安排面试', value: 'waiting_arrangement', active: false, showRedDot: 0, flag: 'jobhunterApplyWaitingArrangement', type: 'apply_waiting_arrangement'},
      {key: '已安排面试', value: 'have_arrangement', active: false, showRedDot: 0, flag: 'jobhunterApplyHaveArrangement', type: 'apply_have_arrangement'},
      {key: '不合适', value: 'not_suitable', flag: 'jobhunterApplyNotSuitable', type: 'apply_not_suitable'}
    ],
    receiveScreen: [
      {key: '全部', value: 'all', active: true, showRedDot: 0, flag: 'all'},
      {key: '待处理', value: 'waiting_processing', active: false, showRedDot: 0, flag: 'jobhunterInviteWaitingProcessing', type: 'invite_waiting_processing'},
      {key: '待安排面试', value: 'waiting_arrangement', active: false, showRedDot: 0, flag: 'jobhunterInviteWaitingArrangement', type: 'invite_waiting_arrangement'},
      {key: '已安排面试', value: 'have_arrangement', active: false, showRedDot: 0, flag: 'jobhunterInviteHaveArrangement', type: 'invite_have_arrangement'},
      {key: '不合适', value: 'not_suitable', active: false, showRedDot: 0, flag: 'jobhunterInviteNotSuitable', type: 'invite_not_suitable'}
    ],
    tabLists: [
      {
        id: 'apply',
        text: '申请记录',
        showRedDot: 0,
        active: true,
        flag: 'jobhunterApplyList'
      },
      {
        id: 'receive',
        text: '收到邀请',
        showRedDot: 0,
        active: false,
        flag: 'jobhunterInviteList'
      },
      {
        id: 'interview',
        text: '面试日程',
        showRedDot: 0,
        active: false,
        flag: 'jobhunterScheduleList'
      }
    ],
    applyIndex: 0,
    receiveIndex: 0,
    applyBottomStatus: 0,
    receiveBottomStatus: 0,
    interviewBottomStatus: 0,
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
    redDotInfos: {}
  },
  // 查看面试历史
  jumpInterviewPage(e) {
    wx.navigateTo({url: `${APPLICANT}interview/history/history`})
  },
  /* 面试日程 */
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
  chooseParentTab(e) {
    let index = e.currentTarget.dataset.index
    let tabLists = this.data.tabLists
    let tabIndex = index
    let dateList = this.data.dateList
    tabLists.map((field, i) => {field.active = false })
    // 当前tab位于面试日程，并且面试日程下面的日期列表的第一个有红点，则离开父级tab 则把首个日期列表的红点清除
    if(index === 2 && dateList.length && dateList[0].number > 0) this.clearDayInterviewRedDot(dateList[0].time)
    tabLists[tabIndex].active = true
    this.setData({tabLists, tabIndex}, () => this.initTabRedDot())
    let data = {}
    switch(index) {
      case 0:
        data = this.data.applyData
        if (!data.isRequire) {
          this.getApplyList()
        }
        break
      case 1:
        data = this.data.receiveData
        if (!data.isRequire) {
          this.getInviteList()
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
        chooseTime = ''
        this.setData({interviewData}, () => this.getNewScheduleNumber())
        break
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
  /**
   * @Author   小书包
   * @DateTime 2019-06-19
   * @detail   清除红点
   * @return   {[type]}        [description]
   */
  clearTabInterviewRedDot(type) {
    clearTabInterviewRedDotApi({type}).then(() => this.initTabRedDot())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-19
   * @detail   清除红点
   * @return   {[type]}        [description]
   */
  clearDayInterviewRedDot(date) {
    clearDayInterviewRedDotApi({date}).then(() => this.initTabRedDot())
  },
  chooseItem(e) {
    let params = e.currentTarget.dataset
    let typeIndex = ''
    let type = ''
    let obj = {}
    // 模拟时时刷新红点接口
    this.initTabRedDot()
    switch(this.data.tabIndex) {
      case 0:
        typeIndex = 'applyIndex'
        obj = this.data.applyScreen
        type = 'applyScreen'
        obj.map((item, index) => {
          if(item.active && item.showRedDot && item.type) {
            item.showRedDot = 0
            this.clearTabInterviewRedDot(item.type)
          }
          item.active = false
        })
        let applyData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        obj[params.index].active = true
        this.setData({applyData, [type]: obj, [typeIndex]: params.index})
        this.getApplyList()
        break
      case 1:
        typeIndex = 'receiveIndex'
        type = 'receiveScreen'
        obj = this.data.receiveScreen
        obj.map((item, index) => {
          if(item.active && item.showRedDot && item.type) {
            item.showRedDot = 0
            this.clearTabInterviewRedDot(item.type)
          }
          item.active = false
        })
        let receiveData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        obj[params.index].active = true
        this.setData({receiveData, [type]: obj, [typeIndex]: params.index})
        this.getInviteList()
      break
    }
  },
  // 我的邀请
  getApplyList(hasLoading = true) {
    if (!this.data.hasLogin || !this.data.isJobhunter) return
    let applyData = this.data.applyData
    let tab = this.data.applyScreen[this.data.applyIndex].value
    let applyBottomStatus = 0
    return getApplyListApi({count: applyData.count, page: applyData.pageNum, tab, ...app.getSource()}, hasLoading).then(res => {
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
    if (!this.data.hasLogin) return
    let receiveData = this.data.receiveData
    let tab = this.data.receiveScreen[this.data.receiveIndex].value
    let receiveBottomStatus = 0
    return getInviteListApi({count: receiveData.count, page: receiveData.pageNum, tab, ...app.getSource()}, hasLoading).then(res => {
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
    if (!this.data.hasLogin) return
    let interviewData = this.data.interviewData
    let interviewBottomStatus = 0
    return getScheduleListApi({count: interviewData.count, page: interviewData.pageNum, time: chooseTime, ...app.getSource()}, hasLoading).then(res => {
      let list = res.data
      list.map(field => {
        let time = field.arrangementInfo.appointment.split(' ')[1].slice(0, 5)
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
  init () {
    this.initTabRedDot()
    switch(this.data.tabIndex) {
      case 0:
        let applyData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({applyData})
        this.getApplyList()
        break
      case 1:
        let receiveData = {
          list: [],
          pageNum: 1,
          count: 20,
          isLastPage: false,
          isRequire: false,
          total: 0
        }
        this.setData({receiveData})
        this.getInviteList()
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
        this.setData({interviewData}, () => this.getNewScheduleNumber())
    }
  },
  onLoad () {
    wx.setStorageSync('choseType', 'APPLICANT')
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
    if (app.getRoleInit) {
      this.setData({hasLogin: app.globalData.hasLogin, isJobhunter: app.globalData.isJobhunter})
      this.init()
    } else {
      app.getRoleInit = () => {
        this.setData({hasLogin: app.globalData.hasLogin, isJobhunter: app.globalData.isJobhunter})
        this.init()
      }
    }
  },
  // 初始化tab红点
  initTabRedDot() {
    this.selectComponent('#bottomRedDotBar').init()
    this.getInterviewRedDotBar()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-25
   * @detail   获取tab红点情况
   * @return   {[type]}   [description]
   */
  getInterviewRedDotBar() {
    return new Promise((resolve, reject) => {
      getInterviewRedDotBarApi().then(res => {
        let redDotInfos = res.data
        let tabLists = this.data.tabLists
        let applyScreen = this.data.applyScreen
        let receiveScreen = this.data.receiveScreen
        tabLists.map(field => field.showRedDot = redDotInfos[field.flag])
        applyScreen.map(field => field.showRedDot = redDotInfos[field.flag])
        receiveScreen.map(field => field.showRedDot = redDotInfos[field.flag])
        this.setData({tabLists, applyScreen, receiveScreen, redDotInfos})
        resolve(res)
      })
    })
  },
  onReachBottom(e) {
    switch(this.data.tabIndex) {
      case 0:
        let applyData = this.data.applyData
        if (!applyData.isLastPage) {
          this.setData({applyBottomStatus: 1})
          this.getApplyList(false)
        }
      break
      case 1:
        let receiveData = this.data.receiveData
        if (!receiveData.isLastPage) {
          this.setData({receiveBottomStatus: 1})
          this.getInviteList(false)
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
    if (!this.data.hasLogin) {
      wx.stopPullDownRefresh()
      return
    }
    this.selectComponent('#bottomRedDotBar').init()
    this.getInterviewRedDotBar()
    switch(this.data.tabIndex) {
      case 0:
        if (!this.data.isJobhunter) {
          wx.stopPullDownRefresh()
          return
        }
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
        }).catch(e => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 1:
        if (!this.data.isJobhunter) {
          wx.stopPullDownRefresh()
          return
        }
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
        }).catch(e => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
      case 2:
        if (!this.data.isJobhunter) {
          wx.stopPullDownRefresh()
          return
        }
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
        }).catch(e => {
          wx.stopPullDownRefresh()
          this.setData({hasReFresh: false})
        })
      break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-01
   * @detail   detail
   */
  routeJump(e) {
    let params = e.currentTarget.dataset
    // 不知道什么情款  有时候拿不到数据
    if(!Object.keys(params).length) return
    switch(params.status) {
      case 12:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 11:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 21:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 52:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 53:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 54:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
        break
      case 55:
        if(Number(params.positionid)) {
          wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionid}`})
        } else {
          wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.recruiteruid}`})
        }
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
  jump (e) {
    let url = ''
    switch (e.currentTarget.dataset.type) {
      case 'login':
        url = `${COMMON}bindPhone/bindPhone`
        break
      case 'positionList':
        url = `${COMMON}homepage/homepage`
        break
      case 'create':
        url = `${APPLICANT}createUser/createUser`
        break
    }
    wx.navigateTo({url})
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  }
})
