import {
  sendWapCodeApi,
  changeNewCaptchaApi, 
  checkSmsCodeApi,
  getAuthCaptchaApi,
  checkImgCodeApi,
  resetPswApi
} from "../../../../api/pages/auth.js"
let app = getApp()
let timer = null
let second = 60
let captchaKey = ''
let loginFalseTimes = 0
let certificate = null
Page({
  data: {
    step: 1,
    second: 60,
    imgUrl: '',
    formData: {
      mobile: '',
      code: '',
      captchaCode: '',
      repeat_password: '',
      password: ''
    }
  },
  onLoad() {
    wx.setStorageSync('choseType', 'RECRUITER')
  },
  bindInput(e) {
    let formData = this.data.formData
    let params = e.currentTarget.dataset
    formData[params.key] = e.detail.value
    this.setData({formData})
  },
  sendCode() {
    if (!this.data.formData.mobile) {
      app.wxToast({title: '请填写手机号'})
      return
    }
    let data = {
      mobile: this.data.formData.mobile,
      type: 'resetPassword'
    }
    sendWapCodeApi(data).then(res => {
      this.isBlured = false
      this.callback = null
      second = 60
      app.wxToast({
        title: '验证码发送成功',
        icon: 'success'
      })
      this.setTime(second)
    })
  },
  setTime (second) {
    timer = setInterval(() => {
      second--
      if(second === 0) {
        second = 60
        clearInterval(timer)
      }
      this.setData({second})
    }, 1000)
  },
  onUnload() {
    clearInterval(timer)
  },
  next() {
    let formData = this.data.formData
    let promiseList = []
    let params = {}

    let checkMobile = new Promise((resolve, reject) => {
      if (!formData.mobile) {
        reject('请填写手机号')
      } else {
        params = Object.assign(params, {mobile: formData.mobile})
        resolve()
      }
    })

    let checkCode = new Promise((resolve, reject) => {
      if (!formData.code) {
        reject('请填写验证码')
      } else {
        params = Object.assign(params, {code: formData.code})
        resolve()
      }
    })

    let checkImgCode = new Promise((resolve, reject) => {
      if (!formData.captchaCode) {
        reject('请输入图片验证')
      } else {
        params = Object.assign(params, {captchaKey, captchaCode: formData.captchaCode})
        resolve()
      }
    })
    
    promiseList = [checkMobile, checkCode]
    if(this.data.imgUrl) {
      promiseList = [checkMobile, checkCode, checkImgCode]
    }
    Promise.all(promiseList).then(() => {
      console.log(params, 'params')
      if(loginFalseTimes >= 3) {
        this.checkImgCode().then(res => {
          this.checkSmsCode(params)
        }).catch(err => {
          this.changeNewCaptcha()
        })
      } else {
        this.checkSmsCode(params)
      }
    }).catch(err => {
      console.log(params, 'jjj')
      app.wxToast({title: err})
    })
  },
  checkSmsCode(data) {
    checkSmsCodeApi(data).catch(res => {
      loginFalseTimes = res.data.loginFalseTimes
      if(loginFalseTimes >= 3) {
        this.changeNewCaptcha()
      }
    }).then(res => {
      certificate = res.data.certificate
      this.setData({step: 2})
    })
  },
  checkImgCode() {
    let formData = this.data.formData
    return new Promise((resolve, reject) => {
      checkImgCodeApi({captchaKey, captchaValue: formData.captchaCode}).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  changeNewCaptcha() {
    getAuthCaptchaApi().then(res => {
      captchaKey = res.data.key
      let imgUrl = res.data.img
      this.setData({imgUrl})
    })
  },
  resetPsw() {
    let formData = this.data.formData
    let params = {
      certificate,
      password: formData.password,
      repeat_password: formData.repeat_password
    }
    resetPswApi(params).then(res => {
      app.wxToast({
        title: '密码已修改成功',
        icon: 'success',
        callback() {
          // wx.reLaunch({url: `${RECRUITER}interview/index/index`})
        }
      })
    })
    .catch(err => {
      // app.wxToast({title: '密码已修改成功'})
      console.log(err)
    })
  }
})