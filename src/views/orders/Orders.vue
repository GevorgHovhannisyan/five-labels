<template>
  <div class="content">
    <div class="orders_page">
      <div class="page_container">
        <div class="orders_menu">
          <h1 class="section_title">Orders</h1>
          <ul>
            <li>
              <a
                class="custom_a start_btn"
                @click="$router.push('/new-order/configure-label')"
                >New order</a
              >
            </li>
            <li v-for="(page, index) in order_pages" :key="index">
              <router-link
                custom
                :class="{ current_page: getPage === page.route_name }"
                :to="page.url"
                v-slot="{ navigate, href }"
              >
                <a :href="href" @click="navigate">
                  <span @click="closeMenu()">{{ page.name }}</span>
                  <span
                    class="count"
                    v-if="
                      page.count_key === 'activeCount' &&
                      (cart_count[page.count_key] || cart_count.newCount)
                    "
                  >
                    {{ cart_count[page.count_key] + cart_count.newCount }}
                  </span>
                  <span class="count" v-else-if="cart_count[page.count_key]">{{
                    cart_count[page.count_key]
                  }}</span></a
                >
              </router-link>
            </li>
          </ul>
        </div>

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import "@/assets/sass/orders.scss"
import { closeMenuBlock } from "@/helpers/utilsCustom"
export default {
  data() {
    return {
      order_pages: [
        // {
        //   url: "/orders/new-order",
        //   name: "New order",
        //   route_name: "new-order",
        //   count_key: null
        // },
        {
          url: "/orders/cart-orders",
          name: "Cart orders",
          route_name: "cart-orders",
          count_key: "cartCount"
        },
        {
          url: "/orders/active-orders",
          name: "Active orders",
          route_name: "active-orders",
          count_key: "activeCount"
        },
        {
          url: "/orders/order-history",
          name: "Order history",
          route_name: "order-history",
          count_key: "historyCount"
        }
      ]
    }
  },
  methods: {
    closeMenu() {
      closeMenuBlock()
    }
  },
  computed: {
    ...mapGetters(["cart_count"]),

    getPage() {
      return this.$route.name
    }
  }
}
</script>
