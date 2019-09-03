
const cdnImagePath = 'https://lieduoduo-uploads-test.oss-cn-shenzhen.aliyuncs.com/front-assets/images/'

// 底部栏开撩文案

// 【C端】
export const agreedTxtC= (res) => {
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

// 【B端】
export const agreedTxtB= (res) => {
	let txtList = [
		'工作易得，知音难觅，壮士约乎？',
		'我不想懂天文地理，我只想懂你~',
		'公司的进口零食得找个人清一清了',
		'我看你骨骼精奇，是块耐磨的料子',
		'好看的和能干的，都欢迎来开撩哦',
		'把握住缘分，搞不好能成为同事~',
		'我这么Nice的面试官已经不多见了！'
	]
	let random = Math.floor((Math.random()*txtList.length))
	return txtList[random]
}

// B端“看看别人怎么写”的文案

// 个人简介
let othersBriefTxtBIndex = null
export const othersBriefTxtB= (res) => {
	let txtList = [
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '有赞',
			txt: 	'白鸦是中国最早的用户体验设计师之一，在创立有赞之前，曾担任支付宝首席产品设计师、百度产品设计师，有着丰富的在线支付、企业服务、电子商务、互联网社区、搜索等各互联网领域经验。'
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '要出发',
			txt: 	'丁根芳本、硕、博均毕业于合肥工业大学，获工学博士学位。2000年在校读博期间，创立“给排水在线网”，担任CEO。2004年“给排水在线网”被网易收购，成为“土木工程”事业部，04年至08年期间担任总监，一手打造出中国最大的建筑工程网站。此后两年，热爱创业的丁根芳离开网易，凭借一腔热情，不断的尝试互联网新模式新思路，2010年成功创立要出发周边游。'
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '小米',
			txt: 	'雷军1992年参与创办金山软件，1998年出任金山软件CEO。1999年创办了卓越网。 2007年，金山软件上市后，雷军卸任金山软件总裁兼CEO职务，担任副董事长。 之后几年，雷军作为天使投资人，投资了凡客诚品、多玩、优视科技等多家创新型企业。 2011年7月，雷军重返金山软件，任金山软件公司董事长。 2010年4月6日，雷军选择重新创业，建立了小米公司。'
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '字节跳动',
			txt: 	'创始人兼CEO张一鸣毕业于南开大学软件工程学院；2006年加入旅游信息搜索公司“酷讯”，曾任“酷讯”技术委员会主席；2009年创立房产信息搜索公司“九九房”；2012年创立“字节跳动”公司并担任CEO。张一鸣与今日头条团队的愿景是成为“最懂你的信息平台，连接人与信息，促进创作和交流。”'
		}
	]
	let random = Math.floor((Math.random()*txtList.length))
	if (random === othersBriefTxtBIndex) {
		random++
		if(random > txtList.length - 1) random = 0
	} else {
		othersBriefTxtBIndex = random
	}
	return txtList[random]
}

// 职位描述
let othersPositionTxtBIndex = null
export const othersPositionTxtB= (res) => {
	let txtList = [
		{
			icon: `${cdnImagePath}nvpic.png`,
			name: '总经理助理/秘书',
			txt: `岗位职责：
 1、负责公文、会议纪要、工作报告等起草及日常文秘、信息报送工作；
 2、协助各部门做好其他的辅助服务工作;
 3、协助总经理管理部门；
 4、接听总经理办公室电话，协调安排总经理的日常工作，跟进相关业务；
 5、总经理安排的其他工作。
 任职资格:
 1、大专以上学历，行政管理或相关工作经验者优先考虑;
 2、有较好的沟通表达能力及服务意识。
 3、工作有条理，细致、认真、有责任心,办事严谨;
 4、熟练电脑操作及Office办公软件,具备基本的网络知识;
 5、熟悉办公室行政管理知识及工作流程，熟悉公文写作格式，具备基本商务信函写作能力;
 6、具备较强的文字撰写能力和较强的沟通协调以及语言表达能力。
 7、有亲和力。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: 'java工程师',
			txt:  `岗位职责：
1.负责软件需求设计、详细设计、编码、单元测试等开发活动；
2.界定软件系统的工作范围、潜在风险、所需资源、工作计划、任务列表、里程碑等项目管理工作；
3.组织相关产品/组件的开发和测试工作，保证代码的高质量、稳定性与高性能；
4.技术难点的攻克,负责核心代码的开发；
5.负责相关产品/组件的代码安全，合理分配代码操作权限； 
6.跟踪相关技术领域和业务领域的发展趋势，保持在业界的领先水平。
任职要求： 
1.熟练掌握java编程语言，具备良好的编码、文档撰写能力；
2.具备较强的软件框架及数据库设计能力；
3.熟悉网络通信的基本原理；
4.熟练掌握java常用开源框架，熟悉常用前端js框架；
5.熟练掌握oracle数据库，熟练掌握redis；
6.熟悉运用开发管理工具，提升开发工作的质量和效率，规避系统开发执行过程中的潜在风险，注重代码质量,确保系统开发产出的按时提交；
7.全日制本科及以上学历，计算机、电子、软件、通讯相关专业毕业。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '产品经理',
			txt: `岗位职责：
1、负责产品的设计/规划，开发计划的跟进，产品上线并对整体用户体验负责；
2、挖掘市场需求，根据市场反馈，设计并落地商业化策略产品；
3、对接公司业务部门，将业务流程线上化；
4、对接商务拓展部门，把控线上客服质量；
5、持续优化线上策略，完善数据建设，推动策略和数据的迭代。  
任职要求：
1、熟练绘制产品原型图，跟进整个产品开发进度；
2、有独立负责过项目或参与过0-1项目优先；
3、思路清晰、逻辑性强、数据敏感、结果导向，掌握效果评估分析相关工具和方法；
4、注重用户体验，能将用户需求转化成产品需求。`
		},
		{
			icon: `${cdnImagePath}nvpic.png`,
			name: 'UI设计师',
			txt: `岗位职责：
1、负责公司产品的UI设计工作(含Web/App)； 
2、和产品交互一起构思与创意，灵活提供视觉解决方案； 
3、关注设计产品功能点数据变化，及时调整； 
4、时刻分析监控流行产品设计趋势，研究目标用户审美倾向并优化现有产品。 
任职要求：
1、1年以上移动互联网设计经验，熟悉Web、iOS、Android设计规则； 
2、能高效理解产品和交互设计思路，敏锐判断视觉设计的可行性； 
3、逻辑严谨，能够制作动态交互； 
4、重视细节，极强的責任心，性格开朗，善于沟通；
5、对前沿设计探索充满兴趣，自我驱动力强，能用设计效果准确表达想法；
6、精通 Photoshop、AI 、Sketch、AE、Princisple等视觉交互设计软件。`
		},
		{
			icon: `${cdnImagePath}nvpic.png`,
			name: '运营专员',
			txt: `岗位职责：
1、熟悉部门现有产品及现有客户基本信息和状况，做好客户关系维系；
2、协助进行市场活动，完成客户邀约；
3、做好用户沟通、资料共享、项目协调等；
4、就具体项目组织商务谈判、合同拟定、产品报价及合同签订等工作。
任职要求：
1、本科及以上学历，大学毕业或有1-2年工作经验，年龄30岁以内，形象气质佳；
2、思维敏捷，有很强的理解沟通、应变能力、组织协调能力和团队合作精神；
3、具有良好的综合素质和培养潜力，有志于在本行业长期发展。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '销售专员',
			txt: `岗位职责：
1、以电话沟通的形式初步筛选客户，为客户提供专业的网络营销策划方案并与客户建立长期合作;
2、主动寻找获取相应的客户资源,销售只需负责客户的开发和培养;
3、销售的工作并非电话推销，而是专业的互联网营销推广顾问;
4、协调客户时间和客户见面沟通面谈促进合作。
任职要求：
1、大专以上学历,有电话销售或客服经验者优先;
2、性格外向，坦诚、自信、乐观、并有足够的耐心和亲和力；
3、良好的人际沟通能力，口头表达能力强，以结果为导向；
4、良好的自我激励能力，能够承受工作压力，乐于从事挑战性的工作。`
		}
	]
	let random = Math.floor((Math.random()*txtList.length))
	if (random === othersPositionTxtBIndex) {
		random++
		if(random > txtList.length - 1) random = 0
	} else {
		othersPositionTxtBIndex = random
	}
	return txtList[random]
}

// C端“看看别人怎么写”的文案

// 位置：新建/编辑工作经历中的 “工作内容”
export const othersworkConTxtC= (res) => {
	let txtList = [
		{
			icon: `${cdnImagePath}nvpic.png`,
			name: 'UI设计师/秘书',
			txt: `1、负责公司内产品如APP、WAP、网页的UI设计；
2、负责UI的测试和验收；
3、负责维护版本迭代，提高在交互层面的用户体验；
4、制定APP、WAP界面的实现标准。输出设计规范及标准。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '运营经理',
			txt: `1、负责产品的整体拉新、促活工作的策划和管理；
2、负责市场各类推广媒介、宣传品策划、设计和管理；
3、配合产品完成既定市场目标，参与公司产品的市场推广；
4、负责整体内容的策划、更新和管理。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '前端工程师',
			txt: `1. 根据项目规划，负责项目子模块研发工作；
2. 独立负责处理和解决线上产品出现的一般问题；
3. 对开发过程出现的技术难点进行攻关及非产品核心技术的难点的预研；
4. 项目的开发和上线工作。`
		},
		{
			icon: `${cdnImagePath}nanpic.png`,
			name: '产品经理',
			txt: `1、负责产品的设计/规划，开发计划的跟进，产品上线并对整体用户体验负责；
2、挖掘市场需求，根据市场反馈，设计并落地商业化策略产品；
3、对接公司业务部门，将业务流程线上化；
4、对接商务拓展部门，把控线上客服质量；
5、持续优化线上策略，完善数据建设，推动策略和数据的迭代。`
		},
		{
			icon: `${cdnImagePath}nvpic.png`,
			name: '人事专员',
			txt: `1、配合公司经营目标的需要，负责相关岗位的招聘管理工作；
2、负责员工关系管理，建立健全员工的人事档案，办理员工入职、转正、异动、离职等手续；
3、负责公司整体培训工作的规划配合以及新员工的入职培训工作。`
		}
	]
	let random = Math.floor((Math.random()*txtList.length))
	let nextOne = () => {
		random++
		if (random > txtList.length - 1) random = 0
		return txtList[random]
	}
	return txtList[random]
}