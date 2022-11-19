<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mobile"
      v-model="drawer"
      fixed
      app
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <NuxtLink to="/" class="logo-link-draw" title="Home">
            <v-list-item-title class="title" v-text="title" />
          </NuxtLink>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="(item, i) in (user !== false ? LoggedinMenu : menu)"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :class="{ 'playlist-transparent': $nuxt.$route.name === 'playlist' }"
      color="#242424"
      elevation="0"
      fixed
      app
      dark
    >
      <v-app-bar-nav-icon v-show="$vuetify.breakpoint.mobile" @click.stop="drawer = !drawer" />
      <NuxtLink to="/" class="logo-link" title="Home">
        <v-toolbar-title class="logo" v-text="title" />
      </NuxtLink>

      <v-spacer />

      <v-btn
        v-for="(item, i) in (user !== false ? LoggedinMenu : menu)"
        v-show="!$vuetify.breakpoint.mobile"
        :key="i"
        :to="item.to"
        class="desktop-nav"
        router
        text
      >
        <v-icon>{{ item.icon }}</v-icon> {{ item.title }}
      </v-btn>

      <v-menu
        v-if="user !== false"
        min-width="200px"
        transition="slide-y-transition"
        nudge-bottom="3"
        nudge-left="6"
        offset-y
        bottom
        left
        attach
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="avatar-btn"
            icon
            v-on="on"
          >
            <v-avatar
              color="#242424"
              :size="$vuetify.breakpoint.mobile ? 32 : 35"
            >
              <v-img :src="user.avatar" aspect-ratio="1" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar
                id="avatar-in-menu-app-bar"
                color="#FFFFFF"
              >
                <v-img :src="user.avatar" aspect-ratio="1" />
              </v-avatar>
              <h3>{{ user.name }}</h3>
              <p id="email-in-menu-app-bar" class="caption mt-1 text--secondary d-inline-block text-truncate">
                {{ user.email }}
              </p>
              <v-divider />
              <v-btn
                :to="`/profile?id=${user.id}`"
                depressed
                block
                tile
                text
                large
                router
                exact
              >
                My profile
              </v-btn>
              <v-divider />
              <v-btn
                to="/settings"
                depressed
                block
                tile
                text
                large
                router
                exact
              >
                Settings
              </v-btn>
              <v-divider />
              <v-btn
                color="primary"
                depressed
                block
                tile
                text
                large
                @click="user_logout"
              >
                Logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script>
import logout from '../common/logout'

export default {
  name: 'Layout',
  data () {
    return {
      drawer: false,
      fixed: false,
      menu: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-information-outline',
          title: 'About',
          to: '/about'
        }
      ],
      LoggedinMenu: [
        {
          icon: 'mdi-compass',
          title: 'Explore',
          to: '/explore'
        },
        {
          icon: 'mdi-account-group',
          title: 'Match',
          to: '/match'
        },
        {
          icon: 'mdi-forum-outline',
          title: 'Chats',
          to: '/chat'
        },
        {
          icon: 'mdi-information-outline',
          title: 'About',
          to: '/about'
        }
      ],
      title: 'KMP'
    }
  },
  computed: {
    overlay () {
      return this.$store.state.overlay.open
    },
    user () {
      return this.$store.state.user.user
    }
  },
  methods: {
    user_logout () {
      logout(this)
    }
  }
}
</script>

<style lang="scss">
$color-pack: false;
@import '~vuetify/src/styles/main.sass';
body, div.v-application {
  background: #f9f9f9!important;
}
::-moz-selection {
  background: #FFC7BD;
}
::selection {
  background:  #FFC7BD;
}
header.v-toolbar.v-app-bar {
  user-select: none;
  .avatar-btn {
    margin-right: -5px!important;
    margin-left: 5px!important;
  }
  div.v-menu__content div.v-list-item__content {
    padding-bottom: 0!important;
  }
  #avatar-in-menu-app-bar {
    margin-bottom: 10px;
  }
  #email-in-menu-app-bar {
    width: 150px;
  }
}
.logo {
  font: {
    family: 'Quicksand', sans-serif;
    size: 1.5rem;
  }
  padding-left: 5px!important;
}
.title {
  font-family: 'Quicksand', sans-serif!important;
}
a.desktop-nav {
  margin-left: 5px;
  span > i {
    margin-right: 10px;
    opacity: .5;
  }
}
a.logo-link {
  color: white!important;
  text-decoration: none;
}
a.logo-link-draw {
  color: $theme-color!important;
  text-decoration: none;
  & > div.title {
    font: {
      family: 'Quicksand', sans-serif!important;
      size: 1.5rem!important;
    }
  }
}
a.hover-underline {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.snackbar-icon {
  margin-right: 10px;
}
div.v-item-group.v-tabs-items {
  background-color: transparent!important;
}
.long-table table {
  min-width: 600px;
}
div.v-card__text.card-text-with-input {
  padding-bottom: 0!important;
}
a.light-btn-on-bg, button.light-btn-on-bg {
  background-color: #ECECEC!important;
}
.playlist-transparent {
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  background-color: transparent!important;
}
</style>
