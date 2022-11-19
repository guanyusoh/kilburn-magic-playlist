<template>
  <div id="settings">
    <div v-if="!loadingData" :class="$vuetify.breakpoint.mdAndDown ? 'full-width' : ''" class="settings-left settings-block">
      <div>
        <div class="profile-container">
          <v-avatar
            :color="`#${userInfoEdit.color}`"
            :size="$vuetify.breakpoint.mdAndDown ? 120 : 170"
          >
            <v-img :src="user.avatar.replace('s=80', 's=400')" aspect-ratio="1" />
          </v-avatar>
          <h2 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4 mt-3 mb-0' : 'text-h3 mt-5 mb-3'" class="d-inline-block text-truncate text-center">
            {{ userInfoEdit.name }}
          </h2>
          <p class="text-subtitle-1 text-center mb-0">
            {{ userInfoEdit.bio }}
          </p>
        </div>
        <div class="bg-color" :style="{ backgroundColor: `#${userInfoEdit.color}` }" />
      </div>
    </div>
    <div v-if="!loadingData" :class="$vuetify.breakpoint.mdAndDown ? 'full-width' : ''" class="settings-right settings-block">
      <h1 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h3'" class="font-weight-bold">
        Settings
      </h1>
      <div :class="$vuetify.breakpoint.mdAndDown ? 'mt-5' : 'mt-7'">
        <v-tabs
          v-model="tab"
          color="primary"
          background-color="transparent"
          show-arrows
        >
          <v-tab>Profile</v-tab>
          <v-tab>Connections</v-tab>
          <v-tab>Security</v-tab>
          <v-tab>Account</v-tab>
        </v-tabs>

        <v-tabs-items
          v-model="tab"
          touchless
        >
          <!-- Profile -->
          <v-tab-item>
            <v-container fluid class="pa-0">
              <v-divider class="mb-5" />
              <h3 class="text-h5 font-weight-bold mb-4">
                Name
              </h3>
              <v-text-field
                v-model="userInfoEdit.name"
                placeholder="Name"
                prepend-inner-icon="mdi-account"
                :append-icon="((userInfoEdit.name !== user.name && !savingName) && userInfoEdit.name.length >= 3 && userInfoEdit.name.length <= 30) ? 'mdi-content-save' : ''"
                :loading="savingName"
                :disabled="savingName"
                :rules="rulesName"
                hint="3-30 letters."
                class="settings-input"
                filled
                @click:append="saveInfo('name')"
                @keydown.enter="saveInfo('name')"
              />

              <h3 class="text-h5 font-weight-bold mb-4 mt-1">
                Avatar
              </h3>
              <p class="mb-2">
                We do not process or store avatar images, instead, we fetch your avatar from
                <a
                  href="https://gravatar.com/"
                  class="hover-underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Gravatar
                  <v-icon
                    color="primary"
                    x-small
                  >
                    mdi-open-in-new
                  </v-icon>
                </a>
                <strong>based on your email.</strong>
              </p>
              <p class="mb-3">
                You can change your avatar on Gravatar. If we are unable to find your avatar on Gravatar, a random avatar will be shown.
              </p>
              <v-btn
                href="https://gravatar.com/"
                rel="noreferrer noopener"
                target="_blank"
                class="light-btn-on-bg"
                depressed
                large
              >
                <v-icon class="connections-btn-icon">
                  mdi-account-circle
                </v-icon> Go to Gravatar
              </v-btn>

              <h3 class="text-h5 font-weight-bold mb-4 mt-8">
                Bio
              </h3>
              <v-text-field
                v-model="userInfoEdit.bio"
                placeholder="Bio"
                prepend-inner-icon="mdi-text-account"
                :append-icon="((userInfoEdit.bio !== userDetail.bio && !savingBio) && userInfoEdit.bio.length <= 100) ? 'mdi-content-save' : ''"
                :loading="savingBio"
                :disabled="savingBio"
                :rules="rulesBio"
                maxlength="100"
                class="settings-input"
                counter
                filled
                @click:append="saveInfo('bio')"
                @keydown.enter="saveInfo('bio')"
              />

              <h3 class="text-h5 font-weight-bold mb-4 mt-1">
                Profile Color
              </h3>
              <v-btn
                v-for="color in colors"
                :key="color"
                :color="`#${color}`"
                :loading="userInfoEdit.color === color"
                :disabled="savingColor"
                :dark="!savingColor"
                class="mr-1 mb-1"
                fab
                small
                depressed
                @click="userInfoEdit.color = color"
              >
                <template v-slot:loader>
                  <v-icon>mdi-check</v-icon>
                </template>
              </v-btn>
              <v-btn
                v-show="userInfoEdit.color !== userDetail.color"
                :color="`#${userInfoEdit.color}`"
                :loading="savingColor"
                :disabled="savingColor"
                class="mr-1 mb-1"
                title="Save"
                fab
                small
                outlined
                @click="saveInfo('color')"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-container>
          </v-tab-item>

          <!-- Connections -->
          <v-tab-item>
            <v-container fluid class="pa-0">
              <v-divider class="mb-5" />
              <h3 class="text-h5 font-weight-bold mb-4">
                Spotify
              </h3>
              <p class="mb-2">
                {{ userDetail.connections.spotify === false ? 'Disconnected.' : 'Connected to user ID ' }}
                <a
                  v-if="userDetail.connections.spotify !== false"
                  :href="`https://open.spotify.com/user/${userDetail.connections.spotify}`"
                  class="hover-underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {{ userDetail.connections.spotify }}
                  <v-icon
                    color="primary"
                    x-small
                  >
                    mdi-open-in-new
                  </v-icon>
                </a>
              </p>
              <v-btn
                v-if="userDetail.connections.spotify === false"
                :loading="connectingSpotifyLoading"
                :disabled="connectingSpotifyLoading"
                :dark="connectingSpotifyLoading ? false : true"
                color="#1ED760"
                depressed
                large
                @click="connectTo('spotify')"
              >
                <v-icon class="connections-btn-icon">
                  mdi-link
                </v-icon> Connect to Spotify
              </v-btn>
              <v-dialog
                v-else-if="userDetail.connections.spotify !== false"
                v-model="disconnectSpotifyDialog"
                width="300"
                attach
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    depressed
                    dark
                    large
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="connections-btn-icon">
                      mdi-link-off
                    </v-icon> Disconnect with Spotify
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Confirm</v-card-title>
                  <v-card-text>
                    Disconnect with <strong>Spotify</strong>?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      :disabled="disconnectSpotifyLoading"
                      text
                      @click="disconnectSpotifyDialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      :loading="disconnectSpotifyLoading"
                      :disabled="disconnectSpotifyLoading"
                      color="primary"
                      text
                      @click="disconnectConfirm('Spotify')"
                    >
                      Confirm
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <h3 class="text-h5 font-weight-bold mb-4 mt-8">
                YouTube Music
              </h3>
              <p class="mb-2">
                Comming soon.
              </p>

              <h3 class="text-h5 font-weight-bold mb-4 mt-8">
                Apple Music
              </h3>
              <p class="mb-2">
                Comming soon.
              </p>

              <h3 class="text-h5 font-weight-bold mb-4 mt-8">
                Netease Cloud Music
              </h3>
              <p class="mb-2">
                Comming soon.
              </p>
            </v-container>
          </v-tab-item>

          <!-- Security -->
          <v-tab-item>
            <v-container fluid class="pa-0">
              <v-divider class="mb-5" />
              <h3 class="text-h5 font-weight-bold mb-4">
                Password
              </h3>
              <v-form ref="password" v-model="validPassword" @submit.self.prevent>
                <v-text-field
                  v-model="password.old"
                  label="Old password"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :readonly="savingPassword"
                  :rules="rulesPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="settings-input"
                  validate-on-blur
                  filled
                  @click:append="showOldPassword = !showOldPassword"
                  @keydown.enter="updatePassword"
                />
                <v-text-field
                  v-model="password.new"
                  label="New password"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :readonly="savingPassword"
                  :rules="rulesPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="settings-input"
                  hint="At least 8 characters."
                  validate-on-blur
                  filled
                  @click:append="showNewPassword = !showNewPassword"
                  @keydown.enter="updatePassword"
                />
                <v-btn
                  color="primary"
                  :loading="savingPassword"
                  :disabled="savingPassword"
                  depressed
                  @click="updatePassword"
                >
                  Update
                </v-btn>
              </v-form>

              <h3 class="text-h5 font-weight-bold mb-4 mt-10">
                Passwordless Login
                <span class="recommand-label rounded text-body-2">
                  Recommand
                </span>
              </h3>
              <p class="mb-2">
                WebAuthn is a new technology that can help you to safely login to your account without password. No personal data will be uploaded.
              </p>
              <p class="mb-2">
                Register your device like phone or tablet, then login with Windows Hello, FaceID/TouchID, fingerprints and more. FIDO2/U2F devices like USB security keys are also supported.
              </p>
              <h4 class="text-h6 font-weight-bold mb-2 mt-5">
                Register new device
              </h4>
              <v-text-field
                v-if="supportWebAuthn"
                v-model="webAuthnNewName"
                label="Device name"
                prepend-inner-icon="mdi-fingerprint"
                append-icon="mdi-arrow-right"
                :rules="rulesDeviceName"
                :readonly="regingWebAuthn"
                maxlength="30"
                class="settings-input"
                counter
                filled
                @click:append="regWebauthn"
                @keydown.enter="regWebauthn"
              />
              <p
                v-else
                class="mb-2"
              >
                Unfortunately this browser doesn't support WebAuthn.
              </p>
              <h4 :class="supportWebAuthn ? 'mt-1' : 'mt-5'" class="text-h6 font-weight-bold mb-2">
                Registered devices
              </h4>
              <v-simple-table class="long-table rounded">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Name
                      </th>
                      <th class="text-left">
                        Added
                      </th>
                      <th class="text-left">
                        Usernameless
                      </th>
                      <th class="text-left">
                        Last used
                      </th>
                      <th class="text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in userDetail.webauthn"
                      :key="index"
                    >
                      <td>{{ item.name }}</td>
                      <td>{{ item.added }}</td>
                      <td>{{ item.usernameless ? 'Ready' : 'No' }}</td>
                      <td>{{ item.lastUsed }}</td>
                      <td>
                        <v-btn
                          title="Rename"
                          icon
                          small
                          @click="editWebAuthnName(index)"
                        >
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-btn>
                        <v-btn
                          color="primary"
                          title="Delete"
                          icon
                          samll
                          @click="deleteWebAuthn(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    <tr v-if="userDetail.webauthn.length === 0">
                      <td colspan="5">
                        <p class="font-italic text--disabled text-center mb-0">
                          No device registered
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-tab-item>

          <!-- Account -->
          <v-tab-item>
            <v-container fluid class="pa-0">
              <v-divider class="mb-5" />
              <h3 class="text-h5 font-weight-bold mb-4">
                Email
              </h3>
              <v-form ref="email" v-model="validEmail" @submit.self.prevent>
                <v-text-field
                  v-model="userInfoEdit.email"
                  placeholder="Email"
                  prepend-inner-icon="mdi-email"
                  :append-icon="((userInfoEdit.email !== user.email && !savingEmail && validEmail) && userInfoEdit.email !== '') ? 'mdi-content-save' : ''"
                  :loading="savingEmail"
                  :disabled="savingEmail"
                  :rules="rulesEmail"
                  class="settings-input"
                  filled
                  @click:append="updateEmail"
                  @keydown.enter="updateEmail"
                />
              </v-form>

              <h3 class="text-h5 font-weight-bold mb-4 mt-1">
                Delete Account
              </h3>
              <p class="mb-2">
                Deleted account cannot be recovered. Please make sure you do want to delete your account.
              </p>
              <v-dialog
                v-model="deleteAccountBeforeDialog"
                width="300"
                attach
                persistent
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    depressed
                    dark
                    large
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="connections-btn-icon">
                      mdi-delete
                    </v-icon> Delete
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Confirm</v-card-title>
                  <v-card-text>
                    Do you want to <strong>delete your account</strong>?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      text
                      @click="deleteAccountBeforeDialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="deleteAccountAskPassword"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <v-dialog
      v-if="userDetail.webauthn.length > 0"
      v-model="renameDialog"
      width="300"
      persistent
    >
      <v-card>
        <v-card-title>Rename</v-card-title>
        <v-card-text class="card-text-with-input">
          <v-text-field
            v-model="webAuthnEditingName"
            placeholder="Device name"
            prepend-inner-icon="mdi-pencil"
            :readonly="renameDialogLoading"
            maxlength="30"
            class="mt-2"
            validate-on-blur
            counter
            filled
            clearable
            @keydown.enter="editWebAuthnConfirm"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="renameDialogLoading"
            text
            @click="renameDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="webAuthnEditingName === '' || webAuthnEditingName === null || renameDialogLoading"
            :loading="renameDialogLoading"
            text
            @click="editWebAuthnConfirm"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="userDetail.webauthn.length > 0"
      v-model="deleteDialog"
      width="300"
      persistent
    >
      <v-card>
        <v-card-title>Confirm</v-card-title>
        <v-card-text>
          Delete registered device <strong>{{ userDetail.webauthn[deletingWebAuthnIndex].name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="deleteDialogLoading"
            text
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="deleteDialogLoading"
            :loading="deleteDialogLoading"
            text
            @click="deleteWebAuthnConfirm"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addWebAuthnDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      :transition="$vuetify.breakpoint.xs ? 'slide-y-reverse-transition' : 'dialog-transition'"
      width="600"
      persistent
    >
      <v-card :class="$vuetify.breakpoint.xs ? 'rounded-0 card-relative' : ''">
        <v-card-title>Register "{{ webAuthnNewName.trim() }}"</v-card-title>
        <v-card-text>
          <p class="text-center mt-4 pb-4 dialog-icon-p">
            <v-icon
              x-large
              color="#DDDDDD"
              class="huge-icon"
            >
              mdi-cellphone-key
            </v-icon>
          </p>
          <p class="mb-2">
            If you register your device with usernameless feature, you can login without enter your email, otherwise you need to enter your email first.
          </p>
          <p class="mb-2">
            However, Android and iOS 13- devices devices do not support usernameless feature. Registering with usernameless feature will also leave a permanent record on your device (unless you reset its built-in authenticator).
          </p>
          <p>Do you want to register with usernameless feature?</p>
          <div :class="$vuetify.breakpoint.xs ? 'card-btns' : ''" class="pt-2">
            <v-btn
              class="mb-2"
              depressed
              block
              large
              @click="regWebauthnAskPassword(true)"
            >
              <v-icon class="snackbar-icon">
                mdi-check
              </v-icon>
              Usernameless
              <v-spacer />
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn
              class="mb-5"
              depressed
              block
              large
              @click="regWebauthnAskPassword(false)"
            >
              <v-icon class="snackbar-icon">
                mdi-close
              </v-icon>
              No usernameless
              <v-spacer />
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn
              depressed
              block
              large
              @click="cancelRegWebauthn"
            >
              Cancel
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addWebAuthnLoadingDialog"
      width="280"
      persistent
    >
      <v-card>
        <v-card-text :class="showDeviceTip ? 'shown-text' : ''" class="card-text-loading">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          />
          <span :class="showDeviceTip ? 'shown' : ''" class="device-tip">
            Follow your device's instruction...
          </span>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="deleteAccountDialog"
      width="300"
      attach
      persistent
    >
      <v-card>
        <v-card-title>Password</v-card-title>
        <v-card-text class="card-text-with-input">
          Enter your password to confirm.
          <v-text-field
            v-model="deleteAccoundPassword"
            placeholder="Password"
            prepend-inner-icon="mdi-lock"
            :append-icon="showAccountPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :readonly="deleteAccountLoading"
            :type="showAccountPassword ? 'text' : 'password'"
            :rules="rulesPasswordVaildateOnly"
            hide-details="auto"
            class="mt-2"
            validate-on-blur
            filled
            @click:append="showAccountPassword = !showAccountPassword"
            @keydown.enter="deleteAccountConfirm"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="deleteAccountLoading"
            text
            @click="deleteAccountDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="deleteAccountLoading || deleteAccoundPassword.length < 8 || deleteAccoundPassword.length > 64 || deleteAccoundPassword.includes(' ')"
            :loading="deleteAccountLoading"
            color="primary"
            text
            @click="deleteAccountConfirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="addWebAuthnPasswordDialog"
      width="300"
      attach
      persistent
    >
      <v-card>
        <v-card-title>Password</v-card-title>
        <v-card-text class="card-text-with-input">
          Enter your password to continue.
          <v-text-field
            v-model="addWebAuthnPassword"
            placeholder="Password"
            prepend-inner-icon="mdi-lock"
            :append-icon="showWebAuthnPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showWebAuthnPassword ? 'text' : 'password'"
            :rules="rulesPasswordVaildateOnly"
            hide-details="auto"
            class="mt-2"
            validate-on-blur
            filled
            @click:append="showWebAuthnPassword = !showWebAuthnPassword"
            @keydown.enter="regWebAuthnConfirm"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="cancelRegWebauthnAskPassword"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="addWebAuthnPassword.length < 8 || addWebAuthnPassword.length > 64 || addWebAuthnPassword.includes(' ')"
            color="primary"
            text
            @click="regWebAuthnConfirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  </div>
</template>

<script>
import Vue from 'vue'
import logout from '../common/logout'

export default {
  name: 'Settings',
  middleware: 'auth',
  data () {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        avatar: ''
      },
      userDetail: {
        bio: '',
        color: '242424',
        connections: {
          spotify: false
        },
        webauthn: []
      },
      userInfoEdit: {
        name: '',
        bio: '',
        color: '242424',
        email: ''
      },
      password: {
        old: '',
        new: ''
      },

      savingName: false,
      savingBio: false,
      savingColor: false,
      savingPassword: false,
      savingEmail: false,
      validEmail: false,

      showOldPassword: false,
      showNewPassword: false,
      validPassword: false,
      deleteAccoundPassword: '',
      showAccountPassword: false,
      showWebAuthnPassword: false,

      supportWebAuthn: true,
      webAuthnNewName: '',
      regingWebAuthn: false,
      webAuthnEditingName: '',
      webAuthnEditingIndex: 0,
      deletingWebAuthnIndex: 0,
      addWebAuthnPassword: '',
      webAuthnUsernameless: false,
      showDeviceTip: false,

      disconnectSpotifyDialog: false,
      disconnectSpotifyLoading: false,
      connectingSpotifyLoading: false,
      connectingSpotifyTimer: null,
      renameDialog: false,
      renameDialogLoading: false,
      deleteDialog: false,
      deleteDialogLoading: false,
      addWebAuthnDialog: false,
      addWebAuthnPasswordDialog: false,
      addWebAuthnLoadingDialog: false,
      deleteAccountBeforeDialog: false,
      deleteAccountDialog: false,
      deleteAccountLoading: false,

      rulesName: [
        value => value.length >= 3 || 'At least 3 characters.',
        value => value.length <= 30 || 'At most 30 characters.'
      ],
      rulesBio: [
        value => value.length <= 100 || 'Max 100 characters.'
      ],
      rulesPassword: [],
      rulesPasswordVaildateOnly: [
        value => (value === '' || !value.includes(' ')) || 'Password cannot contain space.',
        value => (value === '' || value.length >= 8) || 'At least 8 characters.',
        value => (value === '' || value.length <= 64) || 'At most 64 characters.'
      ],
      rulesPasswordBackup: [
        value => !!value || 'Password is required.',
        value => (value && !value.includes(' ')) || 'Password cannot contain space.',
        value => (value && value.length >= 8) || 'At least 8 characters.',
        value => (value && value.length <= 64) || 'At most 64 characters.'
      ],
      rulesDeviceName: [],
      rulesDeviceNameBackup: [
        value => !!value || 'Name required.'
      ],
      rulesEmail: [
        value => !!value || 'Email is required.',
        value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value) || 'Please enter an email.'
      ],

      colors: [
        '242424',
        '411D44',
        '0D5379',
        '286D4F',
        'A27211',
        'E76E6B'
      ],

      tab: null,
      snackbar: false,
      snackbarText: '',
      snackbarSuccess: false,
      loadingData: false
    }
  },
  mounted () {
    this.rulesPassword = this.rulesPasswordVaildateOnly

    if (window.PublicKeyCredential === undefined || navigator.credentials.create === undefined || typeof navigator.credentials.create !== 'function') {
      this.supportWebAuthn = false
    }

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
  beforeDestroy () {
    if (this.connectingSpotifyTimer !== null) {
      window.clearInterval(this.connectingSpotifyTimer)
    }
  },
  methods: {
    /**
     * Verify user's login
     * @param {boolean} update If it is updating user info
     */
    async verifyAuth (update = false) {
      if (!update) {
        this.loadingData = true
        this.$store.commit('overlay/set', true)
      }

      let requestFailed = false
      const response = await this.$axios.$get('/api/user/info/', {
        params: {
          id: this.user.id
        }
      }).catch(() => {
        this.$store.commit('overlay/set', false)
        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.$store.commit('user/update', response.data.user)
        this.user = response.data.user
        this.userDetail = response.data.userDetail

        this.userInfoEdit.name = this.user.name
        this.userInfoEdit.email = this.user.email
        this.userInfoEdit.bio = this.userDetail.bio
        this.userInfoEdit.color = this.userDetail.color

        this.loadingData = false
        this.$store.commit('overlay/set', false)
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.$store.commit('overlay/set', false)
          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    /**
     * Update user info
     * @param {string} field Which field is modified
     */
    async saveInfo (field) {
      let sendData = {}
      // Check inputs
      if (field === 'name') {
        if (this.userInfoEdit.name.length < 3 || this.userInfoEdit.name.length > 30 || this.userInfoEdit.name === this.user.name || this.savingName) {
          return
        }
        this.savingName = true
        sendData = {
          update: 'name',
          value: this.userInfoEdit.name
        }
      } else if (field === 'bio') {
        if (this.userInfoEdit.bio.length > 100 || this.userInfoEdit.bio === this.userDetail.bio || this.savingBio) {
          return
        }
        this.savingBio = true
        sendData = {
          update: 'bio',
          value: this.userInfoEdit.bio
        }
      } else if (field === 'color') {
        if (this.savingColor) {
          return
        }
        let colorFlag = false
        for (const color of this.colors) {
          if (this.userInfoEdit.color === color) {
            colorFlag = true
            break
          }
        }
        if (!colorFlag) {
          return
        }

        this.savingColor = true
        sendData = {
          update: 'color',
          value: this.userInfoEdit.color
        }
      }

      let requestFailed = false
      const response = await this.$axios.$post('/api/user/update/', sendData).catch(() => {
        // End loading
        if (field === 'name') {
          this.savingName = false
        } else if (field === 'bio') {
          this.savingBio = false
        } else if (field === 'color') {
          this.savingColor = false
        }

        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        localStorage.setItem('user', JSON.stringify(response.data.user))
        this.$store.commit('user/update', response.data.user)

        for (const item of ['name', 'bio', 'color']) {
          if (item === field) {
            if (item !== 'name') {
              this.userInfoEdit[item] = response.data.userDetail[item]
            } else {
              this.userInfoEdit[item] = response.data.user[item]
            }
          } else {
            if (item !== 'name') {
              if (this.userInfoEdit[item] === this.userDetail[item]) {
                this.userInfoEdit[item] = response.data.userDetail[item]
              }
            } else {
              if (this.userInfoEdit[item] === this.user[item]) {
                this.userInfoEdit[item] = response.data.user[item]
              }
            }
          }
        }
        if (this.userInfoEdit.email === this.user.email) {
          this.userInfoEdit.email = response.data.user.email
        }
        this.user = response.data.user
        this.userDetail = response.data.userDetail

        // End loading
        if (field === 'name') {
          this.savingName = false
        } else if (field === 'bio') {
          this.savingBio = false
        } else if (field === 'color') {
          this.savingColor = false
        }

        // Show snackbar
        this.snackbarText = 'Profile updated.'
        this.snackbarSuccess = true
        this.snackbar = false
        Vue.nextTick(() => {
          this.snackbar = true
        })
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          // End loading
          if (field === 'name') {
            this.savingName = false
          } else if (field === 'bio') {
            this.savingBio = false
          } else if (field === 'color') {
            this.savingColor = false
          }

          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    /**
     * Update password
     */
    updatePassword () {
      if (this.savingPassword) {
        return
      }
      this.rulesPassword = this.rulesPasswordBackup
      this.$refs.password.validate()
      Vue.nextTick(async () => {
        if (this.validPassword) {
          // Valid, send request
          this.savingPassword = true
          let requestFailed = false
          const response = await this.$axios.$post('/api/user/update_password/', {
            oldPassword: this.password.old,
            newPassword: this.password.new
          }).catch(() => {
            this.savingPassword = false
            this.snackbarText = 'Request failed.'
            this.snackbarSuccess = false
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

            if (this.userInfoEdit.name === this.user.name) {
              this.userInfoEdit.name = response.data.user.name
            }
            if (this.userInfoEdit.email === this.user.email) {
              this.userInfoEdit.email = response.data.user.email
            }
            this.user = response.data.user

            this.savingPassword = false
            this.password = {
              old: '',
              new: ''
            }
            this.rulesPassword = this.rulesPasswordVaildateOnly

            // Show snackbar
            this.snackbarText = 'Password updated.'
            this.snackbarSuccess = true
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          } else {
            // Error
            this.savingPassword = false
            this.snackbarText = response.reason
            this.snackbarSuccess = false
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        } else {
          // Invalid, show details
          this.$refs.password.validate()
        }
      })
    },
    /**
     * Update email
     */
    updateEmail () {
      if (this.savingEmail) {
        return
      }
      this.$refs.email.validate()
      Vue.nextTick(async () => {
        if (this.validEmail) {
          if (this.userInfoEdit.email === this.user.email) {
            return
          }
          // Valid, send request
          this.savingEmail = true
          let requestFailed = false
          const response = await this.$axios.$post('/api/user/update_email/', {
            email: this.userInfoEdit.email
          }).catch(() => {
            this.savingEmail = false
            this.snackbarText = 'Request failed.'
            this.snackbarSuccess = false
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
            localStorage.setItem('user', JSON.stringify(response.data))
            this.$store.commit('user/update', response.data)

            if (this.userInfoEdit.name === this.user.name) {
              this.userInfoEdit.name = response.data.name
            }
            this.userInfoEdit.email = response.data.email
            this.user = response.data

            this.savingEmail = false

            // Show snackbar
            this.snackbarText = 'Email updated.'
            this.snackbarSuccess = true
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          } else {
            // Error
            this.savingEmail = false
            this.snackbarText = response.reason
            this.snackbarSuccess = false
            this.snackbar = false
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        } else {
          // Invalid, show details
          this.$refs.email.validate()
        }
      })
    },
    /**
     * Register a WebAuthn device
     */
    regWebauthn () {
      this.rulesDeviceName = this.rulesDeviceNameBackup
      if (this.regingWebAuthn) {
        return
      }
      if (this.webAuthnNewName.length === null || this.webAuthnNewName.length === 0 || this.webAuthnNewName.length > 30) {
        return
      }
      this.addWebAuthnDialog = true
      this.regingWebAuthn = true
    },
    /**
     * Cancel to register a WebAuthn device
     */
    cancelRegWebauthn () {
      this.rulesDeviceName = []
      this.addWebAuthnDialog = false
      this.regingWebAuthn = false
    },
    /**
     * Ask for password before register a WebAuthn device
     * @param {boolean} usernameless Whether to enable usernameless
     */
    regWebauthnAskPassword (usernameless) {
      this.webAuthnUsernameless = usernameless
      this.addWebAuthnDialog = false
      this.addWebAuthnPassword = ''
      this.addWebAuthnPasswordDialog = true
      this.showDeviceTip = false
    },
    /**
     * Cencel to register a WebAuthn device
     */
    cancelRegWebauthnAskPassword () {
      this.regingWebAuthn = false
      this.addWebAuthnPassword = ''
      this.addWebAuthnPasswordDialog = false
      this.rulesDeviceName = []
    },
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
     * Start register a WebAuthn device
     */
    async regWebAuthnConfirm () {
      const usernameless = this.webAuthnUsernameless
      if (this.webAuthnNewName.length === null || this.webAuthnNewName.length === 0 || this.webAuthnNewName.length > 30) {
        return
      }
      if (this.addWebAuthnPassword.length < 8 || this.addWebAuthnPassword.length > 64 || this.addWebAuthnPassword.includes(' ')) {
        return
      }
      this.addWebAuthnPasswordDialog = false
      this.addWebAuthnLoadingDialog = true
      let passwordFailed = false
      const passwordResponse = await this.$axios.$post('/api/verify_password/', { password: this.addWebAuthnPassword }).catch(() => {
        this.addWebAuthnLoadingDialog = false
        this.regingWebAuthn = false
        this.rulesDeviceName = []

        passwordFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
        this.snackbar = false
        Vue.nextTick(() => {
          this.snackbar = true
        })
      })

      // Request failed
      if (passwordFailed) {
        return
      }

      if (passwordResponse.success) {
        // Success
        this.showDeviceTip = true
        let requestFailed = false
        const response = await this.$axios.$post('/api/webauthn/reg_start/', {
          usernameless,
          password: this.addWebAuthnPassword
        }).catch(() => {
          this.addWebAuthnLoadingDialog = false
          this.regingWebAuthn = false
          this.rulesDeviceName = []

          requestFailed = true
          this.snackbarText = 'Request failed.'
          this.snackbarSuccess = false
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
          const data = response.data
          let challenge = new Uint8Array(32)
          let userId = new Uint8Array(32)
          challenge = Uint8Array.from(window.atob(this.b64url2b64(data.challenge)), c => c.charCodeAt(0))
          userId = Uint8Array.from(window.atob(this.b64url2b64(data.user.id)), c => c.charCodeAt(0))
          const publicKey = {
            challenge,
            rp: {
              id: data.rp.id,
              name: data.rp.name
            },
            user: {
              id: userId,
              name: data.user.name,
              displayName: data.user.displayName,
              icon: data.user.icon
            },
            pubKeyCredParams: data.pubKeyCredParams,
            authenticatorSelection: data.authenticatorSelection,
            timeout: data.timeout
          }
          // If some authenticators are already registered, exclude
          if (data.excludeCredentials) {
            publicKey.excludeCredentials = data.excludeCredentials.map((item) => {
              item.id = Uint8Array.from(window.atob(this.b64url2b64(item.id)), c => c.charCodeAt(0))
              return item
            })
          }

          // Create, a pop-up window should appear
          navigator.credentials.create({
            publicKey
          }).then((data) => {
            // Code Uint8Array into string for transmission
            return {
              id: data.id,
              type: data.type,
              rawId: window.btoa(String.fromCharCode(...(new Uint8Array(data.rawId)))),
              response: {
                clientDataJSON: window.btoa(String.fromCharCode(...(new Uint8Array(data.response.clientDataJSON)))),
                attestationObject: window.btoa(String.fromCharCode(...(new Uint8Array(data.response.attestationObject))))
              }
            }
          }).then(JSON.stringify).then(async (authenticatorAttestationResponse) => {
            // Send WebAuthn reponse
            let responseFailed = false
            const passwordlessResponse = await this.$axios.$post('/api/webauthn/reg/', {
              data: window.btoa(authenticatorAttestationResponse),
              name: this.webAuthnNewName
            }).catch(() => {
              responseFailed = true
              this.addWebAuthnLoadingDialog = false
              this.regingWebAuthn = false
              this.rulesDeviceName = []

              this.snackbarText = 'Request failed.'
              this.snackbarSuccess = false
              this.snackbar = false
              Vue.nextTick(() => {
                this.snackbar = true
              })
            })

            // Failed
            if (responseFailed) {
              return
            }

            if (passwordlessResponse.success) {
              // Success
              this.addWebAuthnLoadingDialog = false
              this.regingWebAuthn = false

              this.userDetail.webauthn = passwordlessResponse.data
              this.webAuthnNewName = ''
              this.rulesDeviceName = []

              this.snackbarText = 'Device registered.'
              this.snackbarSuccess = true
              this.snackbar = false
              Vue.nextTick(() => {
                this.snackbar = true
              })
            } else {
              // Error
              if (response.reason === 'Login expired.') {
                logout(this, true)
              } else {
                this.addWebAuthnLoadingDialog = false
                this.regingWebAuthn = false
                this.rulesDeviceName = []

                this.snackbarText = passwordlessResponse.reason
                this.snackbarSuccess = false
                this.snackbar = false
                Vue.nextTick(() => {
                  this.snackbar = true
                })
              }
            }
          }).catch(() => {
            this.addWebAuthnLoadingDialog = false
            this.regingWebAuthn = false
            this.rulesDeviceName = []

            this.snackbarText = `Registration failed.${usernameless ? ' Try to register without usernameless feature.' : ''}`
            this.snackbarSuccess = false
            this.snackbar = false
            this.deletingWebAuthnIndex = 0
            Vue.nextTick(() => {
              this.snackbar = true
            })
          })
        } else {
          // Error
          if (response.reason === 'Login expired.') {
            logout(this, true)
          } else {
            this.addWebAuthnLoadingDialog = false
            this.regingWebAuthn = false
            this.rulesDeviceName = []

            this.snackbarText = response.reason
            this.snackbarSuccess = false
            this.snackbar = false
            this.deletingWebAuthnIndex = 0
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        }
      } else {
        // Error
        this.addWebAuthnLoadingDialog = false
        this.regingWebAuthn = false
        this.rulesDeviceName = []

        this.snackbarText = passwordResponse.reason
        this.snackbarSuccess = false
        this.snackbar = false
        Vue.nextTick(() => {
          this.snackbar = true
        })
      }
    },
    /**
     * Rename a WebAuthn device
     * @param {number} index WebAuthn device index
     */
    editWebAuthnName (index) {
      this.webAuthnEditingName = this.userDetail.webauthn[index].name
      this.webAuthnEditingIndex = index
      this.renameDialog = true
    },
    /**
     * Send a request to rename a WebAuthn device
     */
    async editWebAuthnConfirm () {
      if (this.renameDialogLoading) {
        this.renameDialog = false
        return
      }
      if (this.webAuthnEditingName === null || this.webAuthnEditingName.length > 30) {
        return
      }
      if (this.webAuthnEditingName === this.userDetail.webauthn[this.webAuthnEditingIndex].name) {
        this.renameDialog = false
        this.webAuthnEditingIndex = 0
        return
      }
      this.renameDialogLoading = true
      let requestFailed = false
      const response = await this.$axios.$post('/api/webauthn/rename/', {
        id: this.userDetail.webauthn[this.webAuthnEditingIndex].id,
        name: this.webAuthnEditingName
      }).catch(() => {
        this.renameDialogLoading = false
        this.renameDialog = false
        this.webAuthnEditingIndex = 0

        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        this.renameDialogLoading = false
        this.renameDialog = false
        this.webAuthnEditingIndex = 0

        this.userDetail.webauthn = response.data
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.renameDialogLoading = false
          this.renameDialog = false
          this.webAuthnEditingIndex = 0

          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          this.deletingWebAuthnIndex = 0
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    /**
     * Delete a WebAuthn device
     * @param {number} index WebAuthn device index
     */
    deleteWebAuthn (index) {
      this.deletingWebAuthnIndex = index
      this.deleteDialog = true
    },
    /**
     * Send a request to delete a WebAuthn device
     */
    async deleteWebAuthnConfirm () {
      if (this.deleteDialogLoading) {
        this.deleteDialog = false
        return
      }
      this.deleteDialogLoading = true
      let requestFailed = false
      const response = await this.$axios.$get('/api/webauthn/delete/', {
        params: {
          id: this.userDetail.webauthn[this.deletingWebAuthnIndex].id
        }
      }).catch(() => {
        this.deleteDialogLoading = false
        this.deleteDialog = false
        this.deletingWebAuthnIndex = 0

        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        this.deleteDialogLoading = false
        this.deleteDialog = false
        this.deletingWebAuthnIndex = 0

        this.userDetail.webauthn = response.data
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.deleteDialogLoading = false
          this.deleteDialog = false
          this.deletingWebAuthnIndex = 0

          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          this.deletingWebAuthnIndex = 0
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    /**
     * Start a progress to connect to a service
     * @param {string} service Service name
     */
    async connectTo (service) {
      if (service === 'spotify') {
        this.connectingSpotifyLoading = true
        let requestFailed = false
        const response = await this.$axios.$get('/api/connect/spotify/start/').catch(() => {
          this.connectingSpotifyLoading = false

          requestFailed = true
          this.snackbarText = 'Request failed.'
          this.snackbarSuccess = false
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
          const spotify = open(`https://accounts.spotify.com/authorize?response_type=code&client_id=13dc8c98ed7246d8932f00232515c505&scope=${encodeURIComponent('playlist-read-private user-read-recently-played user-top-read user-follow-read')}&redirect_uri=${encodeURIComponent('https://kmp.yrc.me/api/connect/spotify/')}&state=${response.data.state}`, 'spotify', 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=500,height=800')
          this.connectingSpotifyTimer = setInterval(async () => {
            if (spotify.closed) {
              await this.verifyAuth(true)
              this.connectingSpotifyLoading = false
              window.clearInterval(this.connectingSpotifyTimer)
              this.connectingSpotifyTimer = null
            }
          }, 500)
        } else {
          // Error
          if (response.reason === 'Login expired.') {
            logout(this, true)
          } else {
            this.connectingSpotifyLoading = true

            this.snackbarText = response.reason
            this.snackbarSuccess = false
            this.snackbar = false
            this.deletingWebAuthnIndex = 0
            Vue.nextTick(() => {
              this.snackbar = true
            })
          }
        }
      }
    },
    /**
     * Send a request to disconnect with a service
     * @param {string} service Service name
     */
    async disconnectConfirm (service) {
      if (this[`disconnect${service}Loading`]) {
        this[`disconnect${service}Loading`] = false
        return
      }
      if (service !== 'Spotify') {
        return
      }
      this[`disconnect${service}Loading`] = true
      let requestFailed = false
      const response = await this.$axios.$get('/api/user/disconnect/', {
        params: {
          service: service.toLowerCase()
        }
      }).catch(() => {
        this[`disconnect${service}Loading`] = false
        this[`disconnect${service}Dialog`] = false

        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        this[`disconnect${service}Loading`] = false
        this[`disconnect${service}Dialog`] = false

        this.userDetail.connections = response.data
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this[`disconnect${service}Loading`] = false
          this[`disconnect${service}Dialog`] = false

          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          this.deletingWebAuthnIndex = 0
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    },
    /**
     * Ask for password before to deleting current account
     */
    deleteAccountAskPassword () {
      this.deleteAccountBeforeDialog = false
      this.deleteAccountDialog = true
    },
    /**
     * Send a request to delete current account :-(
     */
    async deleteAccountConfirm () {
      if (this.deleteAccountLoading) {
        this.deleteAccountDialog = false
        return
      }
      if (this.deleteAccoundPassword.length < 8 || this.deleteAccoundPassword.length > 64 || this.deleteAccoundPassword.includes(' ')) {
        return
      }
      this.deleteAccountLoading = true
      let requestFailed = false
      const response = await this.$axios.$post('/api/user/delete/', { password: this.deleteAccoundPassword }).catch(() => {
        this.deleteAccountLoading = false
        this.deleteAccountDialog = false
        this.deleteAccoundPassword = ''

        requestFailed = true
        this.snackbarText = 'Request failed.'
        this.snackbarSuccess = false
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
        // Account deleted, goodbye
        this.deleteAccountLoading = false
        this.deleteAccountDialog = false

        localStorage.removeItem('auth')
        localStorage.removeItem('user')
        this.$store.commit('user/update', false)
        this.$router.replace('/?deleted=true')
      } else {
        // Error
        if (response.reason === 'Login expired.') {
          logout(this, true)
        } else {
          this.deleteAccountLoading = false
          this.deleteAccountDialog = false
          this.deleteAccoundPassword = ''

          this.snackbarText = response.reason
          this.snackbarSuccess = false
          this.snackbar = false
          this.deletingWebAuthnIndex = 0
          Vue.nextTick(() => {
            this.snackbar = true
          })
        }
      }
    }
  },
  head () {
    return {
      title: 'Settings'
    }
  }
}
</script>

<style lang="scss" scoped>
#settings {
  .settings-block {
    top: 0;
    min-height: 100%;
  }
  .settings-left {
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
  .settings-right {
    position: absolute;
    right: 0;
    width: 65%;
    padding: 50px;
    .connections-btn-icon {
      margin-right: 10px;
    }
    .settings-input {
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
.huge-icon {
  font-size: 100px!important;
}
@media (max-width: 370px) {
  .dialog-icon-p {
    display: none;
  }
}
</style>
