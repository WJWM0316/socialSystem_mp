import {RECRUITER, APPLICANT, COMMON} from '../../../../config.js'
import {getSelectorQuery}  from '../../../../utils/util.js'
import { getAvartListApi } from '../../../../api/pages/active.js'
import { getPositionListApi, getPositionRecordApi, getRecommendApi } from '../../../../api/pages/position.js'
import {getFilterDataApi} from '../../../../api/pages/aggregate.js'
import {getAdBannerApi} from '../../../../api/pages/common'
import {shareChance} from '../../../../utils/shareWord.js'

const app = getApp()
let timer = null
let identity = '',
    hasOnload = false // 用来判断是否执行了onload，就不走onShow的校验
Page({
  data: {
    pageCount: 20,
    navH: app.globalData.navHeight,
    showNav: false,
    fixedBarHeight: 0,
    hasReFresh: false,
    onBottomStatus: 0,
    hideLoginBox: true,
    isBangs: app.globalData.isBangs,
    pixelRatio: app.globalData.systemInfo.pixelRatio,
    bannerH: 200,
    tabList: [
      {
        name: '工作城市',
        type: 'city',
        active: false
      },
      {
        name: '职位类型',
        type: 'positionType',
        active: false
      },
      {
        name: '薪资范围',
        type: 'salary',
        active: false
      }
    ],
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    bannerIndex: 0,
    bannerList: [],
    moreRecruiter: [],
    tabType: 'closeTab',
    city: 0,
    cityIndex: 0,
    type: 0,
    typeIndex: 0,
    emolument: 1,
    emolumentIndex: 0,
    cityList: [],
    positionTypeList: [],
    emolumentList: [],
    requireOAuth: false,
    cdnImagePath: app.globalData.cdnImagePath,
    userInfo: app.globalData.userInfo,
    options: {},
    hasLogin: 0,
    isJobhunter: 0,
    hasExpect: 1,
    recommended: 0 // 是否有推荐策略
  },
  onLoad(options) {
    hasOnload = false
    let bannerH = this.data.bannerH,
        requireOAuth = this.data.requireOAuth
    if (!this.data.isBangs) {
      bannerH = app.globalData.systemInfo.screenWidth/(750/420)
    } else {
      bannerH = app.globalData.systemInfo.screenWidth/(750/468)
    }
    if (options.needAuth && wx.getStorageSync('choseType') === 'RECRUITER') { // 是否从不服来赞过来的B身份 强制C端身份
      wx.setStorageSync('choseType', 'APPLICANT')
    }
    identity = app.identification(options)
    const positionList = {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    }
    this.setData({positionList, bannerH, options})
    let init = () => {
      this.getAdBannerList()
      this.getAvartList()
      this.getFilterData().then(() => {
        this.getRecord()
        hasOnload = true
        if (app.getRoleInit) {
          this.initPage()
        } else {
          app.getRoleInit = () => {
            this.initPage()
          }
        }
      })
    }
    if (app.loginInit) {
      init()
    } else {
      app.loginInit = () => {
        init()
      }
    }
  },
  onUnload () {
  },
  onShow (options) {
    if (hasOnload) {
      this.initPage()
    }
    let init = () => {
      app.wxReportAnalytics('enterPage_report', {
        haslogin: app.globalData.hasLogin,
        isjobhunter: app.globalData.isJobhunter,
        userinfo: app.globalData.userInfo ? 1 : 0
      })
      this.setData({hasLogin: app.globalData.hasLogin, userInfo: app.globalData.userInfo, isJobhunter: app.globalData.isJobhunter})
      let bannerList = this.data.bannerList
      if (app.globalData.isJobhunter && bannerList.length > 0 && bannerList[bannerList.length - 1].smallImgUrl === 'https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resume.png') {
        bannerList.splice(bannerList.length - 1, 1)
        this.setData({bannerList, bannerIndex: 0})
      }
      if (app.pageInit) {
        this.selectComponent('#bottomRedDotBar').init()
        this.setData({hasExpect: app.globalData.hasExpect})
      } else {
        app.pageInit = () => {
          this.selectComponent('#bottomRedDotBar').init()
          this.setData({hasExpect: app.globalData.hasExpect})
        }
      }
    }
    if (app.getRoleInit) {
      init()
    } else {
      app.getRoleInit = () => {
        init()
      }
    }
    if (wx.getStorageSync('choseType') === 'RECRUITER') {
      app.wxConfirm({
        title: '提示',
        content: '检测到你是招聘官，是否切换招聘端',
        confirmBack() {
          wx.reLaunch({
            url: `${RECRUITER}index/index`
          })
        },
        cancelBack() {
          wx.setStorageSync('choseType', 'APPLICANT')
          app.getAllInfo()
        }
      })
    }
  },
  initPage () {
    let jumpCreate = () => {
      if (!app.globalData.isMicroCard && wx.getStorageSync('choseType') !== 'RECRUITER') {
        app.wxToast({
          title: '前往求职飞船',
          icon: 'loading',
          callback () {
            wx.reLaunch({
              url: `${APPLICANT}createUser/createUser?micro=true`
            })
          }
        })
      }
    }
    if (!app.globalData.hasLogin) {
      this.setData({hideLoginBox: false})
    } else {
      let timer = setTimeout(() => {
        jumpCreate()
        clearTimeout(timer)
      }, 500)
    }
  }, 
  getAvartList() {
    getAvartListApi().then(res => {
      const moreRecruiter = res.data.moreRecruiter
      this.setData({moreRecruiter})
    })
  },
  toMore () {
    wx.navigateTo({
      url: `${COMMON}rank/rank`
    })
  },
  autoplay (e) {
    this.setData({bannerIndex: e.detail.current})
  },
  jumpBanner (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `/${url}`
    })
  },
  getFilterData () {
    return getFilterDataApi().then(res => {
      let cityList = res.data.area,
          positionTypeList = res.data.label,
          emolumentList = res.data.emolument
      cityList.unshift({areaId: '', name: '全部'})
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        labelId: '',
        name: '全部',
        type: 'self_label_position'
      })
      this.setData({cityList, positionTypeList, emolumentList})
    })
  },
  choseTab (e) {
    let closeTab = e.currentTarget.dataset.type
    if (this.data.tabType === closeTab || closeTab === 'closeTab') {
      this.setData({tabType: 'closeTab'})
    } else {
      this.setData({tabType: closeTab})
    }
  },
  toggle (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    let tabList = this.data.tabList
    if (this.data.options.positionTypeId) {
      let options = this.data.options
      delete options.positionTypeId
      delete options.typeName
      this.setData({options})
    }
    switch (this.data.tabType) {
      case 'city':
        if (index === 0) {
          tabList[0].name = '工作城市'
          tabList[0].active = false
        } else {
          tabList[0].active = true
          tabList[0].name = name
        }
        this.setData({tabList, city: id, cityIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'positionType':
        if (index === 0) {
          tabList[1].name = '职位类型'
          tabList[1].active = false
        } else {
          tabList[1].active = true
          tabList[1].name = name
        }
        this.setData({tabList, type: id, typeIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
      case 'salary':
        if (index === 0) {
          tabList[2].name = '薪资范围'
          tabList[2].active = false
        } else {
          tabList[2].active = true
          tabList[2].name = name
        }
        this.setData({tabList, emolument: id, emolumentIndex: index, tabType: 'closeTab'})
        this.reloadPositionLists()
        break
    }
    if (this.data.tabFixed) this.setData({tabFixed: false})
  },
  getRecord() {
    return getPositionRecordApi().then(res => {
      let city = this.data.city,
          type = Number(this.data.options.positionTypeId) || Number(res.data.type) || 0,
          typeName = this.data.options.typeName || res.data.typeName || '',
          emolument = this.data.emolument,
          cityIndex = this.data.cityIndex,
          typeIndex = this.data.typeIndex,
          emolumentIndex = this.data.emolumentIndex,
          tabList = this.data.tabList,
          positionTypeList = this.data.positionTypeList,
          recommended = this.data.recommended
      if (res.data.city) {
        city = Number(res.data.city)
        this.data.cityList.map((item, index) => {
          if (item.areaId === city) {
            cityIndex = index
            if (index === 0) {
              tabList[0].name = '工作城市'
            } else {
              tabList[0].active = true
              tabList[0].name = item.name
            }
          }
        })
      }
      if (type) {
        let curType = positionTypeList.filter((item) => { return item.labelId === type})
        if (curType.length === 0) {
          tabList[1].active = true
          tabList[1].name = typeName
          positionTypeList.push({labelId: type, name: typeName})
          typeIndex = positionTypeList.length - 1
          this.setData({positionTypeList})
        } else {
          positionTypeList.forEach((item, index) => {
            if (item.labelId === type) {
              typeIndex = index
              if (index === 0) {
                tabList[1].name = '职位类型'
              } else {
                tabList[1].active = true
                tabList[1].name = item.name
              }
            }
          })
        }
      }
      if (res.data.emolumentId) {
        emolument = Number(res.data.emolumentId)
        this.data.emolumentList.map((item, index) => {
          if (item.id === emolument) {
            emolumentIndex = index
            if (index === 0) {
              tabList[2].name = '薪资范围'
            } else {
              tabList[2].active = true
              tabList[2].name = item.text
            }
          }
        })
      }
      if (this.data.options.positionTypeId) {
        city = 0
        cityIndex = 0
        tabList[0].name = '工作城市'
        tabList[0].active = false
        emolument = 1
        emolumentIndex = 0
        tabList[2].active = false
        tabList[2].name = '薪资范围'
      }
      if (res.data.recommended) {
        recommended = res.data.recommended
      }
      this.setData({tabList, city, type, cityIndex, typeIndex, emolument, emolumentIndex, recommended}, () => {
        this.getPositionList()
      })  
    }).catch(e => {
      this.getPositionList()
    })
  },
  getPositionList(hasLoading = true) {
    let params = {count: this.data.pageCount, page: this.data.positionList.pageNum, is_record: 1, ...app.getSource()}
    if(this.data.city) {
      params = Object.assign(params, {city: this.data.city})
    }
    if(this.data.type) {
      params = Object.assign(params, {type: this.data.type})
    }
    if (this.data.emolument) {
      params = Object.assign(params, {emolument_id: this.data.emolument})
    }
    if(!this.data.type) {
      delete params.type
    }
    if(!this.data.city) {
      delete params.city
    }
    if(!this.data.emolument) {
      delete params.emolument_id
    }
    if (this.data.options.positionTypeId) {
      params.is_record = 0
      delete params.city
      delete params.emolument_id
    }
    let getList = null
    if (this.data.recommended && !params.city && !params.type) {
      getList = getRecommendApi
      params.count = 15
      if (params.page === 1) params.isFisrtPage = 1
    } else {
      getList = getPositionListApi
    }
    return getList(params, hasLoading).then(res => {
      let positionList = this.data.positionList
      let onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      let requireOAuth = false
      if (res.meta && res.meta.requireOAuth) requireOAuth = res.meta.requireOAuth
      if (this.data.options.needAuth && !app.globalData.userInfo) {
        requireOAuth = true
      }
      positionList.list = positionList.list.concat(res.data)
      positionList.isLastPage = res.data.length === params.count || (res.meta && res.meta.nextPageUrl) ? false : true
      positionList.pageNum = positionList.pageNum + 1
      positionList.isRequire = true
      this.setData({positionList, requireOAuth, onBottomStatus})
    })
  },
  getAdBannerList () {
    getAdBannerApi().then(res => {
      let list = res.data
      // 没有创建简历的 新增一个banner位
      if (!app.globalData.isJobhunter) {
        list.push({
          bigImgUrl: "https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resumeX.png",
          smallImgUrl:"https://attach.lieduoduo.ziwork.com/front-assets/images/banner_resume.png",
          targetUrl:`page/applicant/pages/createUser/createUser?from=3`,
          type: 'create'
        })
      }
      this.setData({bannerList: list})
    })
  },
  authSuccess() {
    let requireOAuth = false
    this.setData({requireOAuth})
  },
  addIntention () {
    let data = this.data,
        salaryFloor = 0,
        salaryCeil = 0
    switch (data.emolument) {
      case 1:
        salaryFloor = 0
        salaryCeil = 0
        break
      case 2:
        salaryFloor = 1
        salaryCeil = 2
        break
      case 3:
        salaryFloor = 3
        salaryCeil = 6
        break
      case 4:
        salaryFloor = 5
        salaryCeil = 10
        break
      case 5:
        salaryFloor = 10
        salaryCeil = 20
        break
      case 6:
        salaryFloor = 15
        salaryCeil = 30
        break
      case 7:
        salaryFloor = 20
        salaryCeil = 40
        break
      case 8:
        salaryFloor = 50
        salaryCeil = 100
        break
    }
    let lntention = {
      city: data.city,
      cityName: data.cityList[data.cityIndex].name,
      provinceName: data.cityList[data.cityIndex].provinceName,
      positionType: data.type,
      positionName: data.positionTypeList[data.typeIndex].name,
      salaryFloor: salaryFloor,
      salaryCeil: salaryCeil
    }
    if (data.positionTypeList[data.typeIndex].pid === data.positionTypeList[data.typeIndex].topPid) {
      lntention.positionType = 0
      lntention.positionName = ''
    }
    wx.setStorageSync('addIntention', lntention)
    wx.navigateTo({
      url: `/page/applicant/pages/center/resumeEditor/aimsEdit/aimsEdit`
    })
  },
  reloadPositionLists(hasLoading = true) {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList})
    return this.getPositionList()
  },
  onPageScroll(e) {
    if (e.scrollTop > this.data.bannerH + 37 + 55) {
      if (!this.data.tabFixed) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.setData({tabFixed: true})
          clearTimeout(timer)
        }, 10) 
      }
    } else {
      if (this.data.tabFixed) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.setData({tabFixed: false})
          clearTimeout(timer)
        }, 10) 
      }
    }
  },
  onPullDownRefresh() {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true})
    this.selectComponent('#bottomRedDotBar').init()
    this.getPositionList().then(res => {
      this.setData({positionList, hasReFresh: false})
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({positionList, hasReFresh: false})
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const positionList = this.data.positionList
    if (!positionList.isLastPage) {
      this.setData({onBottomStatus: 1})
      this.getPositionList(false)
    }
  },
  onShareAppMessage(options) {
　　return app.wxShare({
      options,
      title: shareChance,
      path: `${APPLICANT}index/index`
    })
  }
})
