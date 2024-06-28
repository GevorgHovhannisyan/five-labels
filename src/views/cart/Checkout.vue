<template>
  <div class="content">
    <div class="checkout_page">
      <div class="page_container">
        <h1 class="section_title">Checkout</h1>
        <div class="checkout_inner">
          <router-link custom :to="getPage" class="back_btn icon_left">
            Back
          </router-link>
          <ValidationObserver
            ref="add_card_form"
            slim
            v-slot="{ handleSubmit, reset }"
          >
            <form
              class="checkout_form"
              @submit.prevent="handleSubmit(checkoutOrders)"
              @reset.prevent="reset"
            >
              <div class="fields_group" :class="{ new_fields: add_address }">
                <h2 class="section_subtitle">Choose address</h2>
                <div class="available_list" v-if="addresses.length">
                  <div class="field_block full_field">
                    <span class="label">Shipping address</span>
                    <v-select
                      :options="addresses"
                      @input="addressChanged(address)"
                      v-model="address"
                      :clearable="false"
                      :searchable="false"
                      :reduce="(addresse) => addresse.id"
                    >
                      <template #open-indicator="{ attributes }">
                        <span v-bind="attributes" class="icon_down"></span>
                      </template>
                    </v-select>
                  </div>
                </div>
                <span
                  class="fields_toggle"
                  data-list="Choose from my addresses"
                  data-new="Add new address"
                  @click="add_address = !add_address"
                  v-if="addresses.length"
                ></span>
                <div
                  class="fields_inner state_block"
                  v-if="!addresses.length || add_address"
                >
                  <div class="field_block">
                    <label>
                      <span class="field_name">Country</span>
                      <v-select
                        v-model="country"
                        :options="countries"
                        :clearable="false"
                        disabled
                        :searchable="false"
                        label="english_name"
                        :selectable="(option) => option.alpha2_code === 'US'"
                        :reduce="(country) => country.alpha2_code"
                      >
                        <template #open-indicator="{ attributes }">
                          <span v-bind="attributes" class="icon_down"></span>
                        </template>
                      </v-select>
                    </label>
                  </div>

                  <ValidationProvider
                    name="state"
                    v-slot="{ errors }"
                    slim
                    rules="required"
                  >
                    <div class="field_block" :class="{ has_error: errors[0] }">
                      <span class="field_name">State</span>
                      <v-select
                        v-model="state"
                        :options="states"
                        :clearable="false"
                        label="name"
                        name="state"
                      >
                        <!-- :reduce="(state) => state.code" -->
                        <template #open-indicator="{ attributes }">
                          <span v-bind="attributes" class="icon_down"></span>
                        </template>
                      </v-select>

                      <span class="error_message">{{ errors[0] }}</span>
                    </div>
                  </ValidationProvider>

                  <div class="field_block" :class="{ has_error: addressError }">
                    <label>
                      <vue-google-autocomplete
                        ref="address_checkout"
                        name="address"
                        v-model="address_line"
                        v-on:keypress="keypress"
                        v-on:focus="focusAutoComplete"
                        id="map"
                        classname="form-control"
                        placeholder="Please type your address"
                        v-on:placechanged="getAddressData"
                        country="us"
                      >
                      </vue-google-autocomplete>

                      <span class="field_name">Address line</span>
                    </label>
                    <span class="error_message" v-if="addressError">{{
                      addressError
                    }}</span>
                  </div>

                  <ValidationProvider
                    name="city"
                    v-slot="{ errors }"
                    slim
                    rules="required"
                  >
                    <div class="field_block" :class="{ has_error: errors[0] }">
                      <label>
                        <input
                          type="text"
                          v-model="address_data.city"
                          @input="checkLength(address_data.city, 'city')"
                          name="city"
                          placeholder="Ex. Portland"
                        />
                        <span class="field_name">City</span>
                      </label>
                      <span class="error_message">{{ errors[0] }}</span>
                    </div>
                  </ValidationProvider>

                  <div class="field_block">
                    <label>
                      <input
                        type="text"
                        ref="address_line_2"
                        v-model="address2"
                        name="address-2"
                        placeholder="Please type your address 2"
                      />
                      <span class="field_name">Address line 2</span>
                    </label>
                  </div>

                  <ValidationProvider
                    name="zip_code"
                    v-slot="{ errors }"
                    slim
                    rules="required"
                  >
                    <div class="field_block" :class="{ has_error: errors[0] }">
                      <label>
                        <input
                          type="text"
                          v-model="address_data.postal_code"
                          name="zip_code"
                          @input="
                            checkLength(address_data.postal_code, 'postal_code')
                          "
                          placeholder="Ex. 94723"
                          oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                        />
                        <span class="field_name">Zip / Postal code</span>
                      </label>
                      <span class="error_message">{{ errors[0] }}</span>
                    </div>
                  </ValidationProvider>

                  <div class="additional_field">
                    <label class="checkbox_label">
                      <input
                        type="checkbox"
                        v-model="address_data.remember"
                        name="remember[]"
                      />
                      <span class="check_btn">Remember</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="fields_group" :class="{ new_fields: add_payment }">
                <h2 class="section_subtitle">Choose payment method</h2>
                <div class="cart_block">
                  <img src="/images/stripe.png" alt="stripe" title="stripe" />
                </div>

                <div class="available_list" v-if="payment_options.length">
                  <div class="field_block full_field">
                    <span class="label">Payment method</span>
                    <v-select
                      :options="payment_options"
                      v-model="payment_id"
                      :clearable="false"
                      :searchable="false"
                      :reduce="(payment) => payment.id"
                    >
                      <template #open-indicator="{ attributes }">
                        <span v-bind="attributes" class="icon_down"></span>
                      </template>
                    </v-select>
                  </div>
                </div>
                <span
                  class="fields_toggle"
                  data-list="Choose from my cards"
                  data-new="Add new card"
                  @click="add_payment = !add_payment"
                  v-if="payment_options.length"
                ></span>
                <div
                  class="fields_inner"
                  v-if="!payment_options.length || add_payment"
                >
                  <ValidationProvider
                    name="card_number"
                    v-slot="{ errors }"
                    slim
                    rules="required"
                  >
                    <div
                      class="field_block full_field"
                      :class="{ has_error: errors[0] }"
                    >
                      <label>
                        <input
                          type="text"
                          class="card_number"
                          v-model="payment_data.number"
                          @input="checkNumber($event)"
                          name="card_number"
                          oninput="this.value=this.value.replace(/[^0-9]/g,'');"
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
                    <div
                      class="field_block full_field"
                      :class="{ has_error: errors[0] }"
                    >
                      <label>
                        <input
                          type="text"
                          v-model="payment_data.cardholder_name"
                          @input="checkName($event)"
                          name="cardholder_name"
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
                          class="card_expire"
                          maxlength="5"
                          v-model="payment_data.expire"
                          @input="checkExpire($event)"
                          placeholder="MM/YY"
                          type="text"
                          name="card_expire"
                          data-validation="length"
                          data-validation-length="5"
                        />
                        <!-- oninput="this.value=this.value.replace(/[^0-9/]/g,'');" -->
                        <input
                          type="hidden"
                          data-name="SecureCard-expiryMonth"
                        />
                        <input
                          type="hidden"
                          data-name="SecureCard-expiryYear"
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
                          v-model="payment_data.cvc"
                          @input="checkcvc($event)"
                          type="text"
                          name="cvc"
                          oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                          data-validation="length"
                          data-validation-length="3"
                          maxlength="3"
                        />
                        <span class="popover_block icon_info">
                          <ul>
                            <li>
                              CVC code is an extra code printed on your debit or
                              credit card. With most cards it is the final three
                              digits of the number printed on the signature
                              strip on the reverse of your card.
                            </li>
                          </ul>
                        </span>

                        <span class="field_name">CVC</span>
                      </label>
                      <span class="error_message">{{ errors[0] }}</span>
                    </div>
                  </ValidationProvider>

                  <div class="additional_field">
                    <label class="checkbox_label">
                      <input
                        v-model="payment_data.remember"
                        type="checkbox"
                        name="remember[]"
                      />
                      <span class="check_btn">Remember</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="checkout_actions">
                <div class="total_price">
                  <div class="price_label">Total price</div>
                  <div class="price_size">$ {{ getTotal }}</div>
                </div>
                <button
                  type="submit"
                  class="checkout_btn"
                  aria-label="checkout"
                  @click="checkInvalids"
                >
                  Checkout
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
    <SuccessFailPopup
      :openPopup="openConfirm"
      @closePopup="completeOrder"
      :checkout_status="checkout_status"
      :text="popup_text"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import { check_card_expire, check_card_number } from "@/helpers/utilsCustom"
import { scrollFunction } from "@/helpers/validationScroll"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import VueGoogleAutocomplete from "vue-google-autocomplete"
import countries from "@/helpers/countries.json"
import states from "@/helpers/states.json"
import "@/assets/sass/checkout.scss"
/* eslint-disable */
export default {
  computed: {
    ...mapGetters(["checkout_info", "addresses"]),
    getTotal() {
      if (this.checkout_info && this.checkout_info.total) {
        return this.checkout_info.total
      } else {
        return 0
      }
    },
    getPage() {
      const page =
        this.$route.query && this.$route.query.page
          ? "/orders/" + this.$route.query.page
          : "/cart"
      return page
    }
  },

  async created() {
    await this.getAddresses(true).then(() => {
      if (this.addresses.length) {
        const defaultAddr = this.addresses.find((addr) => addr.default)
        if (defaultAddr) {
          this.address = defaultAddr.id
          this.saveAddress = defaultAddr
        } else {
          this.address = this.addresses[0].id
          this.saveAddress = this.addresses[0]
        }
      } else {
        this.add_address = true
      }
    })

    if (localStorage.getItem("cart_to_checkout")) {
      const check_info = JSON.parse(localStorage.getItem("cart_to_checkout"))

      this.$store.commit("SET_CHECKOUT_INFO", {
        order_ids: check_info.order_ids,
        total: check_info.total,
        quantities: check_info.quantities,
        orders: check_info.orders
      })

      if (this.address) {
        this.calculateOrders(check_info.orders)
      }
    }

    if (!this.checkout_info) {
      this.$router.push("/cart")
    }
    setTimeout(() => {
      detectContentHeight()
    }, 200)

    await this.getPaymentMethods({ noLoader: true }).then((response) => {
      let data = response.data
      if (data.length) {
        data.map((p) => {
          p.label = `${
            p.brand.charAt(0).toUpperCase() + p.brand.slice(1)
          }: **** **** **** ${p.last4}`
        })

        const defaultMethod = data.find((method) => method.default)
        if (defaultMethod) {
          this.payment_id = defaultMethod.id
        } else {
          this.payment_id = data[0].id
        }
      } else {
        this.add_payment = true
      }
      this.payment_options = data
    })
  },
  methods: {
    ...mapActions([
      "getAddresses",
      "getPaymentMethods",
      "orderCheckout",
      "getCartCount",
      "calculateQuantity",
      "updateUserOrder"
    ]),
    async checkoutOrders() {
      if (this.add_address && !this.address_correct) {
        this.addressError = "Address is invalid"
        return false
      }

      const payload = {
        payment: {},
        address: {},
        order_ids: this.checkout_info.order_ids
      }

      if (this.add_payment) {
        const exp_month = this.payment_data.expire.split("/")[0]
        const exp_year = this.payment_data.expire.split("/")[1]
        payload.payment.number = this.payment_data.number
        payload.payment.city = this.payment_data.city
        payload.payment.exp_month = exp_month
        payload.payment.exp_year = exp_year
        payload.payment.cvc = this.payment_data.cvc
        payload.payment.remember = this.payment_data.remember ? true : false

        if (!this.payment_data.default) {
          if (!this.payment_options.length) {
            payload.payment.default_method = true
          }
        } else {
          payload.payment.default_method = this.payment_data.default
        }
      } else {
        payload.payment.id = this.payment_id
      }

      if (this.add_address) {
        payload.address.country = this.country
        payload.address.city = this.address_data.city
        payload.address.state = this.state
        payload.address.postal_code = this.address_data.postal_code
        payload.address.address = this.address_line
        payload.address.address2 = this.address2
        payload.address.remember = this.address_data.remember ? true : false

        if (!this.address_data.default) {
          if (!this.addresses.length) {
            payload.address.default = true
          }
        } else {
          payload.address.default = this.address_data.default
        }
      } else {
        payload.address.id = this.address
      }

      if (this.add_address && !this.ordersCalculated) {
        await this.calculateOrders(this.checkout_info.orders)
        this.checkout_status = 200
        this.popup_text = "Your order updated, please submit again."
        this.ordersCalculated = true
        setTimeout(() => {
          this.openConfirm = true
        }, 300)
        return false
      }

      await this.orderCheckout(payload)
        .then(() => {
          this.checkout_status = 200
          this.popup_text = "Your order successfully confirmed"
          this.ordersCalculated = false
          setTimeout(() => {
            this.openConfirm = true
          }, 300)
          this.$store.commit("SET_CHECKOUT_INFO", null)
          localStorage.removeItem("cart_to_checkout")
          this.getCartCount()
        })
        .catch((error) => {
          const message =
            error && error.response && error.response.data
              ? error.response.data.message
                ? error.response.data.message
                : error.response.data
              : "Something went wrong"
          if (message && typeof message == "string") {
            this.checkout_status = 400
            this.popup_text = message
            setTimeout(() => {
              this.openConfirm = true
            }, 300)
          } else {
            this.checkout_status = 400
            this.popup_text = "Something went wrong"
            setTimeout(() => {
              this.openConfirm = true
            }, 300)
          }
        })
    },
    checkNumber() {
      const selector = document.querySelector(".card_number")
      const value = check_card_number(selector)
      this.payment_data.number = value
    },
    checkcvc(event) {
      this.payment_data.cvc = +event.target.value.replace(/[a-zA-Z]/i, "")
    },
    checkName(event) {
      if (event.target.value.length < 35) {
        this.payment_data.cardholder_name = event.target.value.replace(
          /[^a-zA-Z]+/g,
          ""
        )
        this.payment_data.cardholder_name = event.target.value.toUpperCase()
      } else {
        this.payment_data.cardholder_name = event.target.value
          .slice(0, 35)
          .toUpperCase()
      }
    },
    checkExpire(event) {
      this.payment_data.expire = check_card_expire(event.target.value)
    },
    completeOrder() {
      this.openConfirm = false
      if (!this.ordersCalculated) {
        if (this.checkout_status === 200) {
          this.$store.commit("SHOW_LOADING", true)
          setTimeout(() => {
            this.getCartCount()
            this.$router
              .push("/orders/active-orders")
              .then(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
              .catch(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
          }, 200)
        }
      }
    },
    checkLength(event, type) {
      this.ordersCalculated = false
      if (type === "country") {
        this.address_data.country = event.slice(0, 35)
      } else if (type === "city") {
        this.address_data.city = event.slice(0, 35)
      } else if (type === "region") {
        this.address_data.state = event.slice(0, 35)
      } else if (type === "postal_code") {
        this.address_data.postal_code = event.slice(0, 5)
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
    },
    getAddressData(addressData, placeResultData) {
      this.saveAddress = addressData

      let cityName = ""
      if (
        placeResultData &&
        placeResultData.address_components &&
        placeResultData.address_components
      ) {
        const components = placeResultData.address_components
        components.find((comp) => {
          if (comp.types && comp.types.length) {
            if (comp.types.includes("neighborhood")) {
              cityName = comp.long_name
                ? comp.long_name
                : comp.short_name
                ? comp.short_name
                : ""
            } else if (
              comp.types.includes("locality") &&
              comp.types.includes("political")
            ) {
              cityName = comp.long_name
                ? comp.long_name
                : comp.short_name
                ? comp.short_name
                : ""
            }
          }
        })
      }

      if (cityName) {
        this.address_data.city = cityName
      }

      if (addressData.administrative_area_level_1) {
        this.state = addressData.administrative_area_level_1
      }

      if (addressData.route) {
        setTimeout(() => {
          if (addressData.street_number) {
            this.$refs.address_checkout.update(
              addressData.street_number + " " + addressData.route
            )
            this.address_line =
              addressData.street_number + " " + addressData.route
          } else {
            this.$refs.address_checkout.update(addressData.route)
            this.address_line = addressData.route
          }
          this.address_correct = true
        }, 100)
      }
      if (addressData.postal_code) {
        this.address_data.postal_code = addressData.postal_code
      }
    },
    keypress() {
      this.addressError = false
      this.address_correct = false
    },
    focusAutoComplete() {
      if (!this.address_correct && this.saveAddress) {
        this.addressError = false
        this.getAddressData(this.saveAddress)
      }
    },
    async calculateOrders(orders) {
      let total = 0

      if (orders.length) {
        this.$store.commit("SHOW_LOADING", true)
        for (let i = 0; i < orders.length; i++) {
          const order = orders[i]
          if (!orders[i].sticker_id) {
            const params = {
              product_id: order.product_id,
              shape_id: order.shape_id,
              finish_id: order.finishing_id,
              material_id: order.material_id,
              die_id: order.die_id,
              direction_id: order.label_direction_id,
              quantity: order.qty,
              postal_code: this.add_address
                ? this.address_data.postal_code
                : this.saveAddress.postal_code
            }
            await this.calculateQuantity({ params, noLoader: true }).then(
              async (res) => {
                const calculate_data = res
                const updatePayload = {
                  id: order.id,
                  qty: order.qty,
                  postal_code: params.postal_code,
                  price: calculate_data.price,
                  price_per_label: calculate_data.pricePerLabel,
                  shipping_price: calculate_data.shippingCost
                }
                await this.updateUserOrder({
                  payload: updatePayload,
                  noLoader: true
                })
                total += calculate_data.total
              }
            )
          } else {
            total += order.price
          }
        }
        this.$store.commit("SHOW_LOADING", false)
      }

      const check_info = JSON.parse(localStorage.getItem("cart_to_checkout"))

      this.$store.commit("SET_CHECKOUT_INFO", {
        order_ids: check_info.order_ids,
        total: total,
        quantities: check_info.quantities,
        orders: check_info.orders
      })
    },
    addressChanged(address) {
      const findAddress = this.addresses.find((addr) => addr.id === address)
      console.log("findAddress", findAddress)
      this.saveAddress = findAddress
      const check_info = JSON.parse(localStorage.getItem("cart_to_checkout"))

      this.calculateOrders(check_info.orders)
    }
  },
  data() {
    return {
      add_address: false,
      add_payment: false,
      address: null,
      payment_options: [],
      address_data: {},
      payment_id: null,
      payment_data: {},
      openConfirm: false,
      checkout_status: 200,
      popup_text: "Your order successfully confirmed",
      countries,
      states,

      country: "US",
      state: "CA",
      address_line: null,
      address_not_correct: false,
      saveAddress: null,
      address_correct: false,
      addressError: false,
      address2: null,

      saveAddress: null,
      ordersCalculated: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      let recaptchaScript = document.createElement("script")
      recaptchaScript.setAttribute(
        "src",
        "https://maps.googleapis.com/maps/api/js?key=" +
          process.env.VUE_APP_GAPI_KEY +
          "&libraries=places"
      )
      document.head.appendChild(recaptchaScript)
    })
  },
  components: {
    SuccessFailPopup,
    VueGoogleAutocomplete
  }
}
</script>

<style lang="scss">
.checkout_form .vs__dropdown-toggle {
  min-height: 53px;
}
</style>
