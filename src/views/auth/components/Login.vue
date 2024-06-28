<template>
  <ValidationObserver ref="log_in" v-slot="{ handleSubmit }">
    <form class="sign_form" @submit.prevent="handleSubmit(login)">
      <ValidationProvider
        name="email"
        v-slot="{ errors }"
        rules="required|email"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              v-model="login_data.email"
              type="text"
              name="email"
              placeholder="Email address"
              @input="checkLength(login_data.email, 'email')"
            />
            <span class="field_name">Email address</span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>

      <ValidationProvider name="password" v-slot="{ errors }" rules="required">
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              :type="type"
              name="password"
              v-model="login_data.password"
              @input="checkLength(login_data.password, 'password')"
              placeholder="Password"
              class="password_field"
            />
            <span class="field_name">Password</span>
            <span
              class="type_toggle"
              @click="
                type === 'password' ? (type = 'text') : (type = 'password')
              "
            ></span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>
      <div class="additional_fields">
        <label class="checkbox_label">
          <input
            type="checkbox"
            v-model="login_data.remember"
            name="remember"
          />
          <span class="check_btn">Remember</span>
        </label>
        <router-link
          custom
          class="login_link"
          to="/auth/forgot-password"
          v-slot="{ navigate, href }"
        >
          <a :href="href" @click="navigate">Forgot password</a>
        </router-link>
      </div>
      <div class="actions_block">
        <div class="social_sign">
          <!-- <div class="sign_label">Log in with</div> -->
          <a class="custom_a" ref="signinBtn">
            <img
              src="/images/google.svg"
              alt=""
              title=""
              width="24"
              height="24"
            />
            Sign with Google
          </a>
        </div>
        <div class="submit_btn">
          <button type="submit" aria-label="login" @click="checkInvalids">
            Log in
          </button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapActions } from "vuex"
import { scrollFunction } from "@/helpers/validationScroll"
// import { openNotif } from "@/helpers/mainHelper"
// const client_ids = process.env.VUE_APP_GAUTH_CLIENT_ID
// const client_secret = process.env.VUE_APP_GAUTH_CLIENT_SECRET

export default {
  data() {
    return {
      login_data: {
        email: null,
        password: null,
        remember: false
      },
      type: "password"
    }
  },
  mounted() {
    const that = this
    window.gapi.load("auth2", async () => {
      const client_ids = process.env.VUE_APP_GAUTH
      const client_secret = process.env.VUE_APP_GAUTH_CLIENT_SECRET
      console.log("client_ids", client_ids)
      console.log(
        "envs",
        process.env.VUE_APP_API_URL,
        process.env.STRIPE_API_KEY
      )

      const auth2 = await window.gapi.auth2.init({
        client_id: client_ids,
        client_secret: client_secret,
        plugin_name: "chat",
        scope: "profile email"
      })

      await auth2.attachClickHandler(this.$refs.signinBtn, {}, () => {
        if (auth2.isSignedIn.get()) {
          var profile = auth2.currentUser.get().getBasicProfile()
          that
            .authGoogle({
              google_id: profile.getId(),
              email: profile.getEmail(),
              name: profile.getGivenName(),
              last_name: profile.getFamilyName()
            })
            .then(() => {
              that.getCartCount()
              that.getNotifications()
              // openNotif()
              this.$root.$emit("initFirebase")
            })
            .catch((error) => {
              if (error && error.response.data && error.response.data.message) {
                const message = error.response.data.message
                if (
                  message &&
                  message ===
                    "An account with this email address already exists"
                ) {
                  that.$refs.log_in.setErrors({ email: [message] })
                }
              }
            })
        }
      })
    })
  },
  methods: {
    ...mapActions([
      "userLogin",
      "authGoogle",
      "getCartCount",
      "getNotifications"
    ]),
    async login() {
      const payload = {
        email: this.login_data.email,
        password: this.login_data.password,
        remember: this.login_data.remember
      }

      await this.userLogin(payload)
        .then(() => {
          // openNotif()
          this.getCartCount()
          this.getNotifications()
          this.$root.$emit("initFirebase")
        })
        .catch((err) => {
          const error = err.response ? err.response.data.message : null
          if (error) {
            const error_obj = {}

            if (error === "Wrong password") {
              error_obj.password = [error]
            } else {
              error_obj.email = [error]
            }
            this.$refs.log_in.setErrors(error_obj)
          }
        })
    },
    checkLength(value, type) {
      if (type === "email") {
        if (value.length > 50) {
          this.login_data[type] = value.slice(0, 50)
        }
      } else {
        if (value.length > 50) {
          this.login_data[type] = value.slice(0, 50)
        }
      }
    },
    checkInvalids() {
      setTimeout(() => {
        const errorField = document.querySelectorAll(".has_error")
        const header = document.querySelector(".header")
        if (errorField && errorField.length) {
          let scrollElement = errorField[0]
          scrollFunction(scrollElement.offsetTop, header.offsetHeight)
        }
      }, 300)
    }
  }
}
</script>

<style lng="sass"></style>
