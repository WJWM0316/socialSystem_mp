
import {RECRUITER, APPLICANT, COMMON} from '../../../../../config.js'

import {getSelectorQuery}  from '../../../../../utils/util.js'

import { getPositionListApi } from '../../../../../api/pages/position.js'

import {
  getCityLabelApi
} from '../../../../../api/pages/common'

import {
  getLabelPositionApi
} from '../../../../../api/pages/label.js'

import {shareChance} from '../../../../../utils/shareWord.js'

const app = getApp()

Page({
  data: {
    pageCount: 20,
    navH: app.globalData.navHeight,
    fixedBarHeight: 0,
    hasReFresh: false,
    onBottomStatus: 0,
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    city: 0,
    cityIndex: 0,
    type: 0,
    typeIndex: 0,
    cityList: [],
    positionTypeList: [],
    applyIndex: 0,
    positionIndex: 0,
    cdnImagePath: app.globalData.cdnImagePath
  },
  onLoad() {
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({positionList})
    if (app.loginInit) {
      this.getPositionList()
      this.getCityLabel()
      this.getLabelPosition()
    } else {
      app.loginInit = () => {
        this.getPositionList()
        this.getCityLabel()
        this.getLabelPosition()
      }
    }
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是面试官，是否切换面试官',
        confirmBack() {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
        }
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取热门城市
   * @return   {[type]}   [description]
   */
  getCityLabel() {
    getCityLabelApi().then(res => {
      const cityList = res.data
      cityList.unshift({areaId: 'all', name: '全部地区'})
      this.setData({cityList})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取技能标签
   * @return   {[type]}   [description]
   */
  getLabelPosition() {
    getLabelPositionApi().then(res => {
      const positionTypeList = res.data
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        labelId: 'all',
        name: '全部类型',
        type: 'self_label_position'
      })
      this.setData({positionTypeList})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取职位列表
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, hasLoading}
      if(this.data.city) {
        params = Object.assign(params, {city: this.data.city})
      }
      if(this.data.type) {
        params = Object.assign(params, {type: this.data.type})
      }
      if(!this.data.type) {
        delete params.type
      }
      if(!this.data.city) {
        delete params.city
      }
      getPositionListApi(params).then(res => {
        const positionList = this.data.positionList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        positionList.list = positionList.list.concat(res.data)
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   刷新数据
   * @return   {[type]}   [description]
   */
  reloadPositionLists(hasLoading = true) {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true})
    return this.getPositionList().then(res => {
      const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      positionList.list = res.data
      positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      positionList.pageNum = 2
      positionList.isRequire = true
      this.setData({positionList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    this.reloadPositionLists().then(res => {
      wx.stopPullDownRefresh()
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
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.getPositionList(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   类型改变重新拉数据
   * @return   {[type]}     [description]
   */
  bindChange(e) {
    const params = e.currentTarget.dataset
    const list = params.type === 'city' ? this.data.cityList : this.data.positionTypeList
    const result = list.find((field, index) => index === Number(e.detail.value))
    const type = params.type
    const otherParamsIndex = params.type === 'city' ? 'cityIndex' : 'typeIndex'
    const otherParamValue = result[params.type === 'city' ? 'areaId' : 'labelId']
    const positionList = this.data.positionList
    positionList.pageNum = 1

    if(typeof otherParamValue === 'number') {
      this.setData({[type]: otherParamValue, [otherParamsIndex]: Number(e.detail.value)}, () => this.reloadPositionLists())
    } else {
      this.setData({[type]: 0, [otherParamsIndex]: 0, positionList}, () => this.reloadPositionLists())
    }
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      title: shareChance,
      path: `${APPLICANT}jobs/job/job`,
      imageUrl: `${this.data.cdnImagePath}positionList.png`
    })
  }
})
