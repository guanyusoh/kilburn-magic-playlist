<template>
  <div>
    <div class="chat-list">
      <v-list v-if="loaded" dark>
        <v-list-item-group v-model="selectedChat">
          <template v-for="(item, index) in matchedUsers">
            <v-list-item
              :key="index"
              class="py-2"
            >
              <v-list-item-avatar>
                <v-img :src="item.avatar" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle><span>{{ item.lastMessageTime }} - </span>{{ item.lastMessage }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="chat-content">
      <div v-if="!(typeof selectedChat === 'undefined') && loaded" class="content">
        <div v-for="(message, messageIndex) in (typeof selectedChat === 'undefined' ? [] : reversedArray)" :key="`message-${messageIndex}`" class="message" :class="`message-${message.type}`">
          <v-avatar :size="56">
            <v-img :src="message.type === 'me' ? user.avatar : matchedUsers[selectedChat].avatar" />
          </v-avatar>
          <div class="message-text" v-text="message.content" />
        </div>
      </div>
      <div v-if="!(typeof selectedChat === 'undefined') && loaded" class="inputs-bg" />
      <div v-if="!(typeof selectedChat === 'undefined') && loaded" class="inputs">
        <v-btn
          icon
          large
          nuxt
          color="gray"
          :to="`/profile?id=${matchedUsers[selectedChat].id}`"
        >
          <v-icon large>
            mdi-information-outline
          </v-icon>
        </v-btn>
        <v-textarea
          v-model="input"
          name="main-input"
          solo
          auto-grow
          rounded
          hide-details
          rows="1"
          placeholder="Text..."
          class="mx-5"
        />
        <v-btn
          fab
          dark
          color="primary"
          @click="send"
        >
          <v-icon dark>
            mdi-send
          </v-icon>
        </v-btn>
      </div>
      <div v-else class="empty text--disabled text-h5">
        Select a chat to start
      </div>
    </div>
    <v-snackbar
      v-model="snackbar"
      color="primary"
      multi-line
      app
      top
      right
    >
      <v-icon class="snackbar-icon">
        mdi-close-circle-outline
      </v-icon>
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'
import logout from '../common/logout'

export default {
  name: 'Chat',
  middleware: 'auth',
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        avatar: ''
      },
      selectedChat: undefined,
      input: '',
      matchedUsers: [
        {
          name: 'Matt',
          avatar: 'https://secure.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60',
          lastMessageTime: '8:36',
          lastMessage: 'Hi there!',
          messages: [
            {
              type: 'others',
              content: 'Hi there!'
            }
          ],
          id: 3
        },
        {
          name: 'Archibald Ward',
          avatar: 'https://secure.gravatar.com/userimage/5/ff5263e8c30557b57e64423ee8496e41',
          lastMessageTime: '6:47',
          lastMessage: 'How\'s things going?',
          messages: [
            {
              type: 'others',
              content: 'hi bro'
            },
            {
              type: 'me',
              content: 'hi! time flies right?'
            },
            {
              type: 'others',
              content: 'How\'s things going?'
            }
          ],
          id: 4
        },
        {
          name: 'RubenBos',
          avatar: 'https://www.gravatar.com/avatar/c3252645330852eea77850faf70cfb1f?d=retro',
          lastMessageTime: 'yesterday',
          lastMessage: 'Wow thats awesome!',
          messages: [
            {
              type: 'me',
              content: 'hi'
            },
            {
              type: 'me',
              content: 'i found your account by daliy match'
            },
            {
              type: 'me',
              content: 'looks like we both like onerepublic'
            },
            {
              type: 'me',
              content: 'it\'s one of my favorite bands'
            },
            {
              type: 'others',
              content: 'yeahhhhh! they are great'
            },
            {
              type: 'others',
              content: 'I love them tooo'
            },
            {
              type: 'others',
              content: 'btw'
            },
            {
              type: 'others',
              content: 'Do u know other bands'
            },
            {
              type: 'others',
              content: 'like imagine dragons?'
            },
            {
              type: 'me',
              content: 'yeah of course'
            },
            {
              type: 'me',
              content: 'whatever it takes'
            },
            {
              type: 'me',
              content: 'that\'s my favorite'
            },
            {
              type: 'me',
              content: 'u can listen to it if u haven\'t'
            },
            {
              type: 'others',
              content: 'Wow thats awesome!'
            }
          ],
          id: 5
        },
        {
          name: 'Joyce Malory',
          avatar: 'https://www.gravatar.com/avatar/6bb98abeb33586c74adbfd314a77e6cb',
          lastMessageTime: 'yesterday',
          lastMessage: 'I love this song tooooooo',
          messages: [
            {
              type: 'others',
              content: 'Hiiiii~ i\'m from daliy matching'
            },
            {
              type: 'me',
              content: 'hi there'
            },
            {
              type: 'others',
              content: 'u like the piano guys as well?'
            },
            {
              type: 'others',
              content: 'that\'s cool'
            },
            {
              type: 'me',
              content: 'yeah! what\'t ur favorite song?'
            },
            {
              type: 'others',
              content: 'thats \'tour de france\''
            },
            {
              type: 'me',
              content: 'I love this song tooooooo'
            }
          ],
          id: 6
        },
        {
          name: 'Steven Victor',
          avatar: 'https://www.gravatar.com/avatar/235e6383bad4ce15b370ab9771e204e8',
          lastMessageTime: '2 days ago',
          lastMessage: 'c u later!',
          messages: [
            {
              type: 'others',
              content: 'hey bro don\'t forget today\'s music meeting'
            },
            {
              type: 'me',
              content: 'oh right'
            },
            {
              type: 'me',
              content: 'got it'
            },
            {
              type: 'others',
              content: 'c u later'
            },
            {
              type: 'me',
              content: 'c u later!'
            }
          ],
          id: 8
        }
      ],
      loaded: false,
      matched: false,
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {
    reversedArray () {
      return this.matchedUsers[this.selectedChat].messages.slice(0).reverse()
    }
  },
  watch: {
    selectedChat () {
      this.input = ''
    }
  },
  mounted () {
    // Verify user info
    if (localStorage.getItem('user')) {
      try {
        this.user = JSON.parse(localStorage.getItem('user'))
      } catch {
        logout(this)
      }
      this.$store.commit('user/update', this.user)
    } else {
      logout(this)
    }
    // Verify login
    this.$store.commit('overlay/set', true)
    this.verifyAuth()

    const chatId = parseInt(this.$route.query.id)
    for (let i = 0; i < this.matchedUsers.length; i++) {
      if (this.matchedUsers[i].id === chatId) {
        this.selectedChat = i
        break
      }
    }
  },
  methods: {
    send () {
      if (this.input.trim() === '') {
        return
      }
      this.matchedUsers[this.selectedChat].messages.push({
        type: 'me',
        content: this.input.trim()
      })
      this.input = ''
    },
    /**
     * Verify user's login
     */
    async verifyAuth () {
      let requestFailed = false
      const response = await this.$axios.$get('/api/verify/').catch(() => {
        requestFailed = true
        this.$store.commit('overlay/set', false)
        this.loaded = true
        this.snackbarText = 'Request failed.'
        this.snackbar = false
        Vue.nextTick(() => {
          this.snackbar = true
        })
      })

      // Request failed
      if (requestFailed) {
        return
      }

      if (response.success) {
        // Success
        localStorage.setItem('user', JSON.stringify(response.data))
        this.$store.commit('user/update', response.data)
        this.user = response.data
        this.$store.commit('overlay/set', false)
        this.loaded = true
        setTimeout(() => {
          this.matched = true
        }, 3000)
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.$store.commit('overlay/set', false)
          this.loaded = true
          this.snackbarText = response.reason
          this.snackbar = false
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    }
  },
  head () {
    return {
      title: 'Chat'
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-list {
    position: absolute;
    left: 0;
    width: 400px;
    background-color: #1E1E1E;
    overflow: auto;
    z-index: 1;
    bottom: 0;
    height: 100vh;
    padding-top: 56px;
}
.chat-content {
    position: absolute;
    right: 0;
    width: calc(100vw - 417px);
    overflow: auto;
    z-index: 1;
    bottom: 0;
    height: 100vh;
    padding-top: 64px;
    .empty {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
    .content {
      display: flex;
      flex-direction: column-reverse;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: calc(100% - 64px);
      overflow: auto;
      z-index: 1;
      padding-bottom: 120px;
      &::-webkit-scrollbar {
        width: 0;
      }
      .message {
        height: 70px;
        display: flex;
        align-items: center;
        width: 90%;
        margin: 0 auto;
        padding-top: 30px;
        .message-text {
          white-space: pre;
          border-radius: 16px;
          padding: 12px 18px;
          font-size: 18px;
        }
      }
      .message-me {
        flex-direction: row-reverse;
        .message-text {
          border-bottom-right-radius: 0px;
          background-color: $theme-color;
          margin-right: 20px;
          color: white;
        }
      }
      .message-others {
        flex-direction: row;
        .message-text {
          border-bottom-left-radius: 0px;
          margin-left: 20px;
          background-color: #EEEEEE;
        }
      }
    }
    .inputs {
      position: absolute;
      bottom: 0;
      right: 5%;
      width: 90%;
      display: flex;
      align-items: center;
      flex-direction: row;
      padding: 20px 0;
      z-index: 3;
    }
    .inputs-bg {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100px;
      z-index: 2;
      background-image: linear-gradient(to top, #F9F9F9 30%, transparent 100%);
    }
}
::v-deep {
  .v-list-item__subtitle {
    span {
      opacity: .5;
    }
  }
}
</style>
