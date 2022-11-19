<template>
  <div>
    <v-container v-if="loaded && !matched" class="matching">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          <h2 class="text-h4 mb-5">
            Loading your matches for today...
          </h2>
        </v-col>
        <v-col cols="3">
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="6"
          />
        </v-col>
      </v-row>
    </v-container>
    <div v-if="loaded && matched" class="matched">
      <flickity ref="flickity" :options="flickityOptions" class="matched-list">
        <div v-for="(item, index) in matchedUsers" :key="`matched-user-${index}`" class="matched-list-item">
          <v-avatar
            :size="180"
          >
            <v-img
              :src="item.avatar"
            />
          </v-avatar>
          <h2 class="text-h4 mt-7 text-truncate">
            {{ item.name }}
          </h2>
          <p class="text--disabled mt-3">
            {{ item.bio }}
          </p>
          <div class="song-list">
            <span v-for="(song, i) in item.songs" :key="i">
              {{ song.name }} - <span class="text--disabled">{{ song.artist }}</span>
            </span>
          </div>
          <div class="mt-12">
            <v-btn
              icon
              large
              nuxt
              color="primary"
              :to="`/profile?id=${item.id}`"
            >
              <v-icon large>
                mdi-information-outline
              </v-icon>
            </v-btn>

            <v-btn
              icon
              large
              nuxt
              color="primary"
              class="ml-4"
              :to="`/chat?id=${item.id}`"
            >
              <v-icon large>
                mdi-forum-outline
              </v-icon>
            </v-btn>
          </div>
        </div>
      </flickity>
      <div class="matched-title">
        <span>
          <span class="matches-title">We found <span>{{ matchedUsers.length }}</span> matches for you!</span><br>
          <span class="sub text--disabled">Matches will be updated once a day</span>
        </span>
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
import Flickity from 'vue-flickity'
import logout from '../common/logout'

export default {
  name: 'Match',
  middleware: 'auth',
  components: {
    Flickity
  },
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        avatar: ''
      },
      matchedUsers: [
        {
          name: 'Matt',
          avatar: 'https://secure.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60?size=180',
          bio: 'Doing something coool',
          songs: [
            {
              name: 'Status',
              artist: 'Ty Dolla $ign'
            },
            {
              name: 'Jojo',
              artist: 'Cliffbado'
            },
            {
              name: 'SO DONE',
              artist: 'The Kid LAROI'
            },
            {
              name: 'My Only One',
              artist: '鄭中基'
            },
            {
              name: 'Sweet Melody',
              artist: 'Little Mix'
            }
          ],
          id: 3
        },
        {
          name: 'Archibald Ward',
          avatar: 'https://secure.gravatar.com/userimage/5/ff5263e8c30557b57e64423ee8496e41?size=180',
          bio: 'Always dreaming, always exploring.',
          songs: [
            {
              name: 'SO DONE',
              artist: 'The Kid LAROI'
            },
            {
              name: 'Status',
              artist: 'Ty Dolla $ign'
            },
            {
              name: 'positions',
              artist: 'Ariana Grande'
            },
            {
              name: 'Sweet Melody',
              artist: 'Little Mix'
            },
            {
              name: 'Jojo',
              artist: 'Cliffbado'
            }
          ],
          id: 4
        },
        {
          name: 'RubenBos',
          avatar: 'https://www.gravatar.com/avatar/c3252645330852eea77850faf70cfb1f?d=retro&size=180',
          bio: 'this is my bio',
          songs: [
            {
              name: 'Sweet Melody',
              artist: 'Little Mix'
            },
            {
              name: 'SO DONE',
              artist: 'The Kid LAROI'
            },
            {
              name: '炎',
              artist: 'LISA'
            },
            {
              name: 'Dingga',
              artist: 'MAMAMOO'
            },
            {
              name: 'positions',
              artist: 'Ariana Grande'
            }
          ],
          id: 5
        }
      ],
      flickityOptions: {
        prevNextButtons: false,
        pageDots: true,
        wrapAround: false,
        freeScroll: false,
        adaptiveHeight: true,
        contain: true
      },
      loaded: false,
      matched: false,
      snackbar: false,
      snackbarText: ''
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
      title: 'Match'
    }
  }
}
</script>

<style lang="scss" scoped>
.matching {
  height: calc(100vh - 90px);
}
.matched {
  max-width: 1500px;
  margin: 0 auto;
  height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .matched-list {
    width: 500px;
    height: 100%;
    max-height: 700px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 20%), 0px 2px 2px 0px rgba(0, 0, 0, 14%), 0px 1px 5px 0px rgba(0, 0, 0, 12%);
    border-radius: 6px;
    background: #F3F3F3;
    .matched-list-item {
      width: 500px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        font-size: 18px;
      }
      .song-list {
        font-size: 20px;
        line-height: 30px;
        margin-top: 5px;
        & > span {
          display: block;
          text-align: center;
        }
      }
    }
  }
  .matched-title {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      span.matches-title {
        font-size: 50px;
        line-height: 50px;
        font-family: 'Quicksand', sans-serif;
        span {
          color: $theme-color;
        }
      }
      span.sub {
        font-size: 22px;
      }
    }
  }
}
::v-deep {
  .flickity-page-dots {
    bottom: -35px;
  }
}
</style>
