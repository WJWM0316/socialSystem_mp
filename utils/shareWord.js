// 分享小程序C端
// 分享小程序B端
export const shareB = '招聘，就上多多招聘！心仪候选人直接开撩！'

// 分享简历
export const shareResume = (res) => {
	let txtList = [
		'我一直在等，等一个懂我的老大~',
		'工作中的我一个顶俩，用过都说好',
		'看在我简历这么好看的份上，约呗',
		'确认过眼神，我是你想要的那个人',
		'嘿，该不会没看出来我超靠谱的吧',
		'看上我的人实在太多，抓紧机会~'
	]
	let random = Math.floor((Math.random()*txtList.length))
	return txtList[random]
}

// 分享招聘官
export const shareRecruiter = (res) => {
	let txtList = [
		'【工作易得，知音难觅，壮士约乎？】TA正在招人！',
		'【我不想懂天文地理，我只想懂你~】TA正在招人！',
		'【公司的进口零食得找个人清一清了】TA正在招人！',
		'【我看你骨骼精奇，是块耐磨的料子】TA正在招人！',
		'【好看的和能干的，都欢迎来开撩哦】TA正在招人！',
		'【把握住缘分，搞不好能成为同事~】TA正在招人！',
		'【我这么Nice的面试官已经不多见了！】TA正在招人！'
	]
	let random = Math.floor((Math.random()*txtList.length))
	return txtList[random]
}

// 分享职位
export const sharePosition = (res) => {
	let txtList = [
		'【工作易得，知音难觅，壮士约乎？】试试这个好职位~',
		'【我不想懂天文地理，我只想懂你~】试试这个好职位~',
		'【公司的进口零食得找个人清一清了】试试这个好职位~',
		'【我看你骨骼精奇，是块耐磨的料子】试试这个好职位~',
		'【好看的和能干的，都欢迎来开撩哦】试试这个好职位~',
		'【把握住缘分，搞不好能成为同事~】试试这个好职位~',
		'【我这么Nice的面试官已经不多见了！】试试这个好职位~'
	]
	let random = Math.floor((Math.random()*txtList.length))
	return txtList[random]
}

// 分享公司
export const shareCompany = '正在招人，马上约面，极速入职！我在这里等你！'

// 分享面试
export const shareInterviewr = '邀请你面试一个优秀候选人，快去Look吧~'

// 分享排行榜
export const shareRanking = '全国的面试官，都在这里招聘'

// 分享职业机会
export const shareChance = '你要的高薪福利好，都藏在'



