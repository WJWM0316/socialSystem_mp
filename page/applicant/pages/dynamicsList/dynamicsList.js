import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {geMyBrowseUsersApi } from '../../../../api/pages/active.js'
import { getMyCollectUsersApi } from '../../../../api/pages/browse.js'

const app = getApp()
let options = {}
Page({
  data: {
    list: [],
    pageNum: 1,
    isJobhunter: app.globalData.isJobhunter,
    isLastPage: false,
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    options: {}
  },
  onLoad(options) {
    if (wx.getStorageSync('choseType') !== 'APPLICANT') {
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    this.setData({options})
  },
  onShow() {
    if (app.loginInit) {
      this.getLists()
    } else {
      app.loginInit = () => {
        this.getLists()
      }
    }
  },
  getLists(hasLoading) {
    let isJobhunter = this.data.isJobhunter
    if (app.getRoleInit) {
      isJobhunter = app.globalData.isJobhunter
    } else {
      app.getRoleInit = () => {
        isJobhunter = app.globalData.isJobhunter
      }
    }
    this.setData({isJobhunter})
    switch(this.data.options.type) {
      case 'myBrowse':
        return this.getMyBrowseList(hasLoading)
        break;
      case 'myCollect':
        return this.getMyCollectList(hasLoading)
        break;
    }
  },
  getMyBrowseList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.pageNum, hasLoading, ...app.getSource()}
      geMyBrowseUsersApi(params).then(res => {
        let list = this.data.list
        let isLastPage = this.data.isLastPage
        let pageNum = this.data.pageNum
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list = list.concat(res.data)
        isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        pageNum++
        this.setData({list, pageNum, isLastPage, onBottomStatus}, () => resolve(res))
      })
    })
  },
  getMyCollectList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.pageNum, hasLoading, ...app.getSource()}
      getMyCollectUsersApi(params).then(res => {
        let list = this.data.list
        let isLastPage = this.data.isLastPage
        let pageNum = this.data.pageNum
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        list = list.concat(res.data)
        isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        pageNum++
        this.setData({list, pageNum, isLastPage, onBottomStatus}, () => resolve(res))
      })
    })
  },
  jump (e) {
    let type = e.currentTarget.dataset.type
    if (this.data.options.type === 'myBrowse') {
      if (type === 'index') {
        wx.navigateTo({
          url: `${COMMON}homepage/homepage`
        })
      } else {
        wx.navigateTo({
          url: `${APPLICANT}createUser/createUser`
        })
      }
    } else {
      wx.navigateTo({
        url: `${COMMON}rank/rank`
      })
    }
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({list: [], pageNum: 1, isLastPage: false, onBottomStatus: 0, hasReFresh: true})
    this.getLists(false).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    if (!this.data.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getLists(false)
    }
  },
})
