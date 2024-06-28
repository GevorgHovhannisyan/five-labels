<template>
  <div class="content">
    <!-- <CoolLightBox :items="items" :index="index" @close="index = null">
    </CoolLightBox> -->

    <div class="order_steps">
      <div class="page_container">
        <h1 class="section_title">{{ getRouteName }}</h1>
        <ul class="steps_list">
          <li
            class="custom_a"
            @click="navigateTo('configure-label')"
            :class="{ current_step: currentStep('configure-label') }"
          >
            <span>Configure label</span>
          </li>
          <li
            class="custom_a"
            @click="navigateTo('roll-direction')"
            :class="{ current_step: currentStep('roll-direction') }"
          >
            <span>Roll direction</span>
          </li>
          <li
            class="custom_a"
            @click="navigateTo('quantity-pricing')"
            :class="{ current_step: currentStep('quantity-pricing') }"
          >
            <span>Quantity &#38; pricing</span>
          </li>
          <li
            class="custom_a"
            @click="navigateTo('artwork-uploading')"
            :class="{ current_step: currentStep('artwork-uploading') }"
          >
            <span>Artwork uploading</span>
          </li>
          <li
            class="custom_a"
            @click="navigateTo('customize-artwork')"
            :class="{ current_step: currentStep('customize-artwork') }"
          >
            <span>Customize artwork</span>
          </li>
          <li
            class="custom_a"
            @click="navigateTo('artwork-review')"
            :class="{ current_step: currentStep('artwork-review') }"
          >
            <span>Artwork review</span>
          </li>
        </ul>
        <div class="step_inner">
          <div class="left_col">
            <ProductPart v-if="showProduct" />
            <Recommendations v-else-if="showRecommendations" />
            <CropImage v-if="showCropPart" />
            <Review v-if="showReview" />
          </div>
          <div class="right_col">
            <router-view :setOrderConfigs="setOrderConfigs"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { detectContentHeight } from "@/helpers/mainHelper.js"
import { mapGetters } from "vuex"
import ProductPart from "./components/ProductPart"
import Recommendations from "./components/Recommendations"
import CropImage from "./components/CropImage"
import Review from "./components/Review"
import "@/assets/sass/steps.scss"

export default {
  methods: {
    navigateTo(page) {
      const current_page = this.$route.name
      let canRoute = false
      this.setOrderConfigs = 0

      if (page === "roll-direction") {
        if (current_page == "configure-label") {
          this.setOrderConfigs = 1
        }

        canRoute = true
        //   setTimeout(() => {
        //     if (
        //       this.product_shape &&
        //       this.product_corner &&
        //       this.product_size &&
        //       this.product_finish &&
        //       this.product_material
        //     ) {
        //     }
        // }, 300);
      } else if (page === "quantity-pricing") {
        if (current_page == "configure-label") {
          this.setOrderConfigs = 2
        }
        setTimeout(() => {
          if (this.product_direction) {
            canRoute = true
          }
        }, 10)
      } else if (page === "artwork-uploading") {
        if (this.calculate_data) {
          canRoute = true
        }
      } else if (page === "customize-artwork") {
        if (this.order_image) {
          canRoute = true
        }
      } else if (page === "artwork-review") {
        if (this.order_image) {
          canRoute = true
        }
      } else {
        canRoute = true
      }

      setTimeout(() => {
        if (canRoute && current_page !== page) {
          this.$store.commit("SHOW_LOADING", true)

          const path = this.edited_order
            ? `/edit-order/${page}/${this.edited_order}`
            : `/new-order/${page}`

          this.$router
            .push(path)
            .then(() => {
              this.$store.commit("SHOW_LOADING", false)
            })
            .catch(() => {
              this.$store.commit("SHOW_LOADING", false)
            })
        }
      }, 200)
    }
  },
  computed: {
    ...mapGetters([
      "product_shape",
      "product_corner",
      "product_size",
      "product_finish",
      "product_material",
      "product_direction",
      "calculate_data",
      "order_image",
      "product",
      "edited_order"
    ]),
    getRouteName() {
      return this.$route.meta.title
    },
    showRecommendations() {
      const route = this.$route.name
      const steps = ["artwork-uploading"]
      if (steps.includes(route)) {
        return true
      } else {
        return false
      }
    },
    showProduct() {
      const route = this.$route.name
      const steps = ["configure-label", "roll-direction", "quantity-pricing"]
      if (steps.includes(route)) {
        return true
      } else {
        return false
      }
    },
    showCropPart() {
      const route = this.$route.name
      if (route === "customize-artwork") {
        return true
      } else {
        return false
      }
    },
    showReview() {
      const route = this.$route.name
      if (route === "artwork-review") {
        return true
      } else {
        return false
      }
    },
    currentStep() {
      return (step) => {
        const route = this.$route.name

        if (step === route) {
          return true
        }
      }
    }
  },
  data() {
    return {
      setOrderConfigs: 0
    }
  },
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  },
  destroyed() {
    this.$store.commit("CLEAR_ALL_STEPS")
  },

  components: {
    ProductPart,
    Recommendations,
    CropImage,
    Review
  }
}
</script>

<style scoped>
.custom_a {
  cursor: pointer;
}
</style>
