import {getCollectMySelfApi} from '../../../../api/pages/collect.js'
import {getMyBrowseUsersListApi, getBrowseCompanyListByPageApi} from '../../../../api/pages/browse.js'
import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'

const app = getApp()

Page({
  data: {
    hasReFresh: false,
    tab: 'companyList',
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    pageCount: 20,
    options: {},
    isJobhunter: app.globalData.isJobhunter,
    companyList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    recruiterList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
  },
  onLoad(options) {
    if (wx.getStorageSync('choseType') !== 'APPLICANT') {
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    if (options.tab ==='2') {
      this.setData({tab: 'recruiterList'})
    }
  },
  onShow() {
    let isJobhunter = this.data.isJobhunter
    let init = () => {
      if (app.getRoleInit) {
        isJobhunter = app.globalData.isJobhunter
      } else {
        app.getRoleInit = () => {
          isJobhunter = app.globalData.isJobhunter
        }
      }
      const companyList = {
        list: [],
        pageNum: 1,
        isLastPage: false,
        isRequire: false
      }
      const recruiterList = {
        list: [],
        pageNum: 1,
        isLastPage: false,
        isRequire: false
      }
      this.setData({companyList, recruiterList, isJobhunter}, () => this.getLists(false))
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   户取感兴趣列表
   * @return   {[type]}   [description]
   */
  getLists() {
    const api = this.data.tab === 'companyList' ? 'getBrowseCompanyListByPage' : 'getMyBrowseUsersList'
    return this[api]()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的职位列表
   * @return   {[type]}   [description]
   */
  getBrowseCompanyListByPage(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.companyList.pageNum, hasLoading}
      getBrowseCompanyListByPageApi(params).then(res => {
        const companyList = this.data.companyList
        companyList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        companyList.list = companyList.list.concat(res.data)
        companyList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        companyList.pageNum = companyList.pageNum + 1
        companyList.isRequire = true
        this.setData({companyList}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-28
   * @detail   获取收藏的招聘官列表
   * @return   {[type]}   [description]
   */
  getMyBrowseUsersList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.recruiterList.pageNum, hasLoading}
      getMyBrowseUsersListApi(params).then(res => {
        const recruiterList = this.data.recruiterList
        recruiterList.onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        recruiterList.list = recruiterList.list.concat(res.data)
        recruiterList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        recruiterList.pageNum = recruiterList.pageNum + 1
        recruiterList.isRequire = true
        this.setData({recruiterList}, () => resolve(res))
      })
    })
  },
  onClickTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({tab}, () => {
      if(!this.data[tab].isRequire) this.getLists(false)
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh(hasLoading = true) {
    const key = this.data.tab
    const value = {list: [], pageNum: 1, isLastPage: false, isRequire: false, onBottomStatus: 0}
    this.setData({[key]: value, hasReFresh: true})
    this.getLists().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
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
    const key = this.data.tab
    const value = this.data[key]
    if (!value.isLastPage) {
      if(this.data.tab === 'companyList') {
        let companyList = this.data.companyList
        companyList.onBottomStatus = 1
        this.setData({companyList})
      } else {
        let recruiterList = this.data.recruiterList
        recruiterList.onBottomStatus = 1
        this.setData({recruiterList})
      }
      this.getLists(false)
    }
  },
  routeJump(e) {
    let params = e.currentTarget.dataset
    if(this.data.tab === 'companyList') {
      wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${params.id}`})
    } else {
      wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${params.uid}`})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  jump(e) {
    let type = e.currentTarget.dataset.type
    if(type === 'companyList') {
      wx.reLaunch({url: `${COMMON}homepage/homepage`})
    } else if (type === 'create') {
      wx.navigateTo({url: `${APPLICANT}createUser/createUser`})
    } else if (type === 'rank') {
      wx.navigateTo({url: `${COMMON}rank/rank`})
    }
  }
})