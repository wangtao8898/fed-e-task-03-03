import { request } from '@/plugins/request'

// 登录
export const login = data => {
  return request({
    method: 'post',
    url: '/api/users/login',
    data
  })
}

// 注册
export const register = data => {
  return request({
    method: 'post',
    url: '/api/users',
    data
  })
}

// 关注
export const follow = username => {
  return request({
    method: 'post',
    url: `/api/profiles/${username}/follow`
  })
}

// 取消关注
export const unFollow = username => {
  return request({
    method: 'delete',
    url: `/api/profiles/${username}/follow`
  })
}

// 获取用户信息
export const getProfile = username => {
  return request({
    method: 'get',
    url: `/api/profiles/${username}`
  })
}

// 获取当前登录用户信息
export const getCurrentUser = () => {
  return request({
    method: 'get',
    url: '/api/user'
  })
}

// 更新用户信息
export const updateUser = data => {
  return request({
    method: 'put',
    url: '/api/user',
    data
  })
}