import {getSelectorQuery} from '../../../utils/util.js'
import {COMMON, APPLICANT, RECRUITER} from '../../../config.js'
const app = getApp()
let appendCreatUser = 0,
    appendUserInfoEdit = 0,
    appendItemEdit = 0,
    appendMoreEdit = 0
Component({
  externalClasses: ['my-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {               // 数据列表
      type: Object,
      value: [],
      observer (newVal, oldVal) {
        wx.nextTick(() => {
          if (!newVal || newVal.length === 0) return
          if (!this.data.page) this.floor = newVal.length > 6 ? 6 : newVal.length
          if (app.globalData.hasLogin && this.data.hasGuide) newVal = this.appendCard(newVal)
          this.setData({[`listData[${this.data.page}]`]: newVal}, () => {
            this.updata()
          })
        })
      }
    },
    flowClass: {
      type: String,
      value: ''
    },
    hasGuide: {
      type: Boolean,
      value: false
    },
    page: {
      type: Number,        // 页码
      value: 0
    },
    horizontal: {          // 每排展示数量
      type: Number,
      value: 2
    },
    spaceX: {            // 水平间距 (单位px)
      type: Number,
      value: 10
    },
    spaceY: {            // 垂直间距 (单位px)
      type: Number,
      value: 20
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    listData: [],
    wrapH: 0,
    cdnImagePath: app.globalData.cdnImagePath
  },

  attached () {

    this.leftGrounp    = []     // 每竖的left值集合
    this.heightGroup   = []     // 每竖的高度集合
    this.minIndex      = 0      // 高度最小的一竖索引
    this.curDataGroupIndex = 0  // 开始渲染的排数
    this.floor = 6
    this.totalItem = 0
  },
  detached: function() {
    appendCreatUser = 0
    appendUserInfoEdit = 0
    appendItemEdit = 0
    appendMoreEdit = 0
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      if (!this.data.hasGuide) return
      let userInfoEdit       = wx.getStorageSync('appendUserInfoEdit'),
          creatUser          = wx.getStorageSync('appendCreatUser'),
          itemEdit           = wx.getStorageSync('appendItemEdit'),
          moreEdit           = wx.getStorageSync('appendMoreEdit'),
          listData           = this.data.listData,
          storageData        = {},
          storageType        = ''
      storageData = creatUser || itemEdit || userInfoEdit || moreEdit
      storageType = creatUser ? 'appendCreatUser' : itemEdit ? 'appendItemEdit' : userInfoEdit ? 'appendUserInfoEdit' : moreEdit ? 'appendMoreEdit' : ''
      if (storageData) {
        listData[storageData.firstIndex].splice(storageData.secondIndex, 1)
        this.leftGrounp    = []
        this.heightGroup   = []
        this.minIndex = 0
        this.curDataGroupIndex = 0
        this.totalItem = 0
        if (storageType === 'appendCreatUser') this.floor = 6
        wx.removeStorageSync(`${storageType}`)
        listData.forEach((item, index) => {
          item = this.appendCard(item)
          this.setData({[`listData[${index}]`]: item}, () => {
            this.typeset(item, index)
          })
        })
      }
    },
    hide: function () {
      
    }
  },

  methods: {
    appendCard (newVal) {
      let listData = this.data.listData
      // 累计卡片数目
      this.totalItem = this.totalItem + newVal.length

      let appended = (type) => {
        for (var i = 0; i < listData.length; i++) {
          if (listData[i].some(item => {return item.cardType === type})) return true
        }
      }

      let index = 0

      let setIndex = () => {
        if (this.totalItem > 6) {
          index = this.totalItem === newVal.length ? this.floor : this.floor - (this.totalItem - newVal.length)
        } else {
          index = this.totalItem
        }
      }
            
      // 添加创建简历 引导卡片
      if (this.totalItem >= this.floor && !app.globalData.isJobhunter) {
        if (!appendCreatUser && !appended('creatUser')) {
          setIndex()
          newVal.splice(index, 0, {cardType: 'creatUser'})
          this.totalItem++
          appendCreatUser = 1
        }
      }
      if (app.globalData.isJobhunter) {
        // 添加项目经历 引导卡片
        if (this.totalItem >= this.floor && !app.globalData.resumeInfo.projects.length) {
          if (!appendItemEdit && !appended('itemEdit')) {
            setIndex()
            newVal.splice(index, 0, {cardType: 'itemEdit'})
            this.floor += 10
            this.totalItem++
            appendItemEdit = 1
          }
        }
        // 添加完善个人信息 引导卡片
        if (this.totalItem >= this.floor && !app.globalData.resumeInfo.jobStatus) {
          if (!appendUserInfoEdit && !appended('userInfoEdit')) {
            setIndex()
            newVal.splice(index, 0, {cardType: 'userInfoEdit'})
            this.floor += 10
            this.totalItem++
            appendUserInfoEdit = 1
          }
        }
        
        // 添加更多介绍 引导卡片
        if (this.totalItem >= this.floor && !app.globalData.resumeInfo.moreIntroduce.introduce && !app.globalData.resumeInfo.moreIntroduce.imgs.length) {
          if (!appendMoreEdit && !appended('moreEdit')) {
            setIndex()
            newVal.splice(index, 0, {cardType: 'moreEdit'})
            this.totalItem++
            appendMoreEdit = 1
          }
        }
      }
      return newVal
    },
    routeJump (e) {
      let dataset  = e.currentTarget.dataset,
          routeUrl = ''
      switch (dataset.type) {
        case 'creatUser':
          routeUrl = `${APPLICANT}createUser/createUser`
          break
        case 'itemEdit':
          routeUrl = `${APPLICANT}center/resumeEditor/itemEdit/itemEdit`
          break
        case 'userInfoEdit':
          routeUrl = `${APPLICANT}center/userInfoEdit/userInfoEdit`
          break
        case 'moreEdit':
          routeUrl = `${APPLICANT}center/resumeEditor/moreEdit/moreEdit`
          break
        default: 
          routeUrl = `${COMMON}positionDetail/positionDetail?positionId=${dataset.id}`
      }
      if (routeUrl.indexOf('?') !== -1) {
        routeUrl = `${routeUrl}&fromType=guideCard&firstIndex=${dataset.firstindex}&secondIndex=${dataset.secondindex}`
      } else {
        routeUrl = `${routeUrl}?fromType=guideCard&firstIndex=${dataset.firstindex}&secondIndex=${dataset.secondindex}`
      }
      wx.navigateTo({url: routeUrl})
    },
    formSubmit(e) {
      app.postFormId(e.detail.formId)
    },

    reset () {
      this.leftGrounp    = []
      this.heightGroup   = []
      this.minIndex = 0
      this.curDataGroupIndex = 0
      this.totalItem = 0
      this.floor = 6
      this.setData({listData: [], wrapH: 0})
    },

    updata () {
      wx.nextTick(() => {
        this.typeset(this.data.listData[this.data.page])
      })
    },

    typeset (list, pageIndex = this.data.page) {
      if (!list.length) return
      let that = this
      let minFun = (heightGroup) => {
        return heightGroup.indexOf(Math.min(...heightGroup))
      }
      let maxFun = (heightGroup) => {
        return heightGroup.indexOf(Math.max(...heightGroup))
      }
      wx.nextTick(() => {
        list.forEach((item, index) => {
          getSelectorQuery(`.${this.data.flowClass}_flow${pageIndex}${index}`, that).then(res => {
            if (!res) return
            list[index].width = res.width
            list[index].index = index
            list[index].height = res.height
            if (index % this.data.horizontal === 0) { // 每排数据开始重置一下dataGroup
              this.curDataGroupIndex++
            }
            if (this.curDataGroupIndex === 1) { // 第一排需要特殊处理 top = 0
              list[index].top = 0
              if (index === 0) {
                list[index].left = 0
              } else {
                list[index].left = list[index - 1].left + list[index - 1].width + this.data.spaceX * app.globalData.xs
              }
              this.heightGroup.push(res.height) // 记录每路的高度
              this.leftGrounp.push(list[index].left) // 记录每路的left
            }
            if (this.curDataGroupIndex > 1) { // 从第二排开始布局
              this.minIndex = minFun(this.heightGroup)
              list[index].left = this.leftGrounp[this.minIndex]
              list[index].top = this.heightGroup[this.minIndex] + this.data.spaceY * app.globalData.xs
              this.heightGroup[this.minIndex] = list[index].top + list[index].height // 重置每路的高度
            }
            if (index === list.length - 1) {
              let wrapH = this.heightGroup[maxFun(this.heightGroup)]
              this.setData({[`listData[${pageIndex}]`]: list, wrapH}, () => {
              })
            }
          })
        })
      })
    }
  }
})
