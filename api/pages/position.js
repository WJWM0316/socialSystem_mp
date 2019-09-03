import { request } from '../require.js'

// 职位列表
export const getPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/list',
    data,
    hasLoading: hasLoading
  })
}

// 获取推荐策略职位列表
export const getRecommendApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/recommend/oppty',
    data,
    hasLoading: hasLoading
  })
}

export const findMorePsListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/opportunity/more/${data.positionId}`,
    data,
    hasLoading: false
  })
}

// 职位列表
export const getfilterPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/surface',
    data,
    hasLoading: hasLoading
  })
}

// 招聘官的职位列表
export const getRecruiterPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/mylist',
    data,
    hasLoading: hasLoading
  })
}

export const getPositionListNumApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/statustotal',
    data,
    hasLoading: false
  })
}

// 创建职位
export const createPositionApi = (data, hasLoading) => {
  return request({
    method: 'post',
    url: '/position',
    data,
    hasLoading: hasLoading
  })
}

// 获取职位信息
export const getPositionApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/${data.id}`,
    data,
    hasLoading: hasLoading
  })
}

// 清除职位红点
export const getMyPositionApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/my_position/${data.id}`,
    hasLoading: hasLoading
  })
}

// 编辑职位信息
export const editPositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    hasLoading: hasLoading
  })
}

// 删除职位信息
export const deletePositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/${data.id}`,
    data,
    hasLoading: hasLoading
  })
}

// 获取经验数据列表
export const getPositionExperienceApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: '/position/experience',
    data,
    hasLoading: hasLoading
  })
}

// 关闭职位
export const closePositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/close/${data.id}`,
    data,
    hasLoading: hasLoading
  })
}

// 开放职位
export const openPositionApi = (data, hasLoading) => {
  return request({
    method: 'put',
    url: `/position/open/${data.id}`,
    data,
    hasLoading: hasLoading
  })
}

// 搜搜职位名称
export const getPositionNameListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/position`,
    data,
    hasLoading: hasLoading
  })
}

// 获取职业机会搜索记录
export const getPositionRecordApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/search`,
    data,
    hasLoading: false
  })
}

// 获取职业机会薪资范畴
export const getEmolumentApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/position/emolument`,
    data,
    hasLoading: false
  })
}
