<template>
  <div class="custom_inner_block">
    <div class="col_inner">
      <h2 class="section_subtitle">Quantity &#38; pricing</h2>
      <div class="popular_qty">
        <span class="label" v-if="quantities.length">Quantity</span>
        <label v-for="(qty, index) in quantities" :key="index">
          <input
            @input="calculateQty(qty.quantity, false)"
            v-model="selected_quantity"
            name="popular_quantity"
            :value="qty.quantity"
            type="radio"
          />
          <span class="radio_btn">
            <span class="count_block">{{ qty.quantity }} labels</span>
            <span class="price_size">$ {{ qty.price }}</span>
            <span class="unit_price"
              >( Per label: $
              {{ qty.pricePerLabel }}
              )</span
            >
          </span>
        </label>
      </div>
      <div
        class="custom_qty"
        :class="{ no_quantity: !quantities.length }"
        data-label="or"
      >
        <div class="output_field">
          <label>
            <span class="label">Enter custom quantity</span>
            <input
              @input="setCustomToStore"
              name="qty"
              @keyup.enter="customQtyDelay"
              v-model="custom_qty"
              oninput="this.value=this.value.replace(/[^0-9]/g,'');"
            />
          </label>
        </div>
        <div class="cost_size">
          <span class="label">Cost</span>
          <span class="size_block">$ {{ custom_cost }}</span>
        </div>
        <div class="calc_btn">
          <button @click="customQtyDelay" aria-label="calculate">
            Calculate
          </button>
        </div>
      </div>
      <div class="shipping_info">
        <div class="title_block">
          <!-- Enter your zip code for the shipping price -->
        </div>
        <!--  <div class="shipping_fields">
           <div class="output_field">
            <label>
              <span class="label">Zip code</span>
              <input
                name="zip"
                v-model="shipping_zip"
                @input="setShippingZip(shipping_zip, false)"
                @focusout="zipSet"
                oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                @keyup.enter="zipSet"
              />
            </label>
          </div> -->
        <!--   <div class="shipping_price">
            <span class="label">Shipping price</span>
            <div class="price_size">
               $ {{ calculate_data ? calculate_data.shippingCost : 0 }} 
            Free
            </div>
          </div>
        </div>-->
      </div>
      <div class="summary_block">
        <div class="price_includes">
          <div class="price_label">Price</div>
          <table>
            <tr>
              <td>Per label</td>
              <td>$ {{ calculate_data ? calculate_data.pricePerLabel : 0 }}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>
                <!-- $ {{ calculate_data ? calculate_data.shippingCost : 0 }} -->
                Free
              </td>
            </tr>
          </table>
        </div>
        <div class="price_total">
          <div class="price_label">Total price</div>
          <div class="price_size">
            $ {{ calculate_data ? calculate_data.total : 0 }}
          </div>
        </div>
      </div>
    </div>
    <div class="btns_block">
      <router-link custom :to="getRoute" v-slot="{ navigate, href }">
        <a :href="href" @click="navigate" class="back_btn icon_left">Back</a>
      </router-link>

      <button @click="quantityPricingNextHandler" class="next_btn icon_right">
        Next
      </button>
    </div>
    <SuccessFailPopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      :checkout_status="400"
      :text="errorMessage"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"

export default {
  methods: {
    ...mapActions(["getQuantity", "calculateQuantity", "getAddresses"]),
    quantityPricingNextHandler() {
      if (this.calculate_data) {
        //&& this.validZip
        this.$store.commit("SHOW_LOADING", true)
        const id = this.$route.params.id
        const page = id
          ? `/edit-order/artwork-uploading/${id}`
          : "/new-order/artwork-uploading"
        this.$router
          .push(page)
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      } else {
        // if (this.validZip) {
        this.errorMessage = "Please calculate a product"
        this.openConfirm = true
        // }
      }
    },
    async calculateQty(qty, custom, fromZip) {
      if (!custom) {
        this.$store.commit("CLEAR_STEPS_DATA", "quantity-pricing")
        this.custom_qty = null
        this.custom_cost = 0
      }
      const params = {
        product_id: this.product.service_id,
        shape_id: this.product_shape,
        finish_id: this.product_finish,
        material_id: this.product_material,
        die_id: this.product_size,
        direction_id: this.product_direction,
        quantity: qty
      }

      if (this.zip_code) {
        params.postal_code = this.zip_code
      }

      this.$store.commit("SET_PRODUCT_INFORMATION", {
        quantity: +qty,
        custom_qty: custom
      })
      await this.calculateQuantity({ params })
        .then(() => {
          if (this.calculate_data) {
            if (this.custom_quantity) {
              this.totalPrice = this.calculate_data.total * this.custom_qty
            } else {
              this.totalPrice = this.calculate_data.total * this.quantity
            }
          } else {
            return "$ 0"
          }
        })
        .catch((err) => {
          let message
          if (
            fromZip &&
            err &&
            err.response.data &&
            err.response.data.message &&
            err.response.data.message ===
              "something went wrong please try later"
          ) {
            message = "Wrong zip code"
            this.$store.commit("SET_PRODUCT_INFORMATION", {
              zip_code: null,
              shippingCost: null
            })
            this.shipping_zip = null

            this.calculateQty(qty, custom, false)
          } else {
            message =
              err && err.response && err.response.data
                ? err.response.data.message
                  ? err.response.data.message
                  : err.response.data
                : "Something went wrong"
          }

          if (typeof message == "string") {
            this.errorMessage = message

            if (message === "Invalid zip code") {
              this.$store.commit("SET_PRODUCT_INFORMATION", {
                zip_code: null,
                shippingCost: null
              })
              this.shipping_zip = null
            }

            setTimeout(() => {
              this.openConfirm = true
            }, 300)
          } else if (
            err &&
            err.response.status &&
            err.response.status === 400
          ) {
            this.$store.commit("SET_CALCULATE", null)
            this.errorMessage = "Something went wrong"
            this.totalPrice = 0
            this.custom_cost = 0
            this.openConfirm = true
          }
        })
    },
    customQtyDelay() {
      if (this.custom_qty) {
        if (+this.order_min_quantity && +this.custom_qty < 100) {
          this.errorMessage =
            "The minimal quantity is " + this.order_min_quantity
          this.openConfirm = true
          this.custom_qty = 100
        }

        this.calculateQty(this.custom_qty, true).then(() => {
          if (this.custom_qty && this.calculate_data) {
            this.selected_quantity = null
            this.custom_cost = this.calculate_data.price
          }
        })
      } else {
        this.openConfirm = true
        this.errorMessage = "Please write a quantity"
      }
    },
    setShippingZip(zip_code) {
      let value = zip_code
      if (value.length < 5) {
        this.shipping_zip = value.replace(/[^0-9]/g, "")
      } else {
        this.shipping_zip = value.slice(0, 5)
      }

      this.$store.commit("SET_PRODUCT_INFORMATION", {
        zip_code: +this.shipping_zip
      })
    },
    zipSet() {
      if (
        this.calculate_data &&
        "shippingCost" in this.calculate_data &&
        !this.calculate_data.shippingCost &&
        !this.shipping_zip
      ) {
      } else {
        const isCustom = this.custom_qty ? true : false
        this.calculateQty(this.quantity, isCustom, true)
      }
    },
    setCustomToStore() {
      if (String(this.custom_qty).length && String(this.custom_qty)[0] == "0") {
        this.custom_qty = String(this.custom_qty).slice(1, 22)
      }
      if (+this.custom_qty > this.order_max_quantity) {
        this.custom_qty = String(this.order_max_quantity)
      }
    },
    shipCostCalculate() {
      if (this.zip_code) {
        if (this.custom_qty) {
          this.calculateQty(this.quantity, true)
        } else {
          this.calculateQty(this.quantity, false)
        }
      } else {
        this.calculateQty(this.quantity, true)
      }
    }
  },
  computed: {
    ...mapGetters([
      "quantities",
      "calculate_data",
      "product",
      "product_shape",
      "product_finish",
      "product_material",
      "product_direction",
      "product_size",
      "custom_quantity",
      "quantity",
      "zip_code",
      "edited_order",
      "order_min_quantity",
      "order_max_quantity",
      "addresses",
      "user"
    ]),
    getRoute() {
      if (!this.$route.params.id) {
        return "/new-order/roll-direction"
      } else {
        return `/edit-order/roll-direction/${this.$route.params.id}`
      }
    }
  },
  async created() {
    if (!this.product) {
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"
      this.$router.push(page).catch(() => {})
    } else {
      const params = {
        product_id: this.product.service_id,
        shape_id: this.product_shape,
        finish_id: this.product_finish,
        material_id: this.product_material,
        die_id: this.product_size,
        direction_id: this.product_direction
      }
      await this.getQuantity(params).then(async () => {
        if (this.edited_order) {
          if (this.quantities.length) {
            const findQty = this.quantities.find(
              (q) => q.quantity == this.quantity
            )
            let fromZip = false
            if (this.zip_code) {
              this.shipping_zip = this.zip_code
              fromZip = true
            }
            if (findQty) {
              this.selected_quantity = findQty.quantity
              await this.calculateQty(findQty.quantity, false, fromZip)
            } else {
              this.selected_quantity = null
              this.custom_qty = this.quantity
              await this.calculateQty(this.quantity, true, fromZip)
              this.custom_cost = this.calculate_data.price
            }
          }
        } else if (this.calculate_data) {
          if (!this.quantity) {
            if (this.quantities.length) {
              this.calculateQty(this.quantities[0].quantity)
              this.selected_quantity = this.quantities[0].quantity
            }
          }

          if (this.custom_quantity) {
            this.selected_quantity = null
            this.custom_qty = this.quantity
            this.customQtyDelay()
          } else if (this.quantities.length) {
            const findQty = this.quantities.find(
              (q) => q.quantity === this.quantity
            )
            this.selected_quantity = findQty.quantity
            this.calculateQty(findQty.quantity, false)
          }

          if (this.zip_code) {
            this.shipping_zip = this.zip_code
          }
        } else {
          if (this.quantities.length) {
            if (this.user) {
              await this.getAddresses()
              if (this.addresses.length) {
                const defaultAddress = this.addresses.find(
                  (addr) => addr.default
                )
                if (defaultAddress) {
                  this.shipping_zip = defaultAddress.postal_code
                  this.$store.commit("SET_PRODUCT_INFORMATION", {
                    zip_code: +defaultAddress.postal_code
                  })
                }
              }
            }
            let fromZip = false
            if (this.shipping_zip) {
              fromZip = true
            }

            this.selected_quantity = this.quantities[0].quantity
            this.calculateQty(this.quantities[0].quantity, false, fromZip)
          }
        }
      })
    }
  },
  data() {
    return {
      selected_quantity: null,
      custom_qty: null,
      custom_cost: 0,
      shipping_zip: null,
      openConfirm: false,
      totalPrice: 0,
      errorMessage: "Something went wrong",
      delayTimer: null
      // validZip: true
    }
  },
  components: {
    SuccessFailPopup
  }
}
</script>

<style>
.no_quantity:before {
  content: none !important;
}
</style>
