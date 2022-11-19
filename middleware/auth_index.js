export default function ({ redirect }) {
  // Manage storaged data
  if (!sessionStorage.getItem('pageid')) {
    sessionStorage.setItem('pageid', Date.now())
    if (localStorage.getItem('pagenum')) {
      localStorage.setItem('pagenum', parseInt(localStorage.getItem('pagenum')) + 1)
    } else {
      localStorage.setItem('pagenum', '1')
    }
    window.addEventListener('unload', () => {
      localStorage.setItem('pagenum', parseInt(localStorage.getItem('pagenum')) - 1)
      if (parseInt(localStorage.getItem('pagenum')) <= 0) {
        localStorage.removeItem('pagenum')
        localStorage.removeItem('auth')
        localStorage.removeItem('user')
      }
    })
  }
  if (!localStorage.getItem('pagenum')) {
    localStorage.setItem('pagenum', '1')
  }

  // If the user is not authenticated
  if (localStorage.getItem('auth') && localStorage.getItem('auth').length === 32) {
    return redirect('/explore')
  }
}
