import WeCropper from '../../../../components/functional/we-cropper/we-cropper.js'
import {unloadApi} from '../../../../api/pages/common.js'
import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION} from '../../../../config.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  wxupLoad(file) {
    let BASEHOST = ''
    if (wx.getStorageSync('choseType') === 'APPLICAN') {
      BASEHOST = APPLICANTHOST
    } else {
      BASEHOST = RECRUITERHOST
    }
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.uploadFile({
      url: `${BASEHOST}/attaches`,
      filePath: file.path,//此处为图片的path
      methos: 'post',
      name: "avatar",
      header: {
        'Authorization': wx.getStorageSync('token'),
        'Wechat-Version': VERSION
      }, 
      // 设置请求的 header
      formData: {
        'img1': file.path,
        'attach_type': 'avatar',
        'size': file.size
      }, 
      complete: (res) => {
        if (res.statusCode === 200) {
          let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
          wx.setStorageSync('avatar', data.data[0])
          wx.navigateBack({
            delta: 1
          })
        } else {
          if (res.statusCode === 401) {
            // 需要用到token， 需要绑定手机号
            if (JSON.parse(res.data).code === 4010) {
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: `${COMMON}bindPhone/bindPhone`
              })
            }
            // 需要用到微信token， 需要授权
            if (JSON.parse(res.data).code === 0) {
              wx.removeStorageSync('sessionToken')
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: `${COMMON}auth/auth`
              })
            }
          } else {
            console.log(res, "上传失败")
            this.triggerEvent('failUpload')
            let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
            if (data.msg) getApp().wxToast({title: data.msg})
          }
        }
        wx.hideLoading()
      }
    })
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        this.wxupLoad({path: avatar, size: 0})
      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap () {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    const { cropperOpt } = this.data
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})
