class localstorage {
	set (key, value) {
		let date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				curTimeStamp = date.getTime(),
				overTimeStamp = 0
		if (value.type) {
			switch (value.type) {
				case 'resetTheDay': // 每天0点过期
					if (new Date(year, month, 0).getDate() > day) {
						day++
					} else {
						day = 1
						month++
						if (month > 12) {
							month = 1
							year++
						}
					}
					overTimeStamp = new Date(`${year}/${month}/${day}`).getTime()
					break
				case 'timeStamp': // 指定过了多次事件‘过期
					overTimeStamp = value.time
					break
				case 'date': // 指定日期过期
					overTimeStamp = new Date(value.time).getTime()
					break
			}
		}
		if (overTimeStamp) value.overTimeStamp = overTimeStamp
		wx.setStorageSync(key, value)
	}
	get (key) {
		let value = wx.getStorageSync(key)
		if (value.overTimeStamp && value.overTimeStamp <= new Date().getTime()) {
			wx.removeStorageSync(key)
			return undefined
		} else {
			return value
		}
	}
}
export default new localstorage()