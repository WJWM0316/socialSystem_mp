import {
  getPositionListApi,
  openPositionApi,
  getRecruiterPositionListApi,
  getfilterPositionListApi,
  getPositionListNumApi,
  getPositionCompanyTopListApi
} from "../../../../../api/pages/position.js"

import {RECRUITER, COMMON} from '../../../../../config.js'

import {sharePosition} from '../../../../../utils/shareWord.js'


let app = getApp(),
    positionCard = null
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
    let detail = app.globalData.recruiterDetails
    if(app.setOrgInit) {
      this.setData({onLinePositionList, detail}, () => this.getOnlineLists(true))
    } else {
      app.getAllInfo().then(res => {
        detail = app.globalData.recruiterDetails
        this.setData({onLinePositionList, detail}, () => this.getOnlineLists(true))
      })
    }
    
  },
  getOnlineLists(hasLoading = true) {
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
    // 处理海报不生成的问题
    this.setData({params: {}})
    onLinePositionList.list.map((field, index) => {
      field.active = false
      if(index === params.index) {
        field.active = true
        result = field
        buttonClick = true
        params = field
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
    switch (this.data.options.type) {
      case 'qr-position':
        wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-position&positionId=${this.data.params.id}`})
        break
      case 'ps-position':
        wx.navigateTo({
          url: `${COMMON}poster/createPost/createPost?type=position&positionId=${this.data.params.id}`
        })
      case 'path-position':
        wx.setStorageSync('positionData', this.data.params)
        wx.navigateBack({delta: 1 })
        break
    }
    
  },
  publicPosition() {
    wx.navigateTo({url: `${RECRUITER}position/post/post`})
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
    let infos = this.data.params
　　return app.wxShare({
      options,
      title: sharePosition(),
      path: `${COMMON}positionDetail/positionDetail?positionId=${infos.id}&sCode=${infos.sCode}&sourceType=shp`,
      imageUrl: positionCard,
      success: function() {
        wx.navigateBack({delta: 1 })
      }
    })
  }
})