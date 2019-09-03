let app = getApp()

import {RECRUITER} from '../../../../../../config.js'

import {
  getCompanyIdentityInfosApi
} from '../../../../../../api/pages/company.js'

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    hasReFresh: false,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  backEvent() {
    wx.navigateTo({url: `${RECRUITER}user/company/apply/apply?action=edit`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   切换身份
   * @return   {[type]}   [description]
   */
  toggle() {
    app.wxConfirm({
      title: '切换身份',
      content: '是否继续前往求职端？',
      confirmBack() {
        app.toggleIdentity()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   更改手机
   * @return   {[type]}   [description]
   */
  changePhone() {
    app.wxConfirm({
      title: '换个账号',
      content: '退出后不会删除任何历史数据，下次登录依然可以使用本账号',
      confirmBack() {
        app.uplogin()
      },
      cancelBack: () => {}
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   使用其他验证方式
   * @return   {[type]}   [description]
   */
  changeIndentifyMethods() {
    wx.navigateTo({url: `${RECRUITER}user/company/post/post`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取认证详情
   * @return   {[type]}   [description]
   */
  getCompanyIdentityInfos(hasLoading = true) {
    return new Promise((resolve, reject) => {
      getCompanyIdentityInfosApi({hasLoading}).then(res => {
        let companyInfos = res.data.companyInfo
        let applyJoin = res.data.applyJoin

        let from = applyJoin ? 'join' : 'company'
        resolve(res)
        if(companyInfos.status !== 3) {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${from}`})
        }
      })
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getCompanyIdentityInfos(false).then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
})