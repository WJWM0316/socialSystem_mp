import {getPositionListApi} from '../../../../../api/pages/position.js'
import {getPersonalResumeApi} from '../../../../../api/pages/center.js'
import {getResumerCodeApi} from '../../../../../api/pages/qrcode.js'
import {ellipsis, lineFeed} from '../../../../../utils/canvas.js'
import {replace} from '../../../../../config.js'

let app = getApp()
let qrCodeUrl = ''
let avatarUrl = ''
let info = {}
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
    ctx.fillRect(0, 0, 750, 5000)

    ctx.drawImage(avatarUrl, 306, 55, 138, 138)

    // 背景图1
    ctx.drawImage(`../../../../../images/j4.png`, 0, 0, 750, 401)
    // 个人资料
    ctx.setFontSize(46)
    ctx.setFillStyle('#282828')
    ctx.setTextAlign('center')
    ctx.fillText(info.name, 375, 265)

    let curHeight = 265
    if (info.lastCompanyName) {
      ctx.setFontSize(26)
      curHeight = curHeight + 42
      ellipsis(ctx, `${info.lastCompanyName} | ${info.lastPosition}`, 500, 375, curHeight)
    }
    
    if (info.jobStatusDesc) {
      curHeight = curHeight + 28
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 120)
      ctx.setFillStyle('#EFE9F4')
      ctx.fillRect(278, curHeight, 195, 38)
      ctx.setFontSize(24)
      ctx.setFillStyle('#652791')
      ctx.fillText(info.jobStatusDesc, 375, curHeight + 28)
    }

    curHeight = curHeight + 60

    ctx.setFontSize(24)
    ctx.setTextAlign('left')
     ctx.setFillStyle('#282828')
    let ageDesc = ''
    if (!info.age) {
      ageDesc = '未填'
    } else {
      ageDesc = `${info.age}岁`
    }
    let cityWidth = ctx.measureText(info.workAgeDesc).width
    let edWidth = ctx.measureText(ageDesc).width
    let exWidth = ctx.measureText(`${info.degreeDesc}`).width

    let allWidth = cityWidth + edWidth + exWidth + 90 + 30 + 80
    let msgWidth = 375 - allWidth / 2
    ctx.drawImage(`../../../../../images/a1.png`, msgWidth, curHeight, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.workAgeDesc, msgWidth, curHeight + 25)
    msgWidth = msgWidth + cityWidth + 40
    ctx.drawImage(`../../../../../images/a4.png`, msgWidth, curHeight, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(ageDesc, msgWidth, curHeight + 25)
    msgWidth = msgWidth + exWidth + 40
    ctx.drawImage(`../../../../../images/a2.png`, msgWidth, curHeight, 30, 30)
    msgWidth = msgWidth + 40
    ctx.fillText(info.degreeDesc, msgWidth, curHeight + 25)

    ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight + 30, 750, 50)
    // 画个性标签
    // 
    if (info.personalizedLabels.length > 0) {
      curHeight = curHeight + 76
      let r = 24
      let nextLabel = true
      let position = {}
      position = {
        x: 78,
        y: curHeight
      }
      ctx.setFontSize(26)
      ctx.setStrokeStyle('#fff')
      ctx.setLineWidth(1)
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 65)
      info.personalizedLabels.map((item, index) => {
        addLabel(item, index)
      })
      function addLabel(item, index) {
      // 下个标签的宽度
        let newLabelWidth = 0
        if (index < info.personalizedLabels.length-1) {
          newLabelWidth = ctx.measureText(info.personalizedLabels[index+1].labelName || info.personalizedLabels[index+1].name).width + 2*r
        }
        
        let metricsW = ctx.measureText(item.labelName || item.name).width // 文本宽度
        ctx.setFillStyle('#652791')
        ctx.fillText(item.labelName || item.name, position.x + r, position.y + r + 10)
        ctx.setStrokeStyle('#CEC5DF')
        ctx.beginPath()
        ctx.moveTo(position.x + r, position.y)
        ctx.lineTo(position.x + r + metricsW, position.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(position.x + r, position.y + r, r, 0.5*Math.PI, 1.5*Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(position.x + r + metricsW, position.y + 2*r)
        ctx.lineTo(position.x + r, position.y + 2*r)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(position.x + r + metricsW, position.y + r, r, 1.5*Math.PI, 0.5*Math.PI)
        ctx.stroke()
        // 下一个标签的横坐标
        position.x = position.x + 2*r + metricsW + 16
        // 判断是否需要换行
        if (newLabelWidth > (750 - 78 - position.x)) {
          position.x = 78
          position.y = position.y + 2*r + 15
          curHeight = position.y
          ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 65)
        }
      }
    }

    // 个人简介
    let descWidth = 0
    let descString = ''
    let descIndex = 0
    curHeight = curHeight + 60
    ctx.setFontSize(28)
    ctx.setFillStyle('#282828')
    ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 78)
    curHeight = curHeight + 30
    if (!info.signature) info.signature = '你还未填写个性签名，说说你的想法吧~'

    curHeight = lineFeed(ctx, info.signature, 590, 80, curHeight, `../../../../../images/a7.png`, 750, 110)

    // 求职意向
    ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
    curHeight = curHeight + 30
    ctx.setFontSize(28)
    ctx.setFillStyle('#282828')
    ctx.drawImage(`../../../../../images/a5.png`, 80, curHeight, 193, 50)
    ctx.fillText('求职意向', 125, curHeight + 36)
    // 虚线
    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('#282828')
    ctx.setLineDash([4, 6], 0)
    ctx.moveTo(291, curHeight + 25)
    ctx.lineTo(666, curHeight + 25)
    ctx.stroke()

    curHeight = curHeight + 70

    if (info.expects.length > 0) {
      info.expects.map((item, index) => {
        expectsItem(item, index)
      })
    } else {
      ctx.setTextAlign('center')
      
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
      curHeight = curHeight + 36

      ctx.fillText('尚未完善', 375, curHeight)
    }
    

    function expectsItem(item, index) {
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 150)
      let title = `${item.position} | ${item.city}`
      let nameWidth = ctx.measureText(title).width
      let nameString = ''
      let nameStringWidth = 0
      // 职位名
      ctx.setFontSize(32)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')

      ellipsis(ctx, title, 270, 80, curHeight + 32)

      // 其他
      ctx.setFontSize(24)
      let desc = ''
      item.fields.map((n, i) => {
        if (desc) {
          desc = desc + ' · ' + n.field
        } else {
          desc = n.field
        }
      })

      ellipsis(ctx, desc, 390, 80, curHeight + 72)

      // 薪资
      ctx.setFontSize(36)
      ctx.setFillStyle('#FF7F4C')
      ctx.setTextAlign('right')
      ctx.fillText(`${item.salaryFloor * 1000}~${item.salaryCeil * 1000}`, 606, curHeight + 36)
      ctx.setFontSize(24)
      ctx.fillText(`元/月`, 670, curHeight + 32)

      curHeight = curHeight + 102

      // 虚线
      if (index < info.expects.length - 1) {
        ctx.beginPath()
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#CED7DC')
        ctx.setLineDash([4, 6], 0)
        ctx.moveTo(80, curHeight)
        ctx.lineTo(670, curHeight)
        ctx.stroke()
        curHeight = curHeight + 20
      }
    }

    curHeight = curHeight + 25

    // 工作经历
    ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
    curHeight = curHeight + 20
    ctx.setFontSize(28)
    ctx.setFillStyle('#282828')
    ctx.setTextAlign('left')
    ctx.drawImage(`../../../../../images/a5.png`, 80, curHeight, 193, 50)
    ctx.fillText('工作经历', 125, curHeight + 36)
    // 虚线
    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('#282828')
    ctx.setLineDash([4, 6], 0)
    ctx.moveTo(291, curHeight + 25)
    ctx.lineTo(666, curHeight + 25)
    ctx.stroke()


    curHeight = curHeight + 70
    if (info.careers.length > 0) {
      info.careers.map((item, index) => {
        careersItem(item, index)
      })
    } else {
      ctx.setTextAlign('center')
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
      ctx.fillText('尚未完善', 375, curHeight + 36)
      curHeight = curHeight + 76
    }

    function careersItem(item, index) {
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 200)
      let title = `${item.company}`
      let nameWidth = ctx.measureText(title).width
      let nameString = ''
      let nameStringWidth = 0
      // 职位名
      ctx.setFontSize(32)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')

      ellipsis(ctx, title, 390, 80, curHeight + 32)
      
      // 日期
      if (item.startTime) {
        ctx.setFontSize(24)
        ctx.setFillStyle('#626262')
        ctx.setTextAlign('right')
        item.startTimeDesc = item.startTimeDesc.split('-').join('.')
        item.endTimeDesc = item.endTimeDesc.split('-').join('.')
        ellipsis(ctx, `${item.startTimeDesc}-${item.endTimeDesc}`, 390, 670, curHeight + 36)
      }
      

      // 其他
      ctx.setFontSize(28)
      ctx.setTextAlign('left')
      ellipsis(ctx, item.position, 390, 80, curHeight + 72)

      let padding = 20
      curHeight = curHeight + 105
      let teamPosition = {
        x: 80,
        y: curHeight
      }
      ctx.setFontSize(24)

      item.technicalLabels.map((item, index) => {
        addTeamLabel(item.labelName, index)
      })

      function addTeamLabel(n, j) {
        let metricsW = ctx.measureText(n).width // 当前文本宽度
        ctx.setFillStyle('#EFE9F4')
        ctx.fillRect(teamPosition.x, teamPosition.y, metricsW + 40, 42)
        ctx.setFillStyle('#652791')
        ctx.fillText(n, teamPosition.x + padding, teamPosition.y + 29)

        // 下个标签的宽度
        let newLabelWidth = 0
        if (j < item.technicalLabels.length-1) {
          newLabelWidth = ctx.measureText(item.technicalLabels[j+1].labelName).width + 2*padding
        }

        // 下一个标签的横坐标
        teamPosition.x = teamPosition.x + 2*padding + metricsW + 12

        // 判断是否需要换行
        if (newLabelWidth > (750 - 80 - teamPosition.x)) {
          teamPosition.x = 80
          teamPosition.y = teamPosition.y + 2*padding + 15
          curHeight = teamPosition.y
        }
      }

      curHeight = curHeight + 70
      if (index < info.careers.length - 1) {
        // 虚线
        ctx.beginPath()
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#CED7DC')
        ctx.setLineDash([4, 6], 0)
        ctx.moveTo(80, curHeight)
        ctx.lineTo(670, curHeight)
        ctx.stroke()
      }
      curHeight = curHeight + 20
    }
    
    // 教育经历
    ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
    curHeight = curHeight + 20
    ctx.setFontSize(28)
    ctx.setFillStyle('#282828')
    ctx.setTextAlign('left')
    ctx.drawImage(`../../../../../images/a5.png`, 80, curHeight, 193, 50)
    ctx.fillText('教育经历', 125, curHeight + 36)

    // 虚线
    ctx.beginPath()
    ctx.setLineWidth(1)
    ctx.setStrokeStyle('#282828')
    ctx.setLineDash([4, 6], 0)
    ctx.moveTo(291, curHeight + 25)
    ctx.lineTo(666, curHeight + 25)
    ctx.stroke()

    curHeight = curHeight + 80
    if (info.educations.length > 0) {
      info.educations.map((item, index) => {
        educationsItem(item, index)
      })
    } else {
      ctx.setTextAlign('center')
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 100)
      ctx.fillText('尚未完善', 375, curHeight + 30)
      curHeight = curHeight + 70
      // 虚线
      ctx.beginPath()
      ctx.setLineWidth(1)
      ctx.setStrokeStyle('#CED7DC')
      ctx.setLineDash([4, 6], 0)
      ctx.moveTo(80, curHeight)
      ctx.lineTo(670, curHeight)
      ctx.stroke()
    }
    

    function educationsItem(item, index) {
      ctx.drawImage(`../../../../../images/a7.png`, 0, curHeight, 750, 150)
      let title = `${item.school}`
      let nameWidth = ctx.measureText(title).width
      let nameString = ''
      let nameStringWidth = 0
      // 职位名
      ctx.setFontSize(32)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')

      ellipsis(ctx, title, 390, 80, curHeight + 32)

      
      // 日期
      if (item.startTime) {
        ctx.setFontSize(24)
        ctx.setFillStyle('#626262')
        ctx.setTextAlign('right')
        item.startTimeDesc = item.startTimeDesc.split('-').join('.')
        item.endTimeDesc = item.endTimeDesc.split('-').join('.')
        ctx.fillText(`${item.startTimeDesc}-${item.endTimeDesc}`, 670, curHeight + 36)
      }
      
      // 专业
      curHeight = curHeight + 72
      ctx.setFontSize(28)
      ctx.setFillStyle('#282828')
      ctx.setTextAlign('left')
      let text = item.major ? item.degreeDesc + ` · ${item.major}` : item.degreeDesc
      ellipsis(ctx, text, 390, 80, curHeight)

      curHeight = curHeight + 40

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

    ctx.drawImage(qrCodeUrl, 113, curHeight + 42, 168, 168)
    ctx.drawImage(`../../../../../images/j3.png`, 0, curHeight, 750, 412)

    ctx.setFontSize(32)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#652791')
    ctx.fillText('长按查看Ta的完整简历', 311, curHeight + 150)
    
    curHeight = curHeight + 412
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
    info = app.globalData.resumeInfo
    
    getPersonalResumeApi().then(res => {
      info = res.data
      Promise.all([loadAvatar, loadQrCode]).then((result) => {
        wx.showLoading({
          title: '正在生成...',
        })
        this.drawing (info, avatarUrl, qrCodeUrl)
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
      getResumerCodeApi({resumeUid: app.globalData.resumeInfo.uid}).then(res => {
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
                type: 'resume',
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