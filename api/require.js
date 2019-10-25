import {APPLICANTHOST, RECRUITERHOST, PUBAPIHOST, COMMON, RECRUITER, APPLICANT, VERSION, NODEHOST} from '../config.js'
const app = getApp()
let loadNum = 0
let BASEHOST = ''
let noToastUrlArray = [
  '/company/edit_first_step/',
  '/company/notifyadmin',
  '/company/edit_first_step',
  '/company/self_help_verification',
  '/company/apply_info',
  '/interview/newScheduleNumber',
  '/interview/invite',
  '/interview/newHistory'
]
let apiVersionList = null
let toAuth = false,
    toBindPhone = false
let recruiterJump = (msg) => {
  let companyInfo = msg.data.companyInfo
  let identityInfo = msg.data

  if(msg.data.joinType === 3) {
    // 加入公司
    wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=join`})
  } else {
    // 还没有创建公司信息
    if(!Reflect.has(companyInfo, 'id')) {
      wx.reLaunch({url: `${RECRUITER}user/company/apply/apply`})
    } else {
      if(companyInfo.status === 1) {
        wx.reLaunch({url: `${RECRUITER}index/index?type=${msg.data.joinType === 1 ? 'company' : 'create_org'}`})
      } else {
        if(companyInfo.status === 3) {
          wx.reLaunch({url: `${RECRUITER}user/company/createdCompanyInfos/createdCompanyInfos?type=${msg.data.joinType === 1 ? 'company' : 'create_org'}`})
        } else {
          wx.reLaunch({url: `${RECRUITER}user/company/status/status?from=${msg.data.joinType === 1 ? 'company' : 'create_org'}`})
        }
      }
    }
  }
}

export const request = ({name = '', method = 'post', url, host, data = {}, needKey = true, hasLoading = true, loadingContent = '加载中...'}) => {
  
  let addHttpHead = {}
  // baceHost 切换
  switch(host) {
    case 'PUBAPIHOST':
      BASEHOST = PUBAPIHOST
      break
    case 'NODEHOST':
      BASEHOST = NODEHOST
      break
    default:
      BASEHOST = wx.getStorageSync('choseType') !== "RECRUITER" ? APPLICANTHOST : RECRUITERHOST 
  }
  // 版本号
  addHttpHead['Wechat-Version'] = VERSION

  addHttpHead['Mp-App-Id'] = getApp() && getApp().globalData.appId

  addHttpHead['Role'] = wx.getStorageSync('choseType') !== "RECRUITER" ? 'j' : 'r' 

  // 如果连接带参数scode, 则存到头部
  if (data.sCode && !data.isReload) {
    addHttpHead['Act-Code'] = data.sCode
    addHttpHead['Act-Pid'] = data.id || data.uid
  } else {
    delete addHttpHead['Act-Code']
    delete addHttpHead['Act-Pid']
  }

  // msg_id
  let curRouteOptions = getCurrentPages()[0] && getCurrentPages()[0].options || {}
  if (curRouteOptions.hasOwnProperty('msg_id')) {
    addHttpHead['Msg-Id'] = curRouteOptions.msg_id
  } else {
    delete addHttpHead['Msg']
  }
    
  // 渠道统计
  if (data.sourceType && !data.isReload) {
    addHttpHead['Channel-Code'] = data.sourceType
    addHttpHead['Channel-Url'] = data.sourcePath
  } else {
    delete addHttpHead['Channel-Code']
    delete addHttpHead['Channel-Url']
  }

  delete data['isReload']
  delete data['sourceType']
  delete data['sourcePath']

  // header 传递token, sessionToken
  if (wx.getStorageSync('sessionToken') && !wx.getStorageSync('token')) {
    addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
  } else {
    delete addHttpHead['Authorization']
  }
  if (wx.getStorageSync('token')) {
    if (url !== '/bind/register' && url !== '/bind/quick_login') {
      addHttpHead['Authorization'] = wx.getStorageSync('token')
    } else {
      delete addHttpHead['Authorization']
    }
  } else {
    delete addHttpHead['Authorization']
  }
  // 测试token
  if (wx.getStorageSync('sessionToken')) {
    if (url === '/bind/register' || url === '/bind/quick_login') {
      addHttpHead['Authorization-Wechat'] = wx.getStorageSync('sessionToken')
    }
  }

  // 请求中间件
  const promise = new Promise((resolve, reject) => {
    let saveApiData = {}
    // 开启菊花图
    if (data.hasOwnProperty('hasLoading')) {
      hasLoading = data.hasLoading
      delete data.hasLoading
    }
    if (hasLoading) {
      if (loadNum === 0) {
        wx.showLoading({
          title: loadingContent,
          mask: true
        })
      }
      loadNum++
    }
    let wxRequest = () => {
      wx.request({
        url: BASEHOST+url,
        header: addHttpHead,
        data: data,
        method: method,
        success(res) {
          loadNum--
          if (loadNum <= 0) {
            wx.hideLoading()
            loadNum = 0
          }
          console.log(url, res.data)
          if (typeof res.data === 'string') { // 转换返回json
            res.data = JSON.parse(res.data)
          }
          if (res) {
            let msg = res.data
            let showToast = true
            //有字符串的情况下 转数字
            msg.httpStatus = parseInt(msg.httpStatus)
            if (msg.httpStatus === 200) {
              resolve(msg)
            } else {
              if (msg.httpStatus !== 401 && msg.code !== 809 && msg.code !== 701 && msg.code !== 801 && msg.code !== 910 && !noToastUrlArray.some(now => url.includes(now))) {
                getApp().wxToast({title: msg.msg})
              }
              reject(msg)
            }
            switch (msg.httpStatus) {
              case 200:
                break
              case 401:
                // 需要用到token， 需要绑定手机号
                if (msg.code === 4010 && url !== '/reddot/top_bar_info') {
                  if (toBindPhone) return
                  toBindPhone = true
                  let timer = setTimeout(() => {
                    toBindPhone = false
                    clearTimeout(timer)
                  }, 3000)
                  wx.removeStorageSync('token')
                  wx.navigateTo({
                    url: `${COMMON}bindPhone/bindPhone`
                  })
                }
                // 需要用到微信token， 需要授权
                if (msg.code === 0 && url !== '/reddot/top_bar_info') {
                  if (toAuth) return
                  toAuth = true
                  let timer = setTimeout(() => {
                    toAuth = false
                    clearTimeout(timer)
                  }, 3000)
                  wx.removeStorageSync('sessionToken')
                  wx.removeStorageSync('token')
                  getApp().login().then(res => {
                    wx.redirectTo({
                      url: getApp().getCurrentPagePath()
                    })
                  })
                }
                if (msg.code === 1016) {
                  getApp().login()
                }
                break
              case 400:
                let noJumpUrlArray = [
                  '/interview/newScheduleNumber',
                  '/interview/invite',
                  '/interview/newHistory'
                ]
                if (msg.code === 703 && !noJumpUrlArray.some(now => url.includes(now))) {
                  wx.reLaunch({
                    url: `${APPLICANT}createUser/createUser?micro=true`
                  })
                }
                if (msg.code === 801) {
                  recruiterJump(msg)
                }
            }
          } else {
            getApp().wxToast({title: '服务器异常，请稍后访问'})
          }
        },
        fail(e) {
          loadNum--
          if (loadNum <= 0) {
            wx.hideLoading()
            loadNum = 0
          }
          console.log(e, 'wx.request发神经了')
        }
      })
    }
    let reLogin = () => {
      if (name !== 'login') {
        getApp().login().then(() => {
          wxRequest()
        })
      } else {
        wxRequest()
      }
    }
    if (wx.getStorageSync('sessionToken')) {
      wx.checkSession({
        success () {
          wxRequest()
        },
        fail () {
          reLogin()
        }
      })
    } else {
      reLogin()
    }
  })
  return promise
}

