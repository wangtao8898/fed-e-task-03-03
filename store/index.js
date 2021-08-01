const cookieparser = process.server ? require('cookieparser') : undefined

const state = () => {
  return {
    user: null
  }
}

const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

const actions = {
  // 初始化Vuex以及传递给客户端数据
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (e) {

      }
    }
    commit('setUser', user)
  }
}

export {
  state,
  mutations,
  actions
}