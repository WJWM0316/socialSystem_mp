import {getRecruitersListApi} from '../../../../../api/pages/company.js'

import {COMMON,RECRUITER} from "../../../../../config.js"

import { agreedTxtC, agreedTxtB } from '../../../../../utils/randomCopy.js'


let app = getApp()

Page({
  data: {
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    recruitersList: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    isCompanyAdmin: 0,
    options: {},
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let recruiterInfo = app.globalData.recruiterDetails
    let recruitersList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }

    this.setData({recruitersList})
    if (app.pageInit) {
      this.init()
    } else {
      app.pageInit = () => {
        this.init()
      }
    }
  },
  init() {
    let isCompanyAdmin = this.data.isCompanyAdmin
    app.getRoleInfo().then(res => {
      isCompanyAdmin = res.data.isCompanyAdmin
      app.getBottomRedDot().then(res => this.setData({redDotInfos: app.globalData.redDotInfos}))
      this.setData({isCompanyAdmin}, this.getLists())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getLists() {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let params = {id: options.companyId, page: this.data.recruitersList.pageNum, count: this.data.pageCount}

      getRecruitersListApi(params).then(res => {
        let recruitersList = this.data.recruitersList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let list = res.data
        let item = list.find(item => item.isCompanyAdmin)
        list.map(field => field.randomTxt = agreedTxtB())
        recruitersList.list = recruitersList.list.concat(list)
        recruitersList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        recruitersList.pageNum = recruitersList.pageNum + 1
        recruitersList.isRequire = true
        this.setData({recruitersList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   申请转移权限
   * @return   {[type]}   [description]
   */
  authTransfer() {
  	let result = () => {
  		app.wxConfirm({
	      title: '申请成功',
	      content: `我们已收到您的申请，24小时内会有专人给您致电了解情况，请保持手机畅通。`,
	      showCancel: false,
	      confirmText: '知道了',
	      confirmBack: () => {}
	    })
  	}
  	app.wxConfirm({
      title: '申请转移管理权限',
      content: `您即将转移${'老虎科技'}的公司管理权限给${'陆强'}，确定转移吗？`,
      confirmBack: () => {
        result()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   移除招聘官
   * @return   {[type]}   [description]
   */
  delete(e) {
  	let params = e.currentTarget.dataset
    let recruitersList = this.data.recruitersList
  	let callback = () => this.setData({recruitersList})

    let result = recruitersList.list.find((field, index) => params.index === index)
  	app.wxConfirm({
      title: '移除面试官',
      content: `即将从公司中移除${result.name}，该面试官发布的职位将被关闭且无法继续进行招聘，确认移除吗?`,
      confirmText: '移除',
      confirmBack: () => {
        recruitersList.list.splice(params.index, 1)
        callback()
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   选择当前招聘官
   * @return   {[type]}   [description]
   */
  select(e) {
  	let recruiterList = this.data.recruiterList
  	recruiterList.map((field, index) => field.active = index === params.active ? true : false)
  	this.setData({recruiterList})
  },
  jump(e) {
    let uid = e.currentTarget.dataset.uid
    wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let recruitersList = this.data.recruitersList
    if (!recruitersList.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    let recruitersList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({recruitersList, hasReFresh: true, onBottomStatus: 1})
    app.getBottomRedDot().then(res => this.setData({redDotInfos: app.globalData.redDotInfos}))
    this.getLists().then(res => {
      let recruitersList = this.data.recruitersList
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      recruitersList.list = res.data
      recruitersList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      recruitersList.pageNum = 2
      recruitersList.isRequire = true
      this.setData({recruitersList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  routeJump() {
    wx.navigateTo({url: `${RECRUITER}company/verify/verify`})
  }
})