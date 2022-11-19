export default [
  {
    url: '/api/login/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        token: '00000000000000000000000000000000',
        user: {
          id: 1,
          name: 'Bob',
          email: 'bob@example.com',
          avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
        }
      }
    },
    after: 1500
  },
  {
    url: '/api/register/',
    method: 'post',
    status: 200,
    response: {
      success: false,
      reason: 'This email is already linked to another account.'
    },
    after: 1500
  },
  {
    url: '/api/webauthn/auth_start/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        challenge: 'GUySObsa3MtxbXkyBeiBitvFgivCGdjKO4w2VpB2iGM',
        rpId: 'localhost',
        userVerification: 'discouraged',
        allowCredentials: [
          {
            type: 'public-key',
            id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
          }
        ],
        timeout: 60000
      }
    },
    after: 1500
  },
  {
    url: '/api/webauthn/auth/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        id: 1,
        token: '00000000000000000000000000000000',
        user: {
          name: 'Bob',
          email: 'bob@example.com',
          avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
        }
      }
    },
    after: 1500
  },
  {
    url: '/api/webauthn/reg_start/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        rp: {
          name: 'KMP',
          id: 'localhost'
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -257
          },
          {
            type: 'public-key',
            alg: -259
          },
          {
            type: 'public-key',
            alg: -7
          }
        ],
        challenge: 'UjBZNi9r_tvIDVavnL-Kw5ft_RiDSV_XzQ-sIQ-pMP4',
        attestation: 'none',
        user: {
          name: 'bob@example.com',
          displayName: 'Bob',
          icon: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80',
          id: 'ZjdlZWQ4MDExNDRmY2FYimVhN2UxZmNkZDQ2ZDYyOWFuYrBxZDg3NzU4ZmQxNzFkYTM5NjQ1NjkwNYveVrk5ZA=='
        },
        authenticatorSelection: {
          requireResidentKey: false,
          userVerification: 'discouraged'
        },
        excludeCredentials: [],
        timeout: 60000
      }
    },
    after: 1500
  },
  {
    url: '/api/webauthn/reg/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: [
        {
          name: 'Yubikey',
          usernameless: false,
          added: '2020-12-19 12:31',
          lastUsed: '2020-12-19 19:34',
          id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
        },
        {
          name: 'iPhone',
          usernameless: true,
          added: '2020-12-20 00:12',
          lastUsed: '2020-12-20 01:06',
          id: 'SwhUdK4Oz5CsxxUuHtLlSZCwdHR1PS0aqKGJSAFQndE'
        }
      ]
    },
    after: 1500
  },
  {
    url: '/api/webauthn/delete/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: [
        {
          name: 'Yubikey',
          usernameless: false,
          added: '2020-12-19 12:31',
          lastUsed: '2020-12-19 19:34',
          id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
        }
      ]
    },
    after: 1500
  },
  {
    url: '/api/webauthn/rename/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: [
        {
          name: 'Yubikey2',
          usernameless: false,
          added: '2020-12-19 12:31',
          lastUsed: '2020-12-19 19:34',
          id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
        },
        {
          name: 'iPhone',
          usernameless: true,
          added: '2020-12-20 00:12',
          lastUsed: '2020-12-20 01:06',
          id: 'SwhUdK4Oz5CsxxUuHtLlSZCwdHR1PS0aqKGJSAFQndE'
        }
      ]
    },
    after: 1500
  },
  {
    url: '/api/logout/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: []
    },
    after: 1500
  },
  {
    url: '/api/verify/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      reason: 'Login expired.',
      data: {
        id: 1,
        name: 'Bob',
        email: 'bob@example.com',
        avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
      }
    },
    after: 1500
  },
  {
    url: '/api/verify_password/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      reason: 'Incorrect password.',
      data: []
    },
    after: 1500
  },
  {
    url: '/api/user/info/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      reason: 'Login expired.',
      data: {
        user: {
          id: 1,
          name: 'Bob',
          email: 'bob@example.com',
          avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
        },
        userDetail: {
          bio: 'This is a test bio.',
          color: '242424',
          connections: {
            spotify: 'bob_test'
          },
          webauthn: [
            {
              name: 'Yubikey',
              usernameless: false,
              added: '2020-12-19 12:31',
              lastUsed: '2020-12-19 19:34',
              id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
            },
            {
              name: 'iPhone',
              usernameless: true,
              added: '2020-12-20 00:12',
              lastUsed: '2020-12-20 01:06',
              id: 'SwhUdK4Oz5CsxxUuHtLlSZCwdHR1PS0aqKGJSAFQndE'
            }
          ]
        }
      }
    },
    after: 500
  },
  {
    url: '/api/user/update/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      reason: 'Login expired.',
      data: {
        user: {
          id: 1,
          name: 'Bob',
          email: 'bob@example.com',
          avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
        },
        userDetail: {
          bio: 'This is a test bio.',
          color: '242424',
          connections: {
            spotify: 'bob_test'
          },
          webauthn: [
            {
              name: 'Yubikey',
              usernameless: false,
              added: '2020-12-19 12:31',
              lastUsed: '2020-12-19 19:34',
              id: 'SwhUdK4Oz5CsxxUoLtUlSZCwdHR1PS0aqKGJSAFQndE'
            },
            {
              name: 'iPhone',
              usernameless: true,
              added: '2020-12-20 00:12',
              lastUsed: '2020-12-20 01:06',
              id: 'SwhUdK4Oz5CsxxUuHtLlSZCwdHR1PS0aqKGJSAFQndE'
            }
          ]
        }
      }
    },
    after: 1500
  },
  {
    url: '/api/user/update_password/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        token: '00000000000000000000000000000000',
        user: {
          id: 1,
          name: 'Bob',
          email: 'bob@example.com',
          avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
        }
      }
    },
    after: 1500
  },
  {
    url: '/api/user/update_email/',
    method: 'post',
    status: 200,
    response: {
      success: true,
      data: {
        id: 1,
        name: 'Bob',
        email: 'bob@example.com',
        avatar: 'https://www.gravatar.com/avatar/f0f154fb57a5e08c56317106191cf766?d=retro&s=80'
      }
    },
    after: 1500
  },
  {
    url: '/api/user/delete/',
    method: 'post',
    status: 200,
    response: {
      success: false,
      reason: 'Incorrect password.'
    },
    after: 1500
  },
  {
    url: '/api/connect/spotify/start/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: {
        state: '12345678901234567890123456789012'
      }
    },
    after: 1500
  },
  {
    url: '/api/user/disconnect/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: {
        spotify: false
      }
    },
    after: 1500
  },
  {
    url: '/api/myPlaylist/getRecords/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: {
        songs: [{
          songId: 'a',
          title: 'A',
          artist: 'a',
          genre: 'None',
          year: 'None'
        },
        {
          songId: 'b',
          title: 'B',
          artist: 'b',
          genre: 'None',
          year: 'None'
        },
        {
          songId: 'c',
          title: 'C',
          artist: 'c',
          genre: 'None',
          year: 'None'
        }]
      }
    },
    after: 1500
  },
  {
    url: '/api/myPlaylist/getSongs/',
    method: 'get',
    status: 200,
    response: {
      success: true,
      data: {
        spotify: false,
        songs: [{
          songId: '6rqhFgbbKwnb9MLmUQDhG6',
          title: 'An example song',
          artist: 'A Man',
          genre: 'Alt Rock',
          year: '2001'
        },
        {
          songId: '8rqhFgnbKinb9MLvUQDhP2',
          title: 'Track B',
          artist: 'Bobsy B',
          genre: 'Blues',
          year: '1995'
        },
        {
          songId: '1rxwFybcKwfb5JLiUQPhK5',
          title: 'The C Record',
          artist: 'C.Charlie',
          genre: 'Classical',
          year: '1968'
        }]
      }
    },
    after: 1500
  },
  {
    url: '/api/myPlaylist/Update/',
    method: 'get',
    status: 200,
    response: {
      success: true
    },
    after: 1500
  }
]
