
// 文本溢出打点并渲染  ctx canvas对象 text 文本  width 限制宽度 
export const ellipsis = (ctx, text, width, x, y, color, bgObject) => {
	let ellipsisWidth = ctx.measureText('...').width
	let textWidth = ctx.measureText(text).width
	let curString = ''
	let nextString = ''
	if (textWidth > width) {
		for(let i = 0; i < text.length; i++) {
			curString = curString + text[i]
			if (i < text.length - 1) nextString = curString + text[i+1]
			if (ctx.measureText(nextString).width >= (width - ellipsisWidth)) {
				curString = curString + '...'
				let nextPositionX = addBorder({ctx, text:curString, bgObject})
				ctx.setFillStyle(color)
        ctx.fillText(curString, x, y)
        return nextPositionX
			}
		}
	} else {
		let nextPositionX = addBorder({ctx, text, bgObject})
		ctx.setFillStyle(color)
		ctx.fillText(text, x, y)
		return nextPositionX
	}
} 

// 文本溢出打点不渲染  ctx canvas对象 text 文本  width 限制宽度 
export const ellipsisText = (ctx, text, width) => {
	let ellipsisWidth = ctx.measureText('...').width
	let textWidth = ctx.measureText(text).width
	let curString = ''
	let nextString = ''
	if (textWidth > width) {
		for(let i = 0; i < text.length; i++) {
			curString = curString + text[i]
			if (i < text.length - 1) nextString = curString + text[i+1]
			if (ctx.measureText(nextString).width >= (width - ellipsisWidth)) {
				curString = curString + '...'
				return curString
			}
		}
	} else {
		return text
	}
}


export const addBorder = ({ctx, text, bgObject}) => {
	if (bgObject) {
		let metricsW = ctx.measureText(text).width
		if (!bgObject.x) {
			bgObject.x = (bgObject.maxWidth-(metricsW+2*bgObject.r)) / 2
		}
		ctx.beginPath()
    ctx.setFillStyle(bgObject.color)
    if (bgObject.r) {

    ctx.arc(bgObject.x + bgObject.r, bgObject.y + bgObject.r, bgObject.r, 0.5*Math.PI, 1.5*Math.PI)
    ctx.arc(bgObject.x + metricsW + bgObject.r, bgObject.y + bgObject.r, bgObject.r, 1.5*Math.PI, 0.5*Math.PI)
  	} else {
  		ctx.fillRect(bgObject.x, bgObject.y, metricsW+2*bgObject.padding, bgObject.height)
  	}
  	if (bgObject.opacity) {
  		ctx.setGlobalAlpha(bgObject.opacity)
  	}
    ctx.fill()
    ctx.setGlobalAlpha(1)
    return bgObject.x + metricsW + 2*bgObject.padding + bgObject.margin || 0
  }
}

// 文本换行  ctx canvas对象 text 文本  width 限制宽度  bgUrl 背景图url
export const lineFeed = (ctx, text, width, x, y, bgUrl, bgW = 750, bgH = 90) => {
	bgH = 150
	text = text.replace(/[\r\n]/g, '<newLine>')
	let textArray = text.split('<newLine>')
	let curHeight = y
	for (let j = 0; j < textArray.length; j++) {
		let item = textArray[j].trim()
		if (!item.match(/^[ ]+$/)) {
			let descString = ''
			let nextDescString = ''
			let nextDescWidth = 0
			if (ctx.measureText(item).width > width + 35) {
		    let iIndex = 0 // 最后一行的第一个字的索引
		    for (let i = 0; i < item.length - 1; i++) {
		      descString = descString + item[i]
		      nextDescString = descString + item[i+1]
		      nextDescWidth = ctx.measureText(nextDescString).width
		      if (nextDescWidth > width + 35) {
		      	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		        ctx.fillText(descString, 80, curHeight)
		        iIndex = i
		        descString = ''
		        curHeight += 48
		      }
		    }
		    if (iIndex !== item.length - 1) {
		    	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		    	ctx.fillText(item.slice(iIndex + 1, item.length), 80, curHeight)
		    }
		  } else {
		    if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		    ctx.fillText(item, x, curHeight)
		  }
		  curHeight += 48
		  if (curHeight > 2120) {
		  	ctx.setTextAlign('center')
	    	ctx.setFontSize(28)
	    	ctx.setFillStyle('#652791')
	    	if (bgUrl) ctx.drawImage(bgUrl, 0, curHeight, bgW, bgH)
		  	ctx.fillText('长按识别查看完整职位详情', 375, curHeight)
		  	curHeight += 40
		  	ctx.setTextAlign('left')
		  	return curHeight
		  }
		}
	}
  return curHeight
}


// 遍历标签
export const drawLabel = (ctx, dataArray, {x, y, r, fontSize, color}) => {
  let position = {
    x: x,
    y: y
  }    
  ctx.setFontSize(fontSize)
  ctx.setStrokeStyle(color)
  ctx.setFillStyle(color)
  ctx.setLineWidth(1)
	function addLabel(item, index) {
    // 下个标签的宽度
    let newLabelWidth = 0
    if (index < dataArray.length-1) {
      newLabelWidth = ctx.measureText(dataArray[index+1]).width + 2*r
    }
    
    let metricsW = ctx.measureText(item).width // 文本宽度
    ctx.fillText(item, position.x + r, position.y + r + 10)

    ctx.beginPath()
    ctx.moveTo(position.x + r, position.y)
    ctx.lineTo(position.x + r + metricsW, position.y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(position.x + r, position.y + r, r, 0.5*Math.PI, 1.5*Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(position.x + r + metricsW, position.y + 2*r)
    ctx.lineTo(position.x + r, position.y + 2*r)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(position.x + r + metricsW, position.y + r, r, 1.5*Math.PI, 0.5*Math.PI)
    ctx.stroke()
    // 下一个标签的横坐标
    position.x = position.x + 2*r + metricsW + 16
    // 判断是否需要换行
    if (newLabelWidth > (750 - 2*59 - position.x)) {
      position.x = x
      position.y = position.y + 2*r + 15
    }
  }
  dataArray.map((item, index) => {
    addLabel(item, index)
  })
}

    