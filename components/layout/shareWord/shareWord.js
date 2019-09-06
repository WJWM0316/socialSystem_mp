const app = getApp()
const animation = wx.createAnimation({
  duration: 200,
  timingFunction: 'ease-in-out'
})
let copyContent = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    opened: false,
    openTro: true,
    choseIndex: 0,
    txtIndex: 0,
    guidePop: true,
    animationData: {},
    info: {},
    list: []
  },
  attached () {
    let guidePop = wx.getStorageSync('guidePop')
    let info = wx.getStorageSync('posterData')
    let list = [
      {
        name: '普通版',
        value: [
`#招人啦~！#
【${info.positionName}】【${info.emolumentMin}K~${info.emolumentMax}K】，base【${info.city}】，经验在【${info.workExperienceName}】的牛人欢迎来开撩哦~~
↓↓↓打开下方海报，长按识别二维码即可直接约面试↓↓↓
（不看机会的也可以帮忙转发一下哦，谢谢~）`,
`#招牛人，招高手#
做【${info.typeName}】相关职位的高手看过来~（欢迎大家自荐推荐）
点开下面海报直接扫码来撩~`,
`#招聘啦！招聘啦！#
热招岗位：${info.positionName}，${info.emolumentMin}K~${info.emolumentMax}K！
详情可识别下方海报二维码查看，可以直接在小程序里联系招聘官哦~`
        ]
      },
      {
        name: '团队好',
        value: [
`#${info.companyInfo.companyShortname}招人啦~#
坐标【${info.city}】，团队年轻有活力，在这里永远可以感受满满正能量~
感兴趣的可以长按识别二维码直接约面，等你加入我们！`,
`#想加入好团队的看过来#
团队牛逼氛围好，只要有料，就有足够的施展空间！
欢迎【${info.typeName}】人才，点开海报，长按识别二维码马上加入~`
        ]
      },
      {
        name: '领导赞',
        value: [
`#急招牛人#
有兴趣的小伙伴戳下面海报了解一下，team leader人很nice哦~`,
`#老板要招人啦#
老板是个逗比，魅力爆表，走过路过不要错过~`,
`#找工作的看过来#
有【${info.typeName}】相关经验的小伙伴过来瞧瞧，leader颜值超高（戳下方海报自己体会），欢迎开撩~`
        ]
      },
      {
        name: '友情深',
        value: [
`#找工作的小伙伴们要注意！前方高能！#
公司里C字头大大们发话了，急需牛人若干，一起搞点大的
咱${info.companyInfo.companyShortname}目前${info.companyInfo.financingInfo}，规模${info.companyInfo.employeesInfo}，欢迎【${info.topType}】类牛人跟咱直接约面，品茶言欢~
点开下方海报长按识别，交个朋友呗~
（不看机会的也可以帮忙转发一下哦，谢谢~）`,
`#与其说是招聘贴，不如说是交友帖#
有种默契，叫志同道合；
有种感情，叫革命友谊；
有种效率，叫协作精神；
在创业团队里待过的人，都懂得手足的可贵。发展路上的${info.companyInfo.companyShortname}，立志善待每一位正在或即将一起努力的手足，【${info.positionName}】【${info.emolumentMin}K~${info.emolumentMax}K】，福利不封顶，希望能遇到那个同路的你！
点击下方海报，长按识别二维码，跟咱走~
（不看机会的也可以帮忙转发一下哦，谢谢~）`
        ]
      },
      {
        name: '文艺范',
        value: [
`#无数次追寻和擦肩而过，才换来今天你看到了咱的招聘信息#
我们要的，是热情似火，迎难而上的那个你
我们要的，是忠贞不二，肝胆相照的那个你
我们要的，是心中有梦，热泪常盈的那个你
而我们有的，是合理的待遇，发展的平台，和守望相助的同事
【${info.positionName}】【${info.emolumentMin}K~${info.emolumentMax}K】，点开下方海报扫码，我们等你
（不看机会的也可以帮忙转发一下哦，谢谢~）`,
`#想对候选人说的话#
也许，你早已成长为一位成熟可靠的职场人
独自勇猛地面对着工作中的一切，但
你每次披星戴月的奋斗，
你每次迎难而上的无畏，
你每次突破自我的蜕变，
我们依然希望能参与见证。
加入我们，一起做些有价值的事情吧~
#点击下方海报，长按识别二维码了解我们#
（不看机会的也可以帮忙转发一下哦，谢谢~）`
        ]
      },
      {
        name: '逗比风',
        value: [
`#咱${info.companyInfo.companyShortname}要招牛人啦~~#
【${info.positionName}】【${info.emolumentMin}K~${info.emolumentMax}K】，
岗位福利好，公司待遇佳，领导靠谱人人夸！
要想开撩约面试，扫描海报二维码，从此咱们是一家~
（不看机会的也可以帮忙转发一下哦，谢谢~）
↓↓↓猛戳下方海报扫码↓↓↓`,
`#又是一年招聘时，现在发圈还不迟#
福利待遇真不错，环境优美奖金多；
领导nice不甩锅，同事安分不闯祸；
公司发展关关过，进步速度没得说！
编个段子不容易，扫码约面so easy~
↓↓↓点击下方海报扫码，即可与老板约面↓↓↓
（不看机会的也可以帮忙转发一下哦，谢谢~）`,
`#看到我就是缘分#
金三银四招人忙，全厂指标我独扛；
苦心孤诣写JD，挖个牛人不容易；
万能票圈搭把手，让我也能仰头走！
看机会的扫个码，不跳也随手转发~
（感兴趣的扫码开撩，不看机会的也可以帮忙转发一下哦，谢谢~）`
        ]
      }
    ]
    this.setData({list, guidePop})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    copy () {
      wx.setClipboardData({
        data: copyContent,
        success(res) {
          wx.getClipboardData({
            success(res) {
              app.wxToast({title: '复制成功', icon: 'success'})
            }
          })
        }
      })
    },
    toggle (e) {
      let index = 0
      switch(e.currentTarget.dataset.type) {
        case 'type':
          index = e.currentTarget.dataset.index
          this.setData({choseIndex: index, txtIndex: 0})
          break
        case 'next':
          index = this.data.txtIndex
          if (index < this.data.list[this.data.choseIndex].value.length - 1) {
            index++
          }
          this.setData({txtIndex: index})
          break
        case 'prev':
          index = this.data.txtIndex
          if (index > 0) {
            index--
          }
          this.setData({txtIndex: index})
          break
      }
      copyContent = this.data.list[this.data.choseIndex].value[this.data.txtIndex]
    },
    oper (e) {
      switch(e.currentTarget.dataset.type) {
        case 'open':
          this.setData({opened: true}, () => {
            let timer = setTimeout(() => {
              this.animation = animation
              animation.bottom(36).step()
              this.setData({
                animationData: animation.export()
              })
              clearTimeout(timer)
            }, 50)
          })
          break
        case 'close':
          this.animation = animation
          animation.bottom(-600).step()
          this.setData({
            animationData: animation.export()
            }, () => {
            let timer = setTimeout(() => {
              this.setData({opened: false})
              clearTimeout(timer)
            }, 300)
          })
          break
        case 'openTro':
          this.setData({openTro: true})
          break
        case 'closeTro':
          let guidePop = wx.getStorageSync('guidePop')
          if (!guidePop) wx.setStorageSync('guidePop', true)
          this.triggerEvent('hidePop', true)
          this.setData({openTro: false})
          break
      }
    },
    getValue (e) {
      copyContent = e.detail.value
    }
  }
})
