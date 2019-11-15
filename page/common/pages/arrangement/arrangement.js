import {
  interviewDetailApi,
  setInterviewDetailApi,
  sureInterviewApi,
  setInterviewAttendApi,
  setInterviewCommentApi,
  interviewRetractApi
} from "../../../../api/pages/interview.js"
import { getRecruiterMyInfo2Api } from '../../../../api/pages/recruiter.js'

import {COMMON,APPLICANT,RECRUITER} from "../../../../config.js"
import {mobileReg} from "../../../../utils/fieldRegular.js"
import {shareInterviewr} from '../../../../utils/shareWord.js'
let app = getApp()
let positionCard = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: "", // 身份标识
    options: {},
    cdnImagePath: app.globalData.cdnImagePath,
    appointmentId: '',
    hasReFresh: false,
    revised: false, // 重新编辑面试安排信息
    info: {}
  },
  getResult(e) {
    let hasFilter = false
    let date = e.detail.propsResult
    let info = this.data.info
    let curDate = new Date().getTime() / 1000
    let dataset = e.currentTarget.dataset
    
    if (curDate > date) {
      getApp().wxToast({
        title: '面试时间必须晚于当前时间'
      })
      hasFilter = true
      // 条件不符不给编辑
      if (dataset.type === 'edit') {
        let appointmentTime = info.arrangementInfo.appointmentList[dataset.index].appointmentTime
        if (appointmentTime) info.arrangementInfo.appointmentList[dataset.index].appointmentTime = appointmentTime
        this.setData({info}, () => {
          info.arrangementInfo.appointmentList.map((item, n) => {
            this.selectComponent(`#myPicker${n}`).init()
          })
        })
      }
      return
    }
    
    if (!info.arrangementInfo) {
      info.arrangementInfo = {
        appointmentList: []
      }
    } else {
      if (!info.arrangementInfo.appointmentList) {
        info.arrangementInfo.appointmentList = []
      }
    }
    info.arrangementInfo.appointmentList.map((item, index) => {
      if (item.appointmentTime === date) {
        getApp().wxToast({
          title: '面试时间重复'
        })
        hasFilter = true
        // 条件不符不给编辑
        if (dataset.type === 'edit') {
        let appointmentTime = info.arrangementInfo.appointmentList[dataset.index].appointmentTime
        if (appointmentTime) info.arrangementInfo.appointmentList[dataset.index].appointmentTime = appointmentTime
        this.setData({info}, () => {
          info.arrangementInfo.appointmentList.map((item, n) => {
            this.selectComponent(`#myPicker${n}`).init()
          })
        })
      }
        return
      }
    })
    if (hasFilter) return
    
    if (dataset.type === 'edit') {
      info.arrangementInfo.appointmentList[dataset.index].appointmentTime = date
    } else {
      info.arrangementInfo.appointmentList.push({appointmentTime:date})
    }
    this.setData({info})
  },
  removeDate(e) {
    let index = e.currentTarget.dataset.index
    let info = this.data.info
    info.arrangementInfo.appointmentList.splice(index, 1)
    this.setData({info}, () => {
      info.arrangementInfo.appointmentList.map((item, n) => {
        this.selectComponent(`#myPicker${n}`).init()
      })
    })
  },
  changeVal(e) {
    let info = this.data.info
    if (e.currentTarget.dataset.type === 'name') {
      info.recruiterInfo.realname = e.detail.value
    } else {
      info.recruiterInfo.mobile = e.detail.value
    }
    this.setData({info})
  },
  openMap() {
    wx.openLocation({
      latitude: Number(this.data.info.lat),
      longitude: Number(this.data.info.lng),
      scale: 14,
      name: this.data.info.address,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  callPhone() {
    let info = this.data.info
    wx.showActionSheet({
      itemList: ['拨打', '复制'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: info.arrangementInfo.mobile || info.recruiterRealMobile
          })
        } else {
          wx.setClipboardData({
            data: info.arrangementInfo.mobile || info.recruiterRealMobile,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  app.wxToast({
                    title: '复制成功',
                    icon: 'success'
                  })
                }
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  jump(e) {
    let url = ''
    let info = this.data.info
    switch(e.currentTarget.dataset.type) {
      case 'jobList':
        url = `${COMMON}chooseJob/chooseJob?recruiterUid=${info.recruiterInfo.uid}`
        wx.navigateTo({url})
        break
      case 'addressList':
        url = `${RECRUITER}position/addressList/addressList?type=position&selected=1`
        wx.navigateTo({url})
        break
      case 'position':
        url = `${COMMON}positionDetail/positionDetail?positionId=${info.positionId}`
        wx.navigateTo({url})
        break
      case 'careerChance':
        wx.reLaunch({
          url: `${COMMON}homepage/homepage`
        })
        break
    }
  },
  radioChange(e) {
    let appointmentId = e.detail.value
    this.setData({appointmentId})
  },
  send() {
    let info = this.data.info
    let dateList = []
    if(!info.arrangementInfo.appointmentList || (info.arrangementInfo.appointmentList && info.arrangementInfo.appointmentList.length === 0)) {
      app.wxToast({title: '请编辑面试时间'})
      return
    }
    if (info.arrangementInfo) {
      info.arrangementInfo.appointmentList.map((item, index) => {
        dateList.push(item.appointmentTime)
      })
    }

    let data = {
      interviewId: this.data.options.id,
      realname: info.recruiterInfo.realname,
      mobile: info.recruiterInfo.mobile,
      positionId: info.positionId,
      addressId: info.addressId,
      interviewTime: dateList.join(',')
    }
    let title = ''
    if (!info.recruiterInfo.realname) {
      title = '请填写面试联系人'
    } else if (!info.recruiterInfo.mobile) {
      title = '请填写面试联系电话'
    } else if (info.recruiterInfo.mobile && !mobileReg.test(info.recruiterInfo.mobile)) {
      title = '联系电话格式错误'
    } else if (!data.interviewTime) {
      title = '请至少添加一个约面时间'
    }
    if (title) {
      app.wxToast({title})
      return
    }
    setInterviewDetailApi(data).then(res => {
      wx.removeStorageSync('interviewData')
      wx.removeStorageSync('createPosition')
      app.wxToast({
        title: '发送成功',
        icon: 'success'
      })
      this.pageInit()
    })
  },
  revise() {
    let info = this.data.info
    info.status = 21
    this.setData({info, revised: true})
  },
  sureDate() {
    let data = {
      interviewId: this.data.options.id,
      appointmentId: this.data.appointmentId
    }
    if(!this.data.appointmentId) {
      app.wxToast({title: '请选择一个面试时间'})
      return;
    }
    sureInterviewApi(data).then(res => {
      app.wxToast({
        title: '确定成功',
        icon: 'success'
      })
      this.pageInit('y')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let identity = app.identification(options)
    this.setData({options, identity})
    positionCard = ''
    if(options.adviser) {
      app.wxConfirm({
        title: '邀约已发送',
        content: '已邀约的简历，可以在【面试】-【我的邀请】统一处理',
        showCancel: false,
        confirmText: '好的'
      })
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-26
   * @detail   加个参数 不清除红点
   * @return   {[type]}            [description]
   */
  pageInit() {
    if (this.data.options.id) {
      let params = {interviewId: this.data.options.id, ...app.getSource()}
      // if(notClearRedDot) params.isReload = 1
      return interviewDetailApi(params).then(res => {
        let userInfo = app.globalData.resumeInfo
        let toast = (fn) => {
          let identifyChange = () => {
            app.wxConfirm({
              title: '提示',
              content: '检测到你是招聘官，是否切换招聘官',
              cancelText: '取消',
              confirmText: '确认切换',
              confirmBack: () => {
                wx.setStorageSync('choseType', 'RECRUITER')
                this.setData({identity: 'RECRUITER'})
                app.getAllInfo()
                fn && fn()
              },
              cancelBack: () => {
                wx.reLaunch({url: `${COMMON}homepage/homepage`})
              }
            })
          }
          let hunterForRecruiter = () => {
            app.wxConfirm({
              title: '提示',
              content: '成为当前机构招聘官，即可查看面试详情，是否申请成为机构招聘官？',
              cancelText: '否',
              confirmText: '是',
              confirmBack: () => {
                wx.setStorageSync('choseType', 'RECRUITER')
                this.setData({identity: 'RECRUITER'})
                app.getAllInfo()
                fn()
              },
              cancelBack: () => {
                wx.reLaunch({url: `${COMMON}homepage/homepage`})
              }
            })
          }

          if(app.globalData.isRecruiter) {
            getRecruiterMyInfo2Api().catch(msg => {
              // 820 不是该公司下的B身份
              if (msg.code === 820) {
                hunterForRecruiter()
              }
            }).then(() => {
              identifyChange()
            })
          } else {
            hunterForRecruiter()
          }
        }
        let addressData = wx.getStorageSync('createPosition')
        let positionData = wx.getStorageSync('interviewData')
        let info = res.data
        if(wx.getStorageSync('choseType') === 'APPLICANT' && [41, 58].includes(info.status) && this.data.options.stips && userInfo.uid !== info.jobhunterInfo.uid) {
          toast(this.pageInit)
        }
        info.jobhunterInfo = Object.assign(info.jobhunterInfo, {lastInterviewStatus: info.status})
        info.recruiterInfo = Object.assign(info.recruiterInfo, {lastInterviewStatus: info.status})
        // 转发面试安排 所有人看的的面试安排都是一样
        // if(info.status === 41) {
        //   info.recruiterInfo = info.jobhunterInfo
        // }
        if ((info.status === 12 || info.status === 21 || info.status === 32) && wx.getStorageSync('choseType') === 'RECRUITER') {
          if (addressData) {
            info.addressId = addressData.address_id
            info.address = addressData.address
          }
          if (positionData) {
            info.positionName = positionData.positionName
            info.positionId = positionData.positionId
          }
        }
        this.setData({info})
      })
    } else {
      let recruiter_chat_infos = wx.getStorageSync('recruiter_chat_infos')
      if (recruiter_chat_infos) {
        let info = this.data.info
        info.jobhunterInfo = recruiter_chat_infos.personInfos
        info.positionName = recruiter_chat_infos.positionInfos.positionName
        info.positionId = recruiter_chat_infos.positionInfos.positionId
        info.addressId = recruiter_chat_infos.positionInfos.addressId
        info.address = recruiter_chat_infos.positionInfos.address
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let init = () => {
      let positionData = wx.getStorageSync('interviewData')
      let addressData = wx.getStorageSync('createPosition')
      let info = this.data.info
      if (positionData) {
        info.positionName = positionData.positionName
        info.positionId = positionData.positionId
      }
      if (addressData) {
        info.address = addressData.address
        info.addressId = addressData.address_id
      }
      this.setData({info})
      if (!this.data.revised) {
        this.pageInit()
      }
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('createPosition')
    wx.removeStorageSync('interviewData')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(hasLoading = true) {
    this.setData({hasReFresh: true, revised:false})
    this.pageInit().then(res => {
      this.setData({hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    let that = this
    let btnImageUrl = `${this.data.cdnImagePath}shareB.png`
    if(positionCard){
      btnImageUrl = positionCard
    }
    return app.wxShare({
      options,
      btnTitle: `【${that.data.info.recruiterInfo.realname}】邀请你面试一个优秀候选人，快去看看吧~`,
      btnImageUrl: btnImageUrl,
      btnPath: `${COMMON}arrangement/arrangement?id=${this.options.id}&stips=1`
    })
  },
  todoAction(e) {
    let params = e.currentTarget.dataset
    let _this = this
    let info = _this.data.info
    switch(params.action) {
      case 'notArrive':
        app.wxConfirm({
          title: '该候选人未到场',
          content: '确定标记未到场后，你可以再次对该候选人发起约面',
          confirmBack() {
            setInterviewAttendApi({interviewId: info.interviewId, isAttend: 0}).then(() => {
              info.status = 59
              _this.setData({info})
            })
          },
          cancelBack() {}
        })
        break
      case 'arrived':
        setInterviewAttendApi({interviewId: info.interviewId, isAttend: 1}).then(() => {
          info.status = 57
          _this.setData({info})
        })
        break
      case 'interview':
        wx.navigateTo({
          url: `${COMMON}resumeDetail/resumeDetail?uid=${info.jobhunterInfo.uid}`
        })
        break
      case 'good':
        setInterviewCommentApi({interviewId: info.interviewId}).then(() => {
          info.status = 56
          _this.setData({info}, () => _this.pageInit())
        })
        break
      case 'reason':
        wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=resolve&jobhunterUid=${info.jobhunterInfo.uid}&lastInterviewId=${info.interviewId}`})
        break
      case 'retract':
        interviewRetractApi({id: info.jobhunterInfo.uid, interviewId: info.interviewId}).then(() => _this.pageInit())
        break
      case 'notsuitable':
        let url11 =  info.status === 57 || info.status === 58
          ? `${COMMON}interviewMark/interviewMark?type=pending&jobhunterUid=${info.jobhunterInfo.uid}&lastInterviewId=${info.interviewId}`
          : `${COMMON}interviewMark/interviewMark?type=pending&jobhunterUid=${info.jobhunterInfo.uid}&lastInterviewId=${info.interviewId}&reBack=2`
        wx.navigateTo({url: url11})
        break
      default:
        break
    }
  }
})