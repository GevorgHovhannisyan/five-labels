<template>
  <div class="orders_inner">
    <button
      class="sidebar_toggle"
      for="sidebar_toggle"
      @click="openMenu"
    ></button>
    <h2 class="section_subtitle">
      Cart orders
      <span class="count" v-if="cart_count.cartCount"
        >({{ cart_count.cartCount }})</span
      >
    </h2>
    <div class="card_items">
      <div
        class="empty_info"
        v-if="(user && showEmpty) || (!user && !userOrders.length)"
      >
        <img
          src="/images/empty_cart.svg"
          alt=""
          title=""
          width="483"
          height="342"
        />
        <a
          class="custom_a start_btn"
          @click="$router.push('/new-order/configure-label')"
          >Get started</a
        >
      </div>
      <div
        class="card_item"
        :class="{ opened: order.opened }"
        v-for="(order, index) in userOrders"
        :key="index"
      >
        <div class="item_check">
          <label class="checkbox_label">
            <input
              name="product_select"
              v-model="order.selected"
              type="checkbox"
            />
            <span class="check_btn"></span>
          </label>
        </div>
        <div class="item_inner">
          <a class="product_name mobile_name custom_a"
            >#{{ order.track_number }}
          </a>
          <div class="item_image">
            <img
              :src="getImage(order)"
              alt=""
              title=""
              sizes="(min-width: 960px) 200px, 160px"
            />
          </div>
          <div class="item_details">
            <a class="product_name">#{{ order.order_id }}</a>
            <ul>
              <li>
                <span class="detail_type">Shape:</span>
                <span class="detail_info">{{
                  order.shape ? order.shape.name : ""
                }}</span>
              </li>
              <li v-if="order.corner">
                <span class="detail_type">Corners:</span>
                <span class="detail_info">{{
                  order.corner ? order.corner.name : ""
                }}</span>
              </li>
              <li>
                <span class="detail_type">Roll direction:</span>
                <span class="detail_info">{{ getRollName(order) }}</span>
              </li>
              <li>
                <span class="detail_type">Size:</span>
                <span class="detail_info">{{ getOrderSize(order) }}</span>
              </li>
              <li>
                <span class="detail_type">Finish:</span>
                <span class="detail_info">{{
                  order.finishing ? order.finishing.name : ""
                }}</span>
              </li>
              <li>
                <span class="detail_type">Material:</span>
                <span class="detail_info">{{
                  order.material ? order.material.name : ""
                }}</span>
              </li>
              <li>
                <span class="detail_type">Quantity:</span>
                <span class="detail_info">{{ order.qty }}</span>
              </li>
              <li v-if="order.postal_code">
                <span class="detail_type">Zip code:</span>
                <span class="detail_info">{{ order.postal_code }}</span>
              </li>
              <li>
                <span class="detail_type">Date:</span>
                <span class="detail_info">{{ getDate(order.date) }}</span>
              </li>
            </ul>
          </div>
          <div class="item_actions">
            <div class="actions_block">
              <span
                class="info_toggle"
                data-open="Show details"
                data-close="Hide details"
                @click="
                  order.opened ? (order.opened = false) : (order.opened = true)
                "
              ></span>
              <a
                class="edit_btn icon_edit custom_a"
                v-if="!order.sticker_id && user"
                @click="editOrder(order)"
                >Edit</a
              >
              <a
                href="#"
                class="delete_btn icon_delete"
                @click="
                  openDelCart = true
                  orderDelId = order.id
                "
                >Remove</a
              >
            </div>
            <div class="item_qty">
              <label>
                <span class="field_name">Quantity</span>
                <span
                  class="count_change decrease"
                  @click="changeQty(index, 'decrease')"
                ></span>
                <input
                  type="text"
                  v-model="order.qty"
                  @input="checkNumber($event, index, order)"
                />
                <span
                  class="count_change increase"
                  @click="changeQty(index, 'increase')"
                ></span>
              </label>
            </div>
            <div class="item_price">
              <div class="price_includes">
                <div class="price_label">Price</div>
                <table>
                  <tr>
                    <td>Per label</td>
                    <td>$ {{ getPriceLabel(order) }}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>
                      Free
                      <!-- $ {{ order.shipping_price || 0 }} -->
                    </td>
                  </tr>
                  <tr v-if="order.discount">
                    <td>Discount</td>
                    <td>$ {{ order.discount || 0 }}</td>
                  </tr>
                </table>
              </div>
              <div class="price_total">
                <div class="price_label">Total price</div>
                <div class="price_size">
                  $
                  {{ getCartTotal(order) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="summary_block" v-if="userOrders.length">
      <div class="price_includes">
        <div class="price_label">Price</div>
        <table>
          <tr>
            <td>Labels price</td>
            <td>$ {{ totalInfo.labels }}</td>
          </tr>
          <tr>
            <td>Shipping price</td>
            <td>
              Free
              <!-- $ {{ totalInfo.shipping }} -->
            </td>
          </tr>
          <tr v-if="totalInfo.discount">
            <td>Discount</td>
            <td>$ {{ totalInfo.discount }}</td>
          </tr>
        </table>
      </div>
      <div class="price_total" v-if="userOrders.length">
        <div class="price_label">Total price</div>
        <div class="price_size">$ {{ totalInfo.total }}</div>
      </div>
    </div>
    <div class="action_block" v-if="userOrders.length">
      <button
        href="checkout.php"
        @click="checkoutOrder"
        :disabled="!getOrderIds.length"
        class="checkout_btn"
      >
        Checkout
      </button>
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="400"
      :text="failMessage"
    />
    <RemovePopup
      :openPopup="openDelCart"
      @closePopup="openDelCart = false"
      @submitAction="removeOrder"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { closeMenuBlock } from "@/helpers/utilsCustom"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import RemovePopup from "@/components/common/RemoveCartPopup"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import "@/assets/sass/checkout.scss"
export default {
  computed: {
    ...mapGetters([
      "userOrders",
      "cart_count",
      "user",
      "order_min_quantity",
      "order_max_quantity",
      "calculate_data"
    ]),
    getImage() {
      return (order) => {
        if (order.image) {
          if (Array.isArray(order.image) && order.image.length) {
            return `${process.env.VUE_APP_API_URL}/${order.image[0].path}`
          } else {
            return `${process.env.VUE_APP_API_URL}/${order.image.path}`
          }
        } else {
          return require("@/assets/images/no_product_image.png")
        }
      }
    },
    getRollName() {
      return (order) => {
        let name = ""
        if (order.label_direction) {
          if (order.label_direction_id === 24) {
            name = order.label_direction.name
          } else {
            const nameSplit = order.label_direction.name.split(" ")
            if (nameSplit.length === 4) {
              name = nameSplit[1] + " " + nameSplit[2]
            }
          }
        }
        return name
      }
    },
    totalInfo() {
      const totalObj = {
        labels: 0,
        shipping: 0,
        discount: 0,
        total: 0
      }
      if (this.userOrders.length) {
        this.userOrders.map((o) => {
          if (o.selected) {
            if (+o.shipping_price) {
              totalObj.shipping += o.shipping_price
            }
            if (+o.discount) {
              totalObj.discount += o.discount
            }
            if (+o.price) {
              if (o.sticker_id) {
                totalObj.labels += o.price_per_label * o.qty
              } else {
                totalObj.labels += o.price
              }
            }
          }
        })
      }
      // let total_sum = totalObj.labels + totalObj.shipping
      let total_sum = totalObj.labels - totalObj.discount

      totalObj.total = (
        Math.round((total_sum + totalObj.shipping) * 100) / 100
      ).toFixed(2)
      totalObj.labels = (Math.round(totalObj.labels * 100) / 100).toFixed(2)
      return totalObj
    },
    getOrderIds() {
      const orders = this.userOrders.length
        ? this.userOrders.filter((o) => o.selected)
        : []
      let order_ids = []
      if (orders.length) {
        order_ids = orders.map((o) => o.id)
      }
      return order_ids
    },
    getPriceLabel() {
      return (order) => {
        if (order.sticker_id) {
          return (Math.round(order.price_per_label * 100) / 100).toFixed(2)
        } else {
          return order.price_per_label
            ? +parseFloat(order.price_per_label).toFixed(6)
            : 0
        }
      }
    },
    getDate() {
      return (dates) => {
        const time = Intl.DateTimeFormat().resolvedOptions().timeZone
        let date = this.$moment(dates).tz(time).format(`MM/DD/YYYY HH:mm`)
        return date
      }
    },
    getCartTotal() {
      return (order) => {
        const discount = order.discount ? order.discount : 0
        const shipping_price = order.shipping_price ? order.shipping_price : 0
        if (order.sticker_id) {
          return (Math.round((order.price - discount) * 100) / 100).toFixed(2)
        } else {
          return (
            Math.round((order.price + shipping_price - discount) * 100) / 100
          ).toFixed(2)
        }
      }
    },
    getOrderSize() {
      return (order) => {
        if (order.sticker_id) {
          return order.size_name
        } else {
          return order.die && order.die.width
            ? `${order.die.height}" x ${order.die.width}" `
            : order.die && order.die.name
            ? order.die.name
            : order.size
            ? `${order.size.height}" x ${order.size.width}"`
            : ""
        }
      }
    },
    getOrdersArray() {
      const orders = this.userOrders.length
        ? this.userOrders.filter((o) => o.selected)
        : []

      return orders
    }
  },
  methods: {
    ...mapActions([
      "getUserOrders",
      "deleteOrder",
      "orderCheckout",
      "getCartCount",
      "calculateQuantity",
      "updateUserOrder"
    ]),
    checkNumber(event, index, order) {
      let value = event.target.value

      if (value && +value > this.order_max_quantity) {
        value = String(this.order_max_quantity)
      } else if (value && String(value).length) {
        if (String(value)[0] == 0) {
          if (String(value).length > 1) {
            value = value.slice(1, 25)
          } else {
            value = "1"
          }
        } else if (!Number.isInteger(+value)) {
          value = "1"
        }
      } else if (!String(value).length) {
        value = "1"
      } else if (Number.isInteger(+value)) {
        value = "1"
      }

      const quantity = +value.replace(/[^0-9]/g, "")
      this.userOrders[index].qty = quantity
      order.qty = quantity

      if (!order.sticker_id) {
        const that = this
        clearTimeout(this.delayTimer)

        this.delayTimer = setTimeout(() => {
          const params = {
            product_id: order.product_id,
            shape_id: order.shape_id,
            finish_id: order.finishing_id,
            material_id: order.material_id,
            die_id: order.die_id,
            direction_id: order.label_direction_id,
            quantity: quantity,
            order_id: order.id
            // postal_code: order.postal_code
          }
          if (order.postal_code) {
            params.postal_code = order.postal_code
          }

          that
            .calculateQuantity({ params })
            .then(() => {
              this.userOrders[index].qty = quantity
              this.$store.commit("SET_USER_ORDERS", {
                data: this.userOrders,
                user: this.user
              })
              const updatePayload = {
                id: order.id,
                qty: quantity
              }

              this.updateUserOrder({ payload: updatePayload }).then((order) => {
                this.userOrders[index].qty = quantity
                this.userOrders[index].shipping_price =
                  this.calculate_data.shippingCost

                this.setOrderPrice(index, order)
              })
            })
            .catch(() => {
              if (quantity < this.order_min_quantity) {
                this.failMessage =
                  "The minimal quantity is " + this.order_min_quantity
              }

              setTimeout(() => {
                this.openSuccessFail = true
              }, 0)

              params.quantity = this.order_min_quantity
              this.calcAgain(params, index, order)
              // this.$store.commit("SET_OLD_QTY", order.id)
              // this.userOrders[index].qty = this.userOrders[index].saveQty
            })
        }, 700)
      } else {
        const updatePayload = {
          id: order.id,
          qty: quantity
        }
        const that = this
        clearTimeout(this.delayTimer)
        this.delayTimer = setTimeout(() => {
          that.updateUserOrder({ payload: updatePayload }).then((order) => {
            this.setOrderPrice(index, order)
          })
          that.userOrders[index].qty = value.replace(/[^0-9]/g, "")
        }, 700)
      }
    },
    calcAgain(params, index, order) {
      setTimeout(() => {
        this.calculateQuantity({ params }).then(() => {
          const updatePayload = {
            id: order.id,
            qty: params.quantity
          }

          this.updateUserOrder({ payload: updatePayload }).then((order) => {
            this.userOrders[index].qty = params.quantity
            this.userOrders[index].shipping_price =
              this.calculate_data.shippingCost

            this.setOrderPrice(index, order)
          })
        })
      }, 0)
    },
    changeQty(index, type) {
      if (
        type === "decrease" &&
        this.userOrders[index].qty != 1 &&
        this.userOrders[index].qty != 0
      ) {
        this.userOrders[index].qty--
      } else if (
        type === "increase" &&
        this.userOrders[index].qty &&
        this.userOrders[index].qty < this.order_max_quantity
      ) {
        this.userOrders[index].qty++
      }

      if (!this.userOrders[index].sticker_id) {
        const that = this
        clearTimeout(this.delayTimer)

        this.delayTimer = setTimeout(() => {
          const params = {
            product_id: this.userOrders[index].product_id,
            shape_id: this.userOrders[index].shape_id,
            finish_id: this.userOrders[index].finishing_id,
            material_id: this.userOrders[index].material_id,
            die_id: this.userOrders[index].die_id,
            direction_id: this.userOrders[index].label_direction_id,
            quantity: this.userOrders[index].qty,
            order_id: this.userOrders[index].id
            // postal_code: this.userOrders[index].postal_code
          }

          if (this.userOrders[index].postal_code) {
            params.postal_code = this.userOrders[index].postal_code
          }
          that
            .calculateQuantity({ params })
            .then(() => {
              const updatePayload = {
                id: this.userOrders[index].id,
                qty: this.userOrders[index].qty
              }
              this.updateUserOrder({ payload: updatePayload }).then((order) => {
                this.userOrders[index].shipping_price =
                  this.calculate_data.shippingCost
                this.setOrderPrice(index, order)
              })
            })
            .catch(() => {
              if (this.userOrders[index].qty < this.order_min_quantity) {
                this.failMessage =
                  "The minimal quantity is " + this.order_min_quantity
              }

              setTimeout(() => {
                this.openSuccessFail = true
              }, 0)

              params.quantity = this.order_min_quantity
              this.calcAgain(params, index, this.userOrders[index])

              // this.openSuccessFail = true
              // this.$store.commit("SET_OLD_QTY", this.userOrders[index].id)
              // this.userOrders[index].qty = this.userOrders[index].saveQty
            })
        }, 700)
      } else {
        const that = this
        clearTimeout(this.delayTimer)

        this.delayTimer = setTimeout(() => {
          const updatePayload = {
            id: this.userOrders[index].id,
            qty: this.userOrders[index].qty
          }
          that.updateUserOrder({ payload: updatePayload }).then((order) => {
            this.setOrderPrice(index, order)
          })
        }, 700)
      }
    },
    async removeOrder() {
      await this.deleteOrder(this.orderDelId).then(() => {
        this.getCartCount()

        this.getUserOrders({ order_type: "cart" }).then(() => {
          if (!this.userOrders.length) {
            this.showEmpty = true
          } else {
            this.showEmpty = false
          }
        })
      })
    },
    async checkoutOrder() {
      const quantities = {}
      for (let i = 0; i < this.getOrderIds.length; i++) {
        const findOrder = this.userOrders.find(
          (o) => o.id == this.getOrderIds[i]
        )
        if (findOrder) {
          quantities[this.getOrderIds[i]] = findOrder.qty
        }
      }

      this.$store.commit("SET_CHECKOUT_INFO", {
        order_ids: this.getOrderIds,
        total: this.totalInfo.total,
        orders: this.getOrdersArray,
        quantities
      })

      this.$store.commit("SHOW_LOADING", true)
      this.$router
        .push({ path: "/checkout", query: { page: "cart-orders" } })
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    },
    openMenu() {
      closeMenuBlock()
    },
    setOrderPrice(index, order) {
      const order_data = order
      this.userOrders[index].price = order_data.price
      this.userOrders[index].price_per_label = order_data.price_per_label
    },
    async editOrder(order) {
      // this.$store.commit("SET_EDIT_ORDER", { order })
      this.$store.commit("SHOW_LOADING", true)
      setTimeout(() => {
        this.$router
          .push(`/edit-order/configure-label/${order.id}`)
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      }, 200)
    }
  },
  async created() {
    await this.getUserOrders({ order_type: "cart" }).then(() => {
      if (!this.userOrders.length) {
        this.showEmpty = true
      } else {
        this.showEmpty = false
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
      setTimeout(() => {
        this.$store.commit("SET_CHECKED_ORDERS", {
          data: check_info.order_ids,
          user: true,
          quantities: check_info.quantities,
          orders: check_info.orders
        })
      }, 200)
    }
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  },
  data() {
    return {
      openDelCart: false,
      orderDelId: null,
      openSuccessFail: false,
      delayTimer: null,
      showEmpty: false,
      failMessage: "Something went wrong"
    }
  },
  components: {
    RemovePopup,
    SuccessFailPopup
  },
  beforeDestroy() {
    this.$store.commit("EMPTY_ORDERS")
  }
}
</script>
