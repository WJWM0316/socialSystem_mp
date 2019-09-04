Page({
  data: {
    options: {},
    imgUrl: '../../../../images/201909011831.jpg'
  },
  onLoad(options) {
    this.setData({ options })
  },
  onShow() {
  	let ctx = wx.createCanvasContext('cardCanvas', this)
  	let cardCanvasWidth = 258
  	let cardCanvasHeight = 258
  	let avatarUrlWidth = 100
  	let avatarUrlHeight = 100
    ctx.drawImage('../../../../images/201909011831.jpg', 0, 0, cardCanvasWidth, cardCanvasHeight)
    ctx.drawImage(
    	'../../../../images/201909042919.jpg',
    	cardCanvasWidth/2 - avatarUrlWidth/2,
    	cardCanvasHeight/2 - avatarUrlHeight/2,
    	avatarUrlWidth, 
    	avatarUrlHeight
    )
    ctx.draw(true)
  }
})