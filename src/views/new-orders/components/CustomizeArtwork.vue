<template>
  <div class="custom_inner_block">
    <div class="col_inner">
      <h2 class="section_subtitle">Customizing</h2>
      <ul class="customize_btns">
        <li>
          <button
            @click="$root.$emit('centerVertical')"
            class="icon_hcenter"
            aria-label="vertical center"
          >
            Center vertical
          </button>
        </li>
        <li>
          <button
            @click="$root.$emit('centerHorizontal')"
            class="icon_vcenter"
            aria-label="horizontal center"
          >
            Center horizontal
          </button>
        </li>
        <li>
          <button
            @click="$root.$emit('fitImage')"
            class="icon_fit"
            aria-label="fit"
          >
            Fit image
          </button>
        </li>
        <li>
          <button
            @click="$root.$emit('rotateImage')"
            class="icon_rotate"
            aria-label="rotate"
          >
            Rotate image
          </button>
        </li>
      </ul>
    </div>
    <div class="btns_block">
      <router-link custom :to="getRoute" v-slot="{ navigate, href }">
        <a :href="href" @click="navigate" class="back_btn icon_left">Back</a>
      </router-link>

      <!-- <router-link
        custom
        to="/new-order/artwork-review"
        v-slot="{ navigate, href }"
      > -->
      <a @click="aprrovePopup" class="next_btn icon_right custom_a">Next</a>
    </div>

    <ApprovePopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      @submitAction="submitCrop"
      :image="cropedImage"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import ApprovePopup from "@/components/common/ApproveCrop"
export default {
  data() {
    return {
      openConfirm: false,
      cropedImage: null
    }
  },
  methods: {
    submitCrop() {
      this.$store.commit("SHOW_LOADING", true)

      if (this.no_save_image) {
        this.$store.commit("SET_ORDER_IMAGE", this.no_save_image)
      }
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/artwork-review/${id}`
        : "/new-order/artwork-review"
      this.$router
        .push(page)
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    },
    approvedPop() {
      setTimeout(() => {
        this.$store.commit("SHOW_LOADING", false)

        if (this.edited_order && this.no_save_image) {
          this.cropedImage = URL.createObjectURL(this.no_save_image)
        } else if (
          this.edited_order &&
          this.order_image &&
          this.order_image.path
        ) {
          this.cropedImage = `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
        } else if (this.edited_order && !this.order_image.path) {
          this.cropedImage = URL.createObjectURL(this.order_image)
        } else if (this.no_save_image) {
          this.cropedImage = URL.createObjectURL(this.no_save_image)
        } else if (this.order_image) {
          this.cropedImage = URL.createObjectURL(this.order_image)
        }
        this.openConfirm = true
      }, 700)
    },
    async aprrovePopup() {
      this.$store.commit("SHOW_LOADING", true)

      try {
        await this.$root.$emit("cropManually")
        setTimeout(() => {
          this.approvedPop()
        }, 300)
      } catch (err) {
        console.log(err)
        this.$store.commit("SHOW_LOADING", false)
      }
    }
  },
  created() {
    //  this.$root.$on("cropFinished", () => {

    //  })

    if (!this.product) {
      this.$store.commit("SHOW_LOADING", true)
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"

      this.$router
        .push(page)
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    }
  },
  computed: {
    ...mapGetters(["order_image", "product", "edited_order", "no_save_image"]),
    getRoute() {
      const id = this.$route.params.id
      return id
        ? `/edit-order/artwork-uploading/${id}`
        : "/new-order/artwork-uploading"
    }
  },
  components: {
    ApprovePopup
  }
}
</script>

<style>
.custom_a {
  cursor: pointer;
}
</style>
