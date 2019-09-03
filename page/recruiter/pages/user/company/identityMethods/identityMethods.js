let app = getApp()

import {RECRUITER} from '../../../../../../config.js'

import {
  upJoinTypeApi
} from '../../../../../../api/pages/company.js'

Page({
  data: {
    cdnImagePath: app.globalData.cdnImagePath,
  	telePhone: app.globalData.telePhone,
    options: {}
  },
  onLoad(options) {
    this.setData({options})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   拨打电话
   * @return   {[type]}   [description]
   */
  callPhone() {
    wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   页面跳转
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    let route = e.currentTarget.dataset.route
    let options = this.data.options
    let applyJoin = options.from === 'join' ? true : false
    let url = ''
    switch(route) {
      case 'email':
        if(applyJoin) {
          url = `${RECRUITER}user/company/email/email?companyId=${options.companyId}&suffix=${options.suffix}&from=join`
        } else {
          url = `${RECRUITER}user/company/email/email?companyId=${options.companyId}&from=company`
        }
        wx.navigateTo({url})
        break
      case 'license':
        wx.navigateTo({url: `${RECRUITER}user/company/upload/upload?companyId=${options.companyId}`})
        break
      case 'call':
        wx.makePhoneCall({phoneNumber: app.globalData.telePhone})
        break
      case 'notice':
        upJoinTypeApi({company_id: options.companyId, join_type: 1})
        .then(() => wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`}))
        .catch(err => {
          if(err.code === 307) {
            app.wxToast({
              title: err.msg,
              callback() {
                wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
              }
            })
          } 
        })
        break
      default:
        break
    }
  }
})