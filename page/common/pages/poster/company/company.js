import {getPositionListApi} from '../../../../../api/pages/position.js'
import {getRecruiterDetailApi} from '../../../../../api/pages/recruiter.js'
import {ellipsis, lineFeed, drawLabel, addBorder } from '../../../../../utils/canvas.js'
import {getCompanyQrcodeApi} from '../../../../../api/pages/qrcode.js'
import {replace} from '../../../../../config.js'
let app = getApp()
let info = null
let positionList = [],
    positionNum = 0
let avatarUrl = ''
let qrCodeUrl = ''
let cWidth = 0,
    cHeight = 0,
    cX = 0,
    cY = 0
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
    let curHeight = 0
    // 头像
    // 横向长图
    if (cWidth > cHeight) {
      cHeight = 148 * cHeight / cWidth
      cWidth = 148
      cX = 301
      cY = 70 + (148 - cHeight) / 2
    } else if (cWidth < cHeight) {
      cWidth = 148 * cWidth / cHeight
      cHeight = 148
      cY = 70
      cX = 301 + (148 - cWidth) / 2
    } else {
      cWidth = 148
      cHeight = 148
      cX = 301
      cY = 70
    }
    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(301, 70, 148, 148)
    ctx.drawImage(avatarUrl, cX, cY, cWidth, cHeight)
    
    // 背景图1
    ctx.drawImage(`../../../../../images/company1.png`, 0, 0, 750, 396)
    curHeight = 396

    // 公司名, 类型 规模
    ctx.setTextAlign('center')
    ctx.setFillStyle('#282828')
    ctx.setFontSize(46)
    ellipsis(ctx, info.companyShortname, 500, 375, 290)
    ctx.setFontSize(24)
    ellipsis(ctx, `${info.industry} · ${info.employeesDesc}`, 500, 375, 334)
    ctx.setTextAlign('left')
    ctx.drawImage(`../../../../../images/company4.png`, 0, curHeight, 750, 120)
    if (info.lightspotInfo.length > 6) {
      curHeight+=60
      ctx.drawImage(`../../../../../images/company4.png`, 0, curHeight, 750, 120)
    }
    curHeight+=120
    ctx.drawImage(`../../../../../images/company2.png`, 0, curHeight, 750, 122)
    curHeight+=122

    // 福利标签
    drawLabel(ctx, info.lightspotInfo, {x: 97, y: 364, r: 24, fontSize: 24, color: '#652791'})

    let bgObject = {}
    positionList.map((item, index) => {
      if (index < 3) positionItem(item, index)
    })

    function positionItem(item, index) {
      ctx.drawImage(`../../../../../images/company4.png`, 0, curHeight, 750, 200)
      // 职位名
      ctx.setFontSize(32)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')
      
      ellipsis(ctx, item.positionName, 270, 80, curHeight + 32)
      // 其他
      ctx.setFontSize(24)
      let textH = curHeight + 80,
          nextPositionX = 80
      let setLable = (text, x) => {
        bgObject = {padding: 12, margin: 12, height: 44, color: '#F8F7F9', x: nextPositionX, y: curHeight + 50}
        nextPositionX = addBorder({ctx, text, bgObject})
        ctx.setFillStyle('#626262')
        ctx.fillText(text, x, textH)
      }
      setLable(`${item.city}${item.district}`, 92)
      setLable(`${item.workExperienceName}`, nextPositionX + 12)
      setLable(`${item.educationName}`, nextPositionX + 12)

      // 薪资
      ctx.setFontSize(36)
      ctx.setFillStyle('#FF7F4C')
      ctx.setTextAlign('right')

      ctx.fillText(`${item.emolumentMin * 1000}~${item.emolumentMax * 1000}`, 606, curHeight + 36)
      ctx.setFontSize(24)
      ctx.fillText(`元/月`, 670, curHeight + 32)

      curHeight = curHeight + 130

      // 虚线
      if (index !== positionList.length - 1) {
        ctx.beginPath()
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#CED7DC')
        ctx.setLineDash([4, 6], 0)
        ctx.moveTo(80, curHeight)
        ctx.lineTo(670, curHeight)
        ctx.stroke()
        curHeight = curHeight + 50
      }
    }

    if (positionList.length > 3) {
      ctx.drawImage(qrCodeUrl, 58, curHeight + 110, 160, 160)
      ctx.drawImage(`../../../../../images/company3.png`, 0, curHeight, 750, 330)
      ctx.setFillStyle('#626262')
      ctx.setTextAlign('center')
      ctx.setFontSize(24)
      ctx.fillText(`Ta还有【${positionList[3].positionName}】等${positionNum - 3}个职位在招`, 375, curHeight + 10)
    } else {
      ctx.drawImage(qrCodeUrl, 58, curHeight + 70, 160, 160)
      ctx.drawImage(`../../../../../images/company3.png`, 0, curHeight - 40, 750, 330)
      curHeight = curHeight - 40
    }

    curHeight += 330
    ctx.setFontSize(30)
    ctx.setFillStyle('#FFFFFF')
    ctx.setTextAlign('left')
    ctx.fillText(`长按识别小程序码，`, 250, curHeight - 155)
    ctx.fillText(`查看公司和职位详情`, 250, curHeight - 105)
    
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
    
    getRecruiterDetailApi().then(res => {
      info = res.data.companyInfo
      let loadAvatar = new Promise((resolve, reject) => {
        // 头像
        wx.downloadFile({
          url: info.logo.smallUrl.replace(replace.path1, replace.path2),
          success(res) {
            avatarUrl = loadResult(res, resolve)
            wx.getImageInfo({
              src: avatarUrl,
              success(res0) {
                cWidth = res0.width
                cHeight = res0.height
              }
            })
          },
          fail(e) {
            app.wxToast({title: '图片加载失败，请重新生成', callback() {wx.navigateBack({ delta: 1 })}})
          }
        })
      })
      let loadQrCode = new Promise((resolve, reject) => {
        // 二维码
        getCompanyQrcodeApi().then(res => {
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
      Promise.all([this.getPositionList(), loadAvatar, loadQrCode]).then((result) => {
        wx.showLoading({
          title: '正在生成...',
        })
        this.drawing(info, avatarUrl, qrCodeUrl)
      })
    })
  },
  getPositionList () {
    return getPositionListApi({company_id: info.id, is_online: 1}).then(res => {
      positionList = res.data
      positionNum = res.meta.total
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