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
  getAdBannerApi,
  getIndexDataApi
} from '../../../../api/pages/common'

let app = getApp()

let fixedDomPosition = 0,
    positionCard = null

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    background: 'transparent',
    hasReFresh: false,
    isFixed: true,
    detail: {},
    welcomeWord: '',
    indexShowCount: {
      jobHunterInterestedToR: 0,
      recentInterview: 0,
      waitingProcessInterview: 0,
      moreRecruiter: [],
      recruiterInterestedToJ: 0
    },
    banner: {},
    bannerIndex: 0,
    companyInfos: {},
    dataBox: {
      list: [
        {
          number: '0',
          text: '机构浏览次数',
          active: true,
          data: {
            key: ['22', '23', '24', '25', '26', '27', '28'],
            value: [
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0]
            ]
          }
        },
        {
          number: '0',
          text: '职位浏览次数',
          active: false,
          data: {
            key: ['22', '23', '24', '25', '26', '27', '28'],
            value: [
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0]
            ]
          }
        },
        {
          number: '0',
          text: '招聘官浏览次数',
          active: false,
          data: {
            key: ['22', '23', '24', '25', '26', '27', '28'],
            value: [
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0]
            ]
          }
        }
      ],
      yesterday: '',
      dayPv: '',
      dayUv: '',
      activeIndex: 0
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
    if(app.loginInit) {
      if(!app.globalData.hasLogin) {
        wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
        return
      }
      this.init()
    } else {
      app.loginInit = () => {
        if(!app.globalData.hasLogin) {
          wx.navigateTo({url: `${COMMON}bindPhone/bindPhone`})
          return
        }
        this.init()
      }
    }
  },
  init () {
    if (wx.getStorageSync('choseType') === 'APPLICANT') return
    let userInfo = app.globalData.userInfo
    let companyInfos = app.globalData.recruiterDetails.companyInfo
    if(app.pageInit) {
      userInfo = app.globalData.userInfo
      companyInfos = app.globalData.recruiterDetails.companyInfo
      this.getMixdata()
      this.setData({userInfo})
      this.selectComponent('#bottomRedDotBar').init()
      this.getIndexData({contentType: 1}).then(res => this.selectComponent('#indexEchart').init())
      setTimeout(() => this.selectComponent('#indexEchart').init(), 1000)
    } else {
      app.pageInit = () => {
        userInfo = app.globalData.userInfo
        companyInfos = app.globalData.recruiterDetails.companyInfo
        this.getMixdata()
        this.setData({userInfo})
        this.selectComponent('#bottomRedDotBar').init()
        this.getIndexData({contentType: 1}).then(res => this.selectComponent('#indexEchart').init())
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
    wx.stopPullDownRefresh()
  },
  onShareAppMessage(options) {
    let that = this,
        companyInfos = wx.getStorageSync('choseType') !== 'RECRUITER' ? this.data.companyInfos : app.globalData.recruiterDetails.companyInfo
    if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
      companyInfos.id = app.globalData.recruiterDetails.currentCompanyId + 1
    }
　　return app.wxShare({
      options,
      btnTitle: `${companyInfos.companyName}正在招聘，马上约面，极速入职！我在店长多多等你！`,
      btnImageUrl: positionCard,
      btnPath: `${COMMON}homepage/homepage?companyId=${companyInfos.id}`
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
        // 超管可以选择机构
        if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
          wx.navigateTo({url: `${RECRUITER}organization/choose/choose?type=createQr&companyId=${app.globalData.recruiterDetails.companyTopId}`})
          return
        }
        wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-mechanism`})
        break
      case 'qr-position':
        if(this.data.detail.positionNum) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=qr-position`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
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
        // 超管可以选择机构
        if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
          wx.navigateTo({url: `${RECRUITER}organization/choose/choose?type=createPost&companyId=${app.globalData.recruiterDetails.companyTopId}`})
          return
        }
        // 该机构的职位上线状态
        if(app.globalData.recruiterDetails.companyInfo.positionTotal.online) {
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=company&companyId=${this.data.detail.companyId}`})
          wx.setStorageSync('companyPosterdata', this.data.companyInfos)
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'position-mechanism':
        // 该机构的职位上线状态
        if(this.data.detail.positionNum) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=ps-position`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'recruiter-mechanism':
        // 该机构的职位上线状态
        if(this.data.detail.positionNum) {
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=recruiter&uid=${app.globalData.recruiterDetails.uid}`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'hidePublicPositionTips':
        this.setData({showPublicPositionTips: false})
        break
      case 'candidate':
        wx.reLaunch({url: `${RECRUITER}candidate/candidate`})
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
    let callback = () => {
      this.getIndexData({contentType: params.index + 1}).then(() => this.selectComponent('#indexEchart').init())
    }
    dataBox.list.map((field, index) => field.active = index === params.index ? true : false)
    dataBox.activeIndex = Number(params.index)
    this.setData({dataBox}, () => callback())
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
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-12
   * @detail   获取数据接口
   * @return   {[type]}   [description]
   */
  getIndexData(params) {
    return getIndexDataApi(params).then(res => {
      let dataBox = this.data.dataBox
      let echartData = this.data.echartData
      // let myDay = new Date()
      // myDay.setTime(myDay.getTime() - 1 * 24 * 60 * 60 * 1000)
      // dataBox.yesterday = myDay.getMonth() + 1 + '月' + myDay.getDate() + '日'

      let key = []
      let value = [[],[]]
      dataBox.list[0].number = res.data.currentData.company
      dataBox.list[1].number = res.data.currentData.position
      dataBox.list[2].number = res.data.currentData.recruiter
      
      res.data.history.map((v, i, arr) => {
        let date = new Date(v.date)
        let item = null
        item = i === 0 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
        // if(i === 0) {
        //   item = date.getMonth() + 1 + '月' + date.getDate() + '日'
        // } else {
        //   item = date.getDate()
        // }
        key.push(item)
        value[1].push(v.uv)
        value[0].push(v.pv)
        if(i === arr.length - 1) {
          dataBox.dayPv = v.pv
          dataBox.dayUv = v.uv
          let myDay = new Date(v.date)
          dataBox.yesterday = myDay.getMonth() + 1 + '月' + myDay.getDate() + '日'
        }
      })
      dataBox.list.map(v => {
        v.data.key = key
        v.data.value = value
      })
      dataBox.activeIndex = 0
      this.setData({ dataBox })
    })
  }
})
