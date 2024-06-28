<template>
  <div>
    <ValidationObserver ref="forgot_pass" v-slot="{ handleSubmit }">
      <form class="sign_form" @submit.prevent="handleSubmit(forgotPassword)">
        <ValidationProvider
          name="email"
          v-slot="{ errors }"
          rules="required|email"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <label>
              <input
                type="text"
                @input="checkLength(email)"
                name="email"
                v-model="email"
                placeholder="Email address"
              />
              <span class="field_name">Email address</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <div class="actions_block">
          <router-link
            custom
            class="back_btn icon_left"
            to="/auth/login"
            v-slot="{ navigate, href }"
          >
            <a :href="href" @click="navigate">Back</a>
          </router-link>

          <div class="submit_btn">
            <button type="submit" aria-label="login">Send</button>
          </div>
        </div>
      </form>
    </ValidationObserver>
    <SuccessFailPopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      :checkout_status="200"
      text="Check your e-mail"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      email: null,
      openConfirm: false
    }
  },
  methods: {
    ...mapActions(["userForgotPass"]),
    async forgotPassword() {
      const payload = {
        email: this.email
      }

      await this.userForgotPass(payload)
        .then((res) => {
          if (res.data.success) {
            this.openConfirm = true
            // this.$router.push("/auth/login")
          }
        })
        .catch((err) => {
          if (err) {
            this.$refs.forgot_pass.setErrors({
              email: ["Could not find any user"]
            })
          }
        })
    },
    checkLength(value) {
      if (value.length > 50) {
        this.email = value.slice(0, 50)
      }
    }
  },
  components: {
    SuccessFailPopup
  }
}
</script>
