class wxAnimation {
	createAnimation ({duration = 400, timingFunction = 'linear', delay = 0, transformOrigin = '50% 50% 0'}) {
		return wx.createAnimation({
			duration,
			timingFunction,
			delay,
			transformOrigin
		})
	}
}

export default new wxAnimation()