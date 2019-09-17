import {getRecruiterQrcodeApi, getCompanyQrcodeApi, getPositionQrcodeApi} from '../../../../api/pages/qrcode.js'
let app = getApp()
Page({
  data: {
    options: {},
    isOpenSetting: true,
    imgUrl: '',
    qrUrl: '',
    title: ''
  },
  onLoad(options) {
    let title = this.data.title || '小程序码生成',
        getApi = null,
        parmas = {}
    switch(options.type) {
      case 'qr-mechanism':
        title = '机构主页小程序码'
        getApi = getCompanyQrcodeApi
        parmas.companyId = options.companyId
        break
      case 'qr-position':
        title = '职位二维码'
        getApi = getPositionQrcodeApi
        parmas.positionId = options.positionId
        break
      case 'qr-recruiter':
        title = '招聘官小程序码'
        getApi = getRecruiterQrcodeApi
        parmas.recruiterUid = options.uid
        parmas.companyId = options.companyId 
        break
      default:
        break
    }
    parmas.forwardType  = 1
    getApi(parmas).then(res => {
      let setData = {title, options}
      if (options.type !== 'qr-recruiter') {
        setData.imgUrl = res.data.qrCodeUrl
      } else {
        setData.qrUrl = res.data.qrCodeUrl
      }
      this.setData(setData, () => {
        if (options.type === 'qr-recruiter') {
          this.draw()
        }
      })
    })
  },
  onShow() {
    console.log(app.globalData.recruiterDetails)
    let that = this
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.writePhotosAlbum']) {
          that.setData({isOpenSetting: true})
        }
      }
    })
    let avatar = wx.getStorageSync('avatar')
    if (avatar) {
      this.draw()
    }
  },
  onUnload () {
    wx.removeStorageSync('avatar')
  },
  backEvent() {
    wx.removeStorageSync('avatar')
    wx.navigateBack({delta: 1})
  },
  draw() {
    let bgUrl = this.data.qrUrl
    let avatarUrl = app.globalData.recruiterDetails.avatars[0].smallUrl
    let avatar = wx.getStorageSync('avatar')
    if(avatar) avatarUrl = avatar.url

    const loadResult = (res, resolve) => {
      let timer = null
      timer = setTimeout(() => {
        app.wxToast({
          title: '图片加载失败，请重新生成',
          callback() {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }, this.data.timerSecond)
      if (res.statusCode === 200) {
        resolve(res)
        clearTimeout(timer)
        return res.tempFilePath
      }
    }

    let loadAvatar = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: avatarUrl,
        success(res) {
          avatarUrl = loadResult(res, resolve)
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
        }
      })
    })
    let loadBgUrl = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: bgUrl,
        success(res) {
          bgUrl = loadResult(res, resolve)
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
        }
      })
    })

    Promise.all([loadAvatar, loadBgUrl]).then((result) => {
      return new Promise((resolve, reject) => {
        let _this = this
        let ctx = wx.createCanvasContext('cardCanvas', this)
        ctx.fillRect(0, 0, 406, 406)

        // 画二维码
        ctx.drawImage(bgUrl, 0, 0, 406, 406)

        ctx.beginPath()  
        ctx.arc(203, 203, 90, 0, Math.PI * 2, false)
        ctx.clip()

        // 画头像
        ctx.drawImage(avatarUrl, 113, 113, 180, 180)

        // 生成图片链接
        ctx.draw(true, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              quality: 1,
              canvasId: 'cardCanvas',
              success(res) {
                _this.setData({imgUrl: res.tempFilePath})
                wx.hideLoading()
              }
            })
          }, 500)
        })
        resolve()
      })
    })
  },
  download() {
    let that = this
    let save = () => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imgUrl,
        success: function (e) {
          app.wxToast({title: '已保存至相册', icon: 'success'})
        },
        fail: function (e) {
          app.wxToast({title: '保存失败'})
        }
      })
    }
    wx.getSetting({
      success(res) {
        if(!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({isOpenSetting: true})
              save()
            },
            fail(res) {
              if (res.errMsg.indexOf('fail') !== -1) {
                that.setData({isOpenSetting: false})
              } 
            }
          })
        } else {
          save()
        }
       }
    })
  }
})