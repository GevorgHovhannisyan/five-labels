<template>
  <div class="custom_inner_block">
    <div class="col_inner">
      <h2 class="section_subtitle">Roll direction</h2>
      <div class="rolls_group">
        <div
          class="roll_block"
          v-for="(roll, index) in directions"
          :key="index"
        >
          <label>
            <input
              v-model="direction"
              @input="setDirection(roll.service_id)"
              :value="roll.service_id"
              type="radio"
              name="roll_direction"
            />
            <span
              class="roll_btn"
              :class="{ not_important: roll.service_id === 24 }"
            >
              <span class="number_block" v-if="roll.number">{{
                roll.number
              }}</span>
              <img
                :src="getDirPhoto(roll.service_id)"
                alt=""
                title=""
                width="140"
                height="61"
                v-if="roll.service_id !== 24"
              />
              <span class="direction_name">{{ roll.name }}</span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="btns_block">
      <router-link custom :to="getRoute" v-slot="{ navigate, href }">
        <a :href="href" @click="navigate" class="back_btn icon_left">Back</a>
      </router-link>

      <a class="next_btn icon_right custom_a" @click="rollDirectionNextHandler">
        Next
        <!-- v-slot="{ navigate, href }" -->
        <!-- <a :href="href" @click="navigate" class="next_btn icon_right">Next</a> -->
      </a>
    </div>
    <SuccessFailPopupVue
      :openPopup="openSuccesFail"
      @closePopup="openSuccesFail = false"
      :checkout_status="400"
      text="Please select roll direction"
    />
  </div>
</template>

<script>
import SuccessFailPopupVue from "../../../components/common/SuccessFailPopup.vue"
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      direction: null,
      openSuccesFail: false
    }
  },
  components: {
    SuccessFailPopupVue
  },
  computed: {
    ...mapGetters([
      "directions",
      "product_direction",
      "product",
      "edited_order"
    ]),
    getDirPhoto() {
      return (roll_id) => {
        let image = ""

        if (roll_id === 16) {
          // top
          image = "/images/top_first.svg"
        } else if (roll_id === 17) {
          image = "/images/bottom_first.svg"
          // bottom
        } else if (roll_id === 18) {
          // Right First Out-Wound
          image = "/images/right_side_first.svg"
        } else if (roll_id === 19) {
          // Left Side Out-Wound
          image = "/images/left_side_first.svg"
        }

        return image
      }
    },
    getRoute() {
      const id = this.$route.params.id
      return id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"
    }
  },
  methods: {
    rollDirectionNextHandler() {
      if (this.direction) {
        this.$store.commit("SHOW_LOADING", true)
        const id = this.$route.params.id
        const page = id
          ? `/edit-order/quantity-pricing/${id}`
          : "/new-order/quantity-pricing"

        this.$router.push(page)
      } else {
        this.openSuccesFail = true
      }
    },
    setDirection(dir) {
      if (!this.edited_order) {
        this.$store.commit("CLEAR_STEPS_DATA", "roll-direction")
      }
      this.$store.commit("SET_PRODUCT_INFORMATION", { direction: +dir })
    }
  },
  created() {
    // this.$store.commit("CLEAR_STEPS_DATA", "roll-direction")
    if (!this.product) {
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"

      this.$router.push(page).catch(() => {})
    }

    if (this.product_direction) {
      this.direction = this.product_direction
    } else {
      if (this.directions.length) {
        this.direction = this.directions[0].service_id
        this.$store.commit("SET_PRODUCT_INFORMATION", {
          direction: +this.direction
        })
      }
    }
  }
}
</script>
