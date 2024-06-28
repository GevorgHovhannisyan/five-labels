<template>
  <ValidationObserver ref="set_password" v-slot="{ handleSubmit }">
    <form class="recovery_form" @submit.prevent="handleSubmit(setNewPassword)">
      <div class="field_block">
        <label>
          <input type="text" name="email" v-model="email" disabled />
          <span class="field_name">Email</span>
        </label>
      </div>

      <ValidationProvider
        name="password"
        v-slot="{ errors }"
        rules="required|password"
        vid="confirm"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              :type="type"
              name="password_conf"
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
          <span class="popover_block icon_info">
            <ul>
              <li>At least 8 characters.</li>
              <li>At least 1 uppercase character.</li>
              <li>At least 1 number.</li>
              <li>A special character (ex. ! @ # ? /)</li>
            </ul>
          </span>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>

      <ValidationProvider
        name="password_conf"
        v-slot="{ errors }"
        rules="required|confirmed:confirm"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              :type="pass_conf"
              name="pass_confirm"
              v-model="login_data.password_conf"
              @input="checkLength(login_data.password_conf, 'password_conf')"
              class="password_field"
            />
            <span class="field_name">Confirm password</span>
            <span
              class="type_toggle"
              @click="
                pass_conf === 'password'
                  ? (pass_conf = 'text')
                  : (pass_conf = 'password')
              "
            ></span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>
      <div class="actions_block">
        <div class="submit_btn">
          <button type="submit" aria-label="login">Set new password</button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      email: null,
      login_data: {
        email: null,
        password: null
      },
      type: "password",
      pass_conf: "password"
    }
  },
  methods: {
    ...mapActions(["recoveryPassword", "userGetByToken", "userLogin"]),
    async setNewPassword() {
      const payload = {
        password: this.login_data.password,
        token: this.$route.params.token
      }

      await this.recoveryPassword(payload)
        .then((res) => {
          if (res.data.success) {
            const payload = {
              email: this.email,
              password: this.login_data.password
            }

            this.userLogin(payload)
            // this.$router.push("/auth/login")
          }
        })
        .catch((err) => {
          const error = err.response ? err.response.data : null
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
    checkLength(value, field) {
      if (value.length > 15) {
        this.login_data[field] = value.slice(0, 50)
      }
    }
  },
  async mounted() {
    const token = this.$route.params.token
    await this.userGetByToken(token)
      .then((res) => {
        const data = res.data
        if (data && data.email) {
          this.email = data.email
        }
      })
      .catch(() => {
        // const error = err.response ? err.response.data.message : null
        // if (error && error === "Wrong token!!") {
        //   console.log(error)
        // }
      })
  }
}
</script>

<style lng="sass"></style>
