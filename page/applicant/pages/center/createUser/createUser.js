// page/applicant/pages/center/firstStep/fitstStep.js
import { postfirstStepApi } from '../../../../../api/pages/center'
import {userNameReg, positionReg} from '../../../../../utils/fieldRegular.js'
let app = getApp()
let query = {}
Page({
  data: {
    showPop: false,
    cdnImagePath: app.globalData.cdnImagePath,
    name: '',
    navHeight: app.globalData.navHeight,
    workTime: '',
    avatar: {},
    gender: '1',
    workTimeDesr: '',
    userInfo: {},
    startWorkYear: ''
  },
  getresult (val) {
    this.setData({workTimeDesr: val.detail.propsDesc, startWorkYear: val.detail.propsResult})
  },
  getValue(e) {
    switch(e.currentTarget.dataset.type) {
      case 'name':
        this.setData({name: e.detail.value})
        break
    }
  },
  submit () {
    let info = this.data
    let title = ''
    if (!info.avatar.id) {
      title = '请上传头像'
    } else  if (!info.name) {
      title = '请输入姓名'
    } else if (info.name && (info.name.length < 2 || info.name.length > 20)) {
      title = '姓名需为2-20个汉字或英文'
    } else if (!info.workTimeDesr) {
      title = '请选择开始工作时间'
    }
    if (title) {
      app.wxToast({'title': title})
      return
    }
    let data = {
      avatar:  info.avatar.id,
      startWorkYear: info.startWorkYear,
      name: info.name,
      gender: info.gender,
      position: info.position,
      apiVersion: 1,
      ...app.getSource()
    }
    postfirstStepApi(data).then(res => {
      let createUser = {
        name: info.name,
        gender: info.gender,
        startWorkYear: info.startWorkYear,
        workTimeDesr: info.workTimeDesr
      }
      wx.setStorageSync('createUserFirst', createUser)
      let path = ''
      if (query.directChat) {
        if (info.startWorkYear === 0) {
          path =  `/page/applicant/pages/center/educaExperience/educaExperience?directChat=${query.directChat}`
        } else {
          path = `/page/applicant/pages/center/workExperience/workExperience?directChat=${query.directChat}`
        }
      } else {
        if (info.startWorkYear === 0) {
          path =  `/page/applicant/pages/center/educaExperience/educaExperience`
        } else {
          path = `/page/applicant/pages/center/workExperience/workExperience`
        }
      }
      wx.navigateTo({
        url: path
      })
    })
  },
  chooseGender (e) {
    this.setData({
      gender: e.target.dataset.gender
    })
  },
  backEvent () {
    this.setData({showPop: true})
  },
  onLoad(options) {
    query = options
    wx.setStorageSync('choseType', 'APPLICANT')
  },
  onShow() {
    let avatar = wx.getStorageSync('avatar')
    let userInfo = app.globalData.userInfo
    let gender = ''
    let createUser = wx.getStorageSync('createUserFirst')
    if (avatar) {
      this.setData({avatar})
    }
    if (!avatar && userInfo) {
      avatar = app.globalData.userInfo.avatarInfo
      this.setData({avatar})
    }
    if (!createUser && userInfo) {
      gender = app.globalData.userInfo.gender
      this.setData({gender: gender.toString()})
    }
    if (createUser) {
      this.setData({name: createUser.name, gender: createUser.gender, workTimeDesr: createUser.workTimeDesr, startWorkYear: createUser.startWorkYear})
    }
  }
})