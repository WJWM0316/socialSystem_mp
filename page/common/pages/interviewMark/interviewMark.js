import {
  getCommentReasonApi,
  refuseInterviewApi,
  getInterviewCommentApi,
  setRecomResumeNotSuitApi,
  getResumeRecomdReasonApi,
  getResumeRecomdCommentApi
} from '../../../../api/pages/interview.js'

const app = getApp()
Page({
  data: {
    extra: '',
    list: [],
    options: {
      type: 'pending',
      // type: 'resolve'
    }
  },
  onLoad(options) {
    this.setData({ options })
  },
  onShow() {
    this.getLists()
  },
  getLists() {
    let options = this.data.options
    let func = null
    if(options.type === 'pending') {
      func = this.getCommentReason()
    } else {
      func = this.getInterviewComment()
    }
    return func
  },
  getInterviewComment() {
    return new Promise((resolve, reject) => {
      let reason = null,
          params = {}
      if (!this.data.options.adviser) {
        reason = getInterviewCommentApi
        params.interviewId = this.data.options.lastInterviewId
      } else {
        reason = getResumeRecomdCommentApi
        params.jobhunterUid = this.data.options.jobhunterUid
      } 
      reason(params).then(res => {
        let rtn = res.data
        let list = rtn.reason.split(',')
        let extra = rtn.extraDesc
        this.setData({list, extra})
      }).catch(() => reject())
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-06-06
   * @detail   获取面试评价不合适理由
   * @return   {[type]}              [description]
   */
  getCommentReason(hasLoading = false) {
    return new Promise((resolve, reject) => {
      let reason = null,
          params = {
            hasLoading
          }
      if (!this.data.options.adviser) {
        reason = getCommentReasonApi
      } else {
        reason = getResumeRecomdReasonApi
      }
      reason(params).then(res => {
        this.setData({list: res.data})
      }).catch(() => reject())
    })
  },
  check(e) {
    let params = e.currentTarget.dataset
    let list = this.data.list
    list.map((field, index) => {
      if(index === params.index) field.active = !field.active
    })
    this.setData({list})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-11
   * @detail   防抖
   * @return   {[type]}   [description]
   */
  debounce(fn, context, delay, text) {
    clearTimeout(fn.timeoutId)
    fn.timeoutId = setTimeout(() => fn.call(context, text), delay)
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-25
   * @detail   绑定文本域输入
   * @return   {[type]}     [description]
   */
  bindInput(e) {
    let extra = e.detail.value
    // extra = extra.trimStart()
    this.setData({extra})
    // this.debounce(this.bindChange, null, 500, name)
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   绑定值得改变
   * @return   {[type]}        [description]
   */
  bindChange(extra) {
    this.setData({extra})
  },
  submit() {
    let list = this.data.list.filter(field => field.active)
    if(!list.length) {
      app.wxToast({title: '请选择不适合的原因'})
      return
    }
    if(this.data.extra && this.data.extra.length > 300) {
      app.wxToast({title: '补充说明不得超过300字'})
      return
    }
    let tem = list.map(field => field.id)
    let reason = tem.join(',')
    let options = this.data.options
    let params = {reason, id: options.jobhunterUid, extra: this.data.extra, interviewId: options.lastInterviewId}
    let submitFun = null
    if (this.data.options.adviser) {
      submitFun = setRecomResumeNotSuitApi
      params.jobhunterUid = options.jobhunterUid
    } else {
      submitFun = refuseInterviewApi
    }
    submitFun(params).then(() => {
      app.wxToast({
        title: '标记成功',
        icon: 'success', 
        callback () {
          wx.removeStorageSync('interviewChatLists')
          if(options.reBack) {
            wx.navigateBack({delta: 2 })
          } else {
            wx.navigateBack({delta: 1 })
          }
        }
      })
    })
  }
})