export default function ({ redirect }) {
  if (!sessionStorage.getItem('pageid')) {
    sessionStorage.setItem('pageid', Date.now())
    if (localStorage.getItem('pagenum')) {
      localStorage.setItem('pagenum', parseInt(localStorage.getItem('pagenum')) + 1)
    } else {
      localStorage.setItem('pagenum', '1')
    }
    document.addEventListener('unload', (e) => {
      localStorage.setItem('pagenum', parseInt(localStorage.getItem('pagenum')) - 1)
      if (localStorage.getItem('pagenum') === '0') {
        localStorage.removeItem('pagenum')
        localStorage.removeItem('auth')
        localStorage.removeItem('user')
      }
    })
  }
  if (!localStorage.getItem('pagenum')) {
    localStorage.setItem('pagenum', '1')
  }
}
