//app.js
import {loginApi, checkSessionKeyApi, bindPhoneApi, uploginApi, authLoginApi} from 'api/pages/auth.js'
import {formIdApi, shareStatistics, readyStatistics, getVersionListApi} from 'api/pages/common.js'
import{getCompanyOrglistApi} from 'api/pages/company.js'
import {getPositionQrcodeApi, getRecruiterQrcodeApi, getResumerCodeApi, getCompanyQrcodeApi} from 'api/pages/qrcode.js'
import {getPersonalResumeApi} from 'api/pages/center.js'
import {getRecruiterDetailApi} from 'api/pages/recruiter.js'
import {COMMON,RECRUITER,APPLICANT} from "config.js"
import {getUserRoleApi} from "api/pages/user.js"
import {quickLoginApi} from 'api/pages/auth.js'
import {shareC, shareB} from 'utils/shareWord.js'
import {getCompanyIdentityInfosApi} from 'api/pages/company.js'
import {getBottomRedDotApi} from 'api/pages/interview.js'

let that = null
let formIdList = [],
    sendNum = 0 // formId 发送次数
App({
  onLaunch: function (e) {
    let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}
    console.log(extConfig, '提测清单')
    this.globalData.appId = wx.getAccountInfoSync().miniProgram.appId
    // 获取导航栏高度
    this.checkUpdateVersion()
    // this.getVersionList()
    this.globalData.startRoute = e
    wx.getSystemInfo({
      success: res => {
        //导航高度
        console.log(res, '系统信息')
        this.globalData.navHeight = res.statusBarHeight + 44
        if (res.model.indexOf('iPhone X') !== -1) {
          this.globalData.isIphoneX = true
        }
        if (res.system.indexOf('iOS') !== -1) {
          this.globalData.isIos = true
        }
        if (this.globalData.navHeight > 74) {
          this.globalData.isBangs = true
        }
      },
      fail: err => {
        console.log(err)
      }
    })
    this.loginInit = null
    this.pageInit = null
    this.getRoleInit = null
    this.login()
  },
  onHide: function (e) {
    // 切换后台 发送全部formId
    if (formIdList.length > 0) {
      formIdApi({form_id: formIdList}).then(res => {
        sendNum = 0
        formIdList = []
      })
    }
  },
  onError: function (e) {
    console.log('onError检测', e)
  },
  globalData: {
    appId: '',
    startRoute: '',
    identity: "", // 身份标识
    isMicroCard: 0, // 是否创建微名片
    isRecruiter: 0, // 是否认证成为招聘官
    isJobhunter: 0, // 是否注册成求职者
    currentCompanyId: 0, // C端用户当前机构
    isTopAdmin: 0, // 是不是超管
    currentCompanyName: '', // 当前机构名称
    hasExpect: 1, // 有求职意向
    hasLogin: 0, // 判断是否登录
    userInfo: null, // 用户信息， 判断是否授权,
    navHeight: 0,
    cdnImagePath: 'https://attach.dd.lieduoduo.ziwork.com/front-assets/images/',
    companyInfo: {}, // 公司信息
    resumeInfo: {}, // 个人简历信息
    recruiterDetails: {}, // 招聘官详情信息
    pageCount: 20, // 分页数量
    isIphoneX: false, // 是否是Iphonex 系列
    isIos: false, // 是否是 ios
    isBangs: false, // 是否是刘海屏，水滴屏
    telePhone: '400-065-5788',  // 联系电话
    systemInfo: wx.getSystemInfoSync(), // 系统信息
    orgList: [], // 机构列表
    // 面试红点信息
    redDotInfos: {}
  },
  // 登录
  login() {
    let that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res0) {
          if (!wx.getStorageSync('choseType')) wx.setStorageSync('choseType', 'APPLICANT')
          let params = {}
          let startRouteParams = that.globalData.startRoute.query
          if (startRouteParams.scene) {
            startRouteParams = that.getSceneParams(startRouteParams.scene)
          }
          if (startRouteParams.sourceType) {
            params = {
              sourceType: startRouteParams.sourceType,
              sourcePath: `/${that.globalData.startRoute.path}?${that.splicingParams(startRouteParams)}`
            }
          } else {
            params = {
              sourceType: 'sch',
              sourcePath: `/${that.globalData.startRoute.path}?${that.splicingParams(startRouteParams)}`
            }
          }
          wx.setStorageSync('code', res0.code)
          loginApi({code: res0.code, ...params}).then(res => {
            // 有token说明已经绑定过用户了
            if (res.data.token) {
              wx.setStorageSync('token', res.data.token)
              that.globalData.hasLogin = 1
              if (res.data.nickname) that.globalData.userInfo = res.data.userWechatInfo
              that.getRoleInfo()
              console.log('用户已认证')
            } else {
              if (res.data.nickname) that.globalData.userInfo = res.data.userInfo
              that.globalData.hasLogin = 0
              console.log('用户未绑定手机号', 'sessionToken', res.data.authToken)
              wx.setStorageSync('sessionToken', res.data.authToken)
            }
            // 登陆回调
            if (that.loginInit) {
              that.loginInit()
            }
            that.loginInit = function () {}
            resolve(res)
          })
        },
        fail: function (e) {
          console.log('登录失败', e)
        }
      })
    })
  },
  // 退出登录
  uplogin() {
    uploginApi().then(res => {
      wx.removeStorageSync('token')
      this.globalData.hasLogin = 0
      this.globalData.resumeInfo = {}
      this.globalData.recruiterDetails = {}
      this.globalData.isRecruiter = 0
      this.globalData.isJobhunter = 0
      wx.reLaunch({url: `${COMMON}startPage/startPage`})
    })
  },
  // 获取最全的角色信息
  getAllInfo() {
    let pageInit = () => {
      if (this.pageInit) { // 页面初始化
        this.pageInit() //执行定义的回调函数
      } else {
        this.pageInit = function () {}
      }
    }
    return new Promise((resolve, reject) => {
      if (wx.getStorageSync('choseType') === 'RECRUITER') {
        getRecruiterDetailApi().then(res0 => {
          this.globalData.recruiterDetails = res0.data
          this.globalData.isRecruiter = 1
          pageInit()
          resolve(res0.data)
        }).catch((e) => {
          reject(e)
          pageInit()
        })
      } else {
        getPersonalResumeApi().then(res0 => {
          this.globalData.resumeInfo = res0.data
          this.globalData.isJobhunter = 1
          this.globalData.hasExpect = 1
          pageInit()
          resolve(res0.data)
        }).catch((e) => {
          reject(e)
          if (e.data.hasExpect === 0) {
            this.globalData.hasExpect = 0
          } else {
            this.globalData.hasExpect = 1
          }
          pageInit()
        })
      }
    })
  },
  // 获取角色身份
  getRoleInfo() {
    return new Promise((resolve, reject) => {
      getUserRoleApi().then(res0 => {
        if (res0.data.isRecruiter) this.globalData.isRecruiter = res0.data.isRecruiter
        if (res0.data.isJobhunter) this.globalData.isJobhunter = res0.data.isJobhunter
        if (res0.data.hasCard) this.globalData.isMicroCard = res0.data.hasCard || 0
        if (res0.data.currentCompanyId) this.globalData.currentCompanyId = res0.data.currentCompanyId
        if (res0.data.isTopAdmin) this.globalData.isTopAdmin = res0.data.isTopAdmin
        if (res0.data.currentCompanyName) this.globalData.currentCompanyName = res0.data.currentCompanyName
        if (this.getRoleInit) { // 登陆初始化
          this.getRoleInit() //执行定义的回调函数
        } else {
          this.getRoleInit = function () {}
        }

        this.getAllInfo()
        resolve(res0)
      })
    })
  },
  // 检查微信授权
  checkLogin () {
    let sessionToken = wx.getStorageSync('sessionToken')
    if (!sessionToken) return
    let that = this
    return new Promise((resolve, reject) => {
      checkSessionKeyApi({session_token: sessionToken}).then(res0 => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
            const e = {}
            e.detail = res
            if (!that.globalData.isIos) {
              that.onGotUserInfo(e)
            }
            console.log('用户已授权')
            resolve(res)
          }
        })
      }).catch(e => {
        resolve(e)
        if (this.getCurrentPagePath().indexOf(`${COMMON}startPage/startPage`) !== -1) {
          wx.navigateTo({
            url: `${COMMON}auth/auth`
          })
        }
      })
    })
  },
  // 授权button 回调
  onGotUserInfo(e, operType) {
    let that = this
    return new Promise((resolve, reject) => {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // 预防信息解密失败， 失败三次后不再授权
        let loginNum = 0
        let data = {
          iv_key: e.detail.iv,
          data: e.detail.encryptedData,
          ...that.getSource()
        }
        let wxLogin = function () {
          // 请求接口获取服务器session_key
          let pageUrl = that.getCurrentPagePath(0)
          data.code = wx.getStorageSync('code')
          if (wx.getStorageSync('sessionToken')) {
            data.session_token = wx.getStorageSync('sessionToken')
          }
          loginApi(data).then(res => {
            wx.removeStorageSync('code')
            // 有token说明已经绑定过用户了
            if (res.data.token) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('sessionToken', res.data.sessionToken)
              that.globalData.hasLogin = 1
              if (res.data.userWechatInfo && res.data.userWechatInfo.nickname) that.globalData.userInfo = res.data.userWechatInfo
              that.getRoleInfo()
              console.log('用户已认证')
            } else {
              console.log('用户未绑定手机号')
              that.globalData.hasLogin = 0
              if (res.data.userInfo && res.data.userInfo.nickname) that.globalData.userInfo = res.data.userInfo
              wx.setStorageSync('sessionToken', res.data.sessionToken)
            }
            resolve(res)
            if (!operType) {
              wx.reLaunch({
                url: pageUrl
              })
            } else {
              if (operType === 'closePop') {
                console.log('授权成功关闭弹窗')
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }              
            }
          }).catch(e => {
            wx.login({
              success: function (res0) {
                wx.setStorageSync('code', res0.code)
              }
            })
            reject(e)
          })
        }
        wxLogin()
      } else {
        console.log('用户拒绝授权', e.detail.errMsg)
        reject(e.detail.errMsg)
      }
    })
  },
  // 微信快速登陆
  quickLogin(e, operType) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      let data = {
        iv_key: e.detail.iv,
        code: wx.getStorageSync('code'),
        data: e.detail.encryptedData
      }
      return new Promise((resolve, reject) => {
        quickLoginApi(data).then(res => {
          if (res.data.token) {
            wx.setStorageSync('token', res.data.token)
            this.globalData.hasLogin = 1
            this.globalData.userInfo = res.data
            let pageUrl = this.getCurrentPagePath(0)
            this.getRoleInfo().then(res0 => {
              this.wxToast({
                title: '登录成功',
                icon: 'success',
                callback() {
                  if (!res0.data.hasCard && operType === 'cIndex' &&  wx.getStorageSync('choseType') !== 'RECRUITER') {
                    wx.reLaunch({
                      url: `${APPLICANT}createUser/createUser?micro=true`
                    })
                  } else {
                    if (operType === 'cIndex') {
                      wx.reLaunch({
                        url: `${COMMON}homepage/homepage`
                      })
                    } else if (operType === 'curPath') {
                      wx.reLaunch({
                        url: `${pageUrl}`
                      })
                    } else {
                      if (getCurrentPages().length > 1) {
                         wx.navigateBack({
                          delta: 1
                        })
                      } else {
                        if (wx.getStorageSync('choseType') !== 'RECRUITER') {
                          wx.reLaunch({
                            url: `${COMMON}homepage/homepage`
                          })
                        } else {
                          wx.reLaunch({
                            url: `${RECRUITER}index/index`
                          })
                        }
                      }
                    }
                  }
                }
              })
              resolve(res)
            })
          } else {
            this.globalData.hasLogin = 0
          }
        }).catch(e => {
          this.checkLogin()
        })
      })
    }
  },
  // 手机登陆
  phoneLogin(data, operType) {
    let _this = this
    return new Promise((resolve, reject) => {
      bindPhoneApi(data).then(res => {
        if (res.data.token) wx.setStorageSync('token', res.data.token)
        if (res.data.sessionToken) wx.setStorageSync('sessionToken', res.data.sessionToken)
        this.globalData.hasLogin = 1
        this.globalData.userInfo = res.data
        this.getRoleInfo().then((res0) => {
          this.wxToast({
            title: '登录成功',
            icon: 'success',
            callback() {
              if (!res0.data.hasCard && operType === 'cIndex' && wx.getStorageSync('choseType') !== 'RECRUITER') {
                wx.reLaunch({
                  url: `${APPLICANT}createUser/createUser?micro=true`
                })
              } else {
                if (operType === 'cIndex') {
                  wx.reLaunch({
                    url: `${APPLICANT}index/index`
                  })
                } else {
                  if (getCurrentPages().length > 1) {
                    if(wx.getStorageSync('choseType') !== 'RECRUITER') {
                      wx.navigateBack({
                        delta: 1
                      })
                    } else {
                      _this.getCompanyIdentity()
                    }
                  } else {
                    if (wx.getStorageSync('choseType') !== 'RECRUITER') {
                      wx.reLaunch({
                        url: `${APPLICANT}index/index`
                      })
                    } else {
                      _this.getCompanyIdentity()
                    }
                  }
                }
              }
            }
          })
        })
        resolve(res)
      }).catch(e => {
        reject(e)
        this.globalData.hasLogin = 0
        if (e.code === 401) {
          this.checkLogin()
        }
      })
    })
  },
  getCompanyIdentity() {
    getCompanyIdentityInfosApi({hasLoading: false}).then(msg => {
      let companyInfo = msg.data.companyInfo
      if(Reflect.has(companyInfo, 'status') && companyInfo.status === 1) wx.navigateBack({delta: 1 })
    })
  },
  // 小程序热更新
  checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function() {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function() {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 微信toast
  wxToast({title, icon = 'none', image, mask = true, duration = 2000, callback = function(){} }) {
    // icon - success 显示成功图标，此时 title 文本最多显示 7 个汉字长度
    // icon - loading 显示加载图标，此时 title 文本最多显示 7 个汉字长度
    wx.showToast({
      title,
      icon,
      image,
      mask,
      duration,
      success() {
        setTimeout(() => {
          // 自定义一个回调函数
          callback()
        }, duration)
      }
    })
  },
  // 微信确认弹框
  wxConfirm({title = '', content, showCancel = true, cancelText = '取消', confirmText = '确定', cancelColor = '#BCBCBC', confirmColor = '#652791', confirmBack = function() {}, cancelBack = function() {}}) {
    wx.showModal({
      title,
      content,
      cancelText,
      cancelColor,
      confirmColor,
      showCancel,
      confirmText,
      success(res) {
        if (res.confirm) {
          confirmBack()
        } else if (res.cancel) {
          cancelBack()
        }
      }
    })
  },
  // 微信分享
  wxShare({options, title, path, imageUrl, noImg, btnTitle, btnPath, btnImageUrl}) {
    let that = this
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    if (!title) {
      title = `【${this.globalData.currentCompanyName}】正在招人，我在这里等你！`
    }
    if (!path) {
      let companyId = this.globalData.companyInfo && this.globalData.companyInfo.id
      path = wx.getStorageSync('choseType') !== 'RECRUITER' ? `${COMMON}homepage/homepage?companyId=${companyId}` : `${RECRUITER}index/index`
    }
    if (!imageUrl) {
      imageUrl = wx.getStorageSync('choseType') !== 'RECRUITER' ? `${this.globalData.cdnImagePath}shareC.png` : `${this.globalData.cdnImagePath}shareB.png`
    }
    if (noImg) {
      imageUrl = ''
    }
    let shareObj = {
      title: title,        // 默认是小程序的名称(可以写slogan等)
      path: path,        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: imageUrl,     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res){
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok'){
        }
      },
      fail: function(){
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel'){
        // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail'){
        // 转发失败，其中 detail message 为详细失败信息
        }
      }
    }
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      shareObj = {
        title: btnTitle || shareObj.title,
        path: btnPath || shareObj.path,
        imageUrl: btnImageUrl || shareObj.imageUrl
      }
    }
          console.log(shareObj)

    return shareObj
  },
  // 切换身份
  toggleIdentity() {
    let identity = wx.getStorageSync('choseType')
    if (identity === 'RECRUITER') {
      wx.setStorageSync('choseType', 'APPLICANT')
      this.getAllInfo().then(() => {
        wx.reLaunch({url: `${COMMON}homepage/homepage` })
      }).catch(() => {
        wx.reLaunch({url: `${COMMON}homepage/homepage` })
      })
    } else {
      if (!this.globalData.hasLogin) {
        wx.navigateTo({
          url: `${COMMON}bindPhone/bindPhone`
        })
      } else {
        wx.setStorageSync('choseType', 'RECRUITER')
        this.getAllInfo().then(() => {
          if (!this.globalData.isRecruiter) {
            wx.reLaunch({
              url: `${RECRUITER}user/company/apply/apply`
            })
          } else {
            wx.reLaunch({
              url: `${RECRUITER}index/index`
            })
          }
        })
      }  
    }
  },
  // 身份识别
  identification(options) {
    if (options.identity) {
      let identity = ''
      switch(options.identity) {
        case 'recruiter':
          wx.setStorageSync('choseType', 'RECRUITER')
          identity = 'RECRUITER'
          break
        case 'jobhunter':
          wx.setStorageSync('choseType', 'APPLICANT')
          identity = 'APPLICANT'
          break
      }
      return identity
    } else {
      let choseType = wx.getStorageSync('choseType')
      if (choseType) {
        return wx.getStorageSync('choseType')
      } else {
        wx.setStorageSync('choseType', 'APPLICANT')
        return 'APPLICANT'
      }
    }
  },
  // 提示切换身份
  promptSwitch({source, jumpPath, confirmBack, cancelBack, directId, directChat}) {
    let path = this.getCurrentPagePath()
    let content = ''
    if (source === 'RECRUITER') {
      jumpPath ? content = '检测到你是面试官，是否切换面试官' : content = '切换为求职者身份后可使用该功能'
      this.wxConfirm({
        title: '提示',
        content,
        confirmBack: () => {
          if (jumpPath) {
            wx.reLaunch({
              url: jumpPath || `${RECRUITER}index/index`
            })
          } else {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo().then(() => {
              wx.reLaunch({url: path})
            }).catch(e => {
              wx.navigateTo({
                url: `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}`
              })
            })
          }
        },
        cancelBack: () => {
          if (jumpPath) {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo()
          }
        }
      })
    } else {
      jumpPath ? content = '检测到你是求职者，是否切换求职者' : content = '切换为面试官身份后可使用该功能'
      this.wxConfirm({
        title: '提示',
        content,
        confirmBack: () => {
          if (jumpPath) {
            wx.reLaunch({
              url: jumpPath || `${APPLICANT}index/index`
            })
          } else {
            wx.setStorageSync('choseType', 'RECRUITER')
            this.getAllInfo().then(() => {
              wx.reLaunch({url: path})
            })
          }
        },
        cancelBack: () => {
          if (jumpPath) {
            wx.setStorageSync('choseType', 'APPLICANT')
            this.getAllInfo()
          }
        }
      })
    }
  },
  // 收集formId
  postFormId(id) {
    console.log(`=======================收集到这个formId了 ${id}=========================`)
    formIdList.push(id)
    if (formIdList.length >= 50) formIdList = formIdList.slice(50, 100)
    if (sendNum === 0) {
      if (formIdList.length === 0) return
    } else if (sendNum === 1) {
      if (formIdList.length < 2) return
    } else if (sendNum === 2) {
      if (formIdList.length < 2) return
    } else if (sendNum === 3) {
      if (formIdList.length < 4) return
    } else if (sendNum === 4) {
      if (formIdList.length < 9) return
    } else {
      return
    }
    if (wx.getStorageSync('sessionToken') || wx.getStorageSync('token')) {
      formIdApi({form_id: formIdList}).then(res => {
        sendNum++
        formIdList = []
      })
    }
  },
  // 获取二维码参数对象
  getSceneParams (scene) {
    scene = decodeURIComponent(scene)
    scene = scene.indexOf('?') === 0 ? scene.substr(1) : scene
    const params = scene.split('&')
    const obj = {}
    params.forEach(item => {
      if (item) {
        const param = item.split('=')
        obj[param[0]] = param[1]
      }
    })
    if (obj.s) obj.sourceType = obj.s
    if (obj.p) obj.positionId = obj.p
    if (obj.j) obj.uid = obj.j
    if (obj.r) obj.uid = obj.r
    if (obj.c) obj.companyId = obj.c
    return obj
  },
  // 判断来源记录
  getSource () {
    let params = {}
    let launch = this.globalData.startRoute
    let route = getCurrentPages()
    let curPath = route[route.length - 1]
    if (launch.path === 'page/common/pages/startPage/startPage' && launch.path === curPath.route) { // 自然搜索使用
      if (curPath.options && curPath.options.sourceType) {
        params.sourceType = curPath.options.sourceType
        params.sourcePath = `/${launch.path}?${this.splicingParams(curPath.options)}`
      } else {
        params.sourceType = 'sch'
        params.sourcePath = `/${launch.path}`
      }
      
    } else {
      if (curPath.options && curPath.options.scene) {
        curPath.options = this.getSceneParams(curPath.options.scene)
        if (curPath.options.s) curPath.options.sourceType = curPath.options.s
        if (curPath.options._q) params._q = curPath.options._q
      }
      if (curPath.options && curPath.options.sourceType) { // 链接带特殊参数
        params.sourceType = curPath.options.sourceType
        params.sourcePath = `/${curPath.route}?${this.splicingParams(curPath.options)}`
      }
    }
    // 跟踪转发人记录
    if (curPath.options && curPath.options.sCode) params.sCode = curPath.options.sCode
    return params
  },
  // 预览简历
  previewResume (e) {
    if (e.currentTarget.dataset.file.attachType === 'doc') {
      wx.showLoading({
        title: '文档加载中...'
      })
      wx.downloadFile({
        url: e.currentTarget.dataset.file.url,
        success(res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success(res) {
              wx.hideLoading()
              console.log('打开文档成功')
            }
          })
        },
        fail(e) {
          wx.hideLoading()
          console.log(e)
        }
      })
    } else {
      wx.previewImage({
        current: e.currentTarget.dataset.file.url, // 当前显示图片的http链接
        urls: [e.currentTarget.dataset.file.url] // 需要预览的图片http链接列表
      })
    }
  },
  // 拼接参数成字符串
  splicingParams (params) {
    let string = ''
    for (let i in params) {
      string = `${string}${i}=${params[i]}&`
    }
    string = string.slice(0, string.length-1)
    return string
  },
  // 获取当前页面完整链接
  getCurrentPagePath (index) {
    var pages = getCurrentPages() //获取加载的页面
    if (!index && index !== 0) index = pages.length - 1
    let pageUrl = pages[index] && pages[index].route
    if (pages[index] && pages[index].options && this.splicingParams(pages[index].options)) {
      return `/${pageUrl}?${this.splicingParams(pages[index].options)}`
    } else {
      return `/${pageUrl}`
    }
  },
  // 操作统计
  shareStatistics ({type, infos, forwardType}) {
    switch (type) {
      case 'position':
        getPositionQrcodeApi({positionId: infos.id, forwardType})
        break
      case 'recruiter':
        getRecruiterQrcodeApi({recruiterUid: infos.uid, companyId: infos.currentCompanyId, forwardType})
        break
      case 'resumer':
        getResumerCodeApi({resumeUid: infos.uid, forwardType})
        break
      case 'company':
        getCompanyQrcodeApi({companyId: infos.id, forwardType})
        break
    }
  },
  // 浏览统计
  readyStatistics ({id=0, page, channel, sCode}) {
    readyStatistics({id, page, channel, sCode}).then(res => {
    })
  },
  // 获取缓存接口版本号
  getVersionList () {
    getVersionListApi().then(res => {
      if (res.data.constructor === Object) wx.setStorageSync('apiVersionList', res.data)
    })
  },
  // 微信数据分析上报
  wxReportAnalytics (type, param) {
    var pages = getCurrentPages() //获取加载的页面
    param.path = pages[pages.length - 1].route
    switch (type) {
      case 'btn_report':
        wx.reportAnalytics('button_operation_report', param)
        break
      case 'enterPage_report':
        wx.reportAnalytics('enterpage_report', param)
        break
    }
  },
  // 获取底部栏红点情况
  getBottomRedDot() {
    return new Promise((resolve, reject) => {
      getBottomRedDotApi().then(res => {
        this.globalData.redDotInfos = res.data
        resolve(res)
      })
    })
  }
})
