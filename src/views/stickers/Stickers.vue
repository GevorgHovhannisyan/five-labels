<template>
  <div class="content">
    <div class="products_page">
      <div class="page_container">
        <h1 class="section_title">Stickers</h1>
        <ul class="stickers_list">
          <li v-for="(sticker, index) in stickers" :key="index">
            <div class="sticker_block">
              <div class="sticker_image">
                <img
                  :src="getStickerImage(sticker)"
                  alt=""
                  title=""
                  width="232"
                  height="232"
                />
              </div>
              <div class="action_block">
                <div class="sticker_title">{{ sticker.title }}</div>
                <div class="prc_block">
                  <span class="field_name">Price</span>
                  <span class="field_name">$ {{ sticker.price }}</span>
                </div>

                <div class="qty_block">
                  <label>
                    <span class="field_name">Quantity</span>
                    <span
                      class="count_change decrease"
                      @click="
                        sticker.quantity !== 1 ? sticker.quantity-- : false
                      "
                    ></span>
                    <input
                      type="text"
                      @input="checkNumber($event, index)"
                      v-model="sticker.quantity"
                    />
                    <span
                      class="count_change increase"
                      @click="sticker.quantity++"
                    ></span>
                  </label>
                </div>

                <button
                  @click="addToCard(sticker)"
                  class="add_cart_btn"
                  aria-label="add to cart"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div class="empty_info" v-if="showEmpty">
          <img
            src="/images/empty_sticker.png"
            alt=""
            title=""
            width="483"
            height="342"
          />
        </div>
      </div>
    </div>
    <SuccessFailPopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      :checkout_status="api_status"
      :text="popText"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
import "@/assets/sass/products.scss"
export default {
  methods: {
    ...mapActions(["getStickers", "orderSticker", "getCartCount"]),
    async addToCard(sticker) {
      if (this.user) {
        await this.orderSticker({
          sticker_id: sticker.id,
          qty: sticker.quantity
        })
          .then(() => {
            this.popText = "Sticker added to cart"
            this.api_status = 200
            this.openConfirm = true
            this.getCartCount()
            // this.$store.commit("INCREASE_CART_COUNT")
          })
          .catch(() => {
            this.popText = "Something went wrong"

            this.api_status = 400
            this.openConfirm = true
          })
      } else {
        const carts = localStorage.getItem("local_carts")

        sticker.sticker_id = sticker.id
        // sticker.id = new Date().getTime()
        sticker.qty = sticker.quantity
        sticker.price_per_label = sticker.price

        if (carts && JSON.parse(carts).length) {
          let new_carts = JSON.parse(carts)

          if (new_carts.find((c) => c.sticker_id == sticker.sticker_id)) {
            const index = new_carts.findIndex(
              (c) => c.sticker_id == sticker.sticker_id
            )

            new_carts[index].qty = +new_carts[index].qty + +sticker.quantity
          } else {
            new_carts.push(sticker)
          }

          localStorage.setItem("local_carts", JSON.stringify(new_carts))
        } else {
          let new_carts = [sticker]
          localStorage.setItem("local_carts", JSON.stringify(new_carts))
        }

        this.api_status = 200
        this.openConfirm = true
      }
    },
    checkNumber(event, index) {
      let value = event.target.value
      if (value && String(value).length > 6) {
        if (String(value)[0] == 0) {
          value = value.slice(1, 6)
        } else {
          value = value.slice(0, 6)
        }
      } else if (value && String(value).length) {
        if (String(value)[0] == 0) {
          if (String(value).length > 1) {
            value = value.slice(1, 6)
          } else {
            value = "1"
          }
        } else if (!Number.isInteger(+value)) {
          value = "1"
        }
      } else if (!String(value).length) {
        value = "1"
      }

      this.stickers[index].quantity = +value.replace(/[^0-9]/g, "")
    }
  },
  computed: {
    ...mapGetters(["stickers", "user"]),
    getStickerImage() {
      return (sticker) => {
        if (sticker.images && sticker.images.length) {
          return `${process.env.VUE_APP_API_URL}/${sticker.images[0].path}`
        } else {
          return require("@/assets/images/no_product_image.png")
        }
      }
    }
  },
  components: {
    SuccessFailPopup
  },
  data() {
    return {
      openConfirm: false,
      api_status: 200,
      showEmpty: false,
      popText: "Sticker added to cart"
    }
  },
  async created() {
    await this.getStickers().then(() => {
      if (!this.stickers.length) {
        this.showEmpty = true
      } else {
        this.showEmpty = false
      }
    })
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>
