export default function ({ $axios }) {
  $axios.onRequest((config) => {
    if (localStorage.getItem('auth') && localStorage.getItem('auth').length === 32) {
      config.headers.common.auth = localStorage.getItem('auth')
      config.headers.common.authkey = JSON.parse(localStorage.getItem('user')).id
    }
  })
}
