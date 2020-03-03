let app = getApp(),
    uploadTask = null;
import {APPLICANTHOST, RECRUITERHOST, COMMON, VERSION, UPLOADATTACHPATH} from '../../../../../config.js'
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
      vkey: '',
      hasRequire: false
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
    actionMenu: false,
    loaded: false
  },
  onLoad() {
    this.getMyInfo().then(() => {
      let resumeAttach = app.globalData.resumeInfo.resumeAttach
      if(!resumeAttach) {
        this.setData({ resumeAttach: this.data.resumeAttach, loaded: true })
        return
      }
      this.setData({ resumeAttach, loaded: true })
    })    
  },
  // onShow() {
  //   this.getMyInfo().then(() => {
  //     let resumeAttach = app.globalData.resumeInfo.resumeAttach
  //     if(!resumeAttach) {
  //       this.setData({ resumeAttach: this.data.resumeAttach, loaded: true })
  //       return
  //     }
  //     this.setData({ resumeAttach, loaded: true })
  //   })    
  // },
  backEvent() {
    let that = this

    if (uploadTask) {
      uploadTask.abort()
      app.wxConfirm({
        title: '提示',
        content: '文件上传中，返回后将取消上传，确定离开当前页面？',
        cancelText: '确认返回',
        confirmText: '继续上传',
        cancelBack() {          
          uploadTask = null
          wx.navigateBack({delta: 1})        
        },
        confirmBack: () => {
          let resumeAttach = this.data.resumeAttach
          resumeAttach.vkey = ''
          uploadTask = null
          resumeAttach.uploading = false
          that.setData({ resumeAttach }) 
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
          let resumeAttach = that.data.resumeAttach
          resumeAttach = Object.assign(resumeAttach, { errTips: '', tips: ''})
          that.setData({ resumeAttach }, () => that.upload(res.tempFiles[0]))          
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
        confirmText: '确定',
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
      url: UPLOADATTACHPATH
    })
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
    let fileSize = (file.size / 1000 / 1024 ).toFixed(2) + 'M'
    resumeAttach = Object.assign(resumeAttach, file, { uploading: true, fileSize })
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
          console.log(that.data)
          that.setData({ resumeAttach: data }, () => {
            that.saveAttach({attach_resume: resumeAttach.id, attach_name: resumeAttach.name})
          })
        },
        fail(err) {
          if (err.statusCode === 401) {
            // 需要用到token， 需要绑定手机号
            if (JSON.parse(err.data).code === 4010) {
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: `${COMMON}bindPhone/bindPhone`
              })
            }
            // 需要用到微信token， 需要授权
            if (JSON.parse(err.data).code === 0) {
              wx.removeStorageSync('sessionToken')
              wx.removeStorageSync('token')
              wx.navigateTo({
                url: `${COMMON}auth/auth`
              })
            }
          } else {
            let data = typeof err.data === "string" ? JSON.parse(err.data) : err.data
            if (data.msg) getApp().wxToast({title: data.msg})
          }
          that.setData({ resumeAttach })
          console.log(err, 'err')
        }
      })
      uploadTask.onProgressUpdate((res) => {
        resumeAttach = Object.assign(resumeAttach, { progress: res.progress })
        if(res.progress === 100) {
          resumeAttach = Object.assign(resumeAttach, { progress: res.progress, errTips: '', tips: '附件保存中...，请稍等' })
        }
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
      resumeAttach.hasRequire = true
      resumeAttach.uploading = false
      resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
      this.setData({hasReFresh: false, resumeAttach})
      wx.stopPullDownRefresh()
      console.log(this.data)
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
    let that = this
    app.wxConfirm({
      title: '删除简历',
      content: '确定删除该附件简历吗？删除后将无法向招聘官发送附件简历。',
      cancelText: '确认删除',
      confirmText: '再想想',
      confirmColor: '#652791',
      cancelColor: '#BCBCBC',
      cancelBack() {          
        deleteAttachApi().then(() => {
          app.wxToast({
            title: '删除成功',
            callback() {
              app.globalData.resumeInfo.resumeAttach = null
              that.reupload()
            }
          })
        }) 
      },
      confirmBack: () => {
        
      }
    })    
  },
  reupload() {
    let resumeAttach = this.data.resumeAttach
    resumeAttach.vkey = ''
    this.setData({ resumeAttach })
  },
  saveAttach(params) {
    // let resumeAttach = this.data.resumeAttach
    // resumeAttach = Object.assign(resumeAttach, { tips: `${this.isImageType(file.name) ? '图片' : '文件'}上传中，请稍等...`})
    // this.setData({ resumeAttach })
    return saveAttachApi(params).then(() => {
      getAttachResumeApi().then(res => {
        let resumeAttach = res.data
        resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
        app.globalData.resumeInfo.resumeAttach = resumeAttach
        this.setData({ resumeAttach }, () => {
          uploadTask = null
        })
      })
    })
  },
  onPullDownRefresh() {
    this.setData({ hasReFresh: true }, () => {
      this.getMyInfo()
      // getAttachResumeApi().then(res => {
      //   let resumeAttach = res.data
      //   if(!resumeAttach.vkey) resumeAttach.vkey = ''
      //   resumeAttach = Object.assign(this.data.resumeAttach, resumeAttach)
      //   // app.globalData.resumeInfo.resumeAttach = resumeAttach
      //   this.setData({ resumeAttach, hasReFresh: false })
      //   wx.stopPullDownRefresh()
      // })
    })
  }
})