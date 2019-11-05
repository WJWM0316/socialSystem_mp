import {
  setUserNameApi
} from "../../../../api/pages/auth.js"
import { userNameNewReg } from '../../../../utils/fieldRegular.js'
import {COMMON,RECRUITER} from '../../../../config.js'
import {getUserInfoApi} from "../../../../api/pages/user.js"

let app = getApp()
Page({
  data: {
    username: ''
  },
  onShow() {
    getUserInfoApi().then(res => { this.setData({username: res.data.username}) })
  },
  bindInput(e) {
    let username = this.data.username
    username = e.detail.value
    this.setData({username})
  },
  next() {
    if (!this.data.username) {
      app.wxToast({title: '用户名格式不正确，请重新输入'})
      return
    }
    if (!userNameNewReg.test(this.data.username)) {
      app.wxToast({title: '用户名格式不正确，请重新输入'})
      return
    }
    setUserNameApi({username: this.data.username}).then(res => {
      app.globalData.userInfo.username = this.data.username
      app.wxToast({
        title: '用户名设置成功',
        icon: 'success',
        callback() {
          wx.navigateBack({delta: 1 })
        }
      })
    })
  },
  clear() {
    this.setData({username: ''})
  }
})