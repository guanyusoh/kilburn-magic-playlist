<template>
  <div class="about-container pa-2" :class="$vuetify.breakpoint.mdAndDown ? 'mt-3' : 'mt-12'">
    <h1 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h3'" class="font-weight-bold mb-3 text-center">
      About <span>KMP</span>
    </h1>
    <p class="text-center">
      Connect with music.
    </p>
    <h2 :class="$vuetify.breakpoint.mdAndDown ? 'text-h5' : 'text-h4'" class="font-weight-bold mt-12 text-center">
      Team Members
    </h2>
    <div class="mt-5 d-flex justify-start align-start flex-wrap">
      <v-card v-for="(i, index) in members" :key="index" class="ma-3 text-truncate member-card" :class="$vuetify.breakpoint.smAndDown ? 'pa-4 small' : 'pa-5'">
        <v-avatar
          :size="$vuetify.breakpoint.mdAndDown ? 70 : 120"
        >
          <v-img
            :src="require(`../assets/img/avatars/${i.avatar}`)"
            alt=""
          />
        </v-avatar>
        <span class="text-h6" :class="$vuetify.breakpoint.mdAndDown ? 'ml-3' : 'ml-5'">
          {{ i.name }}
        </span>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      user: false,
      members: [
        {
          name: 'Ruicheng Yao',
          avatar: 'ruicheng.jpg'
        },
        {
          name: 'Luc Tran',
          avatar: 'luc.jpg'
        },
        {
          name: 'Guan Yu Soh',
          avatar: 'guan.jpg'
        },
        {
          name: 'Adam Eltantawi Abdelhalim',
          avatar: 'adam.jpg'
        },
        {
          name: 'Ruben Bos',
          avatar: 'ruben.png'
        },
        {
          name: 'David Demetriad',
          avatar: 'david.jpg'
        },
        {
          name: 'Danilo Nerici',
          avatar: 'danilo.png'
        }
      ]
    }
  },
  mounted () {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user')) || false
    }
    if (this.user !== false) {
      this.$store.commit('user/update', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  h1 {
    span {
      font-family: 'Quicksand', sans-serif;
      color: $theme-color;
    }
  }
  .member-card {
    width: calc(50% - 24px);
    &.small {
      width: 100%;
    }
  }
}
::v-deep {
  .v-avatar {
    border-radius: 50%!important;
  }
}
</style>
