import {getPositionListApi} from '../../../../../api/pages/position.js'
import {getRecruiterDetailApi} from '../../../../../api/pages/recruiter.js'
import {ellipsis, lineFeed} from '../../../../../utils/canvas.js'
import {getRecruiterQrcodeApi} from '../../../../../api/pages/qrcode.js'
import {replace} from '../../../../../config.js'

let app = getApp()
let info = null
let positionList = []
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
    timerSecond: 30000
  },
  drawing (info, avatarUrl, qrCodeUrl) {
    let that = this
    const ctx = wx.createCanvasContext('canvas')
    ctx.width = 750
    ctx.setFillStyle('#652791')
    ctx.fillRect(0, 0, 750, 2500)

    // 头像
    ctx.drawImage(avatarUrl, 290, 71, 168, 168)

    // 背景图1
    ctx.drawImage(`../../../../../images/j1.png`, 0, 0, 750, 515)

    // vip
    if (info.companyInfo.id) {
      ctx.drawImage(`../../../../../images/vip.png`, 410, 190, 46, 46)
    }

    // 画资料
    ctx.setFontSize(46)
    ctx.setFillStyle('#fff')
    ctx.setTextAlign('center')
    ctx.fillText(info.name, 375, 305)
    ctx.setFontSize(26)
    ellipsis(ctx, info.position, 500, 375, 350)
    ctx.setFontSize(28)
    let cutString = ''
    let ellipsisWidth = ctx.measureText('...').width
    let companyDesc = `Ta属于【${info.companyInfo.companyShortname}】星球`
    if (ctx.measureText(companyDesc).width > 466) {
      for (let i = 0; i < companyDesc.length; i++) {
        cutString = cutString + companyDesc[i]
        if (ctx.measureText(cutString).width >= 466 - ellipsisWidth) {
          cutString = cutString + '...'
          ctx.fillText(cutString, 375, 397)
          break
        }
      }
    } else {
      ctx.fillText(companyDesc, 375, 397)
    }

    let curHeight = 515

    // 开始主要内容
    ctx.drawImage(`../../../../../images/a8.png`, 0, curHeight, 750, 100)
    ctx.drawImage(`../../../../../images/a6.png`, 79, curHeight - 20, 163, 32)
    ctx.setFontSize(28)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#282828')
    ctx.fillText('个人简介', 114, curHeight + 6)
    
    // 描述
    curHeight = curHeight + 60
    let descString = ''
    let descWidth = 0
    if (!info.brief) info.brief = '你还未填写个人简介，快去填写吧~'
    curHeight = lineFeed(ctx, info.brief, 580, 80, curHeight, `../../../../../images/a8.png`, 750, 48)

    // 在招职位
    ctx.drawImage(`../../../../../images/a8.png`, 0, curHeight, 750, 100)
    curHeight = curHeight + 30
    ctx.drawImage(`../../../../../images/a6.png`, 79, curHeight, 163, 32)
    ctx.fillText('在招职位', 114, curHeight + 26)

    curHeight = curHeight + 70
    positionList.map((item, index) => {
      positionItem(item, index)
    })

    function positionItem(item, index) {
      ctx.drawImage(`../../../../../images/a8.png`, 0, curHeight, 750, 135)
      // 职位名
      ctx.setFontSize(32)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')
      
      ellipsis(ctx, item.positionName, 270, 80, curHeight + 32)

      // 其他
      ctx.setFontSize(24)
      ctx.fillText(`${item.city}-${item.district} · ${item.workExperienceName} · ${item.educationName}`, 80, curHeight + 72)

      // 薪资
      ctx.setFontSize(36)
      ctx.setFillStyle('#FF7F4C')
      ctx.setTextAlign('right')
      ctx.fillText(`${item.emolumentMin * 1000}~${item.emolumentMax * 1000}`, 606, curHeight + 36)
      ctx.setFontSize(24)
      ctx.fillText(`元/月`, 670, curHeight + 32)

      curHeight = curHeight + 102

      // 虚线
      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.setStrokeStyle('#CED7DC')
      ctx.setLineDash([4, 6], 0)
      ctx.moveTo(80, curHeight)
      ctx.lineTo(670, curHeight)
      ctx.stroke()

      curHeight = curHeight + 20
    }

    ctx.drawImage(qrCodeUrl, 77, curHeight + 193, 167, 167)
    ctx.drawImage(`../../../../../images/j2.png`, 0, curHeight, 750, 408)
    ctx.setFontSize(26)
    ctx.setFillStyle('#282828')
    ctx.setTextAlign('center')
    ctx.fillText('长按识别查看全部在招职位', 375, curHeight + 60)
    

    ctx.setFontSize(30)
    ctx.setFillStyle('#fff')
    ctx.setTextAlign('left')

    ctx.fillText('像我这么Nice的面试官', 280, curHeight + 240)
    ctx.fillText('已经不多见了！', 280, curHeight + 280)
    ctx.setFontSize(24)
    ctx.fillText(`长按识别，查看Ta的详情`, 280, curHeight + 330)

    curHeight = curHeight + 408

    ctx.draw(true, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: curHeight,
          quality: 1,
          canvasId: 'canvas',
          success(res) {
            console.log(res.tempFilePath)
            that.setData({imgUrl: res.tempFilePath, imgH: curHeight})
            wx.hideLoading()
          }
        })
      }, 500)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    info = app.globalData.recruiterDetails
    getRecruiterDetailApi().then(res => {
      info = res.data
      Promise.all([loadAvatar, loadQrCode, getList]).then((result) => {
        wx.showLoading({
          title: '正在生成...',
        })
        this.drawing(info, avatarUrl, qrCodeUrl)
      })
    })
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
    let getList = getPositionListApi({recruiter: info.uid, count:2, is_online: 1}).then(res => {
      positionList = res.data
    })
    let loadAvatar = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: info.avatar.smallUrl.replace(replace.path1, replace.path2),
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
      getRecruiterQrcodeApi().then(res => {
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
                id: info.uid,
                type: 'recruiter',
                sCode: info.sCode,
                channel: 'qrpl'
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