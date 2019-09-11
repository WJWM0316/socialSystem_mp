import {
  getPositionListApi,
  openPositionApi,
  getRecruiterPositionListApi,
  getfilterPositionListApi,
  getPositionListNumApi,
  getPositionCompanyTopListApi
} from "../../../../../api/pages/position.js"

import {RECRUITER, COMMON} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    options: {},
    onBottomStatus: 0,
    onLinePositionList: {
      list: [],
      pageNum: 1,
      count: 10,
      isLastPage: false,
      isRequire: false
    },
    params: {},
    buttonClick: false,
    detail: app.globalData.recruiterDetails
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    let onLinePositionList = {
      list: [],
      pageNum: 1,
      count: 10,
      isLastPage: false,
      isRequire: false
    }
    this.setData({onLinePositionList}, () => this.getOnlineLists(true))
  },
  getOnlineLists(hasLoading = true) {
    console.log(this.data)
    let Api = this.data.detail.isCompanyTopAdmin ? getPositionCompanyTopListApi : getRecruiterPositionListApi
    return new Promise((resolve, reject) => {

      let onLinePositionList = this.data.onLinePositionList
      let onBottomStatus = this.data.onBottomStatus
      let orgData = wx.getStorageSync('orgData')
      let params = {
        is_online: 1,
        count: onLinePositionList.count,
        page: onLinePositionList.pageNum,
        hasLoading
      }
      //加个机构id
      if(this.data.detail.isCompanyTopAdmin) {
        if(orgData) params = Object.assign(params, {company_id: orgData.id})
      }
      Api(params).then(res => {
        onLinePositionList.list = onLinePositionList.list.concat(res.data || [])
        onLinePositionList.pageNum++
        onLinePositionList.isRequire = true
        onLinePositionList.isLastPage = !res.meta || !res.meta.nextPageUrl ? true : false
        onBottomStatus = !res.meta || !res.meta.nextPageUrl ? 2 : 0
        this.setData({onLinePositionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-15
   * @detail  选中当前的选项
   * @return   {[type]}     [description]
   */
  onClick(e) {
    let params = e.currentTarget.dataset
    let result = {}
    let onLinePositionList = this.data.onLinePositionList
    let buttonClick = this.data.buttonClick
    onLinePositionList.list.map((field, index) => {
      field.active = false
      if(index === params.index) {
        field.active = true
        result = field
        buttonClick = true
      }
    })
    this.setData({params, onLinePositionList, buttonClick})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    let onLinePositionList = this.data.onLinePositionList
    this.setData({onLinePositionList})
    if(!onLinePositionList.isLastPage) this.getOnlineLists(false).then(() => this.setData({onBottomStatus: 1}))
  },
  submit() {
    let buttonClick = this.data.buttonClick
    if(!buttonClick) return
    wx.redirectTo({url: `${RECRUITER}createQr/createQr?type=qr-position`})
  },
  publicPosition() {
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  }
})