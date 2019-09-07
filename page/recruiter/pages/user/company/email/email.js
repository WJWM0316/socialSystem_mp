import {
  sendEmailApi,
  verifyEmailApi,
  sendEnterpriseEmailApi,
  verifyEnterpriseEmailApi,
  perfectCompanyApi
} from '../../../../../../api/pages/company.js'

import {emailReg} from '../../../../../../utils/fieldRegular.js'

import {RECRUITER} from '../../../../../../config.js'

const app = getApp()

Page({
  data: {
    email: '',
    step: 1,
    code: '',
    codeLength: 6,
    isFocus: false,
    ispassword: false,
    canClick: false,
    options: {},
    showTips: false,
    classErrorName: '',
    telePhone: app.globalData.telePhone,
    isEmail: false,
    time: 60,
    timer: null,
    canResend: true
  },
  onLoad(options) {
    this.setData({options})
  },
  onHide() {
    let timer = this.data.timer
    clearInterval(timer)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   绑定按钮的状态
   * @return   {[type]}   [description]
   */
  bindBtnStatus() {
    let canClick = this.data.canClick
    let email = this.data.email
    let options = this.data.options
    let isEmail = this.data.isEmail
    let applyJoin = options.from === 'join' ? true : false
    if(applyJoin) email = this.data.email + this.data.options.suffix

    if(emailReg.test(email)) {
      canClick = true
      isEmail = true
    } else {
      canClick = false
      isEmail = false
    }
    this.setData({ canClick, isEmail })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-20
   * @detail   动态输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let isEmail = this.data.isEmail
    let options = this.data.options
    let email = e.detail.value
    email = email.replace(/\s+/g,'')
    isEmail = emailReg.test(email)
    this.setData({email, isEmail, error: false}, () => this.bindBtnStatus())
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   发送验证码
   * @return   {[type]}   [description]
   */
  sendEmail() {
    let options = this.data.options
    if(options.from === 'join') {
      this.sendEmailByJoin()
    } else {
      this.sendEmailByCreate()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   发送验证码
   * @return   {[type]}   [description]
   */
  sendEmailByCreate() {
    let email = this.data.email
    let options = this.data.options
    let applyJoin = options.from === 'join' ? true : false
    let params = {email: email.trim(), company_id: options.companyId}
    // 邮箱不正确
    if(!this.data.canClick) return
    if(this.data.step === 2) {
      sendEmailApi(params)
      .then(res => {
        this.setData({canResend: false }, this.killTime())
      })
      .catch(msg => {

        // 已经时招聘官
        if(msg.code === 307) {
          app.wxToast({
            title: msg.msg,
            callback() {
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        if(msg.code === 808) {
          app.wxToast({
            title: msg.msg,
            callback() {
              wx.removeStorageSync('createdCompany')
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        app.wxToast({ title: msg.msg })
      })
    } else {
      sendEmailApi(params)
      .then(res => {
        this.setData({step: 2, isFocus: true}, this.killTime())
      })
      .catch(msg => {

        if(msg.code === 307) {
          app.wxToast({
            title: msg.msg,
            callback() {
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        if(msg.code === 808) {
          app.wxToast({
            title: msg.msg,
            callback() {
              wx.removeStorageSync('createdCompany')
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        app.wxToast({ title: msg.msg })
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-15
   * @detail   倒计时
   * @return   {[type]}   [description]
   */
  killTime() {
    let timer = this.data.timer
    let time = this.data.time
    timer = setInterval(() => {
      time--
      if(time < 1) {
        clearInterval(timer)
        this.setData({canResend: true, time: 60})
      } else {
        this.setData({time, canResend: false})
      }
    }, 1000)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   发送验证码
   * @return   {[type]}   [description]
   */
  sendEmailByJoin() {
    // let storage = wx.getStorageSync('createdCompany')
    let options = this.data.options
    let applyJoin = options.from === 'join' ? true : false
    let params = {email: this.data.email, company_id: options.companyId}
    let email = ''
    if(!this.data.email) return
    if(!params.email.includes('@')) {
      email = `${params.email}${options.suffix}`
      email = email.trim()
      params = Object.assign(params, {email})
    }
    if(this.data.step === 2) {
      sendEnterpriseEmailApi(params).then(res => this.setData({canResend: false }, this.killTime()))
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
    } else {
      sendEnterpriseEmailApi(params).then(res => this.setData({step: 2, isFocus: true}, this.killTime()))
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
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   重新发送验证码
   * @return   {[type]}   [description]
   */
  reEmail() {
    let options = this.data.options
    if(options.from === 'join') {
      this.reEmailByJoin()
    } else {
      this.reEmailByCreate()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   重新发送验证码
   * @return   {[type]}   [description]
   */
  reEmailByCreate() {
    let options = this.data.options
    let email = this.data.email
    email = email.trim()
    let params = {email, company_id: options.companyId}
    // 已经进入倒计时
    if(!this.data.canResend) return;
    this.setData({canResend: false , isFocus: true})
    sendEmailApi(params).then(res => this.killTime())
    .catch(err => {

      if(err.code === 307) {
        app.wxToast({
          title: err.msg,
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
        return
      }

      app.wxToast({ title: err.msg })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-22
   * @detail   重新发送验证码
   * @return   {[type]}   [description]
   */
  reEmailByJoin() {
    let options = this.data.options
    let params = {email: this.data.email, company_id: options.companyId}
    let email = ''
    if(!params.email.includes('@')) {
      email = `${params.email}${options.suffix}`
      email = email.trim()
      params = Object.assign(params, {email})
    }
    // 已经进入倒计时
    if(!this.data.canResend) return;
    this.setData({canResend: false , isFocus: true})
    sendEnterpriseEmailApi(params)
    .then(res => {
      this.killTime()
    })
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
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   验证邮箱
   * @return   {[type]}     [description]
   */
  verifyEmail() {
    let options = this.data.options
    let applyJoin = options.from === 'join' ? true : false
    if(applyJoin) {
      this.verifyEmailByJoin()
    } else {
      this.verifyEmailByCreate()
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   验证邮箱
   * @return   {[type]}     [description]
   */
  verifyEmailByCreate() {
    let options = this.data.options
    let email = this.data.email
    email = email.trim()
    let params = {email, company_id: options.companyId, code: this.data.code}
    verifyEmailApi(params).then(() => {
      let storage = wx.getStorageSync('createdCompany')
      perfectCompanyApi({
        company_name: storage.company_name,
        industry_id: storage.industry_id,
        financing: storage.financing,
        employees: storage.employees,
        company_shortname: storage.company_shortname,
        logo: storage.logo.id,
        intro: storage.intro,
        id: storage.id
      }).then(() => {
        clearInterval(this.data.timer)
        wx.removeStorageSync('createdCompany')
        wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
      })
      .catch(msg => {

        if(msg.code === 307) {
          msg.wxToast({
            title: msg.msg,
            callback() {
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        if(msg.code === 808) {
          app.wxToast({
            title: msg.msg,
            callback() {
              wx.removeStorageSync('createdCompany')
              wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
            }
          })
          return
        }

        app.wxToast({ title: msg.msg })
      })
    })
    .catch(msg => {
      this.setData({code: '', error: true, isFocus: true, classErrorName: 'error'})

      if(msg.code === 307) {
        app.wxToast({
          title: msg.msg,
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
        return
      }

      if(msg.code === 808) {
        app.wxToast({
          title: msg.msg,
          callback() {
            wx.removeStorageSync('createdCompany')
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=company`})
          }
        })
      }

      app.wxToast({ title: msg.msg })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-08
   * @detail   验证邮箱
   * @return   {[type]}     [description]
   */
  verifyEmailByJoin() {
    let options = this.data.options
    let email = this.data.email
    let params = {email, company_id: options.companyId, code: this.data.code}
    if(!params.email.includes('@')) {
      email = `${params.email}${options.suffix}`
      email = email.trim()
      params = Object.assign(params, {email})
    }
    verifyEnterpriseEmailApi(params).then(res => {
      wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
    })
    .catch(err => {
      this.setData({code: '', error: true, isFocus: true, classErrorName: 'error'})
      if(err.code === 307) {
        app.wxToast({
          title: err.msg,
          callback() {
            wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
          }
        })
      } 
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   开启弹窗显示
   * @return   {[type]}   [description]
   */
  tapShow() {
    this.setData({showTips: !this.data.showTips})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-04-08
   * @detail   使用其他验证方式
   * @return   {[type]}   [description]
   */
  changeIndentifyMethods() {
    wx.navigateBack({delta: 1})
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
   * @DateTime 2019-04-09
   * @detail   detail
   * @return   {[type]}     [description]
   */
  getResult(e) {
    let code = e.detail
    this.setData({code: code}, () => {
      this.bindBtnStatus()
      this.setData({error: false, classErrorName: ''})
      if(code.length > 5) this.verifyEmail()
    })
  }
})