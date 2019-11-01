import {uploginApi, checkSetPasswordApi} from "../../../../api/pages/auth.js"
import {getUserInfoApi} from "../../../../api/pages/user.js"

import {
  COMMON,
  RECRUITER,
  APPLICANT
} from '../../../../config.js'
let app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onShow() {
    getUserInfoApi().then(res => {
      this.setData({userInfo: res.data})
    })
  },
  changeMobile() {
    wx.navigateTo({url: `${COMMON}changeMobile/changeMobile`})
  },
  toggleShowPhone() {
    wx.navigateTo({url: `${COMMON}privacySetting/privacySetting`})
  },
  changeName() {
    wx.navigateTo({url: `${COMMON}changeName/changeName`})
  },
  changePassword() {
    let title = ''
    let type = ''
    let action = ''
    if(this.data.userInfo.isSetPassword) {
      title = '修改密码'
      type = 'modify'
    } else {
      title = '设置密码'
      type = 'set'
    }
    wx.navigateTo({url: `${COMMON}forgetPwd/forgetPwd?step=3&title=${title}&type=${type}`})
  }
})