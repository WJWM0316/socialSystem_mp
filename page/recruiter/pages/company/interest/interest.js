import {
  getRecruiterInterestApi
} from '../../../../../api/pages/recruiter.js'

let app = getApp()

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
    infos: {},
    recruiterInfo: {},
    telePhone: app.globalData.telePhone
  },
  onShow() {
    this.getPageInfos()
  },
  getPageInfos() {
    return new Promise((resolve, reject) => {
      let recruiterInfo = app.globalData.recruiterDetails
      if (recruiterInfo.uid) {
        this.setData({recruiterInfo})
        this.getRecruiterInterest().then(() => resolve())
      } else {
        app.getAllInfo().then(res => {
          recruiterInfo = app.globalData.recruiterDetails
          this.setData({recruiterInfo})
          this.getRecruiterInterest().then(() => resolve())
        })
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-03-11
   * @detail   获取权益信息
   * @return   {[type]}   [description]
   */
  getRecruiterInterest() {
    return new Promise((resolve, reject) => {
      getRecruiterInterestApi().then(res => {
        let infos = res.data
        infos.limitDay = this.getDay(infos.expired)
        console.log(infos)
        this.setData({infos}, () => resolve(res))
      })
    })
  },
  alert1() {
    app.wxConfirm({
      title: '升级专业版',
      content: `了解更多店长多多招聘权益，欢迎联系我们~`,
      cancelText: '考虑一下',
      confirmText: '联系客服',
      confirmBack: () => {
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
      },
      cancelBack: () => {
        // wx.makePhoneCall({phoneNumber: '020-61279889'})
      }
    })
  },
  alert2() {
    app.wxConfirm({
      title: '服务续费',
      content: `了解更多店长多多招聘权益，欢迎联系我们~`,
      cancelText: '考虑一下',
      confirmText: '联系客服',
      confirmBack: () => {
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
      },
      cancelBack: () => {
        // wx.makePhoneCall({phoneNumber: '020-61279889'})
      }
    })
  },
  call() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-21
   * @detail   下拉重新获取数据
   * @return   {[type]}              [description]
   */
  onPullDownRefresh() {
    this.setData({hasReFresh: true})
    this.getPageInfos(false).then(res => {
      this.setData({hasReFresh: false}, () => wx.stopPullDownRefresh())
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  getDay(endtime) {
    return Math.floor((endtime * 1000 - Date.parse(new Date())) / 86400000)
  }
})