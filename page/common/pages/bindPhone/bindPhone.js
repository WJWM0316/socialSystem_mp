import {COMMON,RECRUITER} from '../../../../config.js'
import {sendCodeApi, changeNewCaptchaApi, pswLoginApi,getMinAppBindCompanyApi} from "../../../../api/pages/auth.js"
import {quickLoginApi} from '../../../../api/pages/auth.js'
import {mobileReg} from '../../../../utils/fieldRegular.js'

let mobileNumber = 0
let password = 0
let second = 60
let app = getApp()
let timer = null
let timerInt = null
let backType = 'backPrev'
let captchaKey = ''

Page({
  data: {
    code: '',
    password: '',
    imgUrl: '',
    cdnImagePath: app.globalData.cdnImagePath,
    second: 60,
    canClick: false,
    choseType: '',
    loginType: 2,
    captchaValue: '',
    codeType: 1,
    companyName: '',
    bindInfo: {}
  },
  onLoad(options) {
    // wx.setStorageSync('choseType', 'RECRUITER')
    captchaKey = ''
    backType = 'backPrev'
    if (options.backType) backType = options.backType
  },
  onShow() {
    getMinAppBindCompanyApi().then(res => this.setData({bindInfo: res.data}))
    this.setData({choseType: wx.getStorageSync('choseType')})
  },
  setTime (second) {
    timerInt = setInterval(() => {
      second--
      if (second === 0) {
        second = 60
        clearInterval(timerInt)
      }
      this.setData({second})
    }, 1000)
  },
  sendCode() {
    if (!this.data.mobile) {
      app.wxToast({
        title: '请输入手机号'
      })
      return
    }
    let data = {
      mobile: this.data.mobile
    }
    sendCodeApi(data).then(res => {
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
  bindPhone() {
    let funcApi = this.data.choseType === 'APPLICANT' || this.data.loginType === 1 ? 'phoneLogin' : 'pswLogin'
    this[funcApi]()
  },
  bindInput(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    let formData = this.data
    formData[key] = value
    this.setData(formData)
  },
  // 手机号登录
  phoneLogin() {

    if (!mobileReg.test(this.data.mobile)) {
      app.wxToast({
        title: '请输入手机号'
      })
      return
    }

    if (!this.data.code) {
      app.wxToast({
        title: '请输入短信验证码'
      })
      return
    }

    if(this.data.imgUrl) {
      if(!this.data.captchaValue) {
        app.wxToast({
          title: '请输入图形验证码'
        })
        return
      }
    }

    let data = {
      mobile: this.data.mobile,
      password: this.data.password,
      code: this.data.code,
      captchaKey,
      captchaValue: this.data.captchaValue
    }
    app.phoneLogin(data, backType).catch(res => {
      if (res.code === 419) {
        captchaKey = res.data.key
        let imgUrl = res.data.img
        this.setData({imgUrl})
      } else if (res.code === 440){
        captchaKey = ''
        this.changeNewCaptcha()
      }
    })
  },
  // 账号密码登录
  pswLogin() {
    if (!this.data.mobile) {
      app.wxToast({
        title: '请输入用户名或手机号'
      })
      return
    }

    if (!this.data.password) {
      app.wxToast({
        title: '请输入密码'
      })
      return
    }

    let params = {mobile: this.data.mobile, password: this.data.password}
    app.pswLogin(params).catch(res => {
      if (res.code === 419) {
        captchaKey = res.data.key
        let imgUrl = res.data.img
        this.setData({imgUrl})
      } else if (res.code === 440){
        captchaKey = ''
        captchaValue = ''
        this.changeNewCaptcha()
      }
    })
  },
  getPhoneNumber(e) {
    app.quickLogin(e, backType)
  },
  changeNewCaptcha () {
    changeNewCaptchaApi().then(res0 => {
      captchaKey = res0.data.key
      let imgUrl = res0.data.img
      this.setData({imgUrl})
    })
  },
  getPhoneNumber(e) {
    app.quickLogin(e, backType)
  },
  formSubmit(e) {
    app.postFormId(e.detail.formId)
  },
  todoAction(e) {
    let action = e.currentTarget.dataset.action
    switch(action) {
      case 'forget':
        wx.navigateTo({url: `${COMMON}forgetPwd/forgetPwd`})
        break
      case 'clear':
        this.setData({mobile: ''})
        break
      case 'changeCodeType':
        this.setData({codeType: this.data.codeType === 1 ? 2 : 1})
        break
      case 'changeLoginType':
        this.setData({loginType: this.data.loginType === 1 ? 2 : 1, mobile: ''})
        break
      case 'userAgreement':
        wx.navigateTo({url: `${COMMON}webView/webView?type=userAgreement`})
        break
      default:
        break
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(timerInt)
  }
})