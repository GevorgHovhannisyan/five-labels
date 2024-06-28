<template>
  <ValidationObserver ref="register" v-slot="{ handleSubmit }">
    <form class="sign_form" @submit.prevent="handleSubmit(register)">
      <ValidationProvider
        name="Name"
        v-slot="{ errors }"
        rules="required|alpha_spaces"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              type="text"
              name="Name"
              v-model="reg_data.name"
              @input="checkLength(reg_data.name, 'name')"
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
        rules="required|alpha_spaces"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              type="text"
              name="Surname"
              v-model="reg_data.last_name"
              @input="checkLength(reg_data.last_name, 'last_name')"
              placeholder="Surname"
            />
            <span class="field_name">Surname</span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>

      <ValidationProvider
        name="email"
        v-slot="{ errors }"
        rules="required|email"
      >
        <div
          class="field_block"
          ref="mail_reg"
          :class="{ has_error: errors[0] }"
        >
          <label>
            <input
              type="text"
              name="email"
              v-model="reg_data.email"
              @input="checkLength(reg_data.email, 'email')"
              placeholder="Email address"
            />
            <span class="field_name">Email address</span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>
      <ValidationProvider name="phone" v-slot="{ errors }">
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              type="text"
              name="phone"
              v-facade="'(###) ###-####'"
              v-model="reg_data.phone"
              placeholder="Phone"
            />
            <!-- @input="checkNumber($event)" -->
            <span class="field_name">Phone</span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>

      <ValidationProvider
        name="password"
        v-slot="{ errors }"
        rules="required|password"
        vid="confirm"
      >
        <div class="field_block" :class="{ has_error: errors[0] }">
          <label>
            <input
              :type="passType"
              name="password"
              placeholder="Password"
              v-model="reg_data.password"
              @input="checkLength(reg_data.password, 'password')"
              class="password_field"
            />
            <span class="field_name">Password</span>
            <span
              class="type_toggle"
              @click="
                passType === 'password'
                  ? (passType = 'text')
                  : (passType = 'password')
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
              :type="passConfType"
              name="password_repeate"
              placeholder="Confirm password"
              @input="checkLength(confirm_password, 'confirm_password')"
              v-model="confirm_password"
              class="password_field"
            />
            <span class="field_name">Confirm password</span>
            <span
              class="type_toggle"
              @click="
                passConfType === 'password'
                  ? (passConfType = 'text')
                  : (passConfType = 'password')
              "
            ></span>
          </label>
          <span class="error_message">{{ errors[0] }}</span>
        </div>
      </ValidationProvider>

      <div class="actions_block">
        <div class="social_sign">
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
          <button type="submit" aria-label="register" @click="checkInvalids">
            Create
          </button>
        </div>
      </div>
    </form>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="loginUser"
      :checkout_status="200"
      text="Congratulations! Your account has been successfully created."
      :hasButton="true"
    />
  </ValidationObserver>
</template>

<script>
import { mapActions } from "vuex"
import { scrollFunction } from "@/helpers/validationScroll"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import { facade, filter } from "vue-input-facade"

const client_ids = process.env.VUE_APP_GAUTH
const client_secret = process.env.VUE_APP_GAUTH_CLIENT_SECRET
export default {
  data() {
    return {
      reg_data: {
        name: null,
        last_name: null,
        email: null,
        phone: null,
        password: null
      },
      confirm_password: null,

      passType: "password",
      passConfType: "password",
      address: "",
      openSuccessFail: false
    }
  },
  methods: {
    ...mapActions([
      "userRegister",
      "userLogin",
      "userGet",
      "authGoogle",
      "getCartCount",
      "getNotifications"
    ]),
    async register() {
      const payload = {
        name: this.reg_data.name,
        last_name: this.reg_data.last_name,
        email: this.reg_data.email,
        phone: this.reg_data.phone,
        password: this.reg_data.password
      }

      await this.userRegister(payload)
        .then(async () => {
          this.openSuccessFail = true
        })
        .catch((err) => {
          const error =
            err.response && err.response.data ? err.response.data.message : null
          if (error) {
            const error_obj = {}
            if (
              error === "An account with this email address already exists" ||
              error === "Invalid Email"
            ) {
              error_obj.email = [error]
              const left = this.$refs.mail_reg.getBoundingClientRect().left
              const top = this.$refs.mail_reg.getBoundingClientRect().top

              window.scrollTo({
                top: top,
                left: left,
                behavior: "smooth"
              })
            } else if (error === "Invalid Phone number") {
              error_obj.phone = [error]
            }
            this.$refs.register.setErrors(error_obj)
          }
        })
    },
    async loginUser() {
      this.openSuccessFail = false

      await this.userLogin({
        email: this.reg_data.email,
        password: this.reg_data.password
      }).then((res) => {
        this.userGet(res.data.user.id)
      })
    },
    checkNumber() {
      if (this.reg_data.phone < 11) {
        this.reg_data.phone = this.reg_data.phone.replace(/[^0-9]/g, "")
      } else {
        this.reg_data.phone = this.reg_data.phone
          .replace(/[^0-9]/g, "")
          .slice(0, 11)
      }
      // this.reg_data.phone = this.reg_data.phone.replace(/[^0-9]/g, "")
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
    },
    checkLength(value, field) {
      if (field === "password") {
        if (value.length > 50) {
          this.reg_data[field] = value.slice(0, 50)
        }
      } else if (field === "confirm_password") {
        if (value.length > 50) {
          this.confirm_password = value.slice(0, 50)
        }
      } else if (field === "name" || field === "last_name") {
        if (value.length > 35) {
          this.reg_data[field] = value.slice(0, 35)
        }
      } else if (field === "email") {
        if (value.length > 50) {
          this.reg_data[field] = value.slice(0, 50)
        }
      }
    }
    // getAddressData(addressData, placeResultData, id) {
    //   this.address = addressData;
    //   console.log({placeResultData, id});
    // }
  },
  mounted() {
    const that = this

    window.gapi.load("auth2", async () => {
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
              that.$root.$emit("initFirebase")
            })
            .catch((error) => {
              if (error && error.response.data && error.response.data.message) {
                const message = error.response.data.message
                if (
                  message &&
                  message ===
                    "An account with this email address already exists"
                ) {
                  that.$refs.register.setErrors({ email: [message] })
                }
              }
            })
        }
      })
    })
  },
  components: {
    // InputFacade ,
    SuccessFailPopup
  },
  directives: { facade },
  filters: { facade: filter }
}
</script>
