import {
  applyInterviewApi,
  getInterviewStatusApi,
  inviteInterviewApi,
  refuseInterviewApi,
  confirmInterviewApi,
  notonsiderInterviewApi,
  interviewRetractApi,
  resumeNotInterestRetractApi
} from '../../../api/pages/interview.js'

import {
  getPositionApi,
  openPositionApi,
  closePositionApi,
  getPositionListNumApi
} from '../../../api/pages/position.js'

import {
  getCompanyIdentityInfosApi
} from '../../../api/pages/company.js'

import {RECRUITER, COMMON, APPLICANT} from '../../../config.js'

import { agreedTxtC, agreedTxtB } from '../../../utils/randomCopy.js'
let automatic = false
const app = getApp()
let identity = ''
Component({
  properties: {
    infos: {
      type: Object,
      value: {}
    },
    isOwner: {
      type: Boolean,
      value: false
    },
    // 跟后端协商的type
    type: {
      type: String,
      value: ''
    },
    positionId: {
      type: String,
      value: ''
    },
    options: {
      type: Object,
      value: {}
    }
  },
  data: {
    interviewInfos: {
      haveInterview: 0
    },
    showLoginBox: false,
    identity: '', // 身份标识
    slogoIndex: 0,
    // 是否是我发布
    isOwerner: false,
    currentPage: '',
    index: 0,
    jobWords: agreedTxtC(),
    recruiterWords: agreedTxtB(),
    isShare: false,
    cdnImagePath: app.globalData.cdnImagePath,
    positionInfos: {},
    show: false,
    loaded: false
  },
  attached() {
    identity = wx.getStorageSync('choseType')
    if (this.data.options && this.data.options.directChat) {
      automatic = true
    }
    this.setData({identity})
  },
  methods: {
    init() {
      let currentPage = ''
      switch(this.data.type) {
        case 'position':
          currentPage = 'positionDetail'
          break
        case 'resume':
          currentPage = 'resumeDetail'
          break
        case 'recruiter':
          currentPage = 'recruiterDetail'
          break
        default:
          currentPage = ''
          break
      }
      if (((currentPage === 'positionDetail' || currentPage === 'recruiterDetail') && identity === 'APPLICANT') || (currentPage === 'resumeDetail' && identity === 'RECRUITER')) {
        this.getInterviewStatus()
      }
      this.setData({currentPage, jobWords: agreedTxtC(), recruiterWords: agreedTxtB(), show: false})
    },
    /**
   * @Author   小书包
   * @DateTime 2019-01-29
   * @detail   发布职位
   * @return   {[type]}   [description]
   */
  publicPosition() {
    let identityInfos = this.data.identityInfos
    // 跟后端协商  =1 则可以发布
    if(identityInfos.identityAuth) {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
      return;
    }

    if(identityInfos.status === 1) {
      wx.navigateTo({url: `${RECRUITER}position/post/post`})
    }

    // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
    if(identityInfos.status === 0 || identityInfos.status === 2) {
      this.setData({show: false})
      app.wxConfirm({
        title: '',
        content: `您当前认证身份信息已提交申请，店长多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
        cancelText: '联系客服',
        confirmText: '我知道了',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
        },
        cancelBack: () => {
          wx.makePhoneCall({phoneNumber: this.data.telePhone})
        }
      })
      return;
    }

    // 没有填身份证 则没有验证
    if(!identityInfos.identityNum) {
      this.setData({show: false})
      app.wxConfirm({
        title: '',
        content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
        confirmText: '去认证',
        confirmBack: () => {
          wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
        }
      })
      return;
    }
  },
    /**
     * @Author   小书包
     * @DateTime 2019-03-14
     * @detail   获取招聘官的职位类型
     * @return   {[type]}   [description]
     */
    getPositionListNum() {
      return new Promise((resolve, reject) => {
        getPositionListNumApi().then(res => {
          this.setData({positionInfos: res.data})
          resolve(res)
        })
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-05
     * @detail   获取开料状态
     * @return   {[type]}   [description]
     */
    getInterviewStatus() {
      getInterviewStatusApi({type: this.data.type, vkey: this.data.infos.vkey}).then(res => {
        let interviewInfos = res.data
        this.setData({interviewInfos, identity: wx.getStorageSync('choseType'), loaded: true})
        if(res.code === 204) this.setData({isOwerner: true})
        if(res.code === 230) this.showMergeBox(res.data)
          
        // 防止用户不刷新数据，自动取消气泡
        if(interviewInfos.isReadRedot) {
          setTimeout(() => {
            interviewInfos.isReadRedot = 0
            this.setData({interviewInfos})
          }, 3000)
        }
        if (!res.data.haveInterview && this.data.options && this.data.options.directChat && automatic && !this.data.options.todoAction) {
          let e = {
            currentTarget: {
              dataset: {
                action : 'job-hunting-chat'
              }
            }
          }
          this.todoAction(e)
          automatic = false
        }
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-14
     * @detail   显示合并弹窗
     * @return   {[type]}         [description]
     */
    showMergeBox(infos) {
      const content = infos.tipsData.positionId === 0
        ? '面试官已接受与你约面，但没有选择约面职位，其他职位申请将自动合并，如需修改约面职位，可直接与面试官协商'
        : `面试官已选择你申请职位中的“${infos.tipsData.positionName}”，其他职位申请将自动合并，如需修改约面职位，可直接与面试官协商。`
      app.wxConfirm({
        title: '',
        content,
        showCancel: false,
        confirmText: '我知道了',
        confirmBack() {}
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-22
     * @detail   获取范围内随机数
     * @return   {[type]}       [description]
     */
    getRandomNum(Min, Max) {
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.floor(Rand * Range)
      return num
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-30
     * @detail   通过分享入口进行开撩
     * @return   {[type]}   [description]
     */
    shareChat() {
      let hasLogin = app.globalData.hasLogin
      let isRecruiter = app.globalData.isRecruiter
      let isJobhunter = app.globalData.isJobhunter
      let interviewInfos = this.data.interviewInfos

      const getRole = () => {
        if(app.getRoleInit) {
          chat()
        } else {
          app.getRoleInit = () => chat()
        }
      }

      // 开撩动作
      const chat = () => {
        isRecruiter = app.globalData.isRecruiter
        isJobhunter = app.globalData.isJobhunter
        let successPop = () => {
          if (app.globalData.resumeInfo.resumeCompletePercentage > 0.75) return
          app.wxConfirm({
            title: '开撩成功',
            content: '你的简历竞争力只超过28%的求职者，建议你现在完善简历',
            cancelText: '暂不完善',
            confirmText: '马上完善',
            confirmBack () {
              app.wxReportAnalytics('btn_report', {
                btn_type: 'perfect_immediately'
              })
              wx.navigateTo({
                url: `${COMMON}resumeDetail/resumeDetail?uid=${app.globalData.resumeInfo.uid}`
              })
            }
          })
        }
        if(identity === 'APPLICANT') {
          if(!isJobhunter) {
            let path = app.getCurrentPagePath()
            wx.navigateTo({url: `${APPLICANT}createUser/createUser?directChat=${encodeURIComponent(path)}&from=2`})
          } else {
            // 走正常流程
            if(this.data.type === 'recruiter') {
              // 招聘官没有在线职位或者招聘官没发布过职位
              if(!this.data.infos.positionNum) {
                app.wxReportAnalytics('btn_report', {
                  isjobhunter: app.globalData.isJobhunter,
                  resume_perfection: app.globalData.resumeInfo.resumeCompletePercentage * 100,
                  btn_type: 'job-hunting-chat'
                })
                applyInterviewApi({recruiterUid: this.data.infos.uid}).then(res => {
                  this.getInterviewStatus()
                  successPop()
                })
              } else {
                wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=job_hunting_chat&from=${this.data.currentPage}&showNotPositionApply=${interviewInfos.showNotPositionApply}&from=${this.data.currentPage}&recruiterUid=${this.data.infos.uid}`})
              }
            } else {
              app.wxReportAnalytics('btn_report', {
                isjobhunter: app.globalData.isJobhunter,
                resume_perfection: app.globalData.resumeInfo.resumeCompletePercentage * 100,
                btn_type: 'job-hunting-chat'
              })
              applyInterviewApi({recruiterUid: this.data.infos.recruiterInfo.uid, positionId: this.data.infos.id}).then(res => {
                this.getInterviewStatus()
                successPop()
              })
            }
          }
        } else {
          if(!isRecruiter) {
            this.getCompanyIdentityInfos()
          } else {
            // 走正常流程
            wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=recruiter_chat&from=${this.data.currentPage}&jobhunterUid=${this.data.infos.uid}&recruiterUid=${app.globalData.recruiterDetails.uid}&sourceType=${this.data.infos.sourceType}`})
          }
        }
      }

      // 判断用户是否登录
      if (app.loginInit) {
        console.log(app.globalData.hasLogin, 1111111111111)
        if (!app.globalData.hasLogin) {
          this.setData({showLoginBox: true})
        } else {
          getRole()
        }
      } else {
        app.loginInit = () => {
          if (!app.globalData.hasLogin) {
            this.setData({showLoginBox: true})
          } else {
            getRole()
          }
        }
      }      
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-29
     * @detail   获取个人身份信息
     * @return   {[type]}   [description]
     */
    getCompanyIdentityInfos() {
      return new Promise((resolve, reject) => {
        getCompanyIdentityInfosApi({hasLoading: false}).then(res => {
          let companyInfo = res.data.companyInfo
          let identityInfos = res.data
          let applyJoin = res.data.applyJoin
          this.setData({identityInfos}, () => resolve(res))
        })
      })
    },
    /**
     * @Author   小书包
     * @DateTime 2019-01-02
     * @detail   待办项
     * @return   {[type]}     [description]
     */
    todoAction(e) {
      const action = e.currentTarget.dataset.action
      const interviewInfos = this.data.interviewInfos
      const infos = this.data.infos
      switch(action) {
        // 求职端发起开撩
        case 'job-hunting-chat':
          if (identity === 'APPLICANT') {
            this.shareChat()
          } else {
            app.promptSwitch({
              source: identity
            })
          }
          break
        case 'job-hunting-applyed':
          // app.wxConfirm({
          //   title: '开撩约面',
          //   content: '该招聘官已邀请你面试了哦，暂时不能再申请约面',
          //   confirmText: '去看看',
          //   showCancel: true,
          //   cancelText: '知道了',
          //   confirmBack() {
          //     wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          //   }
          // })
          app.wxToast({title: '面试申请已发送'})
          break
        case 'recruiter-chat':
          let type = this.data.type
          if ((identity !== 'RECRUITER' && type === 'position') || (identity === 'RECRUITER' && type === 'resume')) {
            if(this.data.currentPage === 'resumeDetail') {

              this.getPositionListNum().then(res => {
                console.log(222222222)
                if(!res.data.online) {
                  this.setData({show: true})
                } else {
                  this.shareChat()
                }
              })
            }
          } else {
            app.promptSwitch({
              source: identity
            })
          }
          break
        case 'job-hunting-waiting-interview':
          app.wxToast({title: '等待面试官安排面试'})
          break
        // 求职者等待招聘管确认
        case 'waiting-staff-confirm':
          app.wxToast({title: '等待求职者确认'})
          break
        // 求职者接受约面
        case 'job-hunting-accept':
          confirmInterviewApi({id: interviewInfos.data[0].interviewId}).then(res => {
            app.wxToast({title: '已接受约面'})
            // this.triggerEvent('resultevent', this.data.infos)
            this.getInterviewStatus()
          })
          break
        // 求职端拒绝招聘官
        case 'job-hunting-reject':
          if(this.data.type === 'recruiter') {
            refuseInterviewApi({id: this.data.infos.uid}).then(res => {
              this.getInterviewStatus()
            })
          } else {
            app.wxConfirm({
              title: '暂不考虑该职位',
              content: '确定暂不考虑后，面试官将终止这次约面流程',
              showCancel: true,
              cancelText: '我再想想',
              confirmText: '确定',
              cancelColor: '#BCBCBC',
              confirmColor: '#652791',
              confirmBack: () => {
                refuseInterviewApi({id: this.data.infos.recruiterInfo.uid}).then(res => this.getInterviewStatus())
              }
            })
          }
          break
        // 招聘官拒绝求职者
        case 'recruiter-reject':
          if(interviewInfos.data && interviewInfos.data.length > 1) {
            wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=reject_chat&from=${this.data.currentPage}&jobhunterUid=${infos.uid}`})
            wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          } else {
            wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=pending&jobhunterUid=${infos.uid}&lastInterviewId=${interviewInfos.data[0].interviewId}`})
          }
          break
        // 求职者查看面试详情
        case 'job-hunting-view-detail':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        // 招聘官查看面试安排
        case 'recruiter-view-detail':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        // B端开撩成功后跳转安排面试页面
        case 'recruiter-accept':          
          // 求职者发起多条撩的记录
          if(interviewInfos.data && interviewInfos.data.length > 1) {
            wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=confirm_chat&from=${this.data.currentPage}&recruiterId=${interviewInfos.data[0].recruiterUid}`})
            wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
          } else {
            if(interviewInfos.data[0].positionStatus === 0) {
              wx.setStorageSync('interviewChatLists', this.data.interviewInfos)
              wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=confirm_chat&from=${this.data.currentPage}&recruiterId=${interviewInfos.data[0].recruiterUid}`})
            } else {
              confirmInterviewApi({id: interviewInfos.data[0].interviewId}).then(res => {
                wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
              })
            }
          }
          break
        case 'recruiter-apply':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'recruiter-modify':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'recruiter-arrangement':
          wx.navigateTo({url: `${COMMON}arrangement/arrangement?id=${interviewInfos.data[0].interviewId}`})
          break
        case 'viewRecruiter':
          if(this.data.type === 'position') wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${this.data.infos.recruiterInfo.uid}`})
          break
        case 'close':
          this.setData({show: !this.data.show})
          break
        case 'public':
          this.getCompanyIdentityInfos().then(() => {
            // 跟后端协商  =1 则可以发布
            let identityInfos = this.data.identityInfos
            if(identityInfos.identityAuth) {
              wx.setStorageSync('recruiter_chat_first', {jobhunterUid: infos.uid })
              this.publicPosition()
              wx.navigateTo({url: `${RECRUITER}position/post/post`})
              return;
            }

            if(identityInfos.status === 1) {
              wx.setStorageSync('recruiter_chat_first', {jobhunterUid: infos.uid })
              this.publicPosition()
              wx.navigateTo({url: `${RECRUITER}position/post/post`})
            }

            // 已经填写身份证 但是管理员还没有处理或者身份证信息不符合规范
            if(identityInfos.status === 0 || identityInfos.status === 2) {
              app.wxConfirm({
                title: '',
                content: `您当前认证身份信息已提交申请，店长多多将尽快审核处理，请耐心的等待，感谢您的配合~`,
                cancelText: '联系客服',
                confirmText: '我知道了',
                confirmBack: () => {
                  wx.navigateTo({url: `${RECRUITER}user/company/status/status?from=identity`})
                },
                cancelBack: () => {
                  wx.makePhoneCall({phoneNumber: this.data.telePhone})
                }
              })
              return;
            }

            // 没有填身份证 则没有验证
            if(!identityInfos.identityNum) {
              app.wxConfirm({
                title: '',
                content: `检测到您尚未认证身份，请立即认证，完成发布职位`,
                confirmText: '去认证',
                confirmBack: () => {
                  wx.navigateTo({url: `${RECRUITER}user/company/identity/identity?from=identity`})
                }
              })
              return;
            }
          })
          break
        case 'openPosition':
          wx.navigateTo({url: `${COMMON}chooseJob/chooseJob?type=recruiter_chat&from=${this.data.currentPage}&jobhunterUid=${infos.uid}`})
          break
        case 'retract':
          let params =  interviewInfos.lastInterviewStatus === 61 ? {id: infos.uid, interviewId: interviewInfos.lastInterviewId} : {id: infos.uid}
          interviewRetractApi(params).then(() => this.getInterviewStatus())
          break
        case 'reason':
          wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=resolve&jobhunterUid=${infos.uid}&lastInterviewId=${interviewInfos.lastInterviewId}`})
          break
        case 'uninterested-reason':
          wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=resolve&jobhunterUid=${infos.uid}&adviser=true`})
          break
        case 'recruiter-uninterested':
          wx.navigateTo({url: `${COMMON}interviewMark/interviewMark?type=pending&jobhunterUid=${infos.uid}&adviser=true`})
          break
        case 'uninterested-retract':
          resumeNotInterestRetractApi({jobhunterId: infos.uid}).then(res => {
            app.wxToast({title: '撤销成功', icon: 'success'})
            interviewInfos.hasUnsuitRecord = 0
            infos.advisor.dealStatus = 0
            this.setData({interviewInfos, infos})
          })
        break
        default:
          break
      }
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    }
  }
})
