<template>
  <div>
    <ul class="methods_list">
      <li v-for="(pay_method, index) in payment_methods" :key="index">
        <div class="method_block" :class="{ default: pay_method.default }">
          <div class="card_block">
            <div class="card_logo">
              <img
                :src="getCardImage(pay_method.brand)"
                alt="MasterCard"
                title="MasterCard"
                :width="
                  pay_method.brand === 'visa' ||
                  pay_method.brand !== 'amex' ||
                  pay_method.brand !== 'discover'
                    ? 104
                    : 69
                "
                :height="pay_method.brand === 'visa' ? 33 : 64"
              />
            </div>
            <div class="card_number">
              <span>&#42;&#42;&#42;&#42;</span>
              <span>{{ pay_method.last4 }}</span>
            </div>
          </div>
          <div class="method_actions">
            <label class="checkbox_label">
              <input
                type="radio"
                @input="setDefault(pay_method)"
                :value="pay_method.id"
                v-model="checkedCard"
                name="default_method"
              />
              <span class="select_btn" data-checked="Default"
                >Make default</span
              >
            </label>
            <button
              class="popup_btn icon_delete2"
              aria-label="remove"
              @click="
                deletedCardId = pay_method.id
                openConfirm = true
              "
            ></button>
          </div>
        </div>
      </li>
      <li>
        <div class="method_block">
          <router-link
            custom
            class="add_cart_btn icon_plus"
            to="/profile/payment-methods/add-card"
            v-slot="{ navigate, href }"
          >
            <a :href="href" @click="navigate">Add new card</a>
          </router-link>
        </div>
      </li>
    </ul>

    <CardRemovePopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      @submitAction="removePayment"
    />

    <SuccessFailPopup
      :openPopup="failPopup"
      @closePopup="failPopup = false"
      :checkout_status="400"
      :text="failMessage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import CardRemovePopup from "@/components/common/CardRemovePopup"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      checkedCard: 1,
      deletedCardId: null,
      pay_methods: [
        { id: 1, img: "mastercard.svg" },
        { id: 2, img: "visa.svg" }
      ],
      openConfirm: false,
      failPopup: false,
      failMessage: "Something went wrong"
    }
  },
  methods: {
    ...mapActions([
      "getPaymentMethods",
      "removePaymentMethod",
      "updatePaymentMethods"
    ]),
    async removePayment() {
      await this.removePaymentMethod(this.deletedCardId)
        .then(() => {
          if (
            this.payment_methods.length &&
            !this.payment_methods.find((p) => p.default)
          ) {
            this.checkedCard = this.payment_methods[0].id
            this.setDefault(this.payment_methods[0])

            //         await this.getPaymentMethods().then(() => {
            //   if (this.payment_methods.length) {
            //     const pay = this.payment_methods.find((p) => p.default)
            //     if (pay) {
            //       this.checkedCard = pay.id
            //     }
            //   }
            // })
          }
        })
        .catch((error) => {
          const message =
            error && error.response && error.response.data
              ? error.response.data.message
                ? error.response.data.message
                : error.response.data
              : "Something went wrong"

          if (message && typeof message == "string") {
            this.failMessage = message
            setTimeout(() => {
              this.failPopup = true
            }, 300)
          } else {
            this.failMessage = "Something went wrong"
            setTimeout(() => {
              this.failPopup = true
            }, 300)
          }
        })
    },
    async setDefault(pay_method) {
      await this.updatePaymentMethods({
        id: pay_method.id,
        default_method: true
      }).then(() => {
        this.getPaymentMethods().then(() => {
          if (this.payment_methods.length) {
            const pay = this.payment_methods.find((p) => p.default)
            if (pay) {
              this.checkedCard = pay.id
            }
          }
        })
      })
    }
  },
  computed: {
    ...mapGetters(["payment_methods"]),
    getImg() {
      return (img) => {
        if (img) {
          return require(`../../../assets/images/${img}.svg`)
        }
      }
    },
    getCardImage() {
      return (brand) => {
        let img = "/images/"
        if (brand === "visa") {
          img += "visa-color.png"
        } else if (brand === "mastercard") {
          img += "mastercard.svg"
        } else if (brand === "discover") {
          img += "discover.webp"
        } else if (brand === "amex") {
          img += "amex.png"
        } else {
          img += "visa-color.png"
        }
        return img
      }
    }
  },
  async created() {
    this.checkedCard = null
    await this.getPaymentMethods().then(() => {
      if (this.payment_methods.length) {
        const pay = this.payment_methods.find((p) => p.default)
        if (pay) {
          this.checkedCard = pay.id
        }
      }
    })
  },
  components: {
    CardRemovePopup,
    SuccessFailPopup
  }
}
</script>
