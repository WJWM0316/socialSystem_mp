/**
 * 小程序配置的文件
 */

// 环境切换
// 0 是测试环境  1 是正式环境
export const environment = 0
export const VERSION = 104
export let APPLICANTHOST = '',
					 RECRUITERHOST = '',
					 PUBAPIHOST = '',
					 WEBVIEW = '',
					 NODEHOST = ''
if (environment === 0) {
	// 测试服接口
	APPLICANTHOST = 'https://qiuzhi-api.dd.lieduoduo.ziwork.com'
	RECRUITERHOST = 'https://zhaopin-api.dd.lieduoduo.ziwork.com'
	PUBAPIHOST = 'https://pub-api.dd.lieduoduo.ziwork.com'
	NODEHOST = 'https://node.dd.lieduoduo.ziwork.com/frontEnd'  // 'http://localhost:3001/frontEnd' // 
	WEBVIEW = `https://h5.lieduoduo.ziwork.com/`
} else {
	// 正式服环境
	APPLICANTHOST = 'https://qiuzhi-api.dd.lieduoduo.com'
	RECRUITERHOST = 'https://zhaopin-api.dd.lieduoduo.com'
	NODEHOST =  'https://node.dd.lieduoduo.com/frontEnd'
	PUBAPIHOST = 'https://pub-api.dd.lieduoduo.com'
	WEBVIEW = `https://h5.lieduoduo.com/`
}

// 招聘端page
export const RECRUITER = '/page/recruiter/pages/'

// 应聘端page
export const APPLICANT = '/page/applicant/pages/'

// 公共包page
export const COMMON = '/page/common/pages/'

// components
export const COMPONENTS = '/components/'

// api
export const API = '/api/'