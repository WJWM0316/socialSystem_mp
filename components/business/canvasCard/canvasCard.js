import {ellipsis} from '../../../utils/canvas.js'
import {replace} from '../../../config.js'

let avatarUrl = ''
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardData: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  attached() {
    let that = this
    let avatarImg = ''
    if (this.data.type === 'position') {
      avatarImg = that.data.cardData.recruiterInfo.avatar.smallUrl
    } else if (this.data.type === 'company') {
      avatarImg = that.data.cardData.logoInfo ? that.data.cardData.logoInfo.smallUrl : that.data.cardData.logo.smallUrl
    } else if (this.data.type === 'interview') {
      avatarImg = that.data.cardData.jobhunterInfo.avatar.smallUrl
    } else {
      avatarImg = that.data.cardData.avatar.smallUrl
    }
    let loadAvatar = new Promise((resolve, reject) => {
      // 头像
      wx.downloadFile({
        url: avatarImg.replace(replace.path1, replace.path2),
        success(res) {
          if (res.statusCode === 200) {
            resolve(res)
            avatarUrl = res.tempFilePath
            that.drawing(avatarUrl)
          }
        },
        fail(e) {
          app.wxToast({title: '图片加载失败，请退出重新生成'})
        }
      })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawing (avatarUrl) {
      let that = this
      let info = this.data.cardData
      const ctx = wx.createCanvasContext('cardCanvas', this)
      switch(this.data.type) {
        case 'recruiter':
          ctx.drawImage(avatarUrl, 160, 73, 100, 100)
          ctx.drawImage('../../../images/zhaopin.png', 0, 0, 420, 336)
          ctx.setFontSize(28)
          ctx.setFillStyle('#ffffff')
          ctx.setTextAlign('center')
          ellipsis(ctx, info.name, 168, 210, 215)
          ctx.setFontSize(20)
          ctx.setTextAlign('left')
          let r = 17
          function addLabel(item, index) {
            let x=0, y=0
            switch(index) {
              case 0: 
                x = 198
                y = 34
                break
              case 1:
                x = 226
                y = 28
                break
              case 2: 
                x = 154
                y = 90
                break
              case 3:
                x = 264
                y = 84
                break
              case 4: 
                x = 159
                y = 150
                break
              case 5:
                x = 264
                y = 144
                break
            }
            let metricsW = ctx.measureText(item).width // 文本宽度
            if (index === 0 || index === 2 || index === 4) {
              x = x - metricsW - 2*r
            }
            ctx.beginPath()
            ctx.setFillStyle('#8452A7')
            ctx.arc(x + r, y + r, r, 0.5*Math.PI, 1.5*Math.PI)
            ctx.arc(x + metricsW + r, y + r, r, 1.5*Math.PI, 0.5*Math.PI)
            ctx.fill()
            ctx.setFillStyle('#ffffff')
            ctx.fillText(item, x + r, y + 26)
          }
          info.personalizedLabels.map((item, index) => {
            addLabel(item.labelName, index)
          })
          ctx.setFillStyle('#8452A7')
          let position = `${info.companyInfo.companyShortname} | ${info.position}`
          ctx.setFontSize(24)
          ctx.setTextAlign('center')
          ellipsis(ctx, position, 285, 210, 277, '#282828', {color: '#FFDC29', r: 25, y:243, maxWidth: 420})
        break
        case 'position':
          ctx.setTextAlign('left')
          ctx.drawImage(avatarUrl, 22, 24, 78, 78)
          ctx.drawImage('../../../images/zhiwei.png', 0, 0, 420, 336)
          ctx.setFontSize(26)
          ctx.setFillStyle('#ffffff')
          ellipsis(ctx, info.recruiterInfo.name, 194, 113, 62)
          ctx.setFontSize(22)
          ellipsis(ctx, info.recruiterInfo.position, 194, 113, 94)
          ctx.setFontSize(40)
          ctx.setFillStyle('#FFDC29')
          ctx.fillText(`${info.emolumentMin}K~${info.emolumentMax}K`, 20, 173)
          ctx.setFontSize(28)
          ctx.setFillStyle('#ffffff')
          ellipsis(ctx, info.positionName, 380, 20, 216)
          ctx.setFontSize(20)
          let positionX = 0
          positionX = ellipsis(ctx, `${info.city}${info.district}`, 155, 32, 259, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: 22, y:234})
          positionX = ellipsis(ctx, `${info.workExperienceName}`, 155, positionX + 20, 259, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: positionX + 8, y:234})
          positionX = ellipsis(ctx, `${info.educationName}`, 155, positionX + 20, 259, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: positionX + 8, y:234})
          ctx.setFontSize(26)
          ellipsis(ctx, info.companyInfo.companyShortname, 380, 24, 312)
        break
        case 'resume':
          ctx.setTextAlign('left')
          ctx.drawImage(avatarUrl, 40, 56, 100, 100)
          ctx.drawImage('../../../images/shareResume.png', 0, 0, 420, 336)
          ctx.setFontSize(28)
          ctx.setFillStyle('#ffffff')
          ellipsis(ctx, info.name, 194, 170, 102)
          if(info.jobStatusDesc){
            ctx.setFontSize(22)
            ellipsis(ctx, info.jobStatusDesc, 194, 170, 132)
          }
          let positionX2 = 0
          if(info.expects && info.expects.length>0){
            ctx.setFontSize(22)
            ellipsis(ctx, `期望职位：${info.expects[0].position}`, 380, 40, 250)
            ctx.setFontSize(20)
            positionX2 = ellipsis(ctx, `${info.expects[0].city}`, 150, 50, 200, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: 40, y:176})
          }
          if (info.workAgeDesc) {
            positionX2 = ellipsis(ctx, `${info.workAgeDesc}`, 150, positionX2 + 20, 200, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: positionX2 + 8, y:176})
          }
          if (info.degreeDesc) {
            positionX2 = ellipsis(ctx, `${info.degreeDesc}`, 150, positionX2 + 20, 200, '#ffffff', {color: '#8452A7', padding: 12, margin: 12, height: 34, x: positionX2 + 8, y:176})
          }
        break
        case 'company':
          ctx.drawImage(avatarUrl, 160, 75, 98, 98)
          ctx.drawImage('../../../images/shareCompany.png', 0, 0, 420, 336)
          ctx.setFontSize(30)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#ffffff')
          ellipsis(ctx, info.companyShortname, 380, 210, 230)
          ctx.setFontSize(22)
          ctx.setTextAlign('center')
          let position3 = 20
          position3 = ellipsis(ctx, `${info.industry} | ${info.employeesInfo || info.employeesDesc}`, 390, 210, 265)
        break
        case 'interview':
          ctx.setTextAlign('left')
          ctx.drawImage(avatarUrl, 40, 76, 100, 100)
          ctx.drawImage('../../../images/shareInterview.png', 0, 0, 420, 336)
          ctx.setFontSize(32)
          ctx.setFillStyle('#ffffff')
          ellipsis(ctx, info.jobhunterInfo.realname, 194, 165, 115)
          ctx.setFontSize(22)
          ellipsis(ctx, info.jobhunterInfo.workAgeDesc, 194, 165, 150)
          ctx.setFontSize(24)
          ellipsis(ctx, `面试岗位：${info.positionName || '直接约面'}`, 380, 40, 220)
          console.log(info.arrangementInfo, 1111)
          ellipsis(ctx, `面试时间：${info.arrangementInfo.appointment}`, 380, 40, 255)
        break
      }
      ctx.draw(true, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            quality: 1,
            canvasId: 'cardCanvas',
            success(res) {
              that.triggerEvent('getCreatedImg', res.tempFilePath)     
              console.log(res, '生成图片成功')
            },
            fail(e) {
              console.log(e, '生成图片失败')
            }
          }, this)
        }, 500)
      })
    }
  }
})
