import {
  getBrowseMySelfApi,
  getCollectMySelfApi
} from '../../../../api/pages/browse.js'

import {
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {
  clearReddotApi
} from '../../../../api/pages/common.js'

import {RECRUITER, COMMON} from '../../../../config.js'

let app = getApp()

Page({
  data: {
    hasReFresh: false,
    tab: 'interestList',
    navH: app.globalData.navHeight,
    cdnImagePath: app.globalData.cdnImagePath,
    pageCount: 20,
    options: {},
    isJobhunter: app.globalData.isJobhunter,
    interestList: {
      list: [
        {
          "interviewId": 740,
          "jobhunterUid": 3403,
          "recruiterUid": 662,
          "jobhunterRealname": "零零一一",
          "avatar": {
            "id": 27248,
            "url": "https://attach.lieduoduo.ziwork.com/avatar/2019/0708/17/5d231013b9a96.png",
            "attachType": "avatar",
            "attachTypeDesc": "头像",
            "width": 600,
            "height": 600,
            "middleUrl": "https://attach.lieduoduo.ziwork.com/avatar/2019/0708/17/5d231013b9a96.png!330xauto",
            "smallUrl": "https://attach.lieduoduo.ziwork.com/avatar/2019/0708/17/5d231013b9a96.png!130xauto"
          },
          "redDot": 0,
          "status": 55,
          "statusDesc": "对方暂不考虑",
          "interviewType": 1,
          "positionId": 6765,
          "positionName": "前端开发",
          "emolumentMin": 12,
          "emolumentMax": 13,
          "emolument": "12K-13K",
          "education": 25,
          "educationDesc": "本科",
          "workExperience": 0,
          "workExperienceDesc": "1年以内",
          "companyId": 432,
          "companyName": "那些花儿（中国）有限责任公司",
          "lastCompanyName": "广州百度有限公司",
          "lastPosition": "php",
          "createdAt": "07-25 16:48",
          "createdAtTime": 1564044499,
          "glass": 0,
          "name": '廖继强'
        }
      ],
      pageNum: 2,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    viewList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    },
    indexShowCount: {
      interestedNum: 0,
      viewNum: 0
    }
  },
  // onLoad(options) {
  //   wx.setStorageSync('choseType', 'RECRUITER')
  //   if(Reflect.has(options, 'tab')) this.setData({tab: options.tab})
  // },
  onShow() {
    console.log(this.data);return
    this.getIndexShowCount()
    this.getLists()
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
    this.getIndexShowCount()
    this.getLists().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let key = this.data.tab
    this.setData({onBottomStatus: 1})
    if (!this.data[key].isLastPage) this.getLists()
  },
  /**
   * @Author   小书包
   * @DateTime 查看求职者简历
   * @return   {[type]}     [description]
   */
  viewResumeDetail(e) {
    let params = e.currentTarget.dataset
    clearReddotApi({jobHunterUid: params.jobhunteruid, reddotType: params.type}).then(() => {
      wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
    })
  },
  onClickTab(e) {
    let tab = e.currentTarget.dataset.tab
    let indexShowCount = this.data.indexShowCount
    let interestList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    let viewList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false,
      onBottomStatus: 0
    }
    if(tab === 'viewList') {
      indexShowCount.interestedNum = 0
    } else {
      indexShowCount.viewNum = 0
    }
    this.setData({tab, indexShowCount, interestList, viewList}, () => this.getLists())
  },
  routeJump(e) {
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    if(this.data.tab === 'interestList') {
      return this.getViewList()
    } else {
      return this.getInterestList()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   看过我的列表
   * @return   {[type]}   [description]
   */
  getInterestList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.interestList.pageNum}
      getBrowseMySelfApi(params, hasLoading).then(res => {
        let interestList = this.data.interestList
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        interestList.list = interestList.list.concat(res.data)
        interestList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        interestList.pageNum = interestList.pageNum + 1
        interestList.isRequire = true
        interestList.total = res.meta.total
        this.setData({interestList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   收集过我的列表
   * @return   {[type]}   [description]
   */
  getViewList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let params = {count: this.data.pageCount, page: this.data.viewList.pageNum}
      getCollectMySelfApi(params, hasLoading).then(res => {
        let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        let viewList = this.data.viewList
        viewList.isLastPage = res.meta.nextPageUrl ? false : true
        viewList.pageNum = viewList.pageNum + 1
        viewList.isRequire = true
        viewList.list = viewList.list.concat(res.data)
        this.setData({viewList, onBottomStatus}, () => resolve(res))
      })
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({indexShowCount: res.data}, () => resolve(res))
      })
    })
  }
})