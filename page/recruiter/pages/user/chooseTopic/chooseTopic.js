import {getTopicListApi} from '../../../../../api/pages/recruiter.js'

import {RECRUITER} from '../../../../../config.js'

let app = getApp()

Page({
  data: {
    list: [],
    pageNum: 1,
    isLastPage: false,
    isRequire: false,
    onBottomStatus: 0,
    pageCount: app.globalData.pageCount,
    hasReFresh: false
  },
  onLoad(options) {
    this.getTopicList()
  },
  getTopicList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const params = {count: this.data.pageCount, page: this.data.pageNum, hasLoading}
      getTopicListApi(params)
        .then(res => {
          const list = this.data.list.concat(res.data)
          const isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          const pageNum = this.data.pageNum + 1
          const isRequire = true
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          this.setData({list, isLastPage, pageNum, isRequire, onBottomStatus})
          resolve(res)
        })
    })
  },
  addTop(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `${RECRUITER}user/editDeclaration/editDeclaration?topicId=${item.id}&title=${item.title}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    this.setData({pageNum: 1, hasReFresh: true})
    this.getTopicList(false)
        .then((res) => {
          const list = res.data
          const isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          const pageNum = 2
          const isRequire = true
          const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          this.setData({list, isLastPage, pageNum, isRequire, onBottomStatus}, () => {
            wx.stopPullDownRefresh()
            this.setData({hasReFresh: false})
          })
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
    this.getTopicList()
  }
})