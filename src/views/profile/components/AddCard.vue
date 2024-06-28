<template>
  <ValidationObserver ref="add_card_form" slim v-slot="{ handleSubmit, reset }">
    <form
      class="account_form"
      @submit.prevent="handleSubmit(sendCard)"
      @reset.prevent="reset"
    >
      <div class="fields_group">
        <ValidationProvider
          name="card_number"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block full_field" :class="{ has_error: errors[0] }">
            <label>
              <input
                type="text"
                class="card_number"
                name="card_number"
                v-model="number"
                @input="checkNumber($event)"
                data-validation="length"
                data-validation-length="19"
                maxlength="19"
                placeholder="XXXX-XXXX-XXXX-XXXX"
              />
              <span class="field_name">Card number</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
        <ValidationProvider
          name="cardholder_name"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block full_field" :class="{ has_error: errors[0] }">
            <label>
              <input
                type="text"
                name="cardholder_name"
                v-model="cardholder_name"
                @input="checkName($event)"
                placeholder="Ex. MICHAEL JACKSON"
              />
              <span class="field_name">Name on card</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
        <ValidationProvider
          name="card_expire"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <label>
              <input
                v-model="expire"
                class="card_expire"
                maxlength="5"
                placeholder="MM/YY"
                type="text"
                name="card_expire"
                data-validation="length"
                data-validation-length="5"
                @input="checkExpire($event)"
              />
              <span class="field_name">Expiry</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>
        <ValidationProvider
          name="cvc"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <label>
              <input
                type="text"
                name="cvc"
                v-model="cvc"
                @input="checkcvc($event)"
                maxlength="3"
              />

              <span class="popover_block icon_info">
                <ul>
                  <li>
                    CVC code is an extra code printed on your debit or credit
                    card. With most cards it is the final three digits of the
                    number printed on the signature strip on the reverse of your
                    card.
                  </li>
                </ul>
              </span>
              <!-- <span
                class="popover_block icon_info"
                data-popover="three digits on the back side of the card"
              ></span> -->
              <span class="field_name">CVC</span>
            </label>
          </div>
        </ValidationProvider>

        <div class="additional_field">
          <label class="checkbox_label">
            <input type="checkbox" v-model="default_card" name="set_default" />
            <span class="check_btn">Set as default</span>
          </label>
        </div>
      </div>
      <div class="actions_block">
        <router-link custom class="cancel_btn" to="/profile/payment-methods">
          Cancel
        </router-link>

        <!-- <button class="cancel_btn" >Cancel</button> -->
        <button class="save_btn" aria-label="save">Save</button>
      </div>
    </form>
    <SuccessFailPopup
      :openPopup="failpopup"
      @closePopup="failpopup = false"
      :checkout_status="400"
      :text="errMessage"
    />
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { check_card_expire, check_card_number } from "@/helpers/utilsCustom"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      cardholder_name: null,
      expire: null,
      cvc: null,
      number: null,
      exp_month: null,
      exp_year: null,
      default_card: false,
      failpopup: false,
      errMessage: null
    }
  },
  methods: {
    ...mapActions(["addCard"]),
    checkNumber() {
      const selector = document.querySelector(".card_number")
      const value = check_card_number(selector)
      this.number = value
    },
    checkcvc(event) {
      this.cvc = +event.target.value.replace(/[a-zA-Z]/i, "")
    },
    checkName(event) {
      if (event.target.value.length < 35) {
        this.cardholder_name = event.target.value.replace(/[^a-zA-Z]+/g, "")
        this.cardholder_name = event.target.value.toUpperCase()
      } else {
        this.cardholder_name = event.target.value.slice(0, 35).toUpperCase()
      }
    },
    checkExpire(event) {
      this.expire = check_card_expire(event.target.value)
      // var regExp = /(1[0-2]|0[1-9]|\d)\/(20\d{2}|19\d{2}|0(?!0)\d|[1-9]\d)/
      // var matches = regExp.exec(this.expire)
    },
    async sendCard() {
      const exp_month = this.expire.split("/")[0]
      const exp_year = this.expire.split("/")[1]
      const payload = {
        number: this.number,
        exp_month,
        exp_year,
        cvc: this.cvc
      }
      if (!this.default_card) {
        if (!this.payment_methods.length) {
          payload.default_method = true
        } else {
          payload.default_method = this.default_card ? true : false
        }
      } else {
        payload.default_method = this.default_card ? true : false
      }

      await this.addCard(payload)
        .then(() => {
          this.$router.push("/profile/payment-methods")
        })
        .catch((error) => {
          const message =
            error && error.response && error.response.data
              ? error.response.data.message
                ? error.response.data.message
                : error.response.data
              : "Something went wrong"

          if (message) {
            this.errMessage = message
            setTimeout(() => {
              this.failpopup = true
            }, 200)
          }
        })
    }
  },
  computed: {
    ...mapGetters(["payment_methods"])
  },
  components: {
    SuccessFailPopup
  }
}
</script>

<style></style>
