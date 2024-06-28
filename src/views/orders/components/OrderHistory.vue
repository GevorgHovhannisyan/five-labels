<template>
  <div class="orders_inner">
    <button
      class="sidebar_toggle"
      for="sidebar_toggle"
      @click="openMenu"
    ></button>
    <h2 class="section_subtitle">
      Order history
      <span class="count" v-if="cart_count.historyCount"
        >({{ cart_count.historyCount }})</span
      >
    </h2>
    <div class="card_items">
      <div
        class="empty_info"
        v-if="(user && showEmpty) || (!user && !userOrders.length)"
      >
        <img
          src="/images/history_empty.svg"
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
            </div>
            <div class="item_qty">
              <label>
                <span class="field_name">Quantity</span>
                <span class="qty_number">{{ order.qty }}</span>
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
                  {{ getOrderPrice(order) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { closeMenuBlock } from "@/helpers/utilsCustom"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  computed: {
    ...mapGetters(["userOrders", "cart_count", "user"]),
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
    getOrderPrice() {
      return (order) => {
        const discount = order.discount ? order.discount : 0
        const shipping = order.shipping_price ? order.shipping_price : 0
        if (!order.sticker_id) {
          return (
            Math.round((order.price - discount + shipping) * 100) / 100
          ).toFixed(2)
        } else {
          return (
            Math.round(
              (order.price_per_label * order.qty - discount + shipping) * 100
            ) / 100
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
    }
  },
  async created() {
    await this.getUserOrders({ order_type: "archived" }).then(() => {
      if (!this.userOrders.length) {
        this.showEmpty = true
      } else {
        this.showEmpty = false
      }
    })
    setTimeout(() => {
      detectContentHeight()
    }, 200)
  },
  methods: {
    ...mapActions(["getUserOrders", "orderCheckout"]),
    openMenu() {
      closeMenuBlock()
    }
  },
  data() {
    return {
      showEmpty: false
    }
  },
  beforeDestroy() {
    this.$store.commit("EMPTY_ORDERS")
  }
}
</script>
