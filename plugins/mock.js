if (process.env.NODE_ENV === 'development') {
  const MockAdapter = require('axios-mock-adapter')
  const axios = require('axios')
  const config = require('./mock_config')
  const mockAdapter = new MockAdapter(axios, { onNoMatch: 'passthrough' })

  for (const item of config.default) {
    if (item.method === 'get') {
      mockAdapter.onGet(item.url).reply(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve([item.status, item.response]), item.after)
        })
      })
    } else if (item.method === 'post') {
      mockAdapter.onPost(item.url).reply(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve([item.status, item.response]), item.after)
        })
      })
    }
  }
}
