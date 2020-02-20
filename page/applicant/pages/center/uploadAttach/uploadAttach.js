let app = getApp(),
    uploadTask = null;
import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION, UPLOADATTACHPAT} from '../../../../../config.js'
import {
  getAttachResumeApi,
  saveAttachApi,
  deleteAttachApi
} from '../../../../../api/pages/common.js'

Page({
  data: {
    option: {},
    platform: app.globalData.platform,
    navH: app.globalData.navHeight,
    cdnPath: app.globalData.cdnImagePath,
    resumeAttach: {
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
      const resumeAttach = app.globalData.resumeInfo.resumeAttach
      if(!resumeAttach) {
        return
      }
      this.setData({ resumeAttach })
    })    
  },
  backEvent() {
    let that = this
    if (uploadTask) {
      uploadTask.abort()
      app.wxConfirm({
        title: '提示',
        content: '文件上传中，返回后将取消上传，确定离开当前页面？',
        cancelText: '确定',
        confirmText: '取消',
        cancelBack() {          
          let resumeAttach = this.data.resumeAttach
          resumeAttach.vkey = ''
          uploadTask = null
          that.setData({ resumeAttach })
        },
        confirmBack: () => {
          uploadTask = null
          wx.navigateBack({delta: 1})         
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
    let that = this
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
    let allowFileExt = [
      'pdf',
      'jpg',
      'png',
      'doc',
      'docx'
    ]
    let BASEHOST = ''
    let that = this
    let formData = {
      'img1': file.path,
      'size': file.size || 0
    }
    let fileMinSize = 1024 * 1024 * 3; //3M
    let fileMaxSize = 1024 * 1024 * 10; //10M
    let resumeAttach = this.data.resumeAttach
    let fileFieldArr = file.name.split('.')
    let ext = fileFieldArr[fileFieldArr.length - 1]
    resumeAttach = Object.assign(resumeAttach, file, { uploading: true })
    that.setData({ resumeAttach })
    if (file.size < fileMinSize) {
      resumeAttach = Object.assign(resumeAttach, { tips: `${this.isImageType(file.name) ? '图片' : '文件'}上传中，请稍等...`})
      that.setData({ resumeAttach })
    } else {
      resumeAttach = Object.assign(resumeAttach, { tips: `大${this.isImageType(file.name) ? '图片' : '文件'}上传需要较长时间，请稍等...`})
      that.setData({ resumeAttach })
    }
    if (!allowFileExt.includes(ext)) {
      resumeAttach = Object.assign(resumeAttach, { errTips: `上传失败，文件格式不支持`, tips: ''})
      that.setData({ resumeAttach })
    } else if (file.size > fileMaxSize) {
      resumeAttach = Object.assign(resumeAttach, { errTips: `上传失败，${this.isImageType(file.name) ? '图片' : '文件'}不可大于10M`, tips: ''})
      that.setData({ resumeAttach })
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

      this.setData({ resumeAttach })

      if (wx.getStorageSync('choseType') === 'APPLICAN') {
        BASEHOST = APPLICANTHOST
      } else {
        BASEHOST = RECRUITERHOST
      }
      
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
          data = Object.assign(resumeAttach, data.data[0], {uploading: false})
          that.setData({ resumeAttach: data }, () => that.saveAttach({attach_resume: resumeAttach.id, attach_name: resumeAttach.name}))
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
      })
      
      uploadTask.onProgressUpdate((res) => {
        uploadTask = null
        resumeAttach = Object.assign(resumeAttach, { progress: res.progress })
        that.setData({ resumeAttach })
      })
    }
  },
  preview(e) {
    let that = this
    app.previewResume(e)
  },
  getMyInfo () {
    return app.getAllInfo().then(() => {
      let resumeAttach = app.globalData.resumeInfo.resumeAttach || {}
      resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
      this.setData({hasReFresh: false, resumeAttach})
      wx.stopPullDownRefresh()
    })
  },
  toggleactionMenu() {
    this.setData({actionMenu: !this.data.actionMenu})
  },
  stopPageScroll() {
    return false
  },
  isImageType(filename) {
    let temArr = filename.split('.')
    return ['jpg', 'png'].includes(temArr[temArr.length - 1])
  },
  pickerAction(e) {
    let params = e.currentTarget.dataset
    let resumeAttach = this.data.resumeAttach
    this.setData({actionMenu: !this.data.actionMenu})
    switch(params.action) {
      case 'preview':
        app.previewResume(e)
        break
      case 'reupload':
        resumeAttach.vkey = ''
        this.setData({ resumeAttach })
        break
      case 'delete':
        this.deleteAttach()
        break
      case 'cancle':
        // this.setData({actionMenu: !this.data.actionMenu})
        break
      default:
        break
    }
  },
  deleteAttach() {
    return deleteAttachApi().then(() => {
      app.globalData.resumeInfo.resumeAttach = null
    })
  },
  reupload() {
    let resumeAttach = this.data.resumeAttach
    resumeAttach.vkey = ''
    this.setData({ resumeAttach })
  },
  saveAttach(params) {
    return saveAttachApi(params).then(() => {
      getAttachResumeApi().then(res => {
        let resumeAttach = res.data
        resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
        app.globalData.resumeInfo.resumeAttach = resumeAttach
        this.setData({ resumeAttach })
      })
    })
  },
  onPullDownRefresh() {
    this.setData({ hasReFresh: true }, () => {
      getAttachResumeApi().then(res => {
        let resumeAttach = res.data
        if(!resumeAttach.vkey) resumeAttach.vkey = ''
        resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
        // app.globalData.resumeInfo.resumeAttach = resumeAttach
        this.setData({ resumeAttach, hasReFresh: false })
        wx.stopPullDownRefresh()
      })
    })
  }
})