import {
  getMyBrowseUsersListApi,
  getMyBrowsePositionApi,
  getBrowseMySelfApi,
  getCollectMySelfApi,
  getMyCollectUsersApi
} from '../../../../api/pages/browse.js'

import {
  getBrowseMySelfListsApi
} from '../../../../api/pages/recruiter.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../../config.js'

import {getSelectorQuery}  from '../../../../utils/util.js'

import { getPositionListNumApi } from '../../../../api/pages/position.js'

let app = getApp()

Page({

  data: {
    collectUsers: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    pageCount: 10,
    navH: app.globalData.navHeight,
    background: 'transparent',
    hasReFresh: false,
    onBottomStatus: 0
  },
  onShow() {
    let collectUsers = this.data.collectUsers
    this.setData({collectUsers}, () => {
      if(!collectUsers.list.length) this.getMyCollectUsers()
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   我感兴趣的列表
   * @return   {[type]}   [description]
   */
  getMyCollectUsers(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.collectUsers.pageNum, ...app.getSource()}
      getMyCollectUsersApi(params, hasLoading)
        .then(res => {
          let collectUsers = this.data.collectUsers
          let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
          collectUsers.list = collectUsers.list.concat(res.data)
          collectUsers.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
          collectUsers.pageNum = collectUsers.pageNum + 1
          collectUsers.isRequire = true
          this.setData({collectUsers, onBottomStatus}, () => resolve(res))
        })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    let collectUsers = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({collectUsers, hasReFresh: true})
    this.getMyCollectUsers().then(res => {
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      collectUsers.list = res.data
      collectUsers.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      collectUsers.pageNum = 2
      collectUsers.isRequire = true
      this.setData({collectUsers, onBottomStatus}, () => {
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
    let collectUsers = this.data.collectUsers
    if (!collectUsers.isLastPage) {
      this.setData({onBottomStatus: 1}, () => this.getMyCollectUsers(false))
    }
  },
  dotoAction(e) {
    let uid = app.globalData.recruiterDetails.uid
    let action = e.currentTarget.dataset.action
    if(action === 'position') {
      wx.navigateTo({url: `${RECRUITER}position/index/index`})
    } else {
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${uid}`})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    // 可能会存在空对象
    if(!Object.keys(params).length) return;
    // console.log(params)
    wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
})