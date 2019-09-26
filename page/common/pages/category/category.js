import {
  getLabelPositionApi,
  getLabelLIstsApi,
  getHotLabelListsApi
} from '../../../../api/pages/label.js'

import {RECRUITER} from '../../../../config.js'

const app = getApp()

Page({
  data: {
    positionTypeList: [],
    hotArea: [],
    query: '',
    statusBarHeight: app.globalData.navHeight,
    index1: 0,
    index2: 0,
    showMask: false,
    searing: false
  },
  onLoad(options) {
    this.setData({query: options})
    this.getLists()
  },
  getLists() {
    const options = this.data.query
    if (options.hot) {
      getHotLabelListsApi().then(res => {
        let hotArea = res.data
        let positionType = wx.getStorageSync('positionType')
        if (positionType) {
          hotArea.forEach(field => {
            if (field.labelId === positionType) {
              field.active = true
            }
          })
        }
        this.setData({hotArea}, () => {
          wx.removeStorageSync('positionType')
        })
      })
    }
    getLabelPositionApi()
      .then(res => {
        const positionTypeList = res.data
        this.setData({positionTypeList: res.data})
      })
  },
  onClick(e) {
    const params = e.currentTarget.dataset
    const storage = wx.getStorageSync('createPosition') || {}
    storage.type = params.labelId
    storage.typeName = params.name
    if(params.topid !== storage.parentType) storage.skills = []
    storage.parentType = params.topid
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick1(e) {
    // 只有一级标签
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    if (!positionTypeList[params.index] || !positionTypeList[params.index].children) return
    positionTypeList.map((field, index) => field.active = index === params.index ? true : false)
    positionTypeList[params.index].children.map((field, index) => field.active = index === this.data.index1 ? true : false)
    positionTypeList[params.index].children[this.data.index1].children[this.data.index2].active = true
    this.setData({index1: params.index, positionTypeList, showMask: true})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick2(e) {
    const params = e.currentTarget.dataset
    const positionTypeList = this.data.positionTypeList
    if (!positionTypeList[params.index].children) return
    positionTypeList[this.data.index1].children.map((field, index) => field.active = index === params.index ? true : false)
    this.setData({index2: params.index, positionTypeList, showMask: true})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   一级选中
   * @return   {[type]}     [description]
   */
  onClick3(e) {
    const params = e.currentTarget.dataset
    const result = this.data.positionTypeList[this.data.index1].children[this.data.index2].children[params.index]
    this.setData({showMask: false})
    const storage = wx.getStorageSync('createPosition') || {}
    storage.type = result.labelId
    storage.typeName = result.name
    if(this.data.positionTypeList[this.data.index1].labelId !== storage.parentType) storage.skills = []
    storage.parentType = this.data.positionTypeList[this.data.index1].labelId
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  tapHot (e) {
    const params = e.currentTarget.dataset
    const storage = {}
    storage.type = params.item.labelId
    storage.typeName = params.item.name
    wx.setStorageSync('createPosition', storage)
    wx.navigateBack({delta: 1})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   绑定用户输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    const name = e.detail.value
    this.debounce(this.getLabelLIsts, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-16
   * @detail   搜索技能列表
   * @return   {[type]}   [description]
   */
  getLabelLIsts(name) {
    this.setData({showMask: false})
    if(!name) {
      this.setData({searing: false}, () => this.getLists())
      return;
    }
    getLabelLIstsApi({name})
      .then(res => {
        const positionTypeList = res.data
        const regExp = new RegExp(name, 'g')
        positionTypeList.map(field => {
          field.html = field.name.replace(regExp, `<span style="color: #652791;">${name}</span>`)
          field.html = `<div>${field.html}</div>`
        })
        this.setData({positionTypeList, searing: true})
      })
  },
  closeMask(e) {
    this.setData({showMask: false, index1: 0, index2: 0})
    return
  }
})