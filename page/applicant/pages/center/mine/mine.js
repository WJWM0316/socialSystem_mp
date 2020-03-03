import {COMMON,APPLICANT,RECRUITER} from '../../../../../config.js'
import { getPersonalResumeApi, getMyInfoApi } from '../../../../../api/pages/center.js'
import {shareResume} from '../../../../../utils/shareWord.js'
let app = getApp()
let positionCard = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {},
    hasLogin: 0,
    hideBind: true,
    hasReFresh: false,
    isMicroCard: false,
    cdnImagePath: app.globalData.cdnImagePath,
    resumeAttach: {},
    navH: app.globalData.navHeight,
    isJobhunter: 0,
    isRecruiter: 0,
    telePhone: app.globalData.telePhone,
    showScanIcon: false,
    navbarBg: 'transparent'
  },
  onLoad(options) {
    positionCard = ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    let init = () => {
      if (app.globalData.isJobhunter) {
        let myInfo = app.globalData.resumeInfo
        this.setData({myInfo, resumeAttach: myInfo.resumeAttach || {}})
      }
    }
    if (app.getRoleInit) {
      this.getMyInfo()
    } else {
      app.getRoleInit = () => {
        this.getMyInfo()
      }
    }
    if(app.pageInit) {
      init()
    } else {
      app.pageInit = () => {
        init()
      }
    }
  },
  getMyInfo () {
    let hasLogin = app.globalData.hasLogin,
        isJobhunter = app.globalData.isJobhunter,
        isRecruiter = app.globalData.isRecruiter,
        showScanIcon = hasLogin && isJobhunter ? true : false
    this.setData({isJobhunter, isRecruiter, hasLogin, showScanIcon})
    this.selectComponent('#bottomRedDotBar').init()
    if (app.globalData.isMicroCard && !app.globalData.isJobhunter) {
      getMyInfoApi().then(res => {
        let myInfo = res.data
        this.setData({myInfo, isMicroCard: true})
      })
    }
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.telePhone
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  online() {
    app.wxConfirm({
      title: '联系客服',
      content: '欢迎添加多多社交招聘系统了解更多内容 有疑问请添加客服微信：zike107',
      confirmText: '复制',
      confirmBack() {
        wx.setClipboardData({
          data: 'zike107',
          success(res) {
            wx.getClipboardData({
              success(res) {
                app.wxToast({
                  title: '复制成功',
                  icon: 'success'
                })
              }
            })
          }
        })
      }
    })
  },
  onHide() {
    this.setData({hideBind: true})
  },
  login() {
    this.setData({hideBind: false})
  },
  jump(e) {
    switch(e.currentTarget.dataset.type) {
      case "settings":
        wx.navigateTo({
          url: `${COMMON}settings/settings`
        })
        break
      case "poster":
        wx.navigateTo({
          url: `${COMMON}poster/resume/resume`
        })
        break
      case "scanCode":
        if(this.data.isJobhunter) {
          wx.navigateTo({url: `${APPLICANT}center/attachment/attachment`})
        }
        break
      case 'interest':
        wx.navigateTo({
          url: `${APPLICANT}jobs/like/like`
        })
        break
      case 'toCreate':
        app.getRoleInfo().then(res => {
          let url = ''
          if(!res.data.hasCard) {
            url = `${APPLICANT}createUser/createUser?micro=true`
          } else {
            url = `${APPLICANT}createUser/createUser`
          }
          wx.navigateTo({url})
        })
        break
      case 'interested_in_me':
        wx.navigateTo({
          url: `${APPLICANT}jobs/likeMe/likeMe`
        })
        break
      case 'resume':
        if(this.data.isMicroCard) {
          app.wxConfirm({
            title: '完善简历',
            content: '前往完善在线简历后，即可上传附件简历',
            cancelText: '取消',
            confirmText: '立即前往',
            cancelBack() {},
            confirmBack: () => {
              let path = `${APPLICANT}center/mine/mine?a=11`
              app.getRoleInfo().then(res => {
                let url = ''
                if(!res.data.hasCard) {
                  url = `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&from=2&micro=true`
                } else {
                  url = `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&from=2`
                }
                wx.navigateTo({url})
              })
            }
          })
        } else {
          wx.navigateTo({
            url: `${APPLICANT}center/uploadAttach/uploadAttach`
          })  
        }        
        break
      default:
        break
    }
  },
  /* 去完善简历 */
  completeResume () {
    wx.navigateTo({
      url: `${APPLICANT}createUser/createUser?from=1`
    })
  },
  /* 编辑简历 */
  toEdit () {
    if (!this.data.isJobhunter) return
    wx.navigateTo({
      url: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.myInfo.uid}&preview=true`,
    })
  },
  share () {
    this.selectComponent('#share').oper()
  },
  onPullDownRefresh(hasLoading = true) {
    let hasLogin = false
    let myInfo = {}
    let isJobhunter = 0
    let showScanIcon = this.data.showScanIcon
    this.setData({hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
    getPersonalResumeApi({...app.getSource()}).then(res => {
      hasLogin = app.globalData.hasLogin
      isJobhunter = app.globalData.isJobhunter
      showScanIcon = hasLogin && isJobhunter ? true : false
      app.globalData.resumeInfo = res.data
      this.setData({hasReFresh: false, myInfo: res.data, showScanIcon})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage(options) {
    let that = this
    let imageUrl = `${that.data.cdnImagePath}shareC.png`
    app.shareStatistics({
      id: that.data.myInfo.uid,
      type: 'jobhunter',
      sCode: that.data.myInfo.sCode,
      channel: 'card'
    })
　　return app.wxShare({
      options,
      btnTitle: shareResume(),
      btnPath: `${COMMON}resumeDetail/resumeDetail?uid=${this.data.myInfo.uid}&sCode=${this.data.myInfo.sCode}&sourceType=shj`,
      imageUrl: imageUrl,
      btnImageUrl: positionCard
    })
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为面试官身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onPageScroll(e) {
    let isFixed = e.scrollTop > this.data.navH
    if(e.scrollTop > this.data.navH - 5) {
      if (this.data.navbarBg === 'transparent') this.setData({navbarBg: '#652791'})
    } else {
      if (this.data.navbarBg !== 'transparent') this.setData({navbarBg: 'transparent'})
    }
  }
})