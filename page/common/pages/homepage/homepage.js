import {
  getCompanyInfosApi,
  getCurCompanyInfosApi,
  getRecruitersListApi,
  getOnlinePositionTypeApi,
  getCurrentCompanyRecruitersApi,
  getCurrentCompanyOnlinePositionTypeApi,
  getCurrentCompanyPositionListApi
} from '../../../../api/pages/company.js'

import {
  getLabelPositionApi,
  getLabelLIstsApi
} from '../../../../api/pages/label.js'

import {
  APPLICANT,
  COMMON,
  RECRUITER
} from '../../../../config.js'

import {
  getPositionListApi
} from "../../../../api/pages/position.js"

import {getSelectorQuery} from "../../../../utils/util.js"
import { agreedTxtC, agreedTxtB } from '../../../../utils/randomCopy.js'
import * as watch from '../../../../utils/watch.js'
let app = getApp()
let positionCard = '',
    callBackNum = 0,
    domHeight = 0,
    positionDomTop = 0
Page({
  data: {
    navH: app.globalData.navHeight,
    tab: 'about',
    indicatorDots: false,
    autoplay: false,
    interval: 1000,
    duration: 1000,
    query: {},
    companyInfos: {
      "id": 1346,
      "vkey": "omv1b4ir",
      "companyShortname": "星光璀璨（中国）",
      "companyName": "星光璀璨（中国）影视文化传媒有限公司",
      "logo": 26977,
      "financing": "8",
      "industryId": 150000,
      "industry": "媒体",
      "employees": "6",
      "businessLicense": 0,
      "onJob": 0,
      "email": "Jiqiangliao@thetiger.com.cn",
      "emailStatus": 1,
      "website": "https://baidu.com",
      "status": 1,
      "oneSentenceIntro": "勿因未候日光暖，擅自轻言世间寒。",
      "intro": "星光璀璨（中国）于2016年3月开始运作，先后成立了北京、武汉、成都、山西、郑州等十大工作室，共2000余直播间，同时有10家子公司，100家战略合作线下主播工作室。独家代理签约主播营销权益，共同培养新晋主播，策划全新主播栏目。拥有线上、线下管理人员500多人。专业经纪人、管理团队多方面培训助攻网红之路。稳居陌陌直播平台第一梯队公会，同时巩固各直播平台（花椒、繁星、YY、火山、抖音等）最大的公会地位。",
      "createdUid": 567,
      "isPerfect": 1,
      "wherefrom": "1",
      "customerLevel": 10,
      "advisorGroupId": 1,
      "advisorUid": 21,
      "adminUid": 29,
      "groupId": 4,
      "creator": 0,
      "updater": 0,
      "createdAt": "2019-07-03 17:33:49",
      "updatedAt": "2019-08-19 18:17:31",
      "deletedAt": null,
      "album": [
        {
          "id": 238,
          "companyId": 1346,
          "fileId": 26993,
          "createdAt": "2019-07-03 18:29:48"
        },
        {
          "id": 239,
          "companyId": 1346,
          "fileId": 26994,
          "createdAt": "2019-07-03 18:29:50"
        },
        {
          "id": 240,
          "companyId": 1346,
          "fileId": 26995,
          "createdAt": "2019-07-03 18:29:52"
        },
        {
          "id": 241,
          "companyId": 1346,
          "fileId": 26996,
          "createdAt": "2019-07-03 18:29:54"
        },
        {
          "id": 242,
          "companyId": 1346,
          "fileId": 26997,
          "createdAt": "2019-07-03 18:29:56"
        },
        {
          "id": 243,
          "companyId": 1346,
          "fileId": 26998,
          "createdAt": "2019-07-03 18:29:58"
        },
        {
          "id": 244,
          "companyId": 1346,
          "fileId": 26999,
          "createdAt": "2019-07-03 18:30:00"
        }
      ],
      "address": [
        {
          "id": 1004,
          "companyId": 1346,
          "areaId": 110105,
          "doorplate": "10楼1010室",
          "address": "北京市朝阳区东四环 阳光上东10号楼",
          "lng": "116.483711",
          "lat": "39.965542",
          "headOffice": null,
          "createdAt": "2019-07-12 10:32:34",
          "province": "北京市",
          "city": "北京市",
          "district": "朝阳区"
        },
        {
          "id": 1015,
          "companyId": 1346,
          "areaId": 440105,
          "doorplate": "",
          "address": "广东省广州市海珠区逸景路462号 珠江国际酒店",
          "lng": "113.302628",
          "lat": "23.08285",
          "headOffice": null,
          "createdAt": "2019-08-28 14:24:53",
          "province": "广东省",
          "city": "广州市",
          "district": "海珠区"
        }
      ],
      "product": [
        {
          "id": 462,
          "companyId": 1346,
          "productName": "明日头条",
          "logo": 27000,
          "slogan": "一款基于机器学习的个性化资讯推荐引擎～",
          "lightspot": "核心产品明日头条现已成为一个通过人工智能技术，给用户推荐信息的内容平台。",
          "siteUrl": "www.mrtt.com",
          "createdAt": "2019-07-03 18:37:52",
          "logoInfo": {
            "id": 27000,
            "vkey": "zf4btu9l",
            "attachType": "img",
            "attachTypeDesc": "图片",
            "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c84f841c27.jpg",
            "fileName": "tmp_53e4a855ff01809ba770a153736588d1.jpg",
            "size": 28923,
            "sizeM": "28.2KB",
            "createdAt": "2019-07-03 18:35:36",
            "extension": "jpg",
            "width": 399,
            "height": 368,
            "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c84f841c27.jpg!330xauto",
            "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c84f841c27.jpg!130xauto"
          }
        },
        {
          "id": 463,
          "companyId": 1346,
          "productName": "抖乐",
          "logo": 27001,
          "slogan": "一个帮助大众用户表达自我，记录美好生活的短视频平台～",
          "lightspot": "应用人工智能技术为用户创造丰富多样的玩法！",
          "siteUrl": "www.douyue.com",
          "createdAt": "2019-07-03 18:41:58",
          "logoInfo": {
            "id": 27001,
            "vkey": "u0waqwzx",
            "attachType": "img",
            "attachTypeDesc": "图片",
            "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c85e2cbbcf.jpg",
            "fileName": "tmp_3261888b4c986d3e0b286379f8a0d937.jpg",
            "size": 24468,
            "sizeM": "23.9KB",
            "createdAt": "2019-07-03 18:39:31",
            "extension": "jpg",
            "width": 402,
            "height": 401,
            "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c85e2cbbcf.jpg!330xauto",
            "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c85e2cbbcf.jpg!130xauto"
          }
        },
        {
          "id": 464,
          "companyId": 1346,
          "productName": "南瓜视频",
          "logo": 27002,
          "slogan": "国内最大的「个性化推荐视频平台」～",
          "lightspot": "通过人工智能帮助每个人发现感兴趣的视频！",
          "siteUrl": "www.nangua.com",
          "createdAt": "2019-07-03 18:44:33",
          "logoInfo": {
            "id": 27002,
            "vkey": "liqubztm",
            "attachType": "img",
            "attachTypeDesc": "图片",
            "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c86b8e1588.jpg",
            "fileName": "tmp_622cac290f937b6b4086ed6f1ea9212b.jpg",
            "size": 36768,
            "sizeM": "35.9KB",
            "createdAt": "2019-07-03 18:43:05",
            "extension": "jpg",
            "width": 404,
            "height": 338,
            "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c86b8e1588.jpg!330xauto",
            "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c86b8e1588.jpg!130xauto"
          }
        }
      ],
      "integrityRate": "91%",
      "logoInfo": {
        "id": 26977,
        "vkey": "6uimgr9w",
        "attachType": "img",
        "attachTypeDesc": "图片",
        "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/17/5d1c75cb69a2c.jpg",
        "fileName": "tmp_069a600145ff7aae3da7c0b76966f1e6.jpg",
        "size": 12175,
        "sizeM": "11.9KB",
        "createdAt": "2019-07-03 17:30:52",
        "extension": "jpg",
        "width": 300,
        "height": 300,
        "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/17/5d1c75cb69a2c.jpg!330xauto",
        "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/17/5d1c75cb69a2c.jpg!130xauto"
      },
      "albumInfo": [
        {
          "id": 26993,
          "vkey": "dyx2rxow",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83938d588.jpg",
          "fileName": "tmp_bab3769beca9303ef936fb4a057abf84.jpg",
          "size": 288465,
          "sizeM": "281.7KB",
          "createdAt": "2019-07-03 18:29:40",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83938d588.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83938d588.jpg!130xauto"
        },
        {
          "id": 26994,
          "vkey": "1tgicn6p",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8393e6c35.jpg",
          "fileName": "tmp_a47ae67a768040ca4577de39412742ef.jpg",
          "size": 184804,
          "sizeM": "180.5KB",
          "createdAt": "2019-07-03 18:29:40",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8393e6c35.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8393e6c35.jpg!130xauto"
        },
        {
          "id": 26995,
          "vkey": "bcpvpnnj",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839413c22.jpg",
          "fileName": "tmp_6c8105338b39f882604ade4851df967c.jpg",
          "size": 251550,
          "sizeM": "245.7KB",
          "createdAt": "2019-07-03 18:29:40",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839413c22.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839413c22.jpg!130xauto"
        },
        {
          "id": 26996,
          "vkey": "kjta2vbn",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8394d1000.jpg",
          "fileName": "tmp_75b5c6e9790fccf34df6a6829006918f.jpg",
          "size": 388684,
          "sizeM": "379.6KB",
          "createdAt": "2019-07-03 18:29:41",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8394d1000.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c8394d1000.jpg!130xauto"
        },
        {
          "id": 26997,
          "vkey": "zwrc7qyz",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839517b86.jpg",
          "fileName": "tmp_2d20150881defdc6cb353349516c4b80.jpg",
          "size": 344741,
          "sizeM": "336.7KB",
          "createdAt": "2019-07-03 18:29:42",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839517b86.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c839517b86.jpg!130xauto"
        },
        {
          "id": 26998,
          "vkey": "xizyb9pr",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83951bc77.jpg",
          "fileName": "tmp_6ea2d2fb9f19d497e940e5e877e0b88a.jpg",
          "size": 390516,
          "sizeM": "381.4KB",
          "createdAt": "2019-07-03 18:29:43",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83951bc77.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83951bc77.jpg!130xauto"
        },
        {
          "id": 26999,
          "vkey": "8farf1pc",
          "attachType": "img",
          "attachTypeDesc": "图片",
          "url": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83950d7b0.jpg",
          "fileName": "tmp_8584a47b3686a78eda9db28e2f218c8f.jpg",
          "size": 412533,
          "sizeM": "402.9KB",
          "createdAt": "2019-07-03 18:29:43",
          "extension": "jpg",
          "width": 1440,
          "height": 1080,
          "middleUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83950d7b0.jpg!330xauto",
          "smallUrl": "https://attach.lieduoduo.ziwork.com/img/2019/0703/18/5d1c83950d7b0.jpg!130xauto"
        }
      ],
      "financingInfo": "不需要融资",
      "employeesInfo": "10000人以上",
      "positionNum": 20,
      "businessLicenseInfo": [],
      "onJobInfo": [],
      "adminName": "商务C",
      "advisorName": "廖继强",
      "statusDesc": "上线",
      "customerLevelDesc": "0类",
      "sCode": "mv186qvv"
    },
    recruitersList: [],
    cdnImagePath: app.globalData.cdnImagePath,
    positionTypeList: [],
    onlinePositionTypeList: [],
    typeId: null,
    isFixed: false,
    isRecruiter: app.globalData.isRecruiter,
    isIphoneX: app.globalData.isIphoneX,
    requireOAuth: false,
    map: {
      longitude: 0,
      latitude: 0,
      markers: []
    },
    positionList: {
      list: [],
      pageNum: 1,
      isLastPage: false,
      isRequire: false
    },
    pageCount: 20,
    hasReFresh: false,
    onBottomStatus: 0,
    swiperIndex: 0,
    callBackNum: 0,
    choseType: '',
    showNav: false
  },
  
  onLoad(options) {
    if (options.scene) options = app.getSceneParams(options.scene)
    let showNav = this.data.showNav
    if (wx.getStorageSync('choseType') === 'RECRUITER') showNav = true
    this.setData({query: options, choseType: wx.getStorageSync('choseType'), showNav})
    positionCard = ''
    watch.setWatcher(this)
  },
  watch: {
    callBackNum: function(newVal, oldVal) {
      if (newVal >= 4) {
        this.getPositionDomNodePosition()
      }
    }
  },
  // onShow() {
  //   if (app.loginInit) {
  //     this.initPage()
  //     this.init().then(() => this.getOnlinePositionType())
  //   } else {
  //     app.loginInit = () => {
  //       this.initPage()
  //       this.init().then(() => this.getOnlinePositionType())
  //     }
  //   }
  // },
  initPage () {
    let jumpCreate = () => {
      if (!app.globalData.isJobhunter && wx.getStorageSync('choseType') !== 'RECRUITER') {
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
    if (app.globalData.hasLogin) {
      let timer = setTimeout(() => {
        jumpCreate()
        clearTimeout(timer)
      }, 500)      
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-02-19
   * @detail   获取定位结点的位置
   * @return   {[type]}   [description]
   */
  getDomNodePosition() {
    getSelectorQuery('.banner').then(res => {
      domHeight = res.height
    })
  },
  getPositionDomNodePosition() {
    getSelectorQuery('.child-box').then(res => {
      positionDomTop = res.top
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   获取页面初始化数据
   * @return   {[type]}   [description]
   */
  init() {
    return Promise.all([this.getCompanyDetail(), this.getRecruitersList()]).then(() => this.setData({isRecruiter: app.globalData.isRecruiter}))
  },
  toggle () {
    wx.setStorageSync('choseType', 'RECRUITER')
    wx.reLaunch({url: `${RECRUITER}index/index`})
  },

  /**
   * @Author   小书包
   * @DateTime 2019-01-25
   * @detail   重新加载数据
   * @return   {[type]}   [description]
   */
  onPullDownRefresh() {
    const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
    this.setData({positionList, hasReFresh: true, isFixed: false})
    this.getPositionList(false).then(res => {
      const positionList = {list: [], pageNum: 1, isLastPage: false, isRequire: false}
      const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
      positionList.list = res.data
      positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
      positionList.pageNum = 2
      positionList.isRequire = true
      wx.stopPullDownRefresh()
      this.setData({positionList, onBottomStatus, hasReFresh: false})
    }).catch(e => {
      wx.stopPullDownRefresh()
      this.setData({hasReFresh: false})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-10
   * @detail   获取职位详情
   * @return   {[type]}   [description]
   */
  getPositionList(hasLoading = true) {
    return new Promise((resolve, reject) => {
      const options = this.data.query
      let listFun = null,
          params = {}
      if (this.data.query.companyId) {
        params = {company_id: options.companyId, count: this.data.pageCount, page: this.data.positionList.pageNum}
        listFun = getPositionListApi
      } else {
        params = {count: this.data.pageCount, page: this.data.positionList.pageNum}
        listFun = getCurrentCompanyPositionListApi
      }
      if(typeof this.data.typeId === 'number') {
        params = Object.assign(params, {type: this.data.typeId})
      }
      listFun(params, hasLoading).then(res => {
        callBackNum++
        const positionList = this.data.positionList
        const onBottomStatus = res.meta && res.meta.nextPageUrl ? 0 : 2
        if(params.page !== 1) {
          positionList.list = positionList.list.concat(res.data)
        } else {
          positionList.list = res.data
        }
        positionList.isLastPage = res.meta && res.meta.nextPageUrl ? false : true
        positionList.pageNum = positionList.pageNum + 1
        positionList.isRequire = true
        this.setData({positionList, onBottomStatus, callBackNum}, () => resolve(res))
      }).catch(e => reject(e))
    })
  },

  //获取公司职位类型列表
  getOnlinePositionType() {
    let data = {
      companyId: this.data.query.companyId
    }
    let infos = null,
        params = {}
    if (this.data.query.companyId) {
      params = { companyId: this.data.query.companyId }
      infos = getOnlinePositionTypeApi
    } else {
      infos = getCurrentCompanyOnlinePositionTypeApi
    }
    infos(params).then(res=>{
      callBackNum++
      const positionTypeList = res.data
      positionTypeList.map(field => field.active = false)
      positionTypeList.unshift({
        id: 'all',
        name: '全部',
        active: true
      })
      this.setData({positionTypeList, callBackNum}, () => this.getPositionList())
    })
  },

  // 职位分类选择
  setType(e) {
    let id = e.currentTarget.dataset.id
    let positionTypeList = this.data.positionTypeList
    let typeId = null
    if(this.data.typeId === id) return
    let positionList = this.data.positionList
    positionList.pageNum = 1
    positionTypeList.map(item => {
      item.active = false
      if (item.id === id) {
        typeId = item.id
        item.active = true
      }
    })
    this.setData({positionTypeList, typeId, positionList}, () => this.getPositionList())
  },

  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   跳转招聘官主页
   * @return   {[type]}     [description]
   */
  bindMain(e) {
    wx.navigateTo({url: `${COMMON}recruiterDetail/recruiterDetail?uid=${e.currentTarget.dataset.uid}`})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-02
   * @detail   获取公司详情
   * @return   {[type]}   [description]
   */
  getCompanyDetail(hasLoading = true, isReload = false) {
    return new Promise((resolve, reject) => {
      let getCompanyInfos = null,
          params = {}
      if (this.data.query.companyId) {
        params = {id: this.data.query.companyId, hasLoading, isReload, ...app.getSource()}
        getCompanyInfos = getCompanyInfosApi
      } else {
        getCompanyInfos = getCurCompanyInfosApi
      }
      getCompanyInfos(params).then(res => {
        callBackNum++
        let requireOAuth = res.meta && res.meta.requireOAuth ? res.meta.requireOAuth : false
        const companyInfos = res.data
        app.globalData.companyInfo = companyInfos
        const longitude = companyInfos.address.length ? companyInfos.address[0].lng : 0
        const latitude = companyInfos.address.length ? companyInfos.address[0].lat : 0
        const address = companyInfos.address.length ? companyInfos.address[0].address : ''
        const doorplate = companyInfos.address.length ? companyInfos.address[0].doorplate : ''
        const map = this.data.map
        map.longitude = longitude
        map.latitude = latitude
        map.address = address
        map.doorplate = doorplate
        map.enableScroll = false
        map.markers.push({
          id: 1,
          longitude,
          latitude,
          label: {
            content: companyInfos.companyShortname,
            fontSize:'18rpx',
            color:'#282828',
            anchorX: '30rpx',
            anchorY: '-60rpx'
          }
        })
        this.setData({companyInfos, map, requireOAuth, callBackNum}, () => {
          this.getDomNodePosition()
          resolve(res)
        })
      }).catch(() => {
        let companyInfos = this.data.companyInfos
        companyInfos.noComany = true
        this.setData({companyInfos})
      })
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   获取招聘团队
   * @return   {[type]}   [description]
   */
  getRecruitersList() {
    let listFun = null,
        params = {}
    if (this.data.query.companyId) {
      listFun = getRecruitersListApi
      params = {id: this.data.query.companyId, page: 1, count: 4}
    } else {
      listFun = getCurrentCompanyRecruitersApi
      params = {page: 1, count: 4}
    }
    listFun(params).then(res => {
      callBackNum++
      const wordIndex = Math.floor(Math.random()*8)
      const recruitersList = res.data
      recruitersList.map(field => field.randomTxt = agreedTxtB())
      this.setData({recruitersList, wordIndex, callBackNum})
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   选项卡切换
   * @return   {[type]}     [description]
   */
  onTabClick(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === 'recruitment') {
      wx.pageScrollTo({scrollTop: positionDomTop})
    } else {
      wx.pageScrollTo({scrollTop: 0})
    }
    this.setData({tab})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-04
   * @detail   轮播图设置
   * @return   {[type]}     [description]
   */
  swiperChange(e) {
    this.setData({swiperIndex: e.detail.current})
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   复制
   * @return   {[type]}   [description]
   */
  copyLink() {
    wx.setClipboardData({data: this.data.companyInfos.website })
  },
  /**
   * @Author   小书包
   * @DateTime 2018-12-29
   * @detail   离开当前页面
   * @return   {[type]}   [description]
   */
  routeJump(e) {
    const route = e.currentTarget.dataset.route
    switch(route) {
      case 'map':
        wx.navigateTo({url: `${COMMON}map/map`})
        break
      case 'recruitersList':
        wx.navigateTo({url: `${RECRUITER}user/company/recruiterList/recruiterList?companyId=${this.data.companyInfos.id}`})
        break
      case 'introductionMore':
        wx.navigateTo({url: `${COMMON}homepageMore/homepageMore`})
        wx.setStorageSync('companyInfos', this.data.companyInfos)
        break
      default:
        break
    }
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-19
   * @detail   查看地址
   * @return   {[type]}     [description]
   */
  viewMap(e) {
    const params = e.currentTarget.dataset
    wx.openLocation({
      latitude: Number(params.latitude),
      longitude: Number(params.longitude),
      scale: 14,
      address: `${params.address} ${params.doorplate}`,
      fail: res => {
        app.wxToast({title: '获取位置失败'})
      }
    })
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-22
   * @detail   查看大图
   * @return   {[type]}   [description]
   */
  previewImage(e) {
    let albumInfo = this.data.companyInfos.albumInfo.map(field => field.url)
    let current = albumInfo.find((value, now, arr) => now === this.data.swiperIndex)
    wx.previewImage({current, urls: albumInfo})
  },
  /**
   * @Author   小书包
   * @DateTime 2019-01-23
   * @detail   就算页面的滚动
   * @return   {[type]}     [description]
   */
  onPageScroll(e) {
    if (e.scrollTop > domHeight) {
      if (!this.data.isFixed) this.setData({isFixed: true})
    } else {
      if (this.data.isFixed) this.setData({isFixed: false})
    }
    if (this.data.choseType === 'APPLICANT') {
      if (e.scrollTop > 0) {
        if (!this.data.showNav) this.setData({showNav: true})
      } else {
        if (this.data.showNav) this.setData({showNav: false})
      }
    }
  },
  getCreatedImg(e) {
    positionCard = e.detail
  },
  onShareAppMessage(options) {
    let that = this
    let imageUrl = `${that.data.cdnImagePath}shareC.png`
    let companyInfos = this.data.companyInfos,
        companyId = this.data.query.companyId
    if(!companyInfos.status) {
      return app.wxShare({options})
    }
    app.shareStatistics({
      id: that.data.query.companyId,
      type: 'company',
      sCode: that.data.companyInfos.sCode,
      channel: 'card'
    })
    if(positionCard){
      imageUrl = positionCard
    }
    if (!this.data.query.companyId) {
      companyId = companyInfos.id
    }
　　return app.wxShare({
      options,
      title: `${that.data.companyInfos.companyShortname}正在招聘，马上约面，极速入职！我在店长多多等你！`,
      path: `${COMMON}homepage/homepage?companyId=${companyId}&sCode=${this.data.companyInfos.sCode}&sourceType=shc`,
      imageUrl: imageUrl
    })
  }
})