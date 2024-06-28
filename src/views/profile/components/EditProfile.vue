<template>
  <div>
    <ValidationObserver ref="edit_profile" v-slot="{ handleSubmit }">
      <form
        class="account_form"
        @submit.prevent="handleSubmit(editUser)"
        @keydown.enter="$event.preventDefault()"
        autocomplete="off"
      >
        <div class="fields_group">
          <ValidationProvider
            name="Name"
            v-slot="{ errors }"
            slim
            rules="required|alpha_spaces"
          >
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="user_data.name"
                  type="text"
                  @input="checkLengthUser(user_data.name, 'name')"
                  name="Name"
                  placeholder="Name"
                />
                <span class="field_name">Name</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="Surname"
            v-slot="{ errors }"
            slim
            rules="required|alpha_spaces"
          >
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="user_data.last_name"
                  type="text"
                  @input="checkLengthUser(user_data.last_name, 'last_name')"
                  name="Surname"
                  placeholder="Surname"
                />
                <span class="field_name">Surname</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          <ValidationProvider name="email" v-slot="{ errors }" slim>
            <!-- rules="required|email" -->
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  type="text"
                  v-model="user_data.email"
                  name="email"
                  disabled
                  placeholder="Email address"
                />
                <span class="field_name">Email address</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          <ValidationProvider name="phone" v-slot="{ errors }" slim>
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  type="text"
                  v-model="user_data.phone"
                  name="phone"
                  v-facade="'(###) ###-####'"
                  placeholder="Phone"
                />
                <!-- @input="checkNumber(user_data.phone)" -->
                <span class="field_name">Phone</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
        <div class="actions_block" v-if="!canChangePass">
          <router-link class="cancel_btn" to="/profile/account-settings">
            Cancel
          </router-link>

          <button type="submit" class="save_btn" aria-label="save">Save</button>
        </div>
      </form>
    </ValidationObserver>
    <ValidationObserver
      ref="change_pass"
      v-slot="{ handleSubmit }"
      v-if="!user_data.google_id"
    >
      <form
        class="account_form"
        @submit.prevent="handleSubmit(changePass)"
        autocomplete="off"
      >
        <div class="additional_field" v-if="!user.google_id">
          <label class="checkbox_label">
            <input type="checkbox" name="pass_change" v-model="canChangePass" />
            <span class="check_btn">Change password</span>
          </label>
        </div>
        <div class="password_fields" v-show="canChangePass">
          <h2 class="section_subtitle">Change password</h2>

          <ValidationProvider
            name="old_password"
            v-slot="{ errors }"
            rules="required|password"
            slim
          >
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="old_pass"
                  :type="oldPassType"
                  placeholder="Old password"
                  name="old_password"
                  class="password_field"
                  @input="checkLength(old_pass, 'old_pass')"
                />
                <span class="field_name">Old password</span>
                <span
                  class="type_toggle"
                  @click="
                    oldPassType === 'password'
                      ? (oldPassType = 'text')
                      : (oldPassType = 'password')
                  "
                ></span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="password"
            v-slot="{ errors }"
            rules="required|password"
            vid="confirm"
            slim
          >
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  :type="newPassType"
                  name="password"
                  placeholder="Password"
                  v-model="password"
                  @input="checkLength(password, 'password')"
                  class="password_field"
                />
                <span class="field_name">Password</span>
                <span
                  class="type_toggle"
                  @click="
                    newPassType === 'password'
                      ? (newPassType = 'text')
                      : (newPassType = 'password')
                  "
                ></span>
                <span class="popover_block icon_info">
                  <ul>
                    <li>At least 8 characters.</li>
                    <li>At least 1 uppercase character.</li>
                    <li>At least 1 number.</li>
                    <li>A special character (ex. ! @ # ? /)</li>
                  </ul>
                </span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          <ValidationProvider
            name="password_conf"
            v-slot="{ errors }"
            rules="required|confirmed:confirm"
            slim
          >
            <div class="field_block" :class="{ has_error: errors[0] }">
              <label>
                <input
                  :type="confirmPassType"
                  name="password_repeate"
                  placeholder="Confirm password"
                  v-model="confirm_password"
                  @input="checkLength(confirm_password, 'confirm_password')"
                  class="password_field"
                />
                <span class="field_name">Confirm password</span>
                <span
                  class="type_toggle"
                  @click="
                    confirmPassType === 'password'
                      ? (confirmPassType = 'text')
                      : (confirmPassType = 'password')
                  "
                ></span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </div>
        <div class="actions_block" v-if="canChangePass">
          <router-link class="cancel_btn" to="/profile/account-settings">
            <!-- <button :href="href" @click="navigate" aria-label="cancel"> -->
            Cancel
            <!-- </button> -->
          </router-link>
          <button type="submit" class="save_btn" aria-label="save">Save</button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  data() {
    return {
      user_data: {
        name: null,
        email: null,
        last_name: null,
        phone: null,
        google_id: null
      },
      old_pass: null,
      canChangePass: false,
      oldPassType: "password",
      newPassType: "password",
      confirmPassType: "password",
      confirm_password: null,
      password: null
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    user() {
      this.bindUser(this.user)
    }
  },
  methods: {
    ...mapActions(["updateUser", "updateUserPassword", "userGet"]),
    async editUser() {
      await this.updateUser({ ...this.user_data, id: this.user.id })
        .then(() => {
          this.$router.push("/profile/account-settings")
        })
        .catch((error) => {
          if (error && error.response.data) {
            const message = error.response.data.message

            if (message && message === "Invalid Phone number") {
              this.$refs.edit_profile.setErrors({ phone: message })
            }
          }
        })
    },
    async changePass() {
      const payload = {
        id: this.user.id,
        old_password: this.old_pass,
        password: this.password
      }
      await this.updateUserPassword(payload)
        .then(() => {
          this.canChangePass = false
          this.old_pass = null
          this.password = null
          this.confirm_password = null
        })
        .catch((err) => {
          const error = err.response ? err.response.data.message : null
          if (error) {
            const error_obj = {}
            error_obj.old_password = [error]
            this.$refs.change_pass.setErrors(error_obj)
          }
        })
    },
    checkNumber() {
      this.user_data.phone = this.user_data.phone.replace(/[^0-9]/g, "")
      if (this.user_data.phone > 11) {
        this.user_data.phone = this.user_data.phone.slice(0, 11)
      }
    },
    checkLengthUser(event, type) {
      this.user_data[type] = event.slice(0, 35)
    },
    checkLength(value, field) {
      if (value.length > 50) {
        if (field === "confirm_password") {
          this[field] = value.slice(0, 50)
        } else {
          this[field] = value.slice(0, 50)
        }
      }
    },
    bindUser(user) {
      const data = JSON.parse(JSON.stringify(user))
      this.user_data.name = data.name
      this.user_data.email = data.email
      this.user_data.last_name = data.last_name
      this.user_data.phone = data.phone
      if (data.google_id) {
        this.user_data.google_id = data.google_id
      }
    }
  },
  async created() {
    await this.userGet(this.user.id).then((res) => {
      this.bindUser(res.data)
    })
  }
}
</script>

<style scoped>
.additional_field {
  padding-left: 0 !important;
  padding-bottom: 30px !important;
  padding-top: 18px !important;
}
</style>
