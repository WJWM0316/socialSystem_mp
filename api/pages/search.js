import { request } from '../require.js'

// 搜索职位
export const getSearchPositionListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/es/position`,
    data,
    hasLoading: hasLoading
  })
}

// 搜索职位联想词
export const getSearchMatchListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/match/position`,
    data,
    hasLoading: hasLoading
  })
}

// 搜索机构联想词
export const getSearchMatchCompanyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/match/company`,
    data,
    hasLoading: hasLoading
  })
}

// 搜索机构列表
export const getCompanyListApi = (data, hasLoading) => {
  return request({
    method: 'get',
    url: `/search/es/company`,
    data,
    hasLoading: hasLoading
  })
}
