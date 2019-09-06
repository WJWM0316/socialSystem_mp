import { getRecruiterPositionListApi, getPositionListNumApi } from '../../../../../api/pages/position.js'

import {RECRUITER, COMMON} from '../../../../../config.js'

import {
  getCompanyIdentityInfosApi
} from '../../../../../api/pages/company.js'

let app = getApp()
let identityInfos = {},
    offLinePositionNum = 0
Page({
  data: {
    navH: app.globalData.navHeight,
    positionStatus: '1',
    onLinePositionNum: 0,
    onBottomStatus: 0,
    offBottomStatus: 0,
    isSuper: 1,
    onLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    offLinePosition: {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    },
    hasReFresh: false,
    telePhone: app.globalData.telePhone,
    options: {},
    redDotInfos: {}
  },
  onLoad(options) {
    wx.setStorageSync('choseType', 'RECRUITER')
    if(options.positionStatus) {
      this.setData({positionStatus: options.positionStatus})
    }
  },
  onShow() {
    this.getCompanyIdentityInfos()
    let onLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    let offLinePosition = {
      list: [],
      pageNum: 1,
      count: 20,
      isLastPage: false,
      isRequire: false
    }
    this.selectComponent('#bottomRedDotBar').init()
    getPositionListNumApi({recruiter: app.globalData.recruiterDetails.uid, ...app.getSource()}).then(res => {
      offLinePositionNum = res.data.offline
      let redDotInfos = app.globalData.redDotInfos
      this.setData({onLinePosition, offLinePosition, onLinePositionNum: res.data.online, redDotInfos})
      this.getLists()
    })
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   获取个人身份信息
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    getCompanyIdentityInfosApi({hasLoading}).then(res => identityInfos = res.data)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   发布职位
   * @return   {[type]}   [description]
   */
  publicPosition() {
    // 跟后端协商  =1 则可以发布
    if(identityInfos.identityAuth) {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
      return;
    }

    if(identityInfos.status === 1) {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
    }

    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(identityInfos.status === 0 || identityInfos.status === 2) {
      app.wxConfirm({
        title: '',
        content: `您当前认证身份信息已提交申请，店长多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
        cancelText: '联系客服',
        confirmText: '我知道了',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
        },
        cancelBack: () => {
          wx.makePhoneCall({phoneNumber: this.data.telePhone})
        }
      })
      return;
    }

    // 没有填身份证 则没有验证
    if(!identityInfos.identityNum) {
      app.wxConfirm({
        title: '',
        content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
        confirmText: '去认证',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
        }
      })
      return;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-24
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getLists() {
    switch(this.data.positionStatus) {
      case '1':
        return this.getOnlineLists()
        break;
      case '2':
        return this.getOffLineLists()
        break;
      default:
        break;
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-27
   * @detail   获取列表数据
   * @return   {[type]}   [description]
   */
  getOnlineLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let onLinePosition = this.data.onLinePosition
      let onBottomStatus = this.data.onBottomStatus
      getRecruiterPositionListApi({is_online: 1, count: onLinePosition.count, page: onLinePosition.pageNum, hasLoading})
        .then(res => {
          onLinePosition.list = onLinePosition.list.concat(res.data || [])
          onLinePosition.pageNum++
          onLinePosition.isRequire = true
          if (!res.meta || !res.meta.nextPageUrl) {
            onLinePosition.isLastPage = true
            onBottomStatus = 2
          } else {
            onBottomStatus = 0
          }
          resolve(res)
          this.setData({onLinePosition, onBottomStatus})
        })
    })
  },
  getOffLineLists(hasLoading = true) {
    return new Promise((resolve, reject) => {
      let offLinePosition = this.data.offLinePosition
      let offBottomStatus = this.data.offBottomStatus
      getRecruiterPositionListApi({is_online: 2, count: offLinePosition.count, page: offLinePosition.pageNum, hasLoading})
        .then(res => {
          offLinePosition.list = offLinePosition.list.concat(res.data || [])
          offLinePosition.pageNum++
          offLinePosition.isRequire = true
          if (!res.meta || !res.meta.nextPageUrl) {
            offLinePosition.isLastPage = true
            offBottomStatus = 2
          } else {
            offBottomStatus = 0
          }
          this.setData({offLinePosition, offBottomStatus})
          resolve()
        })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   detail
   * @return   {[type]}     [description]
   */
  routeJump(e) {
    let params = e.currentTarget.dataset
    switch(params.action) {
      case 'add':
        this.publicPosition()
        break
      case 'detail':
        wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionId}`})
        break
      case 'mechanism':
        wx.navigateTo({url: `${RECRUITER}mechanism/list/list`})
        break
      case 'fail':
        wx.navigateTo({url: `${COMMON}positionDetail/positionDetail?positionId=${params.positionId}&type=clear_red_dot`})
        break
      default:
        break
    }
  },
  /* 子级tab栏切换 */
  onClickTab(e) {
    let positionStatus = e.currentTarget.dataset.status
    this.selectComponent('#bottomRedDotBar').init()
    if (positionStatus === '2') {
      if (!this.data.offLinePosition.isRequire) {
        this.getOffLineLists()
      }
    } else {
      if (!this.data.onLinePosition.isRequire) {
        this.getOnlineLists()
      }
    }
    this.setData({positionStatus})
  },
  getResult(e) {
    this.setData({redDotInfos: e.detail})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   detail
   * @return   {[type]}     [description]
   */
  onReachBottom(e) {
    if (this.data.positionStatus === '1') {
      let onLinePosition = this.data.onLinePosition
      if (!onLinePosition.isLastPage) {
        this.setData({onBottomStatus: 1})
        this.getOnlineLists(false)
      }
    } else {
      let offLinePosition = this.data.offLinePosition
      if (!offLinePosition.isLastPage) {
        this.setData({offBottomStatus: 1})
        this.getOffLineLists(false)
      }
    }
  },
  onPullDownRefresh(e) {
    if (this.data.positionStatus === '1') {
      let onLinePosition = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false
      }
      this.setData({onLinePosition, onBottomStatus: 0, hasReFresh: true})
      this.getOnlineLists(false).then(res => {
        wx.stopPullDownRefresh()
        this.setData({hasReFresh: false})
      }).catch(e => {
        wx.stopPullDownRefresh()
      })
    } else {
      let offLinePosition = {
        list: [],
        pageNum: 1,
        count: 20,
        isLastPage: false,
        isRequire: false
      }
      this.setData({offLinePosition, offBottomStatus: 0, hasReFresh: true})
      this.getOffLineLists(false).then(res => {
        wx.stopPullDownRefresh()
        this.setData({hasReFresh: false})
      }).catch(e => {
        wx.stopPullDownRefresh()
      })
    }
    app.getBottomRedDot()
    this.getCompanyIdentityInfos()
  },
  onShareAppMessage(options) {
    let that = this
　　return app.wxShare({options})
  }
})
