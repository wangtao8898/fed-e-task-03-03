import { request } from '@/plugins/request'

// 获取公共文章列表
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/api/articles',
    params
  })
}

// 获取关注文章列表
export const getFeedArticles = params => {
  return request({
    method: 'get',
    url: '/api/articles/feed',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'post',
    url: `/api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'delete',
    url: `/api/articles/${slug}/favorite`
  })
}

// 获取文章详情
export const getArticleDetail = slug => {
  return request({
    method: 'get',
    url: `/api/articles/${slug}`
  })
}

// 获取文章评论
export const getArticleComments = slug => {
  return request({
    method: 'get',
    url: `/api/articles/${slug}/comments`
  })
}

// 添加文章评论
export const addArticleComment = (slug, data) => {
  return request({
    method: 'post',
    url: `/api/articles/${slug}/comments`,
    data
  })
}