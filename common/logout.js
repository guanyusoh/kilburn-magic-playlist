import Vue from 'vue'

export default async (instance, expired = false) => {
  instance.$store.commit('overlay/set', true)
  let requestFailed = false
  const response = await instance.$axios.$get('/api/logout/').catch(() => {
    requestFailed = true
    instance.$store.commit('overlay/set', false)
    instance.snackbarText = 'Request failed.'
    instance.snackbar = false
    Vue.nextTick(() => {
      instance.snackbar = true
    })
  })

  // Request failed
  if (requestFailed) {
    return
  }

  instance.$store.commit('overlay/set', false)

  if (response.success) {
    // Success
    localStorage.removeItem('auth')
    localStorage.removeItem('user')
    instance.$store.commit('user/update', false)
    instance.$router.replace(`/${expired ? '?expired=true' : ''}`)
  } else {
    // Error
    if (response.reason === 'Unknown error.') {
      instance.snackbarText = response.reason
      instance.snackbar = false
      Vue.nextTick(() => {
        instance.snackbar = true
      })
    } else {
      localStorage.removeItem('auth')
      localStorage.removeItem('user')
      instance.$store.commit('user/update', false)
      instance.$router.replace(`/${expired ? '?expired=true' : ''}`)
    }
  }
}
