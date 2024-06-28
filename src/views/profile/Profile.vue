<template>
  <div class="content">
    <div class="profile_page">
      <div class="page_container">
        <div class="profile_menu">
          <h1 class="section_title">Profile</h1>
          <ul>
            <li>
              <a
                :class="{
                  current_page:
                    getPage === 'shipping-addresses' ||
                    getPage === 'edit-shipping-address' ||
                    getPage === 'add-shipping-addresses'
                }"
                class="custom_a"
                @click="closeMenu('/profile/shipping-addresses')"
                >Shipping addresses</a
              >
            </li>
            <li>
              <a
                class="custom_a"
                :class="{
                  current_page:
                    getPage === 'payment-methods' || getPage === 'add-card'
                }"
                @click="closeMenu('/profile/payment-methods')"
                >Payment methods</a
              >
            </li>
            <li>
              <a
                :class="{
                  current_page:
                    getPage === 'account-settings' || getPage === 'edit-profile'
                }"
                class="custom_a"
                @click="closeMenu('/profile/account-settings')"
                >Account settings</a
              >
            </li>
          </ul>
        </div>
        <div class="profile_inner">
          <div class="head_block">
            <button
              class="sidebar_toggle"
              @click="openMenu"
              for="sidebar_toggle"
            ></button>
            <h2 class="section_subtitle">{{ getPageName(getPage) }}</h2>
            <a href="/auth/login" class="logout_btn icon_exit" @click="logOut"
              >Log out</a
            >
          </div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/sass/profile.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import { closeMenuBlock } from "@/helpers/utilsCustom"

export default {
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  },
  computed: {
    getPage() {
      return this.$route.name
    },
    getPageName() {
      return (getPage) => {
        if (
          getPage === "shipping-addresses" ||
          getPage === "edit-shipping-address" ||
          getPage === "add-shipping-addresses"
        ) {
          return "Shipping addresses"
        } else if (getPage === "payment-methods" || getPage === "add-card") {
          return "Payment methods"
        } else if (
          getPage === "account-settings" ||
          getPage === "edit-profile"
        ) {
          return "Account settings"
        }
      }
    }
  },
  methods: {
    logOut() {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("token_expires_in")
    },
    openMenu() {
      closeMenuBlock()
    },
    closeMenu(path) {
      closeMenuBlock()
      this.$store.commit("SHOW_LOADING", true)
      this.$router
        .push(path)
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    }
  }
}
</script>

<style></style>
