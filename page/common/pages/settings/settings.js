import {uploginApi} from "../../../../api/pages/auth.js"
import {COMMON,RECRUITER,APPLICANT} from '../../../../config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identityDesc: "面试官",
    identity: wx.getStorageSync('choseType'),
    detail: app.globalData.recruiterDetails
  },
  // onLoad: function (options) {
  //   if (wx.getStorageSync('choseType') === 'RECRUITER') {
  //     this.setData({identityDesc: "求职者"})
  //   } else {
  //     this.setData({identityDesc: "面试官"})
  //   }
  // },
  onShow() {
    let identity = wx.getStorageSync('choseType')
    if(wx.getStorageSync('choseType') === 'RECRUITER') {
      this.setData({identityDesc: "求职者", identity, detail: app.globalData.recruiterDetails})
    } else {
      this.setData({identityDesc: "面试官", identity, detail: app.globalData.recruiterDetails})
    }
  },
  upLogin() {
    app.wxConfirm({
      title: '退出登录',
      content: `确定退出当前账号吗？`,
      confirmBack() {
        app.uplogin()
      }
    })
  },
  changeMobile() {
    wx.navigateTo({
      url: `${COMMON}changeMobile/changeMobile`
    })
  },
  toggleIdentity() {
    app.wxConfirm({
      title: '身份切换',
      content: `是否切换为${this.data.identityDesc}身份`,
      confirmBack() {
        app.toggleIdentity()
      }
    })
  },
  toggleShowPhone() {
    wx.navigateTo({
      url: `${COMMON}privacySetting/privacySetting`
    })
  },
  setOrganization() {
    wx.navigateTo({
      url: `${RECRUITER}organization/setOrg/setOrg`
    })
  },
  bindAccount() {
    wx.navigateTo({
      url: `${COMMON}bindAccount/bindAccount`
    })
  }
})