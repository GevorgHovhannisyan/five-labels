<template>
  <div class="content">
    <div class="checkout_page">
      <div class="page_container">
        <h1 class="section_title">
          Cart
          <span class="count" v-if="userOrders.length"
            >({{ userOrders.length }})</span
          >
        </h1>
        <div class="card_inner">
          <div class="card_items">
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
                    type="checkbox"
                    @input="checkOrder(order)"
                    v-model="order.selected"
                  />
                  <span class="check_btn"></span>
                </label>
              </div>
              <div class="item_inner">
                <a href="#" class="product_name mobile_name"> </a>
                <div class="item_image">
                  <img
                    :src="getImage(order)"
                    alt=""
                    title=""
                    sizes="(min-width: 960px) 200px, (min-width: 768px) 180px, 160px"
                  />
                </div>
                <div class="item_details">
                  <a
                    v-if="user"
                    class="product_name"
                    :class="{ custom_a: !order.sticker_id }"
                    @click="!order.sticker_id ? editOrder(order) : false"
                  >
                    #{{ order.order_id }}
                  </a>
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
                      @click="toggleClick(index)"
                    ></span>
                    <a
                      class="edit_btn icon_edit custom_a"
                      v-if="!order.sticker_id && user"
                      @click="editOrder(order)"
                      >Edit</a
                    >
                    <span
                      @click="setDelId(order, index)"
                      class="delete_btn icon_delete"
                      >Remove</span
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
                          <td>
                            $
                            {{ getPriceLabel(order) }}
                          </td>
                        </tr>
                        <tr>
                          <td>Shipping</td>
                          <td>
                            <!-- $ {{ order.shipping_price || 0 }} -->
                            Free
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
          <div class="card_summary" v-if="userOrders.length">
            <div class="summary_inner">
              <h2 class="section_subtitle">Details</h2>
              <table>
                <tr>
                  <td>Labels price</td>
                  <td>$ {{ totalInfo.labels }}</td>
                </tr>
                <tr>
                  <td>Shipping price</td>
                  <td>Free</td>
                </tr>
                <tr v-if="totalInfo.discount">
                  <td>Discount</td>
                  <td>$ {{ totalInfo.discount }}</td>
                </tr>
                <tr class="total">
                  <td>Total price</td>
                  <td>$ {{ totalInfo.total }}</td>
                </tr>
              </table>
              <button
                @click="checkoutOrder"
                :disabled="!getOrderIds.length"
                class="checkout_btn"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
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
      </div>
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="400"
      :text="errorMessage"
    />
    <RemovePopup
      :openPopup="openDelCart"
      @closePopup="openDelCart = false"
      @submitAction="removeOrder"
    />
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from "vuex"
import { detectContentHeight, fix } from "@/helpers/mainHelper.js"
import RemovePopup from "@/components/common/RemoveCartPopup"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import "@/assets/sass/checkout.scss"
export default {
  computed: {
    ...mapGetters([
      "userOrders",
      "user",
      "cart_count",
      "calculate_data",
      "order_min_quantity",
      "order_max_quantity",
      "zip_code"
    ]),
    getImage() {
      return (order) => {
        if (this.user) {
          if (order.image) {
            let path = order.image.path
            if (order.sticker_id && order.image.length) {
              path = order.image[0].path
            }
            return `${process.env.VUE_APP_API_URL}/${path}`
          } else {
            return require("@/assets/images/no_product_image.png")
          }
        } else {
          if (order.sticker_id) {
            if (order.images) {
              if (Array.isArray(order.images) && order.images.length) {
                return `${process.env.VUE_APP_API_URL}/${order.images[0].path}`
              } else {
                return `${process.env.VUE_APP_API_URL}/${order.images.path}`
              }
            } else {
              return require("@/assets/images/no_product_image.png")
            }
          } else if (order.image) {
            if (Array.isArray(order.image) && order.image.length) {
              return `${process.env.VUE_APP_API_URL}/${order.image[0].path}`
            } else {
              return `${process.env.VUE_APP_API_URL}/${order.image.path}`
            }
          } else {
            return require("@/assets/images/no_product_image.png")
          }
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
    getOrdersArray() {
      const orders = this.userOrders.length
        ? this.userOrders.filter((o) => o.selected)
        : []
      return orders
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
    }
  },
  methods: {
    ...mapActions([
      "getUserOrders",
      "deleteOrder",
      "orderCheckout",
      "getCartCount",
      "calculateQuantity",
      "updateUserOrder",
      "getUserOrder",
      "bulkCarts"
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
          }

          if (order.postal_code) {
            params.postal_code = order.postal_code
          }

          that
            .calculateQuantity({ params })
            .then(() => {
              if (!this.user) {
                this.userOrders[index].qty = quantity
                this.userOrders[index].price = this.calculate_data.price
                this.userOrders[index].shipping_price =
                  this.calculate_data.shippingCost
                this.userOrders[index].price_per_label =
                  this.calculate_data.pricePerLabel
                localStorage.setItem(
                  "local_carts",
                  JSON.stringify(this.userOrders)
                )
                this.$store.commit("SET_USER_ORDERS", {
                  data: this.userOrders,
                  user: this.user
                })
              } else {
                const updatePayload = {
                  id: order.id,
                  qty: quantity
                }

                this.updateUserOrder({ payload: updatePayload }).then(
                  (order) => {
                    this.userOrders[index].qty = quantity
                    this.userOrders[index].shipping_price =
                      this.calculate_data.shippingCost
                    this.setOrderPrice(index, order)
                  }
                )
              }
            })
            .catch((err) => {
              if (quantity < this.order_min_quantity) {
                this.errorMessage =
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
        if (!this.user) {
          this.userOrders[index].qty = value.replace(/[^0-9]/g, "")
          localStorage.setItem("local_carts", JSON.stringify(this.userOrders))
          this.$store.commit("SET_USER_ORDERS", {
            data: this.userOrders,
            user: this.user
          })
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
      }
    },
    calcAgain(params, index, order) {
      setTimeout(() => {
        this.calculateQuantity({ params }).then(() => {
          if (!this.user) {
            this.userOrders[index].qty = params.quantity
            this.userOrders[index].price = this.calculate_data.price
            this.userOrders[index].shipping_price =
              this.calculate_data.shippingCost
            this.userOrders[index].price_per_label =
              this.calculate_data.pricePerLabel
            localStorage.setItem("local_carts", JSON.stringify(this.userOrders))
            this.$store.commit("SET_USER_ORDERS", {
              data: this.userOrders,
              user: this.user
            })
          } else {
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
          }
        })
      }, 0)
    },
    checkOrder(order) {
      if (!this.user) {
        this.$store.commit("SET_USER_ORDERS", {
          data: this.userOrders,
          user: this.user
        })
      }
    },
    changeQty(index, type) {
      if (this.user) {
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
            }

            if (this.userOrders[index].postal_code) {
              params.postal_code = this.userOrders[index].postal_code
            }

            that
              .calculateQuantity({ params })
              .then(() => {
                if (!this.user) {
                  this.userOrders[index].price = this.calculate_data.price
                  this.userOrders[index].shipping_price =
                    this.calculate_data.shippingCost
                  this.userOrders[index].price_per_label =
                    this.calculate_data.pricePerLabel
                  localStorage.setItem(
                    "local_carts",
                    JSON.stringify(this.userOrders)
                  )

                  this.$store.commit("SET_USER_ORDERS", {
                    data: this.userOrders,
                    user: this.user
                  })
                } else {
                  const updatePayload = {
                    id: this.userOrders[index].id,
                    qty: this.userOrders[index].qty
                  }
                  this.updateUserOrder({ payload: updatePayload }).then(
                    (order) => {
                      this.userOrders[index].shipping_price =
                        this.calculate_data.shippingCost
                      this.setOrderPrice(index, order)
                    }
                  )
                }
              })
              .catch((err) => {
                if (this.userOrders[index].qty < this.order_min_quantity) {
                  this.errorMessage =
                    "The minimal quantity is " + this.order_min_quantity
                }

                setTimeout(() => {
                  this.openSuccessFail = true
                }, 0)
                params.quantity = this.order_min_quantity

                this.calcAgain(params, index, this.userOrders[index])

                // this.openSuccessFail = true

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
      } else {
        let local_carts = localStorage.getItem("local_carts")
        if (local_carts && JSON.parse(local_carts).length) {
          let carts = JSON.parse(local_carts)
          if (
            type === "decrease" &&
            carts[index].qty != 1 &&
            carts[index].qty != 0
          ) {
            carts[index].qty--
          } else if (
            type === "increase" &&
            carts[index].qty &&
            String(carts[index].qty).length < 7
          ) {
            carts[index].qty++
          }

          if (!carts[index].sticker_id) {
            const that = this
            clearTimeout(this.delayTimer)

            this.delayTimer = setTimeout(() => {
              const params = {
                product_id: carts[index].product_id,
                shape_id: carts[index].shape_id,
                finish_id: carts[index].finishing_id,
                material_id: carts[index].material_id,
                die_id: carts[index].die_id,
                direction_id: carts[index].label_direction_id,
                quantity: carts[index].qty,
                order_id: carts[index].id
                // postal_code: carts[index].postal_code
              }

              if (carts[index].postal_code) {
                params.postal_code = carts[index].postal_code
              }

              that
                .calculateQuantity({ params })
                .then(() => {
                  carts[index].price = this.calculate_data.price
                  localStorage.setItem("local_carts", JSON.stringify(carts))
                  this.$store.commit("SET_USER_ORDERS", {
                    data: carts,
                    user: false
                  })
                })
                .catch((err) => {
                  this.openSuccessFail = true
                  this.$store.commit("SET_OLD_QTY", carts[index].id)
                  carts[index].qty = carts[index].saveQty
                })
            }, 700)
          }
          this.$store.commit("SET_USER_ORDERS", {
            data: carts,
            user: this.user
          })
        }
      }
    },
    async removeOrder() {
      if (this.user) {
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
      } else {
        let local_carts = localStorage.getItem("local_carts")
        if (local_carts && JSON.parse(local_carts).length) {
          let carts = JSON.parse(local_carts)
          carts.splice(this.orderDelIndex, 1)
          this.$store.commit("SET_USER_ORDERS", {
            data: carts,
            user: this.user
          })
          localStorage.setItem("local_carts", JSON.stringify(carts))
        }
      }
    },
    setDelId(order, index) {
      this.openDelCart = true

      if (this.user) {
        this.orderDelId = order.id
      } else {
        this.orderDelIndex = index
      }
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
      this.$store.commit("SHOW_LOADING", true)

      if (this.user) {
        this.$store.commit("SET_CHECKOUT_INFO", {
          order_ids: this.getOrderIds,
          total: this.totalInfo.total,
          orders: this.getOrdersArray,
          quantities
        })

        this.$router
          .push("/checkout")
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      } else {
        this.$store.commit("SET_CHECKOUT_INFO", {
          order_ids: this.getOrderIds,
          total: this.totalInfo.total,
          orders: this.getOrdersArray
        })
        this.$router
          .push({ path: "/auth/login", query: { page: "cart" } })
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      }
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
    },
    toggleClick(index) {
      this.userOrders[index].opened = this.userOrders[index].opened
        ? false
        : true
    },
    setOrderPrice(index, order) {
      const order_data = order
      this.userOrders[index].price = order_data.price
      this.userOrders[index].price_per_label = order_data.price_per_label
    }
  },
  async created() {
    const local_carts = localStorage.getItem("local_carts")

    if (local_carts && JSON.parse(local_carts).length) {
      let carts = JSON.parse(local_carts)
      const send_carts = []
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].sticker_id) {
          send_carts.push({
            sticker_id: carts[i].sticker_id,
            qty: carts[i].qty
          })
        } else {
          send_carts.push({
            product_id: carts[i].product_id,
            shape_id: carts[i].shape_id,
            die_id: carts[i].die_id,
            finishing_id: carts[i].finishing_id,
            material_id: carts[i].material_id,
            label_direction_id: carts[i].label_direction_id,
            count: 0,
            price: carts[i].price,
            discount: 0,
            qty: carts[i].qty,
            image: carts[i].image ? carts[i].image : null,
            price_per_label: carts[i].price_per_label,
            postal_code: carts[i].postal_code,
            rotated_images: carts[i].rotated_images,
            original_image: carts[i].original_image,
            shipping_price: carts[i].shipping_price
          })
        }
      }
      if (this.user) {
        await this.bulkCarts(send_carts).then(() => {
          this.getCartCount()
          localStorage.removeItem("local_carts")
        })
      }
    }

    if (this.user) {
      await this.getUserOrders({ order_type: "cart" }).then(() => {
        if (!this.userOrders.length) {
          this.showEmpty = true
        } else {
          this.showEmpty = false
        }
      })
    } else {
      let carts = localStorage.getItem("local_carts")
      if (carts && JSON.parse(carts).length) {
        let cart_list = JSON.parse(carts)

        this.$store.commit("SET_USER_ORDERS", {
          data: cart_list,
          user: this.user
        })
      }
    }
    if (localStorage.getItem("cart_to_checkout")) {
      const check_info = JSON.parse(localStorage.getItem("cart_to_checkout"))
      this.$store.commit("SET_CHECKOUT_INFO", {
        order_ids: check_info.order_ids,
        total: check_info.total,
        quantities: !this.user ? check_info.quantities : {},
        orders: check_info.orders
      })
      setTimeout(() => {
        this.$store.commit("SET_CHECKED_ORDERS", {
          data: check_info.order_ids,
          user: this.user,
          quantities: !this.user ? check_info.quantities : {},
          orders: check_info.orders
        })
      }, 200)
    }

    setTimeout(() => {
      detectContentHeight()
      fix()
    }, 300)
  },
  data() {
    return {
      openDelCart: false,
      orderDelId: null,
      orderDelIndex: null,
      delayTimer: null,
      openSuccessFail: false,
      showEmpty: false,
      errorMessage: "Something went wrong"
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

<style scoped>
.delete_btn,
.checkout_btn {
  cursor: pointer;
}
</style>
