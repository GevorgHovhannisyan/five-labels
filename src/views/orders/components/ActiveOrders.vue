<template>
  <div class="orders_inner">
    <button
      class="sidebar_toggle"
      for="sidebar_toggle"
      @click="openMenu"
    ></button>
    <h2 class="section_subtitle">
      Active orders
      <span class="count" v-if="cart_count.activeCount || cart_count.newCount"
        >({{ cart_count.activeCount + cart_count.newCount }})</span
      >
    </h2>
    <div class="card_items">
      <div
        class="empty_info"
        v-if="(user && showEmpty) || (!user && !userOrders.length)"
      >
        <img
          src="/images/active_empty.svg"
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
          <div class="status_track">
            <ul>
              <li
                :class="{
                  current:
                    isCurrent(order, 'new') ||
                    order.status === 'cart' ||
                    order.status === 'new' ||
                    order.status === 'inprocess'
                }"
              >
                <span>Order placed</span>
              </li>
              <li :class="{ current: isCurrent(order, 'ready') }">
                <span>Process</span>
              </li>
              <li
                :class="{
                  current:
                    order.status === 'shipped' || order.status === 'archived'
                }"
              >
                <span>Shipped</span>
              </li>
            </ul>
          </div>
          <!-- <a href="#" class="product_name mobile_name"
            >{{ order.track_number ? "# " + order.track_number : "" }} {{order.corner ? order.corner.name : ""}}
          </a> -->
          <div class="item_image">
            <img
              :src="getImage(order)"
              alt=""
              title=""
              sizes="(min-width: 960px) 200px, 160px"
            />
            <div class="track_number">
              <span class="info_label">Tracking number</span>
              <span class="number_info">{{
                order.track_number ? order.track_number : "In process"
              }}</span>
            </div>
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
          <div class="item_actions action_parent">
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
            <div class="item_qty active">
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
                  {{ getOrderPrice(order) }}
                </div>
              </div>
            </div>
            <div>
              <label
                @click="moveToArchives(order)"
                class="archive_button checkout_btn_archive icon_archive"
                v-if="
                  !order.user_archive &&
                  (order.status == 'shipped' || order.status == 'archived')
                "
              >
                Move to Archive
              </label>
              <label
                class="archive_button invoise_btn icon_archive"
                @click="getOrderInviose(order)"
              >
                Show invioce
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="checkout_status"
      :text="showText"
    />

    <div class="pdf_page" v-show="false">
      <div class="inner_pdf">
        <div class="pft_btn">
          <button class="close_btn">Close</button>
          <button class="print_btn_">Print</button>
        </div>
        <div class="project_logo">
          <img
            src="https://y2print.com/img/main_logo.795e1dbd.svg"
            title=""
            alt=""
          />
          <div class="asd">
            <span>Fivelabels</span>
            <div class="mail_block">info@fivelabels.com</div>
          </div>
        </div>
        <div class="invoice_text">Receipt</div>
        <div class="user_infos">
          <div class="user_inner">
            <div class="title_inner">Sold To:</div>
            <div class="inner_info">{{ getClientName(invoiseData.user) }}</div>
            <div class="inner_info">{{ getAddress(invoiseData.address) }}</div>
            <div class="inner_info">
              {{ invoiseData.address.city }} {{ invoiseData.address.state }}
              {{ invoiseData.address.postal_code }}
            </div>
            <div class="inner_info">United States</div>
          </div>

          <div class="user_inner">
            <div class="title_inner">Details</div>
            <div class="inner_info">Date: {{ getDate(invoiseData.date) }}</div>
            <div class="inner_info">Order ID: {{ invoiseData.order_id }}</div>
            <div class="inner_info">
              Charged to Mastercard: ****{{ invoiseData.payment_method.last4 }}
            </div>
          </div>
        </div>
        <table class="order">
          <tr>
            <th>Description</th>
            <th>qty</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Label</td>
            <td>{{ invoiseData.qty }}</td>
            <td>$ {{ invoiseData.price_per_label }}</td>
            <td>$ {{ invoiseData.price }}</td>
          </tr>
          <tr>
            <td>Shipping cost</td>
            <td></td>
            <td></td>
            <td>$ 0</td>
          </tr>
        </table>
        <div class="price_block">
          <div class="inner_price">
            <div class="price_title">Discount</div>
            <div class="price_title">$ {{ invoiseData.discount || 0 }}</div>
          </div>
          <div class="price_inner">
            <div class="title_inner">TOTAL</div>
            <div class="inner_info">$ {{ getTotalSum(invoiseData) }}</div>
          </div>
        </div>
      </div>

      <!-- <div class="inner_pdf">
        <div class="pft_btn">
          <button class="close_btn">Close</button>
          <button class="print_btn_">Print</button>
        </div>
        <div class="project_logo">
          <img src="/images/main_logo.svg" title="" alt="" />Fivelabels
        </div>
        <div class="invoice_text">Invoice Receipt</div>
        <div class="text_pdf">Do Not Pay</div>
        <div class="user_infos">
          <div class="user_inner">
            <div class="title_inner">Order ID:</div>
            <div class="inner_info">{{ invoiseData.order_id }}</div>
          </div>
          <div class="user_inner">
            <div class="title_inner">Order Date:</div>
            <div class="inner_info">{{ getDate(invoiseData.date) }}</div>
          </div>
          <div class="user_inner">
            <div class="title_inner">Sold To:</div>
            <div class="inner_info">{{ getClientName(invoiseData.user) }}</div>
            <div class="inner_info">{{ getAddress(invoiseData.address) }}</div>
            <div class="inner_info">
              {{ invoiseData.address.city }} {{ invoiseData.address.state }}
              {{ invoiseData.address.postal_code }}
            </div>
            <div class="inner_info">United States</div>
          </div>
        </div>
        <div class="title_inner details">Order Details</div>
        <table class="order">
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price per Label</th>
            <th style="width: 17%">Price</th>
          </tr>
          <tr>
            <td style="min-width: 230px">
              {{ invoiseData.material.title }}
              {{ invoiseData.sticker_id ? " Sticker" : " Custom lables" }}
            </td>
            <td>{{ invoiseData.qty }}</td>
            <td>$ {{ invoiseData.price_per_label }}</td>
            <td style="min-width: 52px">$ {{ invoiseData.price }}</td>
          </tr>
        </table>
        <div class="price_block">
          <div class="price_inner asd">
            <div class="title_inner shipping_title">Shipping cost</div>
            <div class="inner_info">
              Free
            </div>
          </div>

          <div class="price_inner" v-if="invoiseData.discount">
            <div class="title_inner shipping_title">Discount</div>
            <div class="inner_info">${{ invoiseData.discount }}</div>
          </div>

          <div class="price_inner">
            <div class="title_inner">Total</div>
            <div class="inner_info">${{ getTotalSum(invoiseData) }}</div>
          </div>
        </div>
        <div class="block_pdf">
          <div class="title_inner pay">Payment Methods</div>
          <div class="inner_info">
            Charged to Mastercard XXXXXXXXXXXX{{
              invoiseData.payment_method.last4
            }}
          </div>
        </div>
        <div class="title_inner track">Additional Information</div>
        <table class="info_table">
          <tr>
            <th>Tracing number</th>
          </tr>
          <tr>
            <td>
              {{ invoiseData.track_number ? invoiseData.track_number : "N/A" }}
            </td>
          </tr>
        </table>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { closeMenuBlock } from "@/helpers/utilsCustom"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import printStyle from "@/helpers/printStyle"
// import InvoisePdf from "../../../components/common/InvoisePdf.vue"

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
    totalPrice() {
      return (order) => {
        let total = 0
        total = order.shipping_price + order.price
        return (Math.round(total * 100) / 100).toFixed(2)
      }
    },
    isCurrent() {
      return (order, status) => {
        if (status == "shipped") {
          return order.status === "shipped" || order.status === "archived"
        } else {
          return order.status === status
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
        let date = this.$moment(dates).tz(time).format(`YYYY-MM-DD HH:mm`)
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
    getClientName() {
      return (user) => {
        if (user) {
          if (user.last_name) {
            return user.name + " " + user.last_name
          } else {
            return user.name
          }
        } else {
          return ""
        }
      }
    },
    getAddress() {
      return (address) => {
        let address_text = ""
        if (address) {
          if (address.address) {
            address_text += address.address
          }

          if (address.address2) {
            address_text += " " + address.address2
          }
        }
        return address_text
      }
    },
    getTotalSum() {
      return (invoiseData) => {
        const shipping = invoiseData.shipping_price || 0
        const discount = invoiseData.discount || 0
        return parseFloat(invoiseData.price + shipping - discount).toFixed(2)
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
    await this.getUserOrders({ order_type: "active" }).then(() => {
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
    ...mapActions([
      "getUserOrders",
      "orderCheckout",
      "moveToArchive",
      "getCartCount",
      "getUserOrder"
    ]),
    openMenu() {
      closeMenuBlock()
    },
    moveToArchives(order) {
      this.moveToArchive(order.id)
        .then(async () => {
          await this.getCartCount()
          setTimeout(() => {
            this.getUserOrders({ order_type: "active" }).then(() => {
              this.getCartCount()

              if (!this.userOrders.length) {
                this.showEmpty = true
              } else {
                this.showEmpty = false
              }
            })
          }, 400)

          this.checkout_status = 200
          this.showText = "The Order Moved to Archive"
          this.openSuccessFail = true
        })
        .catch((error) => {
          this.checkout_status = 400
          const message =
            error && error.response && error.response.data
              ? error.response.data.message
                ? error.response.data.message
                : error.response.data
              : "Something went wrong"

          if (message && typeof message == "string") {
            this.showText = message
            setTimeout(() => {
              this.openSuccessFail = true
            }, 300)
          } else {
            this.showText = "Something went wrong"
            setTimeout(() => {
              this.openSuccessFail = true
            }, 300)
          }
          // this.showText = "Something went wrong"
        })
    },
    async getOrderInviose(order) {
      await this.getUserOrder(order.id).then(async ({ data }) => {
        this.invoiseData = await data
        setTimeout(() => {
          const el = document.querySelector(".pdf_page").innerHTML
          this.printContent(el)
        }, 1500)

        // this.generatePDF()
      })
    },
    printContent(data) {
      // const styles = printStyle
      var mywindow = window.open("Invioce", "new div", "width=700,height=700")
      mywindow.document.write("<html><head><title></title>")
      mywindow.document.write(`<style type="text/css"> ${printStyle}  </style>`)
      mywindow.document.write("</head><body >")

      mywindow.document.write(data)

      mywindow.document.write("</body></html>")
      mywindow.document.title = "Order Information"

      let theScript = document.createElement("script")
      theScript.setAttribute("type", "text/javascript")

      const textHtml = `  function injectThis() {
        // The code you want to inject goes here

        const printBtn = document.querySelector(".print_btn_")
        const closeBtn = document.querySelector(".close_btn")
        printBtn.addEventListener("click", () => {
          document.querySelector('.inner_pdf').style.zoom = "100%"
          document.querySelector('.pft_btn').style.display = "none"
          window.focus() // necessary for IE >= 10
          window.print()
          document.querySelector('.pft_btn').style.display = "flex"
          document.querySelector('.inner_pdf').style.zoom = "70%"

        })

        closeBtn.addEventListener("click", () => {
           window.close();
        })
      }
      injectThis();
      `

      theScript.innerHTML = textHtml

      // theScript.innerHTML = injectThis.toString() + "\n injectThis();"
      mywindow.document.body.appendChild(theScript)
      return true
    }
  },
  data() {
    return {
      openSuccessFail: false,
      showText: "",
      showEmpty: false,
      checkout_status: 200,
      invoiseData: {
        user: {},
        address: {},
        material: {},
        payment_method: {}
      }
    }
  },
  components: {
    SuccessFailPopup
    // InvoisePdf
  },
  beforeDestroy() {
    this.$store.commit("EMPTY_ORDERS")
  }
}
</script>

<style scoped>
.product_name {
  cursor: default;
}

.action_parent {
  min-width: 300px;
}
</style>
