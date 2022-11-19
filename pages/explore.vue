<template>
  <div>
    <div id="match-now" class="mt-6">
      <div class="match-title mx-15">
        <div>
          Match<br><span>Now!</span>
        </div>
        <v-btn
          color="primary"
          to="/match"
          nuxt
          depressed
          x-large
        >
          Go Match
        </v-btn>
      </div>
      <div v-if="loaded" class="matched-list">
        <h2 class="text-h5 font-weight-bold ml-15 mb-3">
          Your Matched Users
        </h2>
        <div class="pl-15 pr-10">
          <v-card v-for="(item, index) in matchedUsers" :key="`matched-user-${index}`" class="matched-user pa-6">
            <v-avatar
              :size="70"
            >
              <v-img
                :src="item.avatar"
              />
            </v-avatar>
            <div class="user-name ml-3">
              <v-card-title class="text-truncate">
                {{ item.name }}
              </v-card-title>

              <v-card-subtitle>
                <v-icon class="mr-1" small>
                  mdi-message-outline
                </v-icon>
                {{ item.lastMessage }}
              </v-card-subtitle>
            </div>
            <v-btn
              icon
              large
              nuxt
              color="primary"
              :to="`/chat?id=${item.id}`"
            >
              <v-icon>
                mdi-forum-outline
              </v-icon>
            </v-btn>
          </v-card>
        </div>
      </div>
      <v-icon class="background-icon">
        mdi-account-group
      </v-icon>
    </div>
    <div v-if="loaded" id="popular-user" class="mt-15">
      <h1 class="text-h3 font-weight-bold mb-6">
        <v-btn
          icon
          large
          class="float-right mt-2 ml-1"
          @click="nextUser()"
        >
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-btn
          icon
          large
          class="float-right mt-2"
          @click="previousUser()"
        >
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        Popular Users
      </h1>
      <flickity ref="flickityUser" :options="flickityOptions" class="popular-user-list">
        <v-card v-for="(item, index) in popularUsers" :key="`pop-user-${index}`" class="carousel-cell">
          <v-img
            class="white--text align-end"
            height="300px"
            gradient="to top, rgba(0, 0, 0, 0.6) 0%, transparent 72px"
            :src="item.avatar"
          >
            <v-card-title>{{ item.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">
            {{ item.playlistNum }} Playlists
          </v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{ item.bio }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              icon
              nuxt
              color="primary"
              :to="`/profile?id=${item.id}`"
            >
              <v-icon>
                mdi-information-outline
              </v-icon>
            </v-btn>

            <v-btn
              icon
              nuxt
              color="primary"
              class="mr-3"
              :to="`/chat?id=${item.id}`"
            >
              <v-icon>
                mdi-forum-outline
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </flickity>
    </div>
    <div v-if="loaded" id="popular-playlist" class="mt-15">
      <h1 class="text-h3 font-weight-bold mb-6">
        <v-btn
          icon
          large
          class="float-right mt-2 ml-1"
          @click="nextPlaylist()"
        >
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-btn
          icon
          large
          class="float-right mt-2"
          @click="previousPlaylist()"
        >
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        Popular Playlists
      </h1>
      <flickity ref="flickityPlaylist" :options="flickityOptions" class="popular-user-list">
        <v-card v-for="(item, index) in popularPlaylists" :key="`pop-user-${index}`" class="carousel-cell">
          <v-img
            class="white--text align-end"
            height="300px"
            gradient="to top, rgba(0, 0, 0, 0.6) 0%, transparent 72px"
            :src="require(`../assets/img/cover/cover (${index + 1}).jpg`)"
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
      </flickity>
    </div>
    <div v-if="loaded" id="top-songs" class="mt-15">
      <h1 class="text-h3 font-weight-bold mb-6">
        <v-btn
          icon
          large
          class="float-right mt-2 ml-1"
          @click="nextSong()"
        >
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-btn
          icon
          large
          class="float-right mt-2"
          @click="previousSong()"
        >
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        Top Songs
      </h1>
      <flickity ref="flickitySong" :options="flickityOptions" class="popular-user-list">
        <v-card v-for="(item, index) in topSongs" :key="`pop-user-${index}`" class="carousel-cell">
          <v-img
            class="white--text align-end"
            height="300px"
            gradient="to top, rgba(0, 0, 0, 0.6) 0%, transparent 72px"
            :src="item.cover"
          >
            <v-card-title>
              {{ item.name }}
              <v-spacer />
              <v-btn small icon dark class="add-btn" @click="openDialog">
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle class="artist-name">
              <span class="note float-right">
                <v-icon small color="white">
                  mdi-playlist-music
                </v-icon>
                {{ item.added }}
              </span>
              {{ item.artist }}
            </v-card-subtitle>
          </v-img>
        </v-card>
      </flickity>
    </div>
    <div v-if="loaded" id="my-settings" class="mt-6">
      <div class="settings-title">
        <div>
          Update your settings
          <br>
          <span>To make matching easier</span>
        </div>
        <v-btn
          color="primary"
          to="/settings"
          nuxt
          depressed
          x-large
        >
          My Settings
        </v-btn>
      </div>
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
import Flickity from 'vue-flickity'
import logout from '../common/logout'

export default {
  name: 'Explore',
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
      loaded: false,
      matchedUsers: [
        {
          name: 'Matt',
          avatar: 'https://secure.gravatar.com/avatar/767fc9c115a1b989744c755db47feb60',
          lastMessage: 'Hi there!',
          id: 3
        },
        {
          name: 'Archibald Ward',
          avatar: 'https://secure.gravatar.com/userimage/5/ff5263e8c30557b57e64423ee8496e41',
          lastMessage: 'How\'s things going?',
          id: 4
        },
        {
          name: 'RubenBos',
          avatar: 'https://www.gravatar.com/avatar/c3252645330852eea77850faf70cfb1f?d=retro',
          lastMessage: 'Wow thats awesome!',
          id: 5
        },
        {
          name: 'Joyce Malory',
          avatar: 'https://www.gravatar.com/avatar/6bb98abeb33586c74adbfd314a77e6cb',
          lastMessage: 'I love this song tooooooo',
          id: 6
        },
        {
          name: 'Steven Victor',
          avatar: 'https://www.gravatar.com/avatar/235e6383bad4ce15b370ab9771e204e8',
          lastMessage: 'c u later!',
          id: 8
        }
      ],
      popularUsers: [
        {
          name: 'Steven Victor',
          avatar: 'https://www.gravatar.com/avatar/235e6383bad4ce15b370ab9771e204e8?size=300',
          bio: 'Everything is hard before it\'s easy.',
          playlistNum: 3,
          id: 8
        },
        {
          name: 'Brandon More',
          avatar: 'https://www.gravatar.com/avatar/aebb383786818e453a241206a76a013f?size=300',
          bio: 'I had a bio before...',
          playlistNum: 6,
          id: 12
        },
        {
          name: 'Joyce Malory',
          avatar: 'https://www.gravatar.com/avatar/6bb98abeb33586c74adbfd314a77e6cb?size=300',
          bio: 'Arsenal. Wales. Music. Postman.',
          playlistNum: 4,
          id: 6
        },
        {
          name: 'RubenBos',
          avatar: 'https://www.gravatar.com/avatar/c3252645330852eea77850faf70cfb1f?d=retro&size=300',
          bio: 'this is my bio',
          playlistNum: 2,
          id: 5
        },
        {
          name: 'Armstrong Locke',
          avatar: 'https://www.gravatar.com/avatar/2190158261b87d651494ae5dbbb17ec1?size=300',
          bio: 'the moon is always full',
          playlistNum: 2,
          id: 11
        },
        {
          name: 'Hannah Eveline',
          avatar: 'https://www.gravatar.com/avatar/5dad2bf9f3c581ed78348d025108e9e9?size=300',
          bio: '🤔🤔🤔',
          playlistNum: 10,
          id: 10
        },
        {
          name: 'Marvin Minnie',
          avatar: 'https://www.gravatar.com/avatar/dc75b1021b41486d062ff0285fb94749?size=300',
          bio: 'Preferred: Chinese & English',
          playlistNum: 3,
          id: 15
        }
      ],
      popularPlaylists: [
        {
          name: 'Young, Wild & Free',
          songNum: 23,
          id: 1
        },
        {
          name: 'For Lovers',
          songNum: 21,
          id: 2
        },
        {
          name: 'Sound from nature',
          songNum: 12,
          id: 3
        },
        {
          name: 'Lo-Fi Beats For You',
          songNum: 15,
          id: 4
        },
        {
          name: 'LETS DO NAP',
          songNum: 9,
          id: 5
        },
        {
          name: 'Deep Focus',
          songNum: 24,
          id: 6
        },
        {
          name: 'GO GO OUT',
          songNum: 12,
          id: 7
        },
        {
          name: 'Feelin\' Myself',
          songNum: 7,
          id: 8
        }
      ],
      topSongs: [
        {
          name: 'Status',
          cover: 'https://i.scdn.co/image/ab67616d0000b2739b6cff14d6cdf4b6a2be3a4f',
          artist: 'Ty Dolla $ign',
          added: 25,
          id: 1
        },
        {
          name: 'Light a Flame',
          cover: 'https://i.scdn.co/image/ab67616d00001e02aa12f5b5b2ea88f26ab76846',
          artist: 'SEVENTEEN',
          added: 23,
          id: 2
        },
        {
          name: 'SO DONE',
          cover: 'https://i.scdn.co/image/ab67616d00001e02e59aad3262c3ca9107ca5c2f',
          artist: 'The Kid LAROI',
          added: 20,
          id: 3
        },
        {
          name: 'Sure Banker',
          cover: 'https://i.scdn.co/image/ab67616d00001e024473e0772461f9fea213307c',
          artist: 'TUFANZY',
          added: 16,
          id: 4
        },
        {
          name: 'Jojo',
          cover: 'https://i.scdn.co/image/ab67616d00001e02a206c770ae134a759ccef4fe',
          artist: 'Cliffbado',
          added: 18,
          id: 5
        },
        {
          name: 'My Only One',
          cover: 'https://i.scdn.co/image/ab67616d00001e020680df19853d82da98753bde',
          artist: '鄭中基',
          added: 15,
          id: 6
        },
        {
          name: 'Sweet Melody',
          cover: 'https://i.scdn.co/image/ab67616d00001e02d8bd7cd17c4d1c97f445b184',
          artist: 'Little Mix',
          added: 14,
          id: 7
        }
      ],
      flickityOptions: {
        prevNextButtons: false,
        pageDots: false,
        wrapAround: false,
        freeScroll: true,
        adaptiveHeight: true,
        contain: true,
        freeScrollFriction: 0.1
      },
      playlist: undefined,
      dialog: false,
      loading: false,
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
    nextUser () {
      this.$refs.flickityUser.next()
    },
    previousUser () {
      this.$refs.flickityUser.previous()
    },
    nextPlaylist () {
      this.$refs.flickityPlaylist.next()
    },
    previousPlaylist () {
      this.$refs.flickityPlaylist.previous()
    },
    nextSong () {
      this.$refs.flickitySong.next()
    },
    previousSong () {
      this.$refs.flickitySong.previous()
    },
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
      title: 'Explore'
    }
  }
}
</script>

<style lang="scss" scoped>
.no-underline {
  color: white;
  text-decoration: none!important;
}
#match-now {
  max-width: 1500px;
  margin: 0 auto;
  background-color: #ffe5e4;
  border-radius: 10px;
  height: 500px;
  position: relative;
  overflow: hidden;
  .match-title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: calc(100% - 120px);
    height: 63%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 80px;
    line-height: 75px;
    font-family: 'Quicksand', sans-serif;
    z-index: 1;
    span {
      color: $theme-color;
    }
  }
  .matched-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 37%;
    z-index: 1;
    h2 {
      opacity: .7;
    }
    & > div {
      overflow: hidden;
      overflow-x: auto;
      white-space: nowrap;
      .matched-user {
        display: inline-flex;
        width: 400px;
        margin-right: 10px;
        margin-bottom: 6px;
        align-items: center;
        .user-name {
          flex-grow: 1;
        }
      }
    }
  }
  .background-icon {
    position: absolute;
    bottom: -140px;
    right: -110px;
    font-size: 800px;
    opacity: .1;
    z-index: 0;
    pointer-events: none;
  }
}
#popular-user {
  max-width: 1500px;
  margin: 0 auto;
  .carousel-cell {
    width: 300px;
    margin-right: 10px;
  }
}
#popular-playlist {
  max-width: 1500px;
  margin: 0 auto;
  .carousel-cell {
    width: 300px;
    margin-right: 10px;
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
}
#top-songs {
  max-width: 1500px;
  margin: 0 auto;
  .add-btn {
    margin-right: -5px;
  }
  .carousel-cell {
    width: 300px;
    margin-right: 10px;
    .artist-name {
      color: white;
      opacity: .6;
      .note {
        display: inline-flex;
        align-items: center;
        color: white;
        font-size: 17px;
        font-weight: normal;
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
#my-settings {
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
  margin-left: -12px;
  margin-right: -12px;
  margin-bottom: -12px;
  .settings-title {
    max-width: 1500px;
    margin: 0 auto;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 60px;
    line-height: 55px;
    font-family: 'Quicksand', sans-serif;
    z-index: 1;
    span {
      font-size: 35px;
      opacity: .4;
    }
  }
}
.loading-pl {
  display: flex;
  justify-content: center;
}
::v-deep {
  .v-avatar {
    border-radius: 50%!important;
  }
  #match-now {
    .matched-list {
      & > div {
        .matched-user {
          .user-name {
            .v-card__title {
              padding-top: 0;
            }
            .v-card__subtitle {
              padding-bottom: 0;
            }
          }
        }
      }
    }
  }
  #popular-user, #popular-playlist, #top-songs {
    .flickity-viewport {
      overflow: visible;
    }
  }
}
</style>
