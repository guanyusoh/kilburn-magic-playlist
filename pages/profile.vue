<template>
  <div id="profile">
    <div v-if="userLoaded" :class="$vuetify.breakpoint.mdAndDown ? 'full-width' : ''" class="profile-left profile-block">
      <div>
        <div class="profile-container">
          <v-avatar
            :color="`#${profileUser.userDetail.color}`"
            :size="$vuetify.breakpoint.mdAndDown ? 120 : 170"
          >
            <v-img :src="profileUser.user.avatar.replace('s=80', 's=400')" aspect-ratio="1" />
          </v-avatar>
          <h2 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4 mt-3 mb-0' : 'text-h3 mt-5 mb-3'" class="d-inline-block text-truncate text-center">
            {{ profileUser.user.name }}
          </h2>
          <p class="text-subtitle-1 text-center mb-0">
            {{ profileUser.userDetail.bio }}
          </p>
        </div>
        <div class="bg-color" :style="{ backgroundColor: `#${profileUser.userDetail.color}` }" />
      </div>
    </div>
    <div v-if="userLoaded" :class="$vuetify.breakpoint.mdAndDown ? 'full-width' : ''" class="profile-right profile-block">
      <h1 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h3'" class="font-weight-bold">
        <v-btn v-if="parseInt($route.query.id) === user.id" fab color="primary" class="float-right">
          <v-icon large>
            mdi-plus
          </v-icon>
        </v-btn>
        {{ parseInt($route.query.id) === user.id ? 'My Playlists' : 'Playlists' }}
      </h1>
      <div :class="$vuetify.breakpoint.mdAndDown ? 'mt-10' : 'mt-12'">
        <v-card v-for="(item, index) in (parseInt($route.query.id) === user.id ? myPlaylists : playlists)" :key="`pop-user-${index}`" class="pl-item">
          <v-img
            class="white--text align-end"
            height="250px"
            gradient="to top, rgba(0, 0, 0, 0.6) 0%, transparent 72px"
            :src="item.cover"
          >
            <NuxtLink :to="`/playlist?id=${item.id}`" class="no-underline">
              <v-card-title>
                {{ item.name }}
                <v-spacer />
                <span class="note">
                  <v-icon small color="white">
                    mdi-music-note
                  </v-icon>
                  {{ item.songNum }}
                </span>
              </v-card-title>
            </NuxtLink>
          </v-img>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import logout from '../common/logout'

export default {
  name: 'Profile',
  middleware: 'auth',
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        avatar: ''
      },
      profileUser: {
        user: {
          id: '',
          name: '',
          email: '',
          avatar: ''
        },
        userDetail: {
          color: '212121',
          bio: ''
        }
      },
      myPlaylists: [
        {
          name: 'From spotify',
          songNum: 23,
          cover: 'https://i.scdn.co/image/ab6775700000ee8555c25988a6ac314394d3fbf5',
          id: 1
        },
        {
          name: 'My favorite',
          songNum: 21,
          cover: 'https://t.scdn.co/images/2adf91e7179a4e098834d630c74824b1.jpeg',
          id: 2
        },
        {
          name: 'Untitled Playlist',
          songNum: 12,
          cover: 'https://daily-mix.scdn.co/covers/daily_mix_search.png',
          id: 3
        }
      ],
      playlists: [
        {
          name: 'From spotify',
          songNum: 23,
          cover: 'https://i.scdn.co/image/ab6775700000ee8555c25988a6ac314394d3fbf5',
          id: 1
        },
        {
          name: 'Others',
          songNum: 12,
          cover: 'https://t.scdn.co/images/495fadcefe234607b14b2db3381f3f5d.jpeg',
          id: 2
        }
      ],
      userLoaded: false,
      snackbar: false,
      snackbarText: '',
      loadingData: false
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
    this.verifyAuth()
  },
  methods: {
    /**
     * Verify user's login
     */
    async verifyAuth () {
      this.loadingData = true
      this.$store.commit('overlay/set', true)

      let requestFailed = false
      const response = await this.$axios.$get('/api/verify/').catch(() => {
        this.$store.commit('overlay/set', false)
        requestFailed = true
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
        this.getUserInfo()
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.$store.commit('overlay/set', false)
          this.snackbarText = response.reason
          this.snackbar = false
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    async getUserInfo () {
      let requestFailed = false
      const response = await this.$axios.$get('/api/user/info/', {
        params: {
          id: parseInt(this.$route.query.id)
        }
      }).catch(() => {
        this.$store.commit('overlay/set', false)
        requestFailed = true
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
        this.profileUser = response.data
        this.loadingData = false
        this.userLoaded = true
        this.$store.commit('overlay/set', false)
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.$store.commit('overlay/set', false)
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
      title: this.profileUser.name
    }
  }
}
</script>

<style lang="scss" scoped>
.no-underline {
  color: white;
  text-decoration: none!important;
}
#profile {
  .profile-block {
    top: 0;
    min-height: 100%;
  }
  .profile-left {
    position: fixed;
    left: 0;
    width: 35%;
    height: 100%;
    background: {
      color: $theme-color-dark;
      image: url(~assets/img/login/background.jpg);
      size: cover;
      position: center center;
    }
    & > div {
      width: 100%;
      height: 100%;
      position: relative;
      .bg-color {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        opacity: .9;
        transition: .3s all;
      }
      .profile-container {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
        h2, p {
          width: 70%;
        }
        h2 {
          line-height: 3.5rem;
        }
        p {
          word-break: break-all;
        }
      }
    }
    &.full-width {
      position: absolute;
      height: 350px;
      width: 100%;
      min-height: 0;
    }
  }
  .profile-right {
    position: absolute;
    right: 0;
    width: 65%;
    padding: 50px;
    .connections-btn-icon {
      margin-right: 10px;
    }
    .profile-input {
      max-width: 400px;
    }
    .recommand-label {
      background-color: #e0e0e0;
      color: rgba(0, 0, 0, .6);
      padding: 5px 7px;
      margin-left: 5px;
      vertical-align: middle;
    }
    &.full-width {
      position: absolute;
      top: 350px;
      width: 100%;
      min-height: 0;
      padding: 30px 20px;
    }
  }
}
.card-relative {
  .card-btns {
    width: calc(100% - 48px);
    position: absolute;
    bottom: 20px;
  }
}
.card-text-loading {
  height: 170px;
  width: 280px;
  padding: 0!important;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: height .3s;
  span.device-tip {
    opacity: 0;
    height: 0;
    margin-top: 0!important;
    transition: height .3s, margin-top .3s, opacity .3s .3s;
    &.shown {
      opacity: 1;
      height: 22px;
      margin-top: 30px!important;
    }
  }
  &.shown-text {
    height: 200px;
  }
}
.pl-item {
  width: 250px;
  margin-right: 10px;
  margin-bottom: 10px;
  float: left;
  .note {
    display: inline-flex;
    align-items: center;
    color: white;
    opacity: .6;
    font-size: 17px;
    font-weight: normal;
    i {
      margin-right: 3px;
    }
  }
}
@media (max-width: 370px) {
  .dialog-icon-p {
    display: none;
  }
}
</style>
