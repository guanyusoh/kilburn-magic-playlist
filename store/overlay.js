export const state = () => ({
  open: false
})

export const mutations = {
  set (state, overlay) {
    state.open = overlay
  }
}
