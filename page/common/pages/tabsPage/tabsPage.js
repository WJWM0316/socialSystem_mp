import {
  getJobLabelApi,
  getLifeLabelApi,
  addJobLabelApi,
  addLifeLabelApi,
  saveLabelApi,
  saveRecruiterLabelApi
} from '../../../../api/pages/common.js'

let allSkills = []
let choseFirstId = ''
let choseFirstIndex = 0
let app = getApp()
let jobChoseNum = 0, // 职业标签选择的数量
    lifeChoseNum = 0 // 生活标签选择的数量

Page({
  data: {
    choseFirstName: '',
    num: 10, // 自定义字数
    customLabel: '', // 自定义标签
    skills: [], // 职业二级标签
    literacy: [], // 职业素养标签
    character: [], // 性格标签
    interest: [], // 兴趣标签
    hidePop: true, // 打开自定pop
    skillEditing: false,
    literacyEditing: false,
    characterEditing: false,
    interestEditing: false,
    allChooseLabels: [],
    skillsChoose: [], // 对应的选中
    literacyChoose: [], // 对应的选中
    characterChoose: [], // 对应的选中
    interestChoose: [] // 对应的选中
  },
  onShow() {

    let character = []
    let interest = []
    let skills = []
    let literacy = []
    let choseAllList = []
    let choseFirstName = ''
    let skillsChoose = []
    let literacyChoose = []
    let characterChoose = []
    let interestChoose = []
    let allChooseLabels = []
    let choseType = wx.getStorageSync('choseType')

    if (choseType === 'APPLICANT') {
      choseAllList = app.globalData.resumeInfo.personalizedLabels || []
    } else {
      choseAllList = app.globalData.recruiterDetails.personalizedLabels || []
    }

    Promise.all([getJobLabelApi({type: 'all'}), getLifeLabelApi()]).then(res => {
      allChooseLabels  = choseAllList.slice()
      allChooseLabels.map(v => {
        switch(v.type) {
          case 'label_life':
            if(v.labelId === 120000) {
              v.labeltype = 'interest'
            } else {
              v.labeltype = 'character'
            }
            break
          case 'label_professional_literacy':
            v.labeltype = 'literacy'
            break
          case 'label_professional_skills':
            if(v.source === 'diy') {
              v.labeltype = 'customize'
            } else {
              v.labeltype = 'skills'
            }
            break
          default:
            v.labeltype = 'customize'
            break
        }
      })
      allSkills = res[0].data.labelProfessionalSkills
      literacy = res[0].data.labelProfessionalLiteracy

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
            if(i.source === 'diy') {
              i.labeltype = 'customize'
            } else {
              i.labeltype = 'skills'
              skillsChoose.push(i)
            }
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
            i.labeltype = 'literacy'
            literacyChoose.push(i)
            literacy.map((item, index) => {
              if (item.labelId === i.labelId) {
                literacy[index].checked = true
              }
            })
            break
        }
      })

      res[1].data.map((item, index) => {
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
            if (i.pid === 110000) {
              character.map((k, s) => {
                if (k.labelId === i.labelId) {
                  character[s].checked = true
                  character[s].labeltype = 'character'
                  characterChoose.push(k)
                }
              })
            } else if (i.pid === 120000) {
              interest.map((k, s) => {
                if (k.labelId === i.labelId) {
                  interest[s].checked = true
                  interest[s].labeltype = 'interest'
                  interestChoose.push(k)
                }
              })
            }
            break
        }
      })

      this.setData({skills,
        literacy,
        choseFirstName,
        character,
        interest,
        skillsChoose,
        literacyChoose,
        interestChoose,
        characterChoose,
        allChooseLabels
      })
    })
  },
  closePop() {
    this.setData({hidePop: true})
  },
  openPop() {
    if(this.data.allChooseLabels.length < 5) {
      this.setData({hidePop: false})
    } else {
      app.wxToast({title: '选择标签已达上限'})
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
    let choseFirstName = this.data.choseFirstName
    choseFirstName = e.detail.propsResult.name
    choseFirstId = e.detail.propsResult.labelId
    if (allSkills.length > 0) {
      allSkills.map((n, index) => {
        if (n.labelId === choseFirstId) {
          choseFirstIndex = index
          skills = allSkills[choseFirstIndex].children
          this.setData({skills, choseFirstName})
        }
      })
    }
  },
  choseTab(e) {
    let params = e.currentTarget.dataset
    let allChooseLabels = this.data.allChooseLabels
    let choseData = params.tabdata

    // 删除自定义标签
    if(params.labeltype === 'customize') {
      allChooseLabels.splice(params.index, 1)
      this.setData({allChooseLabels})
      return
    }

    let labelList = this.data[params.labeltype]
    let list = this.data[`${params.labeltype}Choose`]
    let labeltype = params.labeltype

    labelList.map((item, index) => {
      if (item.labelId === choseData.labelId) choseData.index = index
    })

    if(choseData.checked) {
      let item1 = labelList.find(v => v.labelId === choseData.labelId)
      let key = `${params.labeltype}Choose`
      let data = this.data[key]
      if(item1) {
        labelList[choseData.index].checked = false
        list.map((item, index) => item.labelId === choseData.labelId && list.splice(index, 1))
      } else {
        allChooseLabels.splice(allChooseLabels.findIndex(v => v.labelId === choseData.labelId), 1)
        data.splice(data.findIndex(v => v.labelId === choseData.labelId), 1)
        this.setData({allChooseLabels, [key]: data})
      }
    } else {
      if (this.data.allChooseLabels.length > 5) {
        app.wxToast({title: '选择标签已达上限'})
      } else {
        choseData.checked = true
        choseData.labeltype = labeltype
        list.push(choseData)
        labelList[choseData.index].checked = true
      }
    }

    this.setData({[labeltype]: labelList, [`${params.labeltype}Choose`]: list }, () => {
      let allChooseLabels = this.data.allChooseLabels.filter(v => v.labeltype === 'customize')
      allChooseLabels = [
        // 防止落掉自定义标签
        ...allChooseLabels,
        ...this.data.skillsChoose,
        ...this.data.literacyChoose,
        ...this.data.characterChoose,
        ...this.data.interestChoose
      ]
      this.setData({allChooseLabels})
    })
  },
  addLabel() {
    if (this.data.customLabel === '') return
    let data = {
      name: this.data.customLabel
    }
    let list = this.data.allChooseLabels
    let type = ''
    let isReturn = false
    list.map((item, index) => {
      if (item.name === this.data.customLabel) {
        app.wxToast({title: '标签重复，添加失败'})
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
    addJobLabelApi(data).then(res => {
      let data = res.data
      data.name = this.data.customLabel
      data.checked = true
      data.labeltype = 'customize'
      list.push(data)
      this.setData({
        num: 6,
        customLabel: '',
        allChooseLabels: list,
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
  saveLabel() {
    if(!this.data.allChooseLabels.length) return
    let jobList = []
    let literacyLabels = []
    let lifeList = []
    let personalizedLabels = this.data.allChooseLabels
    let choseType = wx.getStorageSync('choseType')

    this.data.allChooseLabels.map((item, index) => {
      if (item.type === 'label_professional_literacy') {
        literacyLabels.push({labelId: item.labelId, source: item.source})
      } else if(item.type === 'label_life') {
        lifeList.push({labelId: item.labelId, source: item.source})
      } else {
        jobList.push({labelId: item.labelId, source: item.source})
      }
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
  switchSlide(e) {
    let params = e.currentTarget.dataset
    let key = `${params.key}Editing`
    let value = this.data[key]
    this.setData({
      skillEditing: false,
      literacyEditing: false,
      characterEditing: false,
      interestEditing: false,
      [key]: !value
    })
  }
})