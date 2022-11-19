<template>
  <div>
    <div class="header">
      <div v-if="loaded" class="header-bg" :style="{ backgroundImage: 'url(../assets/img/cover/cover (8).jpg)' }" />
      <div class="header-mask" />
      <div v-if="loaded" class="header-title">
        <div>
          <h1 class="text-h3 font-weight-bold ">
            {{ title }}<br>
            <span>{{ songNum }} Songs • By {{ author }}</span>
          </h1>
        </div>
      </div>
    </div>
    <div v-if="loaded" class="playlist">
      <v-list
        two-line
      >
        <template v-for="(song, index) in songs">
          <v-list-item
            :key="index"
          >
            <v-list-item-avatar rounded>
              <v-img :src="song.cover" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ song.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ song.album }} - {{ song.artist }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="openDialog">
                <v-icon color="grey lighten-1">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-if="index < songs.length - 1"
            :key="`divider-${index}`"
          />
        </template>
      </v-list>
    </div>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarSuccess ? 'success' : 'primary'"
      multi-line
      app
      top
      right
    >
      <v-icon class="snackbar-icon">
        {{ snackbarSuccess ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
      </v-icon>
      {{ snackbarText }}
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Add to playlist
        </v-card-title>
        <v-card-text>
          <div v-if="loading" class="loading-pl mb-5 mt-10">
            <v-progress-circular
              :size="40"
              color="primary"
              indeterminate
            />
          </div>
          <v-radio-group
            v-else
            v-model="playlist"
            column
          >
            <v-radio
              label="From spotify"
              value="spotify"
              disabled
            />
            <v-radio
              label="My favorite"
              value="favorite"
            />
            <v-radio
              label="Untitled Playlist"
              value="untitled"
            />
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            :disabled="typeof playlist === 'undefined'"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import logout from '../common/logout'

export default {
  name: 'Match',
  middleware: 'auth',
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        avatar: ''
      },
      songs: [
        {
          name: 'See You In Life',
          cover: 'https://i.scdn.co/image/ab67616d0000485109c1a5542f9355cbb071e132',
          artist: 'Valentina Ploy',
          album: 'See You In Life'
        },
        {
          name: 'Be the One',
          cover: 'https://i.scdn.co/image/ab67616d000048511bfd2f370725916127556afa',
          artist: 'Y ARA',
          album: 'Space & Time'
        },
        {
          name: 'Love Me Like A',
          cover: 'https://i.scdn.co/image/ab67616d000048518263bbe1d38ff8a40ae04ec1',
          artist: 'RRILEY',
          album: 'Love Me Like A'
        },
        {
          name: 'All My Sins (feat. syd hartha)',
          cover: 'https://i.scdn.co/image/ab67616d0000485122b01d4747f1e1c90cda1559',
          artist: 'Sarah Barrios, syd hartha',
          album: 'All My Sins (feat. syd hartha)'
        },
        {
          name: 'Bad Boy',
          cover: 'https://i.scdn.co/image/ab67616d0000485190ee0d4d3906192283bae657',
          artist: 'CHUNG HA, Christopher',
          album: 'Bad Boy'
        },
        {
          name: 'Do You Love Me',
          cover: 'https://i.scdn.co/image/ab67616d00004851ee07f5d93ce85ea2013fc959',
          artist: 'Stephanie Poetri',
          album: 'Do You Love Me'
        },
        {
          name: 'Fresh Feelings (feat. J.Sheon)',
          cover: 'https://i.scdn.co/image/ab67616d00004851df6a815d085778e931342627',
          artist: 'Benjamin Kheng, J.Sheon',
          album: 'Fresh Feelings (feat. J.Sheon)'
        }
      ],
      playlist: undefined,
      dialog: false,
      loading: false,
      title: 'Feelin\' Myself',
      songNum: 7,
      author: 'RubenBos',
      loaded: false,
      snackbar: false,
      snackbarText: '',
      snackbarSuccess: false
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
  },
  methods: {
    openDialog () {
      this.dialog = true
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 2000)
    },
    save () {
      this.dialog = false
      setTimeout(() => {
        this.playlist = undefined
        this.snackbarText = 'Song added.'
        this.snackbarSuccess = true
        this.snackbar = false
        Vue.nextTick(() => {
          this.snackbar = true
        })
        setTimeout(() => {
          this.snackbarSuccess = false
        }, 5500)
      }, 500)
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
      title: 'Playlist'
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: -70px;
  left: 0;
  width: 100%;
  height: 500px;
  .header-bg {
    background-image: url('../assets/img/cover/cover (8).jpg');
    background-position: center bottom;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .header-mask {
    background-color: fade-out($color: #212121, $amount: .5);
    background-position: center bottom;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .header-title {
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    z-index: 3;
    div {
      width: 100%;
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      h1 {
        position: absolute;
        color: white;
        bottom: 40px;
        left: 0;
        line-height: 30px;
        z-index: 4;
        span {
          opacity: .5;
          font-size: 20px;
          font-weight: normal;
        }
      }
    }
  }
}
.playlist {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 440px;
}
.loading-pl {
  display: flex;
  justify-content: center;
}
::v-deep {
  .v-list {
    background-color: transparent;
    .v-list-item {
      padding: 0;
    }
  }
}
</style>
