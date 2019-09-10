import {
  getIndexShowCountApi
} from '../../../../api/pages/recruiter.js'

import {
  RECRUITER, 
  COMMON, 
  APPLICANT, 
  WEBVIEW,
  VERSION
} from '../../../../config.js'

import {
  getAdBannerApi
} from '../../../../api/pages/common'

let app = getApp()

let fixedDomPosition = 0,
    positionCard = null

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    choseType: '',
    pageCount: 20,
    background: 'transparent',
    hasReFresh: false,
    onBottomStatus: 0,
    isFixed: true,
    detail: {},
    welcomeWord: '',
    indexShowCount: {
      jobHunterInterestedToR: 0,
      recentInterview: 0,
      onlinePosition: 0,
      waitingProcessInterview: 0,
      moreRecruiter: [],
      rankDetail: {
        currentRank: 0,
        influence: 0,
        popularity: 0
      },
      recruiterInterestedToJ: 0
    },
    banner: {},
    bannerIndex: 0,
    companyInfos: {},
    dataBox: {
      tabLists: [
        {
          number: '520',
          text: '职位浏览次数',
          active: true,
          data: {
            key: ['周a', '周b', '周c', '周d', '周e', '周f', '周g'],
            value: [
              [18, 36, 65, 30, 78, 40, 33],
              [12, 50, 51, 35, 70, 30, 20]
            ]
          }
        },
        {
          number: '666',
          text: '招聘官浏览次数',
          active: false,
          data: {
            key: ['周1', '周2', '周3', '周4', '周5', '周6', '周7'],
            value: [
              [18, 36, 65, 30, 78, 40, 33],
              [12, 50, 51, 35, 70, 30, 20]
            ]
          }
        },
        {
          number: '6.6k',
          text: '机构浏览次数',
          active: false,
          data: {
            key: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            value: [
              [18, 36, 65, 30, 78, 40, 33],
              [12, 50, 51, 35, 70, 30, 20]
            ]
          }
        }
      ]
    },
    echartData: {
      key: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      value: [
        [18, 36, 65, 30, 78, 40, 33],
        [12, 50, 51, 35, 70, 30, 20]
      ]
    },
    viewList: [],
    showPublicPositionTips: false
  },
  onLoad() {
    let choseType = wx.getStorageSync('choseType') || ''
    this.setData({ choseType})
    let that = this
    if (choseType === 'APPLICANT') {
      let that = this
      app.wxConfirm({
        title: '提示',
        content: '检测到你是求职者，是否切换求职者',
        confirmBack() {
          wx.reLaunch({url: `${COMMON}homepage/homepage`})
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'RECRUITER')
          app.getAllInfo().then(res => that.init())
        }
      })
    }
  },
  onShow() {
    this.init();return
    if(app.loginInit) {
      // if(!app.globalData.hasLogin) {
      //   wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
      //   return
      // }
      this.init()
    } else {
      app.loginInit = () => {
        // if (!app.globalData.hasLogin) {
        //   wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
        //   return
        // }
        this.init()
      }
    }
  },
  init () {
    setTimeout(() => {
      this.selectComponent('#indexEchart').init()
    }, 2000)
    if (wx.getStorageSync('choseType') === 'APPLICANT') return
    let userInfo = app.globalData.userInfo
    let companyInfos = app.globalData.recruiterDetails.companyInfo
    if(app.pageInit) {
      userInfo = app.globalData.userInfo
      companyInfos = app.globalData.recruiterDetails.companyInfo
      this.getMixdata()
      this.setData({userInfo})
      this.selectComponent('#bottomRedDotBar').init()
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        companyInfos = app.globalData.recruiterDetails.companyInfo
        this.getMixdata()
        this.setData({userInfo})
        this.selectComponent('#bottomRedDotBar').init()
      }
    }
  },
  getMixdata() {
    this.getIndexShowCount().then(() => this.getBanner())
    this.getWelcomeWord()
  },
  getBanner() {
    return getAdBannerApi({location: 'recruiter_index', hasLoading: false}).then(res => this.setData({banner: res.data}))
  },
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'APPLICANT') {
        resolve()
        return
      }
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({indexShowCount: res.data, detail: res.data.recruiterInfo}, () => resolve(res))
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    this.selectComponent('#bottomRedDotBar').init()
    this.getMixdata()
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({
      options,
      btnTitle: `${this.data.companyInfos.companyName}正在招聘，马上约面，极速入职！我在店长多多等你！`,
      btnImageUrl: positionCard,
      btnPath: `${COMMON}homepage/homepage?companyId=${this.data.companyInfos.id}`
    })
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if(e.scrollTop > 10) {
      if (this.data.background !== '#652791') this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.background !== 'transparent') this.setData({isFixed: false, background: 'transparent'})
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    switch(route) {
      case 'interested':
        wx.navigateTo({url: `${RECRUITER}dynamics/dynamics?tab=viewList`})
        break
      case 'interview':
        wx.reLaunch({url: `${RECRUITER}interview/index/index?tabIndex=2`})
        break
      case 'position':
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        break
      case 'rank':
        wx.navigateTo({url: `${COMMON}rank/rank`})
        break
      case 'recruiter':
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.detail.uid}`})
        break
      case 'adviser':
        wx.navigateTo({url: `${RECRUITER}user/adviser/adviser`})
        break
      case 'companyPoster':
        this.share()
        wx.setStorageSync('companyPosterdata', app.globalData.recruiterDetails.companyInfo)
        break
      case 'receiveData':
        wx.reLaunch({url: `${RECRUITER}interview/index/index`})
        break
      case 'dynamics':
        wx.navigateTo({url: `${RECRUITER}dynamics/dynamics`})
        break
      case 'publicPosition':
        wx.navigateTo({url: `${RECRUITER}position/post/post`})
        break
      case 'qr-mechanism':
        wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-mechanism`})
        break
      case 'qr-position':
        wx.navigateTo({url: `${RECRUITER}organization/position/position?type=qr-position`})
        // wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-position`})
        break
      case 'qr-recruiter':
        wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-recruiter`})
        break
      case 'echart':
        wx.navigateTo({url: `${RECRUITER}echart/echart`})
        break
      case 'shareCompany':
        this.selectComponent('#shareBtn').oper()
        wx.setStorageSync('companyPosterdata', app.globalData.recruiterDetails.companyInfo)
        break
      case 'sharePosition':
        wx.reLaunch({url: `${RECRUITER}position/index/index`})
        break
      case 'poster-mechanism':
        // 该机构的职位上线状态
        if(app.globalData.recruiterDetails.positionNum) {
          wx.navigateTo({url: `${COMMON}poster/company/company`})
          wx.setStorageSync('companyPosterdata', this.data.companyInfos)
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'position-mechanism':
        // 该机构的职位上线状态
        if(app.globalData.recruiterDetails.positionNum) {
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=positionMin&positionId=6864`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'recruiter-mechanism':
        // 该机构的职位上线状态
        if(app.globalData.recruiterDetails.positionNum) {
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'hidePublicPositionTips':
        this.setData({showPublicPositionTips: false})
        break
      default:
        break
    }
  },
  share() {
    this.selectComponent('#shareBtn').oper()
  },
  /**
   * @Author   小书包
   * @DateTime 2019-05-10
   * @detail   根据时间显示不同的问候
   * @return   {[type]}   [description]
   */
  getWelcomeWord() {
    let d = new Date()
    if(d.getHours() >= 6 && d.getHours() < 12) {
      this.setData({welcomeWord: '早上好'})
    } else if(d.getHours() >= 12 && d.getHours() < 14) {
      this.setData({welcomeWord: '中午好'})
    } else if(d.getHours() >= 14 && d.getHours() < 18) {
      this.setData({welcomeWord: '下午好'})
    } else {
      this.setData({welcomeWord: '晚上好'})
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-05
   * @detail   benner轮播
   */
  autoplay (e) {
    this.setData({bannerIndex: e.detail.current})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-05
   * @detail   banner跳转
   */
  bannerJump(e) {
    let url = '/'+e.currentTarget.dataset.url
    wx.navigateTo({ url })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-05
   * @detail   数据看板tab
   */
  onClickDataTab(e) {
    let dataBox = this.data.dataBox
    let params = e.currentTarget.dataset
    let echartData = this.data.echartData
    let result = null
    dataBox.tabLists.map((field, index) => {
      field.active = false
      if(index === params.index) {
        field.active = true
        echartData = field.data
      }
    })
    this.setData({dataBox, echartData}, () => this.selectComponent('#indexEchart').init())
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-07
   * @detail   查看简历详情
   * @return   {[type]}     [description]
   */
  viewRusumeDetail(e) {
    let params = e.currentTarget.dataset
    wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.jobhunteruid}`})
  }
})
