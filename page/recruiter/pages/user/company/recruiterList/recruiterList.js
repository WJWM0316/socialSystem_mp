import {
  getRecruitersListApi
} from '../../../../../../api/pages/company.js'

import {RECRUITER, COMMON} from '../../../../../../config.js'

import { agreedTxtC, agreedTxtB } from '../../../../../../utils/randomCopy.js'

Page({
  data: {
    options: {},
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    recruitersList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
  },
  onLoad(options) {
    this.setData({options})
  },
  onShow() {
    const recruitersList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({recruitersList}, () => this.getLists())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let options = this.data.options
      let params = {count: this.data.pageCount, page: this.data.recruitersList.pageNum, hasLoading, id: options.companyId}
      getRecruitersListApi(params).then(res => {
        const recruitersList = this.data.recruitersList
        const list = res.data
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
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
   * @DateTime 2019-01-15
   * @detail   查看招聘管主页
   * @return   {[type]}     [description]
   */
  bindMain(e) {
    const params = e.currentTarget.dataset
    wx.navigateTo({
      url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.uid}`
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   触底加载数据
   * @return   {[type]}   [description]
   */
  onReachBottom() {
    const recruitersList = this.data.recruitersList
    if (!recruitersList.isLastPage) {
      this.getLists(false).then(() => this.setData({onBottomStatus: 1}))
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    const recruitersList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({recruitersList, hasReFresh: true})
    this.getLists().then(res => {
      const recruitersList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      const list = res.data
      list.map(field => field.randomTxt = agreedTxtB())
      recruitersList.list = list
      recruitersList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      recruitersList.pageNum = 2
      recruitersList.isRequire = true
      this.setData({recruitersList, onBottomStatus, hasReFresh: false}, () => wx.stopPullDownRefresh())
    })
  }
})