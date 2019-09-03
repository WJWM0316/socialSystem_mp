import {ellipsis, ellipsisText} from '../../../../../utils/canvas.js'
import {getPositionQrcodeApi} from '../../../../../api/pages/qrcode.js'
import {agreedTxtB} from '../../../../../utils/randomCopy.js'
import {replace} from '../../../../../config.js'

let app = getApp()
let info = null
let avatarUrl = ''
let qrCodeUrl = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    imgW: 750,
    imgH: 0,
    openSet: true,
    timerSecond: 30000,
    guidePop: true
  },
  drawing (avatarUrl, qrCodeUrl) {
    const ctx = wx.createCanvasContext('canvas')
    let that = this
    ctx.setFillStyle('#652791')
    ctx.fillRect(0, 0, 750, 1180)
    // 头像
    ctx.drawImage(avatarUrl, 300, 131, 150, 150)
    // 二维码
    ctx.drawImage(qrCodeUrl, 289, 831, 175, 175)
    // 背景图1
    ctx.drawImage(`../../../../../images/exPosition.png`, 0, 0, 750, 1180)
    // 个人资料
    ctx.setTextAlign('center')
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(34)
    ellipsis(ctx, `${info.recruiterInfo.name}`, 260, 375, 340)
    ctx.setFontSize(24)
    ellipsis(ctx, `${info.recruiterInfo.companyShortname} | ${info.recruiterInfo.position}`, 550, 375, 378)
    ctx.setFontSize(22)
    ctx.fillText(agreedTxtB(), 375, 435)

    // 主要内容
    ctx.setFontSize(58)
    ellipsis(ctx, info.positionName, 640, 375, 616)
    ctx.setFontSize(50)
    ctx.fillText(`${info.emolumentMin * 1000}~${info.emolumentMax * 1000}元/月`, 375, 682)

    // icon
    ctx.setFontSize(24)
    ctx.setTextAlign('left')
    let cityWidth = ctx.measureText(`${info.city}${info.district}`).width
    let edWidth = ctx.measureText(info.educationName).width
    let exWidth = ctx.measureText(info.workExperienceName).width
    let allWidth = cityWidth + edWidth + exWidth + 90 + 30 + 80
    let msgWidth = 375 - allWidth / 2
    ctx.drawImage(`../../../../../images/a3.png`, msgWidth, 714, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(`${info.city}${info.district}`, msgWidth, 741)
    msgWidth = msgWidth + cityWidth + 40
    ctx.drawImage(`../../../../../images/a1.png`, msgWidth, 714, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.workExperienceName, msgWidth, 741)
    msgWidth = msgWidth + exWidth + 40
    ctx.drawImage(`../../../../../images/a2.png`, msgWidth, 714, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.educationName, msgWidth, 741)

    
    // 标签
    let r = 24
    ctx.setTextAlign('left')
    function addLabel(item, index) {
      let x=0, y=0
      switch(index) {
        case 0: 
          x = 270
          y = 204
          break
        case 1:
          x = 520
          y = 136
          break
        case 2: 
          x = 238
          y = 128
          break
        case 3:
          x = 494
          y = 200
          break
        case 4: 
          x = 445
          y = 64
          break
        case 5:
          x = 276
          y = 64
          break
        case 6:
          x = 212
          y = 265
          break
        case 7:
          x = 538
          y = 266
          break
      }
      let metricsW = ctx.measureText(item).width // 文本宽度
      if (index === 0 || index === 2 || index === 5 || index === 6) {
        x = x - metricsW - 2*r
      }
      ctx.setStrokeStyle('#fff')
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + r + metricsW, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x + r, y + r, r, 0.5*Math.PI, 1.5*Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x + r + metricsW, y + 2*r)
      ctx.lineTo(x + r, y + 2*r)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x + r + metricsW, y + r, r, 1.5*Math.PI, 0.5*Math.PI)
      ctx.stroke()
      ctx.fillText(item, x + r, y + 35)
    }
    info.lightspotInfo.map((item, index) => {
      addLabel(item, index)
    })

    ctx.setTextAlign('center')
    ctx.setFontSize(26)
    ctx.fillText('长按打开小程序查看职位详情', 375, 1050)

    if (info.recruiterInfo.recruiterTypes.length !== 0) {
      let types = ''
      info.recruiterInfo.recruiterTypes.map((item, index) => {
        if (index === 0) {
          types = item.name
        } else {
          types = `${types}、${item.name}`
        }
      })
      let string = `Ta还有${ellipsisText(ctx, types, 275)}等${info.recruiterInfo.positionNum}个职位在招 !`
      ellipsis(ctx, string, 554, 375, 1097, '#FFFFFF', {color: '#ffffff', r:21, y:1066, maxWidth: 750, opacity: 0.3})
    }
    
    
    ctx.draw(true, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          quality: 1,
          canvasId: 'canvas',
          success(res) {
            that.setData({imgUrl: res.tempFilePath})
            wx.hideLoading()
            wx.removeStorageSync('posterData')
          }
        })
      }, 500)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    info = wx.getStorageSync('posterData')
    let that = this
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
        url: info.recruiterInfo.avatar.smallUrl.replace(replace.path1, replace.path2),
        success(res) {
          avatarUrl = loadResult(res, resolve)
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
        }
      })
    })
    let loadQrCode = new Promise((resolve, reject) => {
      // 二维码
      getPositionQrcodeApi({positionId: info.id, channel: 'qrpe'}).then(res => {
        // 二维码
        wx.downloadFile({
          url: res.data.positionQrCodeUrl.replace(replace.path1, replace.path2),
          success(res) {
            qrCodeUrl = loadResult(res, resolve)
          },
          fail(e) {
            app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
          }
        })
      })
    })
    Promise.all([loadAvatar, loadQrCode]).then((result) => {
      wx.showLoading({
        title: '正在生成...'
      })
      this.drawing (avatarUrl, qrCodeUrl)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let guidePop = wx.getStorageSync('guidePop') || false
    this.setData({guidePop})
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({openSet: true})
        }
      }
    })
  },
  onGotUserInfo(e) {
    app.onGotUserInfo(e, true).then(res => {
      this.setData({userInfo: app.globalData.userInfo})
    })
  },
  hidePop (e) {
    this.setData({guidePop: true})
  },
  saveImg () {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.setData({openSet: true})
              svae()
            },
            fail (res) {
              if (res.errMsg.indexOf('fail') !== -1) {
                that.setData({openSet: false})
              } 
            }
          })
        } else {
          svae()
        }
       }
    })
    function svae () {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imgUrl,
        success: function (e) {
          app.wxToast({
            title: '已保存至相册',
            icon: 'success',
            callback () {
              app.shareStatistics({
                id: info.id,
                type: 'position',
                sCode: info.sCode,
                channel: 'qrpe'
              })
            }
          })
        },
        fail: function (e) {
          console.log(e)
          app.wxToast({
            title: '保存失败'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  }
})