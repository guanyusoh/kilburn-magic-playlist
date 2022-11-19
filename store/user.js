export const state = () => ({
  user: false
})

export const mutations = {
  update (state, user) {
    state.user = user
  }
}
