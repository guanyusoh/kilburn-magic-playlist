<template>
  <v-app id="error-page" dark>
    <div id="flex-box-error-page">
      <h1>
        {{ error.statusCode }}
      </h1>
      <h2 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h2>
      <h2 v-else>
        {{ otherError }}
      </h2>
      <v-btn
        depressed
        color="primary"
        to="/"
        router
        exact
        x-large
        class="home"
      >
        <v-icon>mdi-home</v-icon> Home
      </v-btn>
    </div>
  </v-app>
</template>

<script>
import logout from '../common/logout'

export default {
  layout: 'empty',
  middleware: 'auth_error_page',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'Page Not Found',
      otherError: 'An error occurred'
    }
  },
  mounted () {
    // Get user info
    if (localStorage.getItem('user')) {
      try {
        this.user = JSON.parse(localStorage.getItem('user'))
      } catch {
        logout(this)
      }
      this.$store.commit('user/update', this.user)
    }
  },
  head () {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="scss">
#flex-box-error-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font: {
      family: 'Quicksand', sans-serif!important;
      size: 200px;
    }
  }
  h2 {
    font-size: 50px;
    transform: translateY(-40px);
  }
  .home {
    i {
      margin-right: 10px;
    }
  }
}
@media (max-width: 500px) {
  #flex-box-error-page {
    h1 {
      font-size: 150px;
    }
    h2 {
      font-size: 35px;
      transform: translateY(-30px);
    }
  }
}
@media (max-width: 370px) {
  #flex-box-error-page {
    h1 {
      font-size: 120px;
    }
    h2 {
      font-size: 30px;
      transform: translateY(-25px);
    }
  }
}
#error-page > div.v-application--wrap {
  min-height: calc(100vh - 88px);
}
</style>
