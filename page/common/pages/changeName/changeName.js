import {
  setUserNameApi
} from "../../../../api/pages/auth.js"
import { userNameNewReg } from '../../../../utils/fieldRegular.js'
import {COMMON,RECRUITER} from '../../../../config.js'

let app = getApp()
Page({
  data: {
    username: ''
  },
  onShow() {
    this.setData({username: app.globalData.userInfo.username})
  },
  bindInput(e) {
    let username = this.data.username
    username = e.detail.value
    this.setData({username})
  },
  next() {
    if (!userNameNewReg.test(this.data.mobile)) {
      app.wxToast({title: '请输入有效的用户名'})
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