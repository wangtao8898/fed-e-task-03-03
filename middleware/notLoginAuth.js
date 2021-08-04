// 未登录验证
export default ({ store, redirect }) => {
  if (!store.state.user) {
    return redirect('/login')
  }
}