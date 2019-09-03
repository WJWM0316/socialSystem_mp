import { getRecruiterOtherInfosApi } from '../../../../../../api/pages/recruiter.js'

import {RECRUITER, COMMON, WEBVIEW, VERSION} from '../../../../../../config.js'

import {getUserRoleApi} from "../../../../../../api/pages/user.js"

import {shareRecruiter} from '../../../../../../utils/shareWord.js'

let app = getApp()

let recruiterCard = ''

Page({
	data: {
    recruiterInfo: {},
    isRecruiter: app.globalData.isRecruiter,
    cdnPath: app.globalData.cdnImagePath,
    navH: app.globalData.navHeight,
    isIphoneX: app.globalData.isIphoneX,
    hasReFresh: false,
    pageInfos: {},
    navbarBg: 'transparent',
    telePhone: app.globalData.telePhone,
    showScanIcon: true,
    redDotInfos: {}
  },
  onLoad() {
    wx.setStorageSync('choseType', 'RECRUITER')
    recruiterCard = ''
    let recruiterInfo = app.globalData.recruiterDetails
    if (recruiterInfo.uid) {
      this.setData({recruiterInfo})
    } else {
      app.getAllInfo().then(res => {
        recruiterInfo = app.globalData.recruiterDetails
        this.setData({recruiterInfo})
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-11
   * @detail   招聘官-“我的”页面下面一些栏目简单的信息
   * @return   {[type]}   [description]
   */
  getRecruiterOtherInfos() {
    getRecruiterOtherInfosApi({...app.getSource()}).then(res => {
      this.setData({pageInfos: res.data})
    })
  },
  onShow() {
    this.selectComponent('#bottomRedDotBar').init()
    this.getRecruiterOtherInfos()
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-19
   * @detail   前往更新用户资料
   * @return   {[type]}   [description]
   */
  jumpUpdateInfos() {
    wx.navigateTo({
      url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.recruiterInfo.uid}`
    })
    app.wxReportAnalytics('btn_report', {
      btn_type: 'share_myself_B'
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-24
   * @detail   跳出当前页面
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    const pageInfos = this.data.pageInfos
    switch(route) {
      case 'company':
        wx.navigateTo({url: `${RECRUITER}company/indexEdit/indexEdit`})
        break
      case 'base':
        wx.navigateTo({url: `${RECRUITER}user/mine/base/base`})
        break
      case 'identity':
        this.viewIdentity()
        break
      case 'settings':
        wx.navigateTo({url: `${COMMON}settings/settings`})
        break
      case 'poster':
        wx.navigateTo({url: `${COMMON}poster/recruiter/recruiter`})
        app.wxReportAnalytics('btn_report', {
          btn_type: 'created_posters_B'
        })
        break
      case 'team':
        wx.navigateTo({
          url: `${RECRUITER}company/recruiterList/recruiterList?companyId=${this.data.recruiterInfo.companyInfo.id}`
        })
        break
      case 'interest':
        wx.navigateTo({url: `${RECRUITER}company/interest/interest`})
        break
      case 'adviser':
        if(pageInfos.haveAdvisorService) {
          wx.navigateTo({url: `${RECRUITER}user/adviser/adviser`})
        } else {
          let path = encodeURIComponent(`${WEBVIEW}optimal?vkey=${this.data.recruiterInfo.vkey}&iso=0&version=${VERSION}&`)
          wx.navigateTo({url: `${COMMON}webView/webView?type=optimal&p=${path}`})
        }  
        break
      case 'myAccount':
        wx.navigateTo({url: `${RECRUITER}user/myAccount/myAccount`})
        break
      default:
        break
    }
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  toRank () {
    wx.navigateTo({url: `${COMMON}rank/rank`})
    app.wxReportAnalytics('btn_report', {
      btn_type: 'look_at_the_rank'
    })
  },
  getResult(e) {
    this.setData({redDotInfos: e.detail})
  },
  preview(e) {
    wx.previewImage({
      current: this.data.recruiterInfo.avatar.url,
      urls: [this.data.recruiterInfo.avatar.url],
      complete() {
      }
    })
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.telePhone // 仅为示例，并非真实的电话号码
    })
  },
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
    app.getAllInfo().then(res => {
      this.setData({recruiterInfo: res, hasReFresh: false}, () => wx.stopPullDownRefresh())
      this.getRecruiterOtherInfos()
    })
  },
  getCreatedImg(e) {
    recruiterCard = e.detail
  },
  onPageScroll(e) {
    let isFixed = e.scrollTop > this.data.navH
    if(e.scrollTop > this.data.navH - 5) {
      if (this.data.navbarBg === 'transparent') this.setData({navbarBg: '#652791'})
    } else {
      if (this.data.navbarBg !== 'transparent') this.setData({navbarBg: 'transparent'})
    }
  },
  onShareAppMessage(options) {
    let that = this
    app.shareStatistics({
      id: that.data.recruiterInfo.uid,
      type: 'recruiter',
      sCode: that.data.recruiterInfo.sCode,
      channel: 'card'
    })
　　return app.wxShare({
      options,
      title: shareRecruiter(),
      path: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.recruiterInfo.uid}&sCode=${this.data.recruiterInfo.sCode}&sourceType=shr`,
      imageUrl: recruiterCard
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-20
   * @detail   查看认证状态
   * @return   {[type]}   [description]
   */
  viewIdentity() {
    
    const pageInfos = this.data.pageInfos

    //未认证
    if(!pageInfos.identityAuth && (pageInfos.identityStatus !== 0 && pageInfos.identityStatus !== 1 && pageInfos.identityStatus !== 2)) {
      wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
      return
    }

    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(pageInfos.identityStatus === 0 || pageInfos.identityStatus === 2) {
      wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
      return
    }
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为求职者身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
  }
})
