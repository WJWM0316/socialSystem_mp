let app = getApp()
Page({
  data: {
    options: {},
    isOpenSetting: true,
    canvasWidth: 258,
    imgUrl: '',
    title: ''
  },
  onLoad(options) {
    let title = this.data.title || '小程序码生成'
    switch(options.type) {
      case 'qr-mechanism':
        title = '机构主页小程序码'
        break
      case 'qr-position':
        title = '职位二维码'
        break
      case 'qr-recruiter':
        title = '招聘官小程序码'
        break
      default:
        break
    }
    this.setData({title, options})
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
  	this.draw()
  },
  backEvent() {
    wx.removeStorageSync('avatar')
    wx.navigateBack({delta: 1})
  },
  draw() {
    return new Promise((resolve, reject) => {
      let _this = this
      let ctx = wx.createCanvasContext('cardCanvas', this)
      let canvasWidth = this.data.canvasWidth
      let avatarWidth = 100
      let bgUrl = '../../../../images/201909011831.jpg'
      let avatarUrl = '../../../../images/201909042919.jpg'
      let avatar = wx.getStorageSync('avatar')
      if(avatar) avatarUrl = avatar.url
      
      // 最外层的一个圆
      ctx.beginPath()  
      ctx.fillStyle = '#DFD5EB'   
      ctx.arc(canvasWidth/2, canvasWidth/2, canvasWidth/2, 0,Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
      ctx.clip()

      ctx.fillStyle = '#fff'
      // 次外层的圆
      ctx.beginPath()  
      ctx.arc(canvasWidth/2, canvasWidth/2, canvasWidth/2 - 1, 0,Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
      ctx.clip()

      // canvas的实际背景
      ctx.beginPath()  
      ctx.arc(canvasWidth/2, canvasWidth/2, canvasWidth/2 - 9, 0,Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
      ctx.clip()

      // canvas绘制背景图片
      ctx.drawImage(bgUrl, 0, 0, canvasWidth, canvasWidth)

      // 头像或者logo的白色背景
      ctx.beginPath()  
      ctx.arc(canvasWidth/2, canvasWidth/2, 60, 0,Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
      ctx.clip()

      ctx.beginPath()  
      ctx.arc(canvasWidth/2, canvasWidth/2, 60 - 5, 0,Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
      ctx.clip()

      // 实际的logo或者头像
      ctx.drawImage(avatarUrl, canvasWidth/2 - avatarWidth/2, canvasWidth/2 - avatarWidth/2, avatarWidth, avatarWidth)

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