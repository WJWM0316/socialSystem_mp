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

import {
  getPositionListNumApi,
  getCompanyTopPositionListNumApi
} from '../../../../api/pages/position.js'

import {shareRecruiter} from '../../../../utils/shareWord.js'

let app = getApp()

let fixedDomPosition = 0,
    positionCard = null,
    recruiterCard = null
function showTips() {
  if(wx.getStorageSync('notShowAccountSecurityTips')) return
  if(!app.globalData.userInfo.isCancelSetPassword) { //0显示 1不显示
      app.wxConfirm({
        title: '提示',
        content: '您的账号尚未设置密码，为了账户安全，请先创建登录密码。',
        confirmText: '设置密码',
        showCancel: true,
        cancelText: '取消',
        cancelBack: () => {
          wx.setStorageSync('notShowAccountSecurityTips', 1)
        },
        confirmBack: () => {
          wx.setStorageSync('notShowAccountSecurityTips', 1)
          wx.navigateTo({url: `${COMMON}forgetPwd/forgetPwd?step=3&title=设置密码&type=set`})
        }
      })
    }
}

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
      recentInterview: 0,
      waitingProcessInterview: 0,
      browseMyselfCount: 0
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
          data: {}
        },
        {
          number: '0',
          text: '职位浏览次数',
          active: false,
          data: {}
        },
        {
          number: '0',
          text: '招聘官浏览次数',
          active: false,
          data: {}
        }
      ],
      yesterday: '',
      dayPv: '',
      dayUv: '',
      activeIndex: 0
    },
    dynamics: [],
    showPublicPositionTips: false,
    userInfo: app.globalData.recruiterDetails,
    pageShow: true,
    positionInfos: {},
    shareType: '',
    tipsType: '',
    model: {
      show: false,
      title: '成功生成链接',
      link: ''
    }
  },
  onLoad() {
    let choseType = wx.getStorageSync('choseType') || ''
    this.setData({choseType})
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
    this.setData({pageShow: true})
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
    let callback = () => {
      // 处理海报生成问题
      this.setData({userInfo: {}})
      app.getAllInfo().then(res => {
        let companyInfos = res.companyInfo
        let isCompanyTopAdmin = res.isCompanyTopAdmin
        this.getMixdata()
        this.setData({userInfo: res, companyInfos, isCompanyTopAdmin}, () => showTips())
        this.selectComponent('#bottomRedDotBar').init()
      })
    }
    if(app.pageInit) {
      callback()
    } else {
      app.pageInit = () => callback()
    }
  },
  getMixdata() {
    this.getIndexShowCount().then(() => this.getBanner())
    this.getWelcomeWord()
    setTimeout(() => {
      this.getIndexData().then(res => this.selectComponent('#indexEchart').init())
    }, 500)
  },
  getBanner() {
    return getAdBannerApi({
      location: 'recruiter_index', 
      hasLoading: false
    }).then(res => this.setData({banner: res.data}))
  },
  getIndexShowCount() {
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'APPLICANT') {
        resolve()
        return
      }
      getIndexShowCountApi({hasLoading: false}).then(res => {
        this.setData({
          indexShowCount: res.data, 
          detail: res.data.recruiterInfo, 
          dynamics: res.data.dynamics
        }, () => resolve(res))
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
    let btnTitle = `${companyInfos.companyName}正在招聘，马上约面，极速入职！`
    let btnImageUrl = positionCard
    let btnPath = `${COMMON}homepage/homepage?companyId=${companyInfos.id}&sCode=${app.globalData.recruiterDetails.sCode}&sourceType=shr`
    
    if(options.target && options.target.dataset.type === 'recruiter') {
      btnTitle = shareRecruiter()
      btnImageUrl = recruiterCard
      btnPath = `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.userInfo.uid}&sCode=${this.data.userInfo.sCode}&sourceType=shr`
    }
    
　　return app.wxShare({
      options,
      btnTitle,
      btnImageUrl,
      btnPath
    })
  },
  onPageScroll(e) {
    if(e.scrollTop > 10) {
      if (this.data.background !== '#652791') this.setData({isFixed: true, background: '#652791'})
    } else {
      if (this.data.background !== 'transparent') this.setData({isFixed: false, background: 'transparent'})
    }
  },
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let orgData = wx.getStorageSync('orgData')
    let model = this.data.model
    this.setData({tipsType: route})
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
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-mechanism&companyId=${this.data.detail.companyId}`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'qr-position':
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=qr-position`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'qr-recruiter':
        if(this.data.positionInfos.online) {
          if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
            wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-recruiter&uid=${app.globalData.recruiterDetails.uid}&companyId=${orgData.id}`})
          } else {
            wx.navigateTo({url: `${RECRUITER}createQr/createQr?type=qr-recruiter&uid=${app.globalData.recruiterDetails.uid}&companyId=${app.globalData.recruiterDetails.companyInfo.id}`})
          }
          
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'echart':
        wx.navigateTo({
          url: `${RECRUITER}echart/echart`,
          success: () => {
            setTimeout(() => this.setData({pageShow: false}), 600)
          }
        })
        break
      case 'shareCompany':
        // 超管可以选择机构
        if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
          wx.navigateTo({url: `${RECRUITER}organization/list/list?type=shareCompany&companyId=${app.globalData.recruiterDetails.companyTopId}`})
          return
        }
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
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=company&companyId=${this.data.detail.companyId}`})
          wx.setStorageSync('companyPosterdata', this.data.companyInfos)
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'poster-position':
        // 该机构的职位上线状态
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=ps-position`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'poster-recruiter':
        // 该机构的职位上线状态
        if(this.data.positionInfos.online) {
          if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
            wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=recruiter&uid=${app.globalData.recruiterDetails.uid}&companyId=${orgData.id}`})
          } else {
            wx.navigateTo({url: `${COMMON}poster/createPost/createPost?type=recruiter&uid=${app.globalData.recruiterDetails.uid}&companyId=${app.globalData.recruiterDetails.companyInfo.id}`})
          }
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
      case 'shareRecruiter':
        break
      case 'sharePositionMin':
        // 该机构的职位上线状态
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=ps-position-min`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'type-recruiter':
        this.setData({shareType: 'type-recruiter'})
        break
      case 'type-company':
        this.setData({shareType: 'type-company'})
        break
      case 'path-mechanism':
        let homepageUrl = `${COMMON}homepage/homepage?companyId=${this.data.detail.companyId}`.slice(1)
        if (app.globalData.recruiterDetails.isCompanyTopAdmin) {
          wx.navigateTo({url: `${RECRUITER}organization/list/list?type=path-mechanism&companyId=${app.globalData.recruiterDetails.companyTopId}`})
          return
        }
        app.wxConfirm({
          title: '成功生成链接',
          content: `链接为：${homepageUrl}`,
          confirmText: '复制链接',
          showCancel: true,
          cancelText: '取消',
          confirmBack: () => {
            wx.setClipboardData({data: homepageUrl })
          },
          cancelBack: () => {}
        })
        // model.link = homepageUrl
        // model.show = true
        // this.setData({model})
        break
      case 'path-position':
        // 已经有在线职位
        if(this.data.positionInfos.online) {
          wx.navigateTo({url: `${RECRUITER}organization/position/position?type=path-position`})
        } else {
          this.setData({showPublicPositionTips: true})
        }
        break
      case 'path-recruiter':
        let recruiterUrl = `${COMMON}recruiterDetail/recruiterDetail?uid=${app.globalData.recruiterDetails.uid}`.slice(1)
        app.wxConfirm({
          title: '成功生成链接',
          content: `链接为：${recruiterUrl}`,
          confirmText: '复制链接',
          showCancel: true,
          cancelText: '取消',
          cancelBack: () => {},
          confirmBack: () => {
            wx.setClipboardData({
              data: recruiterUrl,
              success: () => {
                app.wxToast({title: '成功复制链接'})
              }
            })
          }
        })
        // model.link = recruiterUrl
        // model.show = true
        // this.setData({model})
        break
      case 'toolUse':
        let path = encodeURIComponent(`${WEBVIEW}instructions?page=instructions`)
        wx.navigateTo({url: `${COMMON}webView/webView?type=optimal&p=${path}`})
        break
      default:
        break
    }
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
      this.getIndexData(params.index).then(() => this.selectComponent('#indexEchart').init())
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
    wx.navigateTo({url: `${COMMON}resumeDetail/resumeDetail?uid=${params.uid}`})
  },
  formatDate(timestamp) {
    let date = new Date(timestamp)
    let YY = date.getFullYear() + '-'
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    return YY + MM + DD
  },
  /**
   * @Author   小书包
   * @DateTime 2019-09-12
   * @detail   获取数据接口
   * @return   {[type]}   [description]
   */
  getIndexData(index = 0) {
    let getPositionNumApi = this.data.userInfo.isCompanyTopAdmin ? getCompanyTopPositionListNumApi : getPositionListNumApi
    let orgData = wx.getStorageSync('orgData')
    let start = new Date()
    let end = new Date()
    start.setTime(start.getTime() - 24 * 7 * 60 * 60 * 1000)
    end.setTime(end.getTime() - 1 * 24 * 60 * 60 * 1000)
    let startDate = this.formatDate(new Date(start))
    let endDate = this.formatDate(new Date(end))

    let params = {startDate, endDate,}

    let params2 = {recruiter: app.globalData.recruiterDetails.uid}

    if(app.globalData.recruiterDetails.isCompanyTopAdmin) {
      params.companyId = orgData.id
      params2.companyId = orgData.id
    }

    getPositionNumApi(params2).then(res => this.setData({positionInfos: res.data}))

    return getIndexDataApi(params).then(res => {
      let dataBox = this.data.dataBox
      let echartData = this.data.echartData
      let tem = [
        {
          key: [],
          value: [[],[]]
        },
        {
          key: [],
          value: [[],[]]
        },
        {
          key: [],
          value: [[],[]]
        }
      ]

      let setDefault = () => {
        let tem = {}
        let key = []
        for(let i = 7; i > 0; i--) {
          let start = new Date(), day, month, day1
          start.setTime(start.getTime() - 24 * i * 60 * 60 * 1000)
          // day = start.getDate()
          month = start.getMonth() + 1 < 10 ? `0${start.getMonth() + 1}` : start.getMonth() + 1
          day1 = start.getDate() < 10 ? `0${start.getDate()}` : start.getDate()
          // if(i === 7 || i === 1) day = start.getMonth() + 1 + '月' + start.getDate() + '日'
          // key.push(day)
          key.push(`${month}.${day1}`)
        }
        return {
          key,
          value: [[0,0,0,0,0,0], [0,0,0,0,0,0]]
        }
      }
      let defaultData = setDefault()
      dataBox.list[0].number = res.data.companyPv
      dataBox.list[1].number = res.data.positionPv
      dataBox.list[2].number = res.data.recruiterPv
      
      if(res.data.data.company.data.length) {
        res.data.data.company.data.reverse().map((v, i, arr) => {
          let item2 = v.date.slice(5).replace('-', '.')
          tem[0].key.push(item2)
          // let date = new Date(v.date)
          // let item = i === 0 || i === arr.length - 1 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          // tem[0].key.push(item)
          tem[0].value[0].push(v.companyVisitPv)
          tem[0].value[1].push(v.companyVisitUv)
        })
      } else {
        tem[0].key = defaultData.key
        tem[0].value = defaultData.value
      }
      if(res.data.data.position.data.length) {
        res.data.data.position.data.reverse().map((v, i, arr) => {
          let item2 = v.date.slice(5).replace('-', '.')
          tem[1].key.push(item2)
          // let date = new Date(v.date)
          // let item = i === 0 || i === arr.length - 1 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          // tem[1].key.push(item)
          tem[1].value[0].push(v.positionVisitPv)
          tem[1].value[1].push(v.positionVisitUv)
        })
      } else {
        tem[1].key = defaultData.key
        tem[1].value = defaultData.value
      }

      if(res.data.data.recruiter.data.length) {
        res.data.data.recruiter.data.reverse().map((v, i, arr) => {
          let item2 = v.date.slice(5).replace('-', '.')
          tem[2].key.push(item2)
          // let date = new Date(v.date)
          // let item = i === 0 || i === arr.length - 1 ? date.getMonth() + 1 + '月' + date.getDate() + '日' : date.getDate()
          // tem[2].key.push(item)
          tem[2].value[0].push(v.recruiterVisitPv)
          tem[2].value[1].push(v.recruiterVisitUv)
        })
      } else {
        tem[2].key = defaultData.key
        tem[2].value = defaultData.value
      }
      
      dataBox.list.map((v,i,arr) => {
        v.data.key = tem[i].key,
        v.data.value = tem[i].value
      })
      dataBox.activeIndex = index
      this.setData({ dataBox })
    })
  },
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  confirmBtn() {
    wx.setClipboardData({
      data: this.data.model.link,
      success: () => {
        app.wxToast({title: '成功复制链接'})
      }
    })
  }
})
