import { request } from '../require.js'

// 招聘官撩约接口
export const inviteInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/inviteInterview',
    data,
    hasLoading
  })
}

// 求职端面试详情
export const interviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/detail/${data.interviewId}?`,
    data,
    hasLoading
  })
}

// 招聘端面试安排设置
export const setInterviewDetailApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/setInterviewInfo/${data.interviewId}`,
    data,
    hasLoading
  })
}

// 开撩约面
export const applyInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/interview/applyInterview',
    data,
    hasLoading
  })
}

// 求职端确认面试安排
export const sureInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirmArrangementInfo/${data.interviewId}`,
    data,
    hasLoading
  })
}

//求职者申请列表 (招聘端的邀请列表)
export const getApplyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/apply',
    data,
    hasLoading
  })
}

//收到邀请列表
export const getInviteListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/invite',
    data,
    hasLoading
  })
}

//面试列表
export const getScheduleListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/schedule',
    data,
    hasLoading
  })
}

//面试列表日期数量
export const getScheduleNumberApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/scheduleNumber',
    data,
    hasLoading
  })
}


//获取底部面试状态
export const getInterviewStatusApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/interview/getInterviewStatus',
    data,
    hasLoading: false
  })
}

//确定约面
export const confirmInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/confirm/${data.id}`,
    data,
    hasLoading
  })
}

//编辑不合适
export const refuseInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/refuse/${data.id}`,
    data,
    hasLoading
  })
}

/* 招聘端 */
//收到意向列表
export const getIntentionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/intention`,
    data,
    hasLoading
  })
}

/* 面试全部红点 */
export const getRedDotListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/getRedDotInfo`,
    data,
    hasLoading
  })
}

// 面试安排不合适
export const notonsiderInterviewApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: `/interview/notonsider/${data.id}`,
    hasLoading
  })
}

// 全部面试
export const getInterviewHistoryApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/newHistory`,
    data,
    hasLoading
  })
}

// 获取日历面试数量（新）
export const getNewScheduleNumberApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/newScheduleNumber`,
    data,
    hasLoading: false
  })
}

// 面试历史（新）
export const getNewHistoryApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/interview/newHistory`,
    data,
    hasLoading
  })
}


// 获取当前招聘官职位类型列表
export const getPositionTypeListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/interviewTypeList`,
    data,
    hasLoading: false
  })
}

// 获取面试评价不合适理由
export const getCommentReasonApi = (data) => {
  return request({
    url: `/interview/getCommentReason`,
    method: 'get',
    hasLoading: false
  })
}

// 不合适面试撤回
export const interviewRetractApi = (data) => {
  return request({
    url: `/interview/interviewRetract/${data.id}`,
    method: 'put',
    data,
    hasLoading: false
  })
}


// 获取不合适评价内容
export const getInterviewCommentApi = (data) => {
  return request({
    url: `/interview/getInterviewComment`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 设置候选人是否到场
export const setInterviewAttendApi = (data) => {
  return request({
    url: `/interview/attend`,
    method: 'put',
    data,
    hasLoading: false
  })
}

// 面试评价(设置感兴趣)
export const setInterviewCommentApi = (data) => {
  return request({
    url: `/interview/interviewComment`,
    method: 'post',
    data,
    hasLoading: false
  })
}

// 设置推荐简历的不感兴趣 
export const setRecomResumeNotSuitApi = (data) => {
  return request({
    url: `/interview/setRecomResumeNotSuit/${data.jobhunterUid}`,
    method: 'put',
    data,
    hasLoading: false
  })
}

// 设置推荐简历的不感兴趣撤回 
export const resumeNotInterestRetractApi = (data) => {
  return request({
    url: `/interview/resumeNotInterestRetract/${data.jobhunterId}`,
    method: 'put',
    data,
    hasLoading: false
  })
}

// 获取推荐简历不合适理由
export const getResumeRecomdReasonApi = (data) => {
  return request({
    url: `/interview/getResumeRecomdReason`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 获取简历不感兴趣评价内容
export const getResumeRecomdCommentApi = (data) => {
  return request({
    url: `/interview/getResumeRecomdComment`,
    method: 'get',
    data,
    hasLoading: false
  })
}

// 获取底部蓝红点
export const getBottomRedDotApi = (data) => {
  return request({
    url: `/reddot/top_bar_info`,
    method: 'get',
    hasLoading: false
  })
}

// 获取面试蓝红点
export const getInterviewRedDotBarApi = (data) => {
  return request({
    url: `/interview/getInterviewRedDotInfo`,
    method: 'get',
    hasLoading: false
  })
}

// 清除红点
export const clearTabInterviewRedDotApi = (data) => {
  return request({
    url: `/interview/deleteTabRedDot`,
    method: 'put',
    data,
    hasLoading: false
  })
}

// 清除日程红点
export const clearDayInterviewRedDotApi = (data) => {
  return request({
    url: `/interview/deleteScheduleTabRedDot`,
    method: 'put',
    data,
    hasLoading: false
  })
}