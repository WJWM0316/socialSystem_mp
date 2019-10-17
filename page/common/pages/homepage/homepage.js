import {
  getCompanyInfosApi,
  getCurCompanyInfosApi,
  getCompanyOrglistApi,
  getCompanyApplyInfoApi
} from '../../../../api/pages/company.js'

import {
  APPLICANT,
  COMMON,
  RECRUITER
} from '../../../../config.js'

import {getSelectorQuery} from "../../../../utils/util.js"
import { agreedTxtC, agreedTxtB } from '../../../../utils/randomCopy.js'

let app = getApp()
let positionCard = '',
    callBackNum = 0,
    domHeight = 0,
    positionDomTop = 0
Page({
  data: {
    navH: app.globalData.navHeight,
    tab: 'about',
    indicatorDots: false,
    autoplay: false,
    interval: 1000,
    duration: 1000,
    query: {},
    companyInfos: {},
    otherOrgList: [],
    hasLogin: 0,
    cdnImagePath: app.globalData.cdnImagePath,
    typeId: null,
    isFixed: false,
    isRecruiter: app.globalData.isRecruiter,
    isIphoneX: app.globalData.isIphoneX,
    isBangs: app.globalData.isBangs,
    map: {
      longitude: 0,
      latitude: 0,
      markers: []
    },

    hasReFresh: false,
    onBottomStatus: 0,
    swiperIndex: 0,
    choseType: '',
    showNav: false
  },
  onLoad(options) {
    if (options.scene) options = app.getSceneParams(options.scene)
    let showNav = this.data.showNav
    if (wx.getStorageSync('choseType') === 'RECRUITER') showNav = true
    this.setData({query: options, choseType: wx.getStorageSync('choseType'), showNav})
    positionCard = ''
  },
  onShow() {
    let hasLogin = wx.getStorageSync('token')
    if (app.loginInit) {
      if(wx.getStorageSync('choseType') !== 'RECRUITER') {
        this.selectComponent('#bottomRedDotBar').init()
      }
      this.getCompanyDetail().then(() => this.setData({isRecruiter: app.globalData.isRecruiter, hasLogin}))
    } else {
      app.loginInit = () => {
        if(wx.getStorageSync('choseType') !== 'RECRUITER') {
          this.selectComponent('#bottomRedDotBar').init()
        }
        this.getCompanyDetail().then(() => this.setData({isRecruiter: app.globalData.isRecruiter, hasLogin}))
      }
    }
  },

  getDomNodePosition() {
    getSelectorQuery('.banner').then(res => {
      domHeight = res.height
    })
  },
  // init() {
  //   return Promise.all([this.getCompanyDetail()]).then(() => this.setData({isRecruiter: app.globalData.isRecruiter}))
  // },
  toggle () {
    wx.setStorageSync('choseType', 'RECRUITER')
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },
  bindMain(e) {
    wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`})
  },
  callPhone () {
    wx.makePhoneCall({
      phoneNumber: this.data.companyInfos.mobile
    })
  },
  getCompanyDetail(hasLoading = true, isReload = false) {
    return new Promise((resolve, reject) => {
      let getCompanyInfos = null,
          params = {}
      if (this.data.query.companyId) {
        params = {id: this.data.query.companyId, hasLoading, isReload, ...app.getSource()}
        getCompanyInfos = getCompanyInfosApi
      } else {
        if (wx.getStorageSync('choseType') === 'RECRUITER') {
          wx.setStorageSync('choseType', 'APPLICANT')
          wx.reLaunch({url: app.getCurrentPagePath()})
        }
        getCompanyInfos = getCurCompanyInfosApi
      }
      getCompanyInfos(params).then(res => {
        if (wx.getStorageSync('choseType') !== 'RECRUITER') this.getCompanyOrglist(res.data.topId)
        callBackNum++
        let requireOAuth = res.meta && res.meta.requireOAuth ? res.meta.requireOAuth : false
        const companyInfos = res.data
        app.globalData.companyInfo = companyInfos
        const longitude = companyInfos.address.length ? companyInfos.address[0].lng : 0
        const latitude = companyInfos.address.length ? companyInfos.address[0].lat : 0
        const address = companyInfos.address.length ? companyInfos.address[0].address : ''
        const doorplate = companyInfos.address.length ? companyInfos.address[0].doorplate : ''
        const map = this.data.map
        map.longitude = longitude
        map.latitude = latitude
        map.address = address
        map.doorplate = doorplate
        map.enableScroll = false
        map.markers.push({
          id: 1,
          longitude,
          latitude,
          label: {
            content: companyInfos.companyName,
            fontSize:'18rpx',
            color:'#282828',
            anchorX: '30rpx',
            anchorY: '-60rpx'
          }
        })
        this.setData({companyInfos, map, requireOAuth, callBackNum}, () => {
          this.getDomNodePosition()
          if (this.data.options.pick) this.selectComponent('#shareBtn').oper()
          resolve(res)
        })
      }).catch(() => {
        let companyInfos = this.data.companyInfos
        companyInfos.noComany = true
        this.setData({companyInfos})
      })
    })
  },
  
  getCompanyOrglist (id) {
    getCompanyOrglistApi({company_id: id}).then(res => {
      if (res.data.length) {
        let list = res.data
        list.forEach((item, index) => {
          if (item.id === this.data.companyInfos.id) {
            list.splice(index, 1)
          }
        })
        this.setData({otherOrgList: list})
      } 
      
    })
  },
  swiperChange(e) {
    this.setData({swiperIndex: e.detail.current})
  },
  copyLink() {
    wx.setClipboardData({data: this.data.companyInfos.website })
  },

  routeJump(e) {
    const route = e.currentTarget.dataset.route,
          item = e.currentTarget.dataset
    switch(route) {
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map`})
        break
      case 'recruitersList':
        wx.navigateTo({url: `${RECRUITER}user/company/recruiterList/recruiterList?companyId=${this.data.companyInfos.id}`})
        break
      case 'otherOrgList':
        wx.navigateTo({url: `${RECRUITER}organization/list/list?companyId=${this.data.companyInfos.topId}`})
        break
      case 'introductionMore':
        wx.navigateTo({url: `${COMMON}homepageMore/homepageMore`})
        wx.setStorageSync('companyInfos', this.data.companyInfos)
        break
      case 'toOrg':
        wx.setStorageSync('orgData', item.item)
        wx.navigateTo({url: `${COMMON}homepage/homepage?companyId=${item.id}`})
        break
      case 'toRecruiter':
        wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${item.uid}`})
        break
      default:
        break
    }
  },

  viewMap(e) {
    const params = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      scale: 14,
      address: `${params.address} ${params.doorplate}`,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },

  previewImage(e) {
    let albumInfo = this.data.companyInfos.albumInfo.map(field => field.url)
    let current = albumInfo.find((value, now, arr) => now === this.data.swiperIndex)
    wx.previewImage({current, urls: albumInfo})
  },

  onPageScroll(e) {
    if (e.scrollTop > domHeight) {
      if (!this.data.isFixed) this.setData({isFixed: true})
    } else {
      if (this.data.isFixed) this.setData({isFixed: false})
    }
    if (this.data.choseType === 'APPLICANT') {
      if (e.scrollTop > 0) {
        if (!this.data.showNav) this.setData({showNav: true})
      } else {
        if (this.data.showNav) this.setData({showNav: false})
      }
    }
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getCompanyDetail(false, false).then(() => {
      this.setData({isRecruiter: app.globalData.isRecruiter, hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  getCompanyApplyInfo() {
    getCompanyApplyInfoApi({company_id: this.data.companyInfos.id}).then(res => {
      wx.setStorageSync('choseType', 'RECRUITER')
      switch(res.data.step) {
        case 1:
          wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
          break
        case 2:
          wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos`})
          break
        default:
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${res.data.status === 1 ?'company' : 'join'}`})
          break
      }
    }).catch(e => {
      switch(e.code) {
        case 1:
          app.wxConfirm({
            title: '身份切换',
            content: `是否切换为招聘官身份`,
            cancelText: '取消',
            confirmText: '确定',
            confirmBack: () => {
              app.toggleIdentity()
            },
            cancelBack: () => {}
          })
          break
        case 2:
          app.wxConfirm({
            title: '提示',
            content: `你已经是招聘官，请前往你的企业专属招聘小程序登录使用。`,
            showCancel: false,
            confirmText: '关闭',
            confirmBack: () => {},
            cancelBack: () => {}
          })
          break
        default:
          break
      }
    })
  },
  onShareAppMessage(options) {
    let that = this
    let imageUrl = `${that.data.cdnImagePath}shareC.png`
    let companyInfos = this.data.companyInfos,
        companyId = this.data.query.companyId
    if(!companyInfos.status) {
      return app.wxShare({options})
    }
    
    if(positionCard){
      imageUrl = positionCard
    }
    if (!this.data.query.companyId) {
      companyId = companyInfos.id
    }
    app.shareStatistics({type: 'company', infos: companyInfos, forwardType: 2})
　　return app.wxShare({
      options,
      title: `${companyInfos.companyName}正在招人，马上约面，极速入职！我在这里等你！`,
      path: `${COMMON}homepage/homepage?companyId=${companyId}&sCode=${companyInfos.sCode}&sourceType=shc`,
      imageUrl: imageUrl
    })
  }
})