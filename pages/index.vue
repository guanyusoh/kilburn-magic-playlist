<template>
  <div>
    <div class="login-block login-block-right" :class="$vuetify.breakpoint.mdAndDown ? 'login-block-full' : ''">
      <div class="flip-parent" :class="login ? '' : 'back'">
        <div class="login-parent form-parent">
          <v-card
            id="login-form"
            :class="$vuetify.breakpoint.xs ? '' : 'login-form-large'"
            width="90%"
            max-width="500px"
            min-width="290px"
          >
            <v-card-text>
              <div class="welcome">
                Welcome back
              </div>
              <p class="display-1 text--primary login-text">
                Login to <span>KMP</span>
              </p>
              <v-form ref="loginForm" v-model="validLogin" @submit.self.prevent>
                <v-text-field
                  ref="loginEmail"
                  v-model="email"
                  :rules="emailRules"
                  :readonly="loggingIn || loggingInPasswordless || registering"
                  label="Email"
                  prepend-inner-icon="mdi-account"
                  validate-on-blur
                  filled
                  required
                  @keydown.enter="doLogin"
                />
                <v-text-field
                  ref="loginPassword"
                  v-model="password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordRules"
                  :readonly="loggingIn || loggingInPasswordless || registering"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  validate-on-blur
                  filled
                  required
                  @keydown.enter="doLogin"
                  @click:append="showPassword = !showPassword"
                />
                <v-btn
                  :loading="loggingIn"
                  :disabled="loggingIn || loggingInPasswordless || registering"
                  color="primary"
                  depressed
                  block
                  x-large
                  @click="doLogin"
                >
                  Login
                </v-btn>
              </v-form>
              <v-divider v-if="supportWebAuthn" class="divider" />
              <v-btn
                v-if="supportWebAuthn"
                :loading="loggingInPasswordless"
                :disabled="loggingIn || loggingInPasswordless || registering"
                outlined
                block
                x-large
                @click="startPasswordlessLogin"
              >
                <v-icon>mdi-fingerprint</v-icon> Passwordless Login
              </v-btn>
              <p class="not-registered">
                Not registered yet? <span @click="toggleForm">Register now</span>
              </p>
            </v-card-text>
          </v-card>
        </div>
        <div class="register-parent form-parent">
          <v-card
            id="register-form"
            :class="$vuetify.breakpoint.xs ? '' : 'register-form-large'"
            width="90%"
            max-width="500px"
            min-width="290px"
          >
            <v-card-text>
              <div class="welcome">
                Welcome
              </div>
              <p class="display-1 text--primary register-text">
                Create an account
              </p>
              <v-form ref="regForm" v-model="validRegister" @submit.self.prevent>
                <v-text-field
                  ref="regEmail"
                  v-model="regEmail"
                  :rules="emailRules"
                  :readonly="loggingIn || loggingInPasswordless || registering"
                  label="Email"
                  prepend-inner-icon="mdi-account"
                  validate-on-blur
                  filled
                  required
                  @keydown.enter="doRegister"
                />
                <v-text-field
                  ref="regPassword"
                  v-model="regPassword"
                  :append-icon="showRegPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordRules"
                  :readonly="loggingIn || loggingInPasswordless || registering"
                  :type="showRegPassword ? 'text' : 'password'"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  hint="At least 8 characters."
                  validate-on-blur
                  filled
                  required
                  @keydown.enter="doRegister"
                  @click:append="showRegPassword = !showRegPassword"
                />
                <p class="agree-tos">
                  To register, you must agree with our
                  <NuxtLink to="/tos" class="tos-link">
                    Terms of Service
                  </NuxtLink>
                </p>
                <v-btn
                  :loading="registering"
                  :disabled="loggingIn || loggingInPasswordless || registering"
                  color="primary"
                  depressed
                  block
                  x-large
                  @click="doRegister"
                >
                  Register
                </v-btn>
              </v-form>
              <p class="already-registered">
                Already registered? <span @click="toggleForm">Login now</span>
              </p>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
    <div class="login-block login-block-left" :class="$vuetify.breakpoint.mdAndDown ? 'login-block-full' : ''">
      <v-app-bar
        v-show="!$vuetify.breakpoint.mdAndDown"
        :color="$vuetify.theme.themes.light.primary"
        elevation="0"
        width="40%"
        fixed
        dark
      >
        <NuxtLink to="/" class="logo-link" title="Home">
          <v-toolbar-title class="logo" v-text="title" />
        </NuxtLink>
      </v-app-bar>
      <div>
        <div>
          <div>
            Kilburn<br>
            Magic<br>
            Playlist
          </div>
          <span>Connect with music.</span>
        </div>
      </div>
      <NuxtLink to="/tos" class="tos-link-small">
        Terms of Service
      </NuxtLink>
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
    <v-snackbar
      v-model="snackbarDeleted"
      color="primary"
      multi-line
      app
      top
      right
    >
      <v-icon class="snackbar-icon">
        mdi-information-outline
      </v-icon>
      {{ snackbarTextDeleted }}
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  middleware: 'auth_index',
  data () {
    return {
      email: '',
      password: '',
      showPassword: false,
      validLogin: false,
      loggingIn: false,
      loggingInPasswordless: false,

      regEmail: '',
      regPassword: '',
      showRegPassword: false,
      validRegister: false,
      registering: false,

      title: 'KMP',
      snackbar: false,
      snackbarText: '',
      snackbarDeleted: false,
      snackbarTextDeleted: '',
      login: true,
      supportWebAuthn: true,

      emailRules: [],
      emailRulesBackup: [
        value => !!value || 'Email is required.',
        value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value) || 'Please enter an email.'
      ],
      emailRulesBackupVaildateOnly: [
        value => (value === '' || typeof value === 'undefined') || (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value) || 'Please enter an email.')
      ],
      passwordRules: [],
      passwordRulesBackup: [
        value => !!value || 'Password is required.',
        value => (value && !value.includes(' ')) || 'Password cannot contain space.',
        value => (value && value.length >= 8) || 'At least 8 characters.',
        value => (value && value.length <= 64) || 'At most 64 characters.'
      ],
      passwordRulesBackupVaildateOnly: [
        value => (value === '' || !value.includes(' ')) || 'Password cannot contain space.',
        value => (value === '' || typeof value === 'undefined') || ((value && value.length >= 8) || 'At least 8 characters.'),
        value => (value === '' || typeof value === 'undefined') || ((value && value.length <= 64) || 'At most 64 characters.')
      ]
    }
  },
  mounted () {
    this.emailRules = this.emailRulesBackupVaildateOnly
    this.passwordRules = this.passwordRulesBackupVaildateOnly
    if (window.PublicKeyCredential === undefined || navigator.credentials.create === undefined || typeof navigator.credentials.create !== 'function') {
      this.supportWebAuthn = false
    }

    // Login expired
    if (this.$route.query.expired === 'true') {
      this.snackbarText = 'Login expired.'
      this.snackbar = false
      Vue.nextTick(() => {
        this.snackbar = true
      })
    }

    // Account deleted
    if (this.$route.query.deleted === 'true') {
      this.snackbarTextDeleted = 'Account deleted.'
      this.snackbarDeleted = false
      Vue.nextTick(() => {
        this.snackbarDeleted = true
      })
    }
  },
  methods: {
    /**
     * Convert Base64URL string to Base64
     * @param {string} input Base64URL string
     * @return {string} Base64 string
     */
    b64url2b64 (input) {
      input = input.replace(/=/g, '').replace(/-/g, '+').replace(/_/g, '/')
      const pad = input.length % 4
      if (pad) {
        if (pad === 1) {
          throw new Error('InvalidLengthError')
        }
        input += new Array(5 - pad).join('=')
      }
      return input
    },
    /**
     * Check input and do login
     */
    doLogin () {
      this.emailRules = this.emailRulesBackup
      this.passwordRules = this.passwordRulesBackup
      this.$refs.loginForm.validate()
      Vue.nextTick(async () => {
        if (this.validLogin) {
          // Valid, send request
          this.loggingIn = true
          let requestFailed = false
          const response = await this.$axios.$post('/api/login/', {
            email: this.email,
            password: this.password
          }).catch(() => {
            this.loggingIn = false
            this.snackbarText = 'Request failed.'
            this.snackbar = false
            requestFailed = true
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
            localStorage.setItem('auth', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            this.$store.commit('user/update', response.data.user)
            this.$router.replace('/explore')
          } else {
            // Error
            this.loggingIn = false
            this.snackbarText = response.reason
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        } else {
          // Invalid, show details
          this.$refs.loginForm.validate()
        }
      })
    },
    /**
     * Check input and do register
     */
    doRegister () {
      this.emailRules = this.emailRulesBackup
      this.passwordRules = this.passwordRulesBackup
      this.$refs.regForm.validate()
      Vue.nextTick(async () => {
        if (this.validRegister) {
          // Valid, send request
          this.registering = true
          let requestFailed = false
          const response = await this.$axios.$post('/api/register/', {
            email: this.regEmail,
            password: this.regPassword
          }).catch(() => {
            this.registering = false
            this.snackbarText = 'Request failed.'
            this.snackbar = false
            requestFailed = true
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
            localStorage.setItem('auth', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            this.$store.commit('user/update', response.data.user)
            this.$router.replace('/explore')
          } else {
            // Error
            this.registering = false
            this.snackbarText = response.reason
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        } else {
          // Invalid, show details
          this.$refs.regForm.validate()
        }
      })
    },
    /**
     * Check input and start WebAuthn process
     */
    startPasswordlessLogin () {
      this.emailRules = this.emailRulesBackupVaildateOnly
      this.passwordRules = []
      this.$refs.loginForm.validate()
      Vue.nextTick(async () => {
        if (this.validLogin) {
          // Valid
          this.loggingInPasswordless = true
          let requestFailed = false
          // Get challenge
          const response = await this.$axios.$post('/api/webauthn/auth_start/', {
            user: this.email === '' ? 'false' : this.email
          }).catch(() => {
            this.loggingInPasswordless = false
            this.snackbarText = 'Request failed.'
            this.snackbar = false
            requestFailed = true
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
            const data = response.data
            const tempId = data.tempId
            data.challenge = Uint8Array.from(window.atob(this.b64url2b64(data.challenge)), c => c.charCodeAt(0))
            if (data.allowCredentials) {
              data.allowCredentials = data.allowCredentials.map((item) => {
                item.id = Uint8Array.from(window.atob(this.b64url2b64(item.id)), c => c.charCodeAt(0))
                return item
              })
            }

            data.tempId = null

            // Start WebAuthn
            navigator.credentials.get({
              publicKey: data
            }).then((keyData) => {
              // Format WebAuthn reponse
              return {
                id: keyData.id,
                type: keyData.type,
                rawId: window.btoa(String.fromCharCode(...(new Uint8Array(keyData.rawId)))),
                response: {
                  authenticatorData: window.btoa(String.fromCharCode(...(new Uint8Array(keyData.response.authenticatorData)))),
                  clientDataJSON: window.btoa(String.fromCharCode(...(new Uint8Array(keyData.response.clientDataJSON)))),
                  signature: window.btoa(String.fromCharCode(...(new Uint8Array(keyData.response.signature)))),
                  userHandle: keyData.response.userHandle ? window.btoa(String.fromCharCode(...(new Uint8Array(keyData.response.userHandle)))) : null
                }
              }
            }).then(JSON.stringify).then(async (authenticatorResponse) => {
              // Send WebAuthn reponse
              let responsetFailed = false
              const passwordlessResponse = await this.$axios.$post('/api/webauthn/auth/', {
                data: window.btoa(authenticatorResponse),
                tempId
              }).catch(() => {
                responsetFailed = true
                this.loggingInPasswordless = false
                this.snackbarText = 'Request failed.'
                this.snackbar = false
                Vue.nextTick(() => {
                  this.snackbar = true
                })
              })

              // Failed
              if (responsetFailed) {
                return
              }

              if (passwordlessResponse.success) {
                // Success
                localStorage.setItem('auth', passwordlessResponse.data.token)
                localStorage.setItem('user', JSON.stringify(passwordlessResponse.data.user))
                this.$store.commit('user/update', passwordlessResponse.data.user)
                this.$router.replace('/explore')
              } else {
                // Error
                this.loggingInPasswordless = false
                this.snackbarText = passwordlessResponse.reason
                this.snackbar = false
                Vue.nextTick(() => {
                  this.snackbar = true
                })
              }
            }).catch(() => {
              this.loggingInPasswordless = false

              // Dispaly error snack bar
              this.snackbarText = `Passwordless login failed.${this.email === '' ? ' You can enter your email and try again.' : ''}`
              this.snackbar = false
              Vue.nextTick(() => {
                this.snackbar = true
              })
            })
          } else {
            // Error
            this.loggingInPasswordless = false
            this.snackbarText = response.reason
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        }
      })
    },
    /**
     * Toggle login form and register form
     */
    toggleForm () {
      // Reset rules
      this.emailRules = this.emailRulesBackupVaildateOnly
      this.passwordRules = this.passwordRulesBackupVaildateOnly

      this.login = !this.login
      if (this.login) {
        // Match animation
        setTimeout(() => {
          this.$refs.loginEmail.focus()
        }, 600)
      } else {
        // Match animation
        setTimeout(() => {
          this.$refs.regEmail.focus()
        }, 600)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-block {
  position: absolute;
  bottom: 0;
  height: 100vh;
}
.login-block-left {
  position: absolute;
  left: 0;
  width: 40%;
  background-color: $theme-color;
  overflow: hidden;
  z-index: 6;
  user-select: none;
  &.login-block-full {
    bottom: -100vh;
    z-index: 1;
    & > div {
      line-height: 70px;
      & > div {
        div {
          font-size: 70px;
        }
        span {
          font-size: 22px;
          transform: translateY(-3px);
        }
      }
    }
  }
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    line-height: 100px;
    & > div {
      div {
        font: {
          family: 'Quicksand', sans-serif;
          size: 100px;
        }
      }
      span {
        display: block;
        width: 100%;
        text-align: center;
        font-size: 30px;
        opacity: .6;
        transform: translateY(-5px);
      }
    }
  }
  .tos-link-small {
    position: absolute;
    bottom: 5px;
    left: 10px;
    color: white;
    text-decoration: none;
    font-size: 14px;
    opacity: .7;
    &:hover {
      text-decoration: underline;
    }
  }
}
.login-block-right {
  right: 0;
  width: 60%;
  background: {
    color: $theme-color-dark;
    image: linear-gradient(transparentize($theme-color-dark, .12), transparentize($theme-color-dark, .12)), url(~assets/img/login/background.jpg);
    size: cover;
    position: center center;
  }
  perspective: 1000px;
  overflow: hidden;
  .flip-parent {
    width: 100%;
    height: 100%;
    transition: .6s;
    transform-style: preserve-3d;
    .form-parent {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      backface-visibility: hidden;
      #login-form {
        &.login-form-large {
          padding: 15px;
        }
        .welcome {
          user-select: none;
        }
        .login-text {
          user-select: none;
          padding-bottom: 20px;
          span {
            font-family: 'Quicksand', sans-serif;
            color: $theme-color;
          }
        }
        i {
          margin-right: 10px;
        }
        .divider {
          margin: 20px 0;
        }
        .not-registered {
          text-align: center;
          margin-bottom: 0;
          margin-top: 20px;
          user-select: none;
          span {
            cursor: pointer;
            color: $theme-color;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      #register-form {
        &.register-form-large {
          padding: 15px;
        }
        .welcome {
          user-select: none;
        }
        .register-text {
          padding-bottom: 20px;
          user-select: none;
          span {
            font-family: 'Quicksand', sans-serif;
            color: $theme-color;
          }
        }
        i {
          margin-right: 10px;
        }
        .divider {
          margin: 20px 0;
        }
        .already-registered {
          text-align: center;
          margin-bottom: 0;
          margin-top: 20px;
          user-select: none;
          span {
            cursor: pointer;
            color: $theme-color;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .agree-tos {
          text-align: center;
          margin-bottom: 23px;
          user-select: none;
          .tos-link {
            cursor: pointer;
            color: $theme-color;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      &.login-parent {
        z-index: 2;
      }
      &.register-parent {
        z-index: 1;
        transform: rotateY(180deg);
      }
    }
    &.back {
      transform: rotateY(180deg);
    }
  }
}
.login-block-full {
  width: 100%;
}
</style>
