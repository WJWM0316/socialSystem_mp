let app = getApp(),
    uploadTask = null;
import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION} from '../../../../../config.js'
import {
  getAttachResumeApi,
  scanQrcodeApi,
  scanLoginApi,
  saveAttachApi
} from '../../../../../api/pages/common.js'

Page({
  data: {
    option: {},
    platform: app.globalData.platform,
    navH: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    attachResume: {
      name: '',
      path: '',
      size: 0,
      time: 0,
      type: '',
      tips: '',
      errTips: '',
      progress: 0,
      uploading: false,
      vkey: ''
    },
    hasReFresh: false,
    actionList: [
      {
        id: 1,
        text: '预览简历',
        action: 'preview'
      },
      {
        id: 2,
        text: '重新上传',
        action: 'reupload'
      },
      {
        id: 3,
        text: '删除',
        action: 'delete'
      },
      {
        id: 4,
        text: '取消',
        action: 'cancle'
      }
    ],
    mobileUpload: true,
    actionMenu: false
  },
  onLoad(option) {
    if (option.mobileUpload) {
      this.setData({['attachResume.uploading']: true})

      return
    }
    this.getMyInfo().then(() => {
      const attachResume = app.globalData.resumeInfo.resumeAttach
      if(!attachResume) {
        return
      }
      this.setData({ attachResume })
    })    
  },
  backEvent() {
    if(uploadTask) {
      app.wxConfirm({
        title: '提示',
        content: '文件上传中，返回后将取消上传，确定离开当前页面？',
        cancelText: '确定',
        confirmText: '取消',
        cancelBack() {},
        confirmBack: () => {
          // wx.navigateBack({delta: 1})
          uploadTask.abort()
        }
      })
    } else {
      wx.navigateBack({delta: 1})
    }
  },
  uploadByWechat() {
    let that = this
    let callBack = () => {
      wx.chooseMessageFile({
        count: 1,
        type: 'all',
        success (res) {
          console.log(res, 111)
          that.upload(res.tempFiles[0])
        },
        fail(err) {
          console.log('wx.chooseImage发神经了', err)
        }
      })
    }
    if(wx.getStorageSync('uploadByWechat')) {
      callBack()
    } else {
      app.wxConfirm({
        title: '微信导入简历',
        content: `请提前将附件简历发送到【文件传输助手】或微信好友，然后在选择好友列表中选中对应聊天窗口后，勾选对应附件进行导入；`,
        showCancel: false,
        confirmText: '前往导入',
        confirmBack() {
          wx.setStorageSync('uploadByWechat', 'uploadByWechat')
          callBack()
        }
      })
    }    
  },
  uploadByPhone() {
    wx.navigateTo({
      
      url: `${COMMON}webView/webView?p=${encodeURIComponent('http://192.168.8.109:8090/uploadFile/index.html')}`
      //url: `${COMMON}webView/webView?p=${encodeURIComponent('https://h5.lieduoduo.ziwork.com/art/uploadFile/index.html')}`
    })
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: (res) => {
    //     console.log(res)
    //     that.upload(res.tempFiles[0])
    //   }
    // })
  },
  upload(file) {
    let allowFileType = [
      'image',
      'file'
    ]
    let BASEHOST = ''
    let that = this
    let formData = {
      'img1': file.path,
      'size': file.size || 0
    }
    let fileMinSize = 1024 * 1024 * 3; //3M
    let fileMaxSize = 1024 * 1024 * 10; //10M
    let attachResume = this.data.attachResume
    attachResume = Object.assign(attachResume, file, { uploading: true })
    that.setData({ attachResume })
    if (file.size < fileMinSize) {
      attachResume = Object.assign(attachResume, { tips: '文件上传中，请稍等...'})
      that.setData({ attachResume })
      console.log('a', attachResume)
    } else {
      attachResume = Object.assign(attachResume, { tips: '大文件上传需要较长时间，请稍等...'})
      that.setData({ attachResume })
      console.log('b', attachResume)
    }
    if (!allowFileType.includes(file.type)) {
      attachResume = Object.assign(attachResume, { errTips: '上传失败，文件格式不支持', tips: ''})
      that.setData({ attachResume })
      console.log('c', attachResume)
    } else if (file.size > fileMaxSize) {
      attachResume = Object.assign(attachResume, { errTips: '上传失败，文件不可大于10M', tips: ''})
      that.setData({ attachResume })
      console.log('d', attachResume)
    } else {

      switch(file.type) {
        case 'image':
          formData = Object.assign(formData, {attach_type: 'img'})
          break
        case 'file':
          formData = Object.assign(formData, {attach_type: 'doc'})
          break
        default:
          break
      }

      if (wx.getStorageSync('choseType') === 'APPLICAN') {
        BASEHOST = APPLICANTHOST
      } else {
        BASEHOST = RECRUITERHOST
      }
      that.setData({ attachResume })
      uploadTask = wx.uploadFile({
        url: `${BASEHOST}/attaches`,
        filePath: file.path,
        methos: 'post',
        name: 'file',
        header: {
          'Authorization': wx.getStorageSync('token'),
          'Wechat-Version': VERSION
        }, 
        formData,
        success(res) {
          let data = typeof res.data === "string" ? JSON.parse(res.data) : res.data
          data = Object.assign(attachResume, data.data[0], {uploading: false})
          that.setData({ attachResume: data }, () => that.saveAttach({attach_resume: attachResume.id, attach_name: attachResume.name}))
        },
        fail(err) {
          // if (err.statusCode === 401) {
          //   // 需要用到token， 需要绑定手机号
          //   if (JSON.parse(err.data).code === 4010) {
          //     wx.removeStorageSync('token')
          //     wx.navigateTo({
          //       url: `${COMMON}bindPhone/bindPhone`
          //     })
          //   }
          //   // 需要用到微信token， 需要授权
          //   if (JSON.parse(err.data).code === 0) {
          //     wx.removeStorageSync('sessionToken')
          //     wx.removeStorageSync('token')
          //     wx.navigateTo({
          //       url: `${COMMON}auth/auth`
          //     })
          //   }
          // } else {
          //   let data = typeof err.data === "string" ? JSON.parse(err.data) : err.data
          //   if (data.msg) getApp().wxToast({title: data.msg})
          // }
          // that.setData({ attachResume })
          console.log(err, 'err')
        }
      }).onProgressUpdate((res) => {
        attachResume = Object.assign(attachResume, { progress: res.progress })
        that.setData({ attachResume })
        console.log(res.progress, 2)
      })
    }
  },
  scanCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        const uuid = res.result.split('&')[0].slice(5)
        const params = {uuid, isBusiness: 0}
        console.log(res, '扫码结果')
        scanQrcodeApi({uuid}).then(res => scanLoginApi(params))
      }
    })
  },
  preview(e) {
    let that = this
    app.previewResume(e)
  },
  getMyInfo () {
    return app.getAllInfo().then(() => {
      let attachResume = app.globalData.resumeInfo.attachResume || {}
      attachResume = Object.assign(this.data.attachResume, attachResume)
      this.setData({hasReFresh: false, attachResume})
      console.log(this.data)
      wx.stopPullDownRefresh()
    })
  },
  toggleactionMenu() {
    this.setData({actionMenu: !this.data.actionMenu})
  },
  stopPageScroll() {return false },
  pickerAction(e) {
    let params = e.currentTarget.dataset
    let attachResume = this.data.attachResume
    this.setData({actionMenu: !this.data.actionMenu})
    switch(params.action) {
      case 'preview':
        app.previewResume(e)
        break
      case 'reupload':
        attachResume.vkey = ''
        this.setData({ attachResume })
        break
      case 'delete':
        // this.setData({actionMenu: !this.data.actionMenu})
        break
      case 'cancle':
        // this.setData({actionMenu: !this.data.actionMenu})
        break
      default:
        break
    }
  },
  reupload() {
    let attachResume = this.data.attachResume
    attachResume.vkey = ''
    this.setData({ attachResume })
  },
  saveAttach(params) {
    return saveAttachApi(params).then(() => {
      getAttachResumeApi().then(res => {
        let attachResume = res.data
        attachResume = Object.assign(this.data.attachResume, attachResume)
        app.globalData.resumeInfo.attachResume = attachResume
        that.setData({ attachResume })
        console.log(res)
      })
    })
  },
  onPullDownRefresh() {
    this.setData({hasReFresh: true}, () => this.getMyInfo())
  }
})