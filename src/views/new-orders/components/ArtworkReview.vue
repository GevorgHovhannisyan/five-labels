<template>
  <div class="custom_inner_block">
    <div class="col_inner">
      <h2 class="section_subtitle">Detailed information</h2>
      <ul class="details_list">
        <li>
          <span class="detail_type">Shape:</span>
          <span class="detail_info">{{ getShapeName }}</span>
        </li>
        <li v-if="getCornerName">
          <span class="detail_type">Corners:</span>
          <span class="detail_info">{{ getCornerName }}</span>
        </li>
        <li>
          <span class="detail_type">Roll direction:</span>
          <span class="detail_info">{{ getRollDirection }}</span>
        </li>
        <li>
          <span class="detail_type">Size:</span>
          <span class="detail_info">{{ getSizeName }}</span>
        </li>
        <li>
          <span class="detail_type">Finish:</span>
          <span class="detail_info">{{ getFinishName }}</span>
        </li>
        <li>
          <span class="detail_type">Material:</span>
          <span class="detail_info">{{ getMaterialName }}</span>
        </li>
        <li>
          <span class="detail_type">Quantity:</span>
          <span class="detail_info">{{
            calculate_data && calculate_data.quantity
              ? calculate_data.quantity
              : 0
          }}</span>
        </li>
        <li v-if="zip_code">
          <span class="detail_type">Zip code:</span>
          <span class="detail_info">{{ zip_code }}</span>
        </li>
      </ul>
      <div class="view_btns">
        <button
          @click="openConfirm = true"
          class="icon_image popup_btn"
          data-popup="approve_popup"
        >
          View your proof
        </button>
        <!-- <button
          class="icon_file popup_btn"
          data-popup="invoice_popup"
          @click="showInvoicePop"
        >
          Show invoice
        </button> -->
      </div>
      <div class="final_summary">
        <div class="output_field">
          <label>
            <span class="label">Enter custom quantity</span>
            <input
              name="qty"
              oninput="this.value=this.value.replace(/[^0-9]/g,'');"
              @input="setCustomQty"
              autocomplete="off"
              v-model="custom_qty"
            />
          </label>
        </div>
        <div class="price_block">
          <div class="price_includes">
            <div class="price_label">Price</div>
            <table>
              <tr>
                <td>Per label</td>
                <td>
                  $ {{ calculate_data ? calculate_data.pricePerLabel : 0 }}
                </td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>
                  <!-- $
                  {{
                    calculate_data && calculate_data.shippingCost
                      ? calculate_data.shippingCost
                      : 0
                  }} -->
                  Free
                </td>
              </tr>
            </table>
          </div>
          <div class="price_total">
            <div class="price_label">Total price</div>
            <div class="price_size">
              $
              {{ calculate_data ? calculate_data.total : 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns_block">
      <router-link custom :to="getRoute" v-slot="{ navigate, href }">
        <a :href="href" @click="navigate" class="back_btn icon_left">Back</a>
      </router-link>
      <!-- <a href="step5.php" class="back_btn icon_left">Back</a> -->

      <button @click="addToCart" class="add_cart_btn icon_cart">
        {{ !edited_order ? "Add to cart" : "Save changes" }}
      </button>
    </div>
    <ApprovePopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      @submitAction="openConfirm = false"
    />

    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="400"
      :text="errorMessage"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import ApprovePopup from "@/components/common/ViewApprovePopup"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      openConfirm: false,
      openInvoice: false,
      custom_qty: null,
      delayTimer: null,
      openSuccessFail: false,
      errorMessage: "Something went wrong"
    }
  },
  methods: {
    ...mapActions([
      "addOrderToCart",
      "calculateQuantity",
      "getCartCount",
      "updateUserOrder"
    ]),
    async addToCart() {
      if (this.user) {
        const formData = new FormData()
        formData.append("user_id", this.user.id)

        formData.append("product_id", this.product.service_id)
        formData.append("shape_id", this.product_shape)
        formData.append("die_id", this.product_size)
        formData.append("finishing_id", this.product_finish)
        formData.append("material_id", this.product_material)
        formData.append("shipping_price", this.calculate_data.shippingCost)
        formData.append("discount", 0)
        formData.append("count", 0)
        formData.append("label_direction_id", this.product_direction)
        formData.append("qty", this.quantity)

        // if (this.zip_code) {
        formData.append("postal_code", this.zip_code ? this.zip_code : "")
        // }
        formData.append("price", this.calculate_data.price)
        formData.append("price_per_label", this.calculate_data.pricePerLabel)

        if (!this.edited_order) {
          if (this.order_image) {
            formData.append("image", this.order_image)
          }

          if (this.original_image) {
            formData.append("original_image", this.original_image)
          }

          if (this.rotated_images && this.rotated_images.length) {
            for (let i = 0; i < this.rotated_images.length; i++) {
              const img = this.rotated_images[i]
              formData.append("rotated_images", img.file)
            }
          }

          await this.addOrderToCart(formData).then(() => {
            this.getCartCount()
            this.$store.commit("SHOW_LOADING", true)

            this.$router
              .push("/cart")
              .then(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
              .catch(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
          })
        } else {
          formData.append("id", this.edited_order)

          if (this.order_image && !this.order_image.path) {
            formData.append("image", this.order_image)
          }
          if (this.rotated_images.length && this.rotated_images[0].file) {
            for (let i = 0; i < this.rotated_images.length; i++) {
              const img = this.rotated_images[i]
              formData.append("rotated_images", img.file)
            }
          }
          await this.updateUserOrder({ payload: formData }).then(() => {
            // this.getCartCount()
            this.$store.commit("SHOW_LOADING", true)

            this.$router
              .push("/cart")
              .then(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
              .catch(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
          })
        }
      } else {
        const payload = {
          id: new Date().getTime(),
          product_id: this.product.service_id,
          shape_id: this.product_shape,

          shape: {
            name: this.getShapeName
          },
          corner: {
            name: this.getCornerName
          },
          label_direction: {
            name: this.getRollDirection
          },
          die: {
            name: this.getSizeName
          },
          finishing: {
            name: this.getFinishName
          },
          material: {
            name: this.getMaterialName
          },
          die_id: this.product_size,
          finishing_id: this.product_finish,
          material_id: this.product_material,
          discount: 0,
          label_direction_id: this.product_direction,
          qty: this.quantity,
          postal_code: this.zip_code,
          price: this.calculate_data.price,
          price_per_label: this.calculate_data.pricePerLabel,
          image: this.image_for_bulk,
          rotated_images: this.rotated_images,
          original_image: this.original_image,
          shipping_price: this.calculate_data.shippingCost
        }

        const carts = localStorage.getItem("local_carts")
        if (carts && JSON.parse(carts).length) {
          let new_carts = JSON.parse(carts)
          new_carts.push(payload)
          localStorage.setItem("local_carts", JSON.stringify(new_carts))
        } else {
          let new_carts = [payload]
          localStorage.setItem("local_carts", JSON.stringify(new_carts))
        }
        this.$store.commit("SHOW_LOADING", true)

        this.$router
          .push("/cart")
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      }
    },
    async calculate(qty) {
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

      await this.calculateQuantity({ params })
        .then(() => {
          this.$store.commit("SET_PRODUCT_INFORMATION", {
            quantity: +qty,
            custom_qty: true
          })
        })
        .catch(() => {
          if (this.custom_qty < this.order_min_quantity) {
            this.errorMessage =
              "The minimal quantity is " + this.order_min_quantity
          }
          setTimeout(() => {
            this.openSuccessFail = true
          }, 0)
          params.quantity = this.order_min_quantity

          this.calcAgain(params)
        })
    },
    async calcAgain(params) {
      await this.calculateQuantity({ params }).then(() => {
        this.$store.commit("SET_PRODUCT_INFORMATION", {
          quantity: this.calculate_data.quantity,
          custom_qty: true
        })
        this.custom_qty = this.calculate_data.quantity
      })
    },

    setCustomQty() {
      const that = this
      const custom_qty = this.custom_qty
      if (+custom_qty > this.order_max_quantity) {
        this.custom_qty = String(this.order_max_quantity)
      } else {
        this.custom_qty = custom_qty
      }

      clearTimeout(this.delayTimer)

      if (this.custom_qty) {
        if (String(custom_qty).length <= this.order_max_quantity) {
          this.delayTimer = setTimeout(() => {
            that.calculate(+this.custom_qty)
          }, 500)
        } else {
          this.custom_qty = String(this.order_max_quantity)
          that.calculate(+this.custom_qty)
        }
      }
    },
    showInvoicePop() {
      this.$root.$emit("showInvoice", {
        shape_name: this.getShapeName,
        corner_name: this.getCornerName,
        roll_direction: this.getRollDirection,
        size_name: this.getSizeName,
        finish_name: this.getFinishName,
        material_name: this.getMaterialName,
        quantity: this.calculate_data.quantity,
        labels: this.calculate_data.pricePerLabel,
        shipping: this.calculate_data.shippingCost,
        total_price: this.calculate_data.total,
        postal_code: this.zip_code
      })
    }
  },
  computed: {
    ...mapGetters([
      "user",
      "calculate_data",
      "shapes",
      "corners",
      "sizes",
      "finishes",
      "materials",
      "directions",
      "product_shape",
      "product_corner",
      "product_size",
      "product_finish",
      "product_material",
      "product_direction",
      "product",
      "quantity",
      "zip_code",
      "order_image",
      "image_for_bulk",
      "edited_order",
      "original_image",
      "rotated_images",
      "order_min_quantity",
      "order_max_quantity"
    ]),
    getShapeName() {
      if (this.shapes.length) {
        return this.shapes.find((s) => s.service_id === this.product_shape).name
      } else {
        return ""
      }
    },
    getCornerName() {
      if (this.corners.length) {
        const find = this.corners.find((s) => s.id === this.product_corner)
        if (find) {
          return find.label
        } else {
          // return "rounded"
          return ""
        }
      } else {
        return ""
      }
    },
    getRollDirection() {
      if (this.directions.length) {
        return this.directions.find(
          (s) => s.service_id === this.product_direction
        ).name
      } else {
        return ""
      }
    },
    getSizeName() {
      if (this.sizes.length) {
        const find = this.sizes.find((s) => s.service_id === this.product_size)
        if (find) {
          return `${find.width}" x ${find.height}"`
        } else {
          return ""
        }
      } else {
        return ""
      }
    },
    getFinishName() {
      if (this.finishes.length) {
        return this.finishes.find((s) => s.service_id === this.product_finish)
          .name
      } else {
        return ""
      }
    },
    getMaterialName() {
      if (this.materials.length) {
        return this.materials.find(
          (s) => s.service_id === this.product_material
        ).name
      } else {
        return ""
      }
    },
    getRoute() {
      const id = this.$route.params.id
      return id
        ? `/edit-order/customize-artwork/${id}`
        : "/new-order/customize-artwork"
    }
  },
  created() {
    if (!this.product) {
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"
      this.$router.push(page).catch(() => {})
    } else if (this.calculate_data) {
      this.custom_qty = this.calculate_data.quantity
    }
  },
  components: {
    ApprovePopup,
    SuccessFailPopup
  }
}
</script>
