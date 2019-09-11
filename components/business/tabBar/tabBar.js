// components/business/tabBar/tabBar.js
import {RECRUITER, APPLICANT, COMMON} from '../../../config.js'
import { getBottomRedDotApi } from '../../../api/pages/interview.js'

const app = getApp()
const cdnImagePath = app.globalData.cdnImagePath
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabType: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    redDot: {},
    recruiterList: [
      {
        title: '首页',
        flag: 'index',
        iconPath: `${cdnImagePath}tab_home_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_home_sel@3x.png`,
        active: true,
        path: `${RECRUITER}index/index`
      },
      {
        title: '候选人',
        flag: 'candidate',
        iconPath: `${cdnImagePath}tab_b_houxuanren@2x.png`,
        selectedIconPath: `${cdnImagePath}tab_b_houxuanren_pre@2x.png`,
        active: false,
        path: `${RECRUITER}candidate/candidate`
      },
      {
        title: '面试',
        flag: 'interview',
        iconPath: `${cdnImagePath}tab_interview_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_interview_sel@3x.png`,
        active: false,
        path: `${RECRUITER}interview/index/index`
      },
      {
        title: '职位管理',
        flag: 'position',
        iconPath: `${cdnImagePath}tab_job_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_job_sel@3x.png`,
        active: false,
        path: `${RECRUITER}position/index/index`
      },
      {
        title: '我的',
        flag: 'mine',
        iconPath: `${cdnImagePath}tab_me_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_me_sel@3x.png`,
        active: false,
        path: `${RECRUITER}user/mine/infos/infos`
      }
    ],
    applicantList: [
      {
        title: '主页',
        flag: 'chance',
        iconPath: `${cdnImagePath}tab_company@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_company_pre@3x.png`,
        active: true,
        path: `${COMMON}homepage/homepage`
      },
      {
        title: '职位',
        flag: 'position',
        iconPath: `${cdnImagePath}tab_company@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_company_pre@3x.png`,
        active: true,
        path: `${APPLICANT}index/index`
      },
      {
        title: '面试',
        flag: 'interview',
        iconPath: `${cdnImagePath}tab_interview_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_interview_sel@3x.png`,
        active: false,
        path: `${APPLICANT}interview/interview/interview`
      },
      {
        title: '我的',
        flag: 'mine',
        iconPath: `${cdnImagePath}tab_me_nor@3x.png`,
        selectedIconPath: `${cdnImagePath}tab_me_sel@3x.png`,
        active: false,
        path: `${APPLICANT}center/mine/mine`
      }
    ],
    isIphoneX: app.globalData.isIphoneX
  },
  attached() {
    const list = !this.data.tabType  ? this.data.applicantList : this.data.recruiterList
    const currentRoute = '/' + getCurrentPages()[getCurrentPages().length - 1].route
    const identity = wx.getStorageSync('choseType')
    list.map(field => field.active = field.path === currentRoute ? true : false)
    this.setData({ list, identity })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取底部栏红点情况
    init() {
      app.getBottomRedDot().then(res => {
        app.globalData.redDotInfos = res.data
        this.setData({redDot: res.data})
        this.triggerEvent('resultevent', res.data)
      })
    },
    toggle(e) {
      if (app.getCurrentPagePath().indexOf(e.target.dataset.path) !== -1) return
      wx.reLaunch({
        url: e.target.dataset.path,
        success: () => wx.removeStorageSync('companyInfos')
      })
    }
  }
})
