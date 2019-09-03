// page/common/pages/tabsPage/tabsPage.js
import {getJobLabelApi, getLifeLabelApi, addJobLabelApi, addLifeLabelApi, saveLabelApi, saveRecruiterLabelApi} from '../../../../api/pages/common.js'
let allSkills = []
let choseFirstId = ''
let choseFirstIndex = 0
let app = getApp()
let jobChoseNum = 0, // 职业标签选择的数量
    lifeChoseNum = 0 // 生活标签选择的数量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '选择职业标签',
    choseFirstName: '',
    pageType: 'job',
    num: 10, // 自定义字数
    customLabel: '', // 自定义标签
    choseJobList: [], // 选择职业标签
    choseLifeList: [], // 选择生活标签
    skills: [], // 职业二级标签
    literacy: [], // 职业素养标签
    character: [], // 性格标签
    interest: [], // 兴趣标签
    hidePop: true // 打开自定pop
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let character = []
    let interest = []
    let skills = []
    let literacy = []
    let choseAllList = []
    let choseJobList = []
    let choseLifeList = []
    let choseFirstName = ''
    let choseType = wx.getStorageSync('choseType')
    if (choseType === "APPLICANT") {
      choseAllList = app.globalData.resumeInfo.personalizedLabels || []
    } else {
      choseAllList = app.globalData.recruiterDetails.personalizedLabels || []
    }
    getJobLabelApi({type: 'all'}).then(res => {
      allSkills = res.data.labelProfessionalSkills
      literacy = res.data.labelProfessionalLiteracy
      // 默认展示第一个类
      skills = allSkills[0].children
      choseFirstName = allSkills[0].name
      // 确定第一个职业技术标签的二级类
      choseAllList.map((item, index) => {
        if (item.type === 'label_professional_skills') {
          allSkills.map((n, j) => {
            if (n.labelId === choseAllList[index].pid) {
              choseFirstIndex = j
              choseFirstName = allSkills[j].name
            }
          })
          return
        }
      })
      choseAllList.map((i, j) => {
        switch(i.type) {
          case 'label_professional_skills':
            i.checked = true
            choseJobList.push(i)
            allSkills.map((k, s) => {
              if (k.labelId === i.pid) {
                allSkills[s].children.map((x, y) => {
                  if (x.labelId === i.labelId) {
                    allSkills[s].children[y].checked = true
                  }
                })
              }
            })
            skills = allSkills[choseFirstIndex].children
            break
          case 'label_professional_literacy':
            i.checked = true
            choseJobList.push(i)
            literacy.map((item, index) => {
              if (item.labelId === i.labelId) {
                literacy[index].checked = true
              }
            })
            break
        }
      })
      this.setData({skills, literacy, choseJobList, choseFirstName})
    })
    getLifeLabelApi().then(res => {
      res.data.map((item, index) => {
        if (item.labelId === 110000) {
          character = item.children
        }
        if (item.labelId === 120000) {
          interest = item.children
        }
      })
      choseAllList.map((i, j) => {
        switch(i.type) {
          case 'label_life':
            i.checked = true
            choseLifeList.push(i)
            if (i.pid === 110000) {
              character.map((k, s) => {
                if (k.labelId === i.labelId) {
                  character[s].checked = true
                }
              })
            } else if (i.pid === 120000) {
              interest.map((k, s) => {
                if (k.labelId === i.labelId) {
                  interest[s].checked = true
                }
              })
            }
            break
        }
      })
      this.setData({character, interest, choseLifeList})
    })
  },
  closePop() {
    this.setData({hidePop: true})
  },
  openPop () {
    if (this.data.pageType === 'life') {
      if (this.data.choseLifeList.length < 3) {
        this.setData({hidePop: false})
      } else {
        app.wxToast({
          title: '选择标签已达上限'
        })
      }
    } else {
      if (this.data.choseJobList.length < 3) {
        this.setData({hidePop: false})
      } else {
        app.wxToast({
          title: '选择标签已达上限'
        })
      }
    }
  },
  getCustomLabel(e) {
    this.setData({
      num: 10 - e.detail.value.length,
      customLabel: e.detail.value
    })
  }, 
  getresult(e) {
    if (!e.detail.propsResult) return
    let skills = []
    choseFirstId = e.detail.propsResult.labelId
    if (allSkills.length > 0) {
      allSkills.map((n, index) => {
        if (n.labelId === choseFirstId) {
          choseFirstIndex = index
          skills = allSkills[choseFirstIndex].children
          this.setData({skills})
        }
      })
    }
  },
  choseTab(e) {
    let list = []
    let labelList = []
    let skills = []
    let labelType = ''
    let type = ''
    if (this.data.pageType === 'life') {
      list = this.data.choseLifeList
      type = 'choseLifeList'
    } else {
      list = this.data.choseJobList
      type = 'choseJobList'
    }
    switch (e.target.dataset.labeltype) {
      case 'skills':
        labelType = 'skills'
        labelList = this.data.skills
        break
      case 'literacy':
        labelType = 'literacy'
        labelList = this.data.literacy
        break
      case 'character':
        labelType = 'character'
        labelList = this.data.character
        break
      case 'interest':
        labelType = 'interest'
        labelList = this.data.interest
        break
      case 'choseJobList':
        labelType = 'choseJobList'
        labelList = this.data.choseJobList
        break
      case 'choseLifeList':
        labelType = 'choseLifeList'
        labelList = this.data.choseLifeList
        break
    }
    let choseData = e.target.dataset.tabdata
    labelList.map((item, index) => {
      if (item.labelId === choseData.labelId) {
        choseData.index = index
        return
      }
    })
    if (choseData.checked) {
      list.map((item, index) => {
        if (item.labelId === choseData.labelId) {
          list.splice(index, 1)
          return
        }
      })
      // 不是点击 选中标签列表
      if (labelType !== 'choseJobList' && labelType !== 'choseLifeList') {
        labelList[choseData.index].checked = false
      // 选中标签列表
      } else {
        if (choseData.source !== 'diy')  {
          let relationList = [] // 所选标签对应的列表
          let relationType = '' // 所选标签对应的列表的类型
          switch (choseData.type) {
            case 'label_professional_skills':
              relationType = 'skills'
              break
            case 'label_professional_literacy':
              relationType = 'literacy'
              relationList = this.data.literacy
              break
            case 'label_life':
              if (choseData.pid === 110000) {
                relationType = 'character'
                relationList = this.data.character
              } else {
                relationType = 'interest'
                relationList = this.data.interest
              }
          }
          if (relationType !== 'skills') {
            relationList.map((item, index) => {
              if (item.labelId === choseData.labelId) {
                item.checked = false
                return
              }
            })
          } else {
            allSkills.map((item, index) => {
              if (item.labelId === choseData.pid) {
                relationList = item.children
                relationList.map((n, i) => {
                  if (n.labelId === choseData.labelId) {
                    relationList[i].checked = false
                    relationList = allSkills[choseFirstIndex].children
                    return
                  }
                })
                return
              }
            })
          }
          this.setData({
            [relationType]: relationList
          })
        }
      }
    // 要选中的
    } else {
      if (list.length === 3) { // 超过五个不给选择了
        app.wxToast({
          title: '选择标签已达上限'
        })
        return
      } else {
        choseData.checked = true
        list.push(choseData) // 不超过五个的，且没被选择的添加进去
        labelList[choseData.index].checked = true
      }
    }
    this.setData({[type]: list, [labelType]: labelList})
  },
  addLabel() {
    if (this.data.customLabel === '') return
    let data = {
      name: this.data.customLabel
    }
    let list = []
    let type = ''
    let addLabelApi = null
    if (this.data.pageType === 'life') {
      list = this.data.choseLifeList
      type = 'choseLifeList'
      addLabelApi = addLifeLabelApi
    } else {
      list = this.data.choseJobList
      type = 'choseJobList'
      addLabelApi = addJobLabelApi
    }
    let isReturn = false
    list.map((item, index) => {
      if (item.name === this.data.customLabel) {
        app.wxToast({
          title: '标签重复，添加失败'
        })
        isReturn = true
        this.setData({
          num: 6,
          customLabel: '',
          hidePop: true
        })
        return
      }
    })
    if (isReturn) return
    addLabelApi(data).then(res => {
      let data = res.data
      data.name = this.data.customLabel
      data.checked = true
      list.push(data)
      this.setData({
        num: 6,
        customLabel: '',
        [type]: list,
        hidePop: true
      })
    }).catch((e) => {
      if (e.data.code === 413) {
        app.wxToast({
          title: '便签库已有此标签'
        })
        this.setData({
          num: 6,
          customLabel: '',
          hidePop: true
        })
      }
    })
  },
  back() {
    if (this.data.pageType === 'life') {
      this.setData({
        pageType: 'job',
        title: '选择职业标签'
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.navigateBack({delta: 1})
    }
  },
  nextStep() {
    if (this.data.choseJobList.length === 0) {
      app.wxToast({
        title: '请选择职业标签'
      })
      return
    }
    this.setData({
      pageType: 'life',
      title: '选择生活标签'
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  saveLabel() {
    if (this.data.choseLifeList.length === 0) {
      app.wxToast({
        title: '请选择生活标签'
      })
      return
    }
    let jobList = []
    let literacyLabels = []
    let lifeList = []
    let personalizedLabels = this.data.choseJobList.concat(this.data.choseLifeList)
    let choseType = wx.getStorageSync('choseType')
    this.data.choseJobList.map((item, index) => {
      if (item.type === 'label_professional_literacy') {
        literacyLabels.push({labelId: item.labelId, source: item.source})
      } else {
        jobList.push({labelId: item.labelId, source: item.source})
      }
    })
    this.data.choseLifeList.map((item, index) => {
      lifeList.push({labelId: item.labelId, source: item.source})
    })
    // jobList = [{labelId: 170000, source: 'system'}]
    // lifeList = [{labelId: 110300, source: 'system'}]
    // literacyLabels = [{labelId: 120000, source: 'system'}, {labelId: 150000, source: 'system'}]
    let data = {
      skillLabels: jobList,
      literacyLabels: literacyLabels,
      lifeLabels: lifeList
    }
    if (choseType === "APPLICANT") {
      saveLabelApi(data).then(res => {
        app.globalData.resumeInfo.personalizedLabels = personalizedLabels
        app.wxToast({
          title: '提交成功',
          icon: "success",
          callback() {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
    } else {
      saveRecruiterLabelApi(data).then(res => {
        app.globalData.recruiterDetails.personalizedLabels = personalizedLabels
        app.wxToast({
          title: '提交成功',
          icon: "success",
          callback() {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})