<template>
  <div class="header">
    <div class="page_container">
      <div class="main_logo">
        <a href="/"
          ><img
            src="../../assets/images/main_logo.svg"
            alt=""
            title=""
            sizes="(min-width: 960px) 77px,(min-width: 576px) 63px, 50px"
        /></a>
        <img
          v-show="false"
          src="../../assets/images/main_logo.png"
          alt=""
          title=""
          sizes="(min-width: 960px) 77px,(min-width: 576px) 63px, 50px"
        />
      </div>
      <div class="menu_block">
        <div class="menu_inner">
          <ul class="profile_actions">
            <router-link custom to="/orders/active-orders" v-if="isTokenSet">
              <a
                :class="{ current_page: currentPage('orders') }"
                class="icon_order action_btn"
                @click="closeBurger()"
                >ORDERS</a
              >
            </router-link>
            <router-link
              v-if="isTokenSet"
              custom
              to="/profile/account-settings"
            >
              <a
                class="icon_user action_btn"
                :class="{ current_page: currentPage('profile') }"
                @click="closeBurger()"
                >PROFILE</a
              >
            </router-link>
          </ul>
          <ul class="menu_list">
            <li>
              <a class="submenu_btn custom_a">PRODUCTS</a>
              <ul class="submenu_list">
                <li
                  @click="
                    closeBurger()
                    closeManual()
                  "
                >
                  <router-link custom to="/custom-labels">
                    CUSTOM LABELS
                  </router-link>
                </li>
                <li
                  @click="
                    closeBurger()
                    closeManual()
                  "
                >
                  <router-link custom to="/stickers"> STICKERS </router-link>
                </li>
                <li
                  @click="
                    closeBurger()
                    closeManual()
                  "
                >
                  <router-link custom to="/sample-pack">
                    SAMPLE PACK
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="industires_list">
              <a
                class="submenu_btn custom_a"
                :class="{
                  custom_a: has_industries
                }"
              >
                <span @click="toIndustries">INDUSTRIES</span>
              </a>
              <ul class="submenu_list ind_submenu_list">
                <li
                  v-for="(menu, index) in content"
                  :key="index"
                  @click="
                    closeBurger()
                    closeIndustries()
                  "
                >
                  <router-link
                    custom
                    :to="{ path: `/industries/${menu.button_url}` }"
                  >
                    {{ menu.title }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li @click="closeBurger()">
              <router-link custom to="/about" v-slot="{ navigate, href }">
                <a :href="href" @click="navigate">ABOUT US</a>
              </router-link>
            </li>
            <li @click="closeBurger()">
              <router-link custom to="/help/faq" v-slot="{ navigate, href }">
                <a :href="href" @click="navigate">HELP</a>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="header_actions">
        <div class="notifications" :class="{ opened: openNotif }" v-if="user">
          <button
            class="notif_btn icon_notif"
            aria-label="notifications"
            @click="readNotifs"
          >
            <span class="items_count" v-if="unreadNotifs">{{
              unreadNotifs
            }}</span>
          </button>
          <div class="notifs_list">
            <div class="notifs_title">Notification</div>
            <ul v-if="notifications.length">
              <li
                class="popup_btn"
                @click="openNotification(message)"
                v-for="(message, index) in notifications"
                :key="index"
              >
                <div class="notif_info">
                  <div class="notif_title">{{ message.title }}</div>
                  <div class="notif_description">{{ message.description }}</div>
                  <div class="notif_date">
                    {{ $moment(message.create_date).format("DD.MM.YYYY") }}
                  </div>
                </div>
                <div class="notif_image" v-if="message.image">
                  <img :src="getImage(message.image)" width="80" height="80" />
                </div>
              </li>
            </ul>
            <div
              v-else
              style="padding: 0 25px 25px; font-size: 20px"
              class="notif_no"
            >
              There are no notifications
            </div>
          </div>
        </div>

        <router-link
          v-if="!isTokenSet"
          custom
          class="login_link"
          to="/auth/login"
          v-slot="{ navigate, href }"
        >
          <a :href="href" @click="navigate">LOG IN</a>
        </router-link>

        <router-link custom to="/cart" v-slot="{ navigate, href }">
          <a
            :href="href"
            class="action_btn icon_cart"
            @click="navigate"
            :class="{ current_page: currentPage('cart') }"
            >CART
            <span class="items_count" v-if="cart_count.cartCount">{{
              cart_count.cartCount
            }}</span>
          </a>
        </router-link>
        <button class="menu_btn">
          <span></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  methods: {
    ...mapActions([
      "getCartCount",
      "getContents",
      "getNotifications",
      "readNotification"
    ]),
    openNotification(message) {
      this.$root.$emit("showNotification", message)
      this.notif_opened = false
    },
    closeBurger() {
      document.querySelector("body").classList.remove("menu_opened")

      let menu_inner = document.querySelectorAll(".submenu_list.fixed")
      if (menu_inner && menu_inner.length) {
        for (let i = 0; i < menu_inner.length; i++) {
          menu_inner[i].classList.remove("fixed")
          menu_inner[i].classList.remove("no_scroll")
        }

        let no_scroll = document.querySelector(".menu_block.no_scroll")
        if (no_scroll) {
          no_scroll.classList.remove("no_scroll")
        }
      }
    },
    toIndustries() {
      if (this.has_industries) {
        this.closeManual()
        this.$store.commit("SHOW_LOADING", true)
        this.$router
          .push("/industries")
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      }
    },
    closeManual() {
      const activeItem = document.querySelector(".menu_list > li")
      if (activeItem.classList.contains("opened")) {
        activeItem.classList.remove("opened")
        document.querySelector(".submenu_list").style.display = "none"
      }
    },
    closeIndustries() {
      const activeItem = document.querySelector(".menu_list .industires_list")
      if (activeItem.classList.contains("opened")) {
        activeItem.classList.remove("opened")
        document.querySelector(".ind_submenu_list").style.display = "none"
      }
    },
    async readNotifs() {
      this.notif_opened = !this.notif_opened

      const reads = this.notifications.filter((n) => !n.read)
      if (reads && reads.length) {
        const ids = reads.map((r) => r.id)
        await this.readNotification({ notification_ids: ids }).then(() => {
          this.$store.commit("SHOW_LOADING", false)
          this.getNotifications()
          this.$store.commit("SHOW_LOADING", false)
        })
      }
    }
  },
  computed: {
    ...mapGetters([
      "isTokenSet",
      "cart_count",
      "content",
      "user",
      "notifications",
      "has_industries"
    ]),
    currentPage() {
      return (page) => {
        const route = this.$route.name
        if (page === "orders") {
          if (
            route === "active-orders" ||
            route === "cart-orders" ||
            route === "new-order" ||
            route === "order-history"
          ) {
            return true
          } else {
            return false
          }
        } else if (page === "profile") {
          if (
            route === "edit-profile" ||
            route === "payment-methods" ||
            route === "shipping-addresses" ||
            route === "account-settings"
          ) {
            return true
          } else {
            return false
          }
        } else if (page === "cart") {
          if (route === "cart" || route === "checkout") {
            return true
          } else {
            return false
          }
        }
      }
    },
    unreadNotifs() {
      return this.notifications.filter((n) => !n.read).length
    },
    openNotif() {
      return this.notif_opened
    },
    getImage() {
      return (image) => {
        return `${process.env.VUE_APP_API_URL}/${image.path}`
      }
    }
  },
  async created() {
    await this.getContents()
    if (this.user) {
      // openNotif()
      try {
        await this.getCartCount()
        await this.getNotifications()
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    const that = this
    document.querySelector("body").addEventListener("click", (event) => {
      const classList = event.target.classList
      let selectorList = document.querySelector(".notifications")
      const notif =
        selectorList &&
        selectorList.classList &&
        selectorList.classList.contains("opened")
          ? true
          : false
      if (
        !classList.contains("notifs_title") &&
        !classList.contains("notif_no") &&
        !classList.contains("notif_btn") &&
        notif
      ) {
        that.notif_opened = false
      }
    })
  },
  data() {
    return {
      notif_opened: false
    }
  }
}
</script>
