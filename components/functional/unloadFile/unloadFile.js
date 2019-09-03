// components/functional/unloadFile/unloadFile.js
import {unloadApi} from '../../../api/pages/common.js'
import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION} from '../../../config.js'
let fileNum = 0 // 选择文件的数量
let result = [] // 返回父组件的结果
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    unloadType: {
      type: String,
      value: 'img'
    },
    number: {
      type: Number,
      value: 9
    },
    url: {
      type: String,
      value: ''
    },
    cardInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    unloadFile() {
      wx.chooseImage({
        count: this.data.number,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.setData({url: res.tempFiles[0].path})
          fileNum = res.tempFiles.length
          if(this.data.cardInfo.type !== 'idCard') {
            wx.showLoading({title: '上传中...', mask: true})
          }
          res.tempFiles.forEach((item) => {
            this.wxupLoad(item)
          })
        },
        fail: (err) => {
          console.log('wx.chooseImage发神经了', err)
        }
      })
    },
    wxupLoad(file) {
      let BASEHOST = ''
      let type = this.data.cardInfo.type === 'idCard' ? 'attaches/idcard' : 'attaches'
      let formData = {
        'img1': file.path,
        'attach_type': this.data.unloadType,
        'size': file.size,
        'side': this.data.cardInfo.side
      }

      this.triggerEvent('beforeUpload')

      if (wx.getStorageSync('choseType') === 'APPLICAN') {
        BASEHOST = APPLICANTHOST
      } else {
        BASEHOST = RECRUITERHOST
      }
      wx.uploadFile({
        url: `${BASEHOST}/${type}`,
        filePath: file.path,//此处为图片的path
        methos: 'post',
        name:"file",
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Wechat-Version': VERSION
        }, 
        // 设置请求的 header
        formData,
        complete: (res) => {
          if (res.statusCode === 200) {
            console.log(res, "上传成功")
            // result = JSON.parse(res.data)
            let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
            result.push(data.data[0])
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
            return
          }
          fileNum--
          if (fileNum === 0) {
            wx.hideLoading()
            this.triggerEvent('resultEvent', result)
            result = []
          }
        }
      })
    }
  }
})
