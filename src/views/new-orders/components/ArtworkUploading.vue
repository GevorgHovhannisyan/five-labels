<template>
  <div class="custom_inner_block">
    <div class="col_inner">
      <h2 class="section_subtitle">Artwork uploading</h2>
      <div class="upload_block">
        <label class="upload_label">
          <input
            type="file"
            @input="saveImage($event)"
            accept=".jpg, .png, .jpeg"
            title=""
          />
          <span class="image_preview"
            ><img v-if="image_url" :src="image_url" alt=""
          /></span>
          <span class="image_name">{{ image_name }}</span>
          <span class="drag_info">Drag and drop to upload your artwork</span>
          <span class="or_separate">or</span>
          <span class="btn_text">{{
            image_url ? "Replace a file" : "Choose a file"
          }}</span>
        </label>
      </div>
    </div>
    <div class="btns_block">
      <router-link custom :to="getRoute" v-slot="{ navigate, href }">
        <a :href="href" @click="navigate" class="back_btn icon_left">Back</a>
      </router-link>
      <a @click="toCrop" class="next_btn icon_right custom_a">Next</a>
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="400"
      :text="textMessage"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      image_url: null,
      image_name: null,
      openSuccessFail: false,
      textMessage: "Please upload an image"
    }
  },
  methods: {
    ...mapActions(["uploadRotatedForUnAuth"]),
    async saveImage(event) {
      const file = event.target.files[0]
      const image_url = URL.createObjectURL(file)
      const image = new Image()
      image.src = image_url

      image.onload = () => {
        let iw = image.width
        let ih = image.height
        let fiw = iw
        let fih = ih
        let workWidth = 100
        let workHeight = 100
        let stageMax = Math.max(workWidth, workHeight)
        let ratio = 1
        if (Math.max(iw, ih) > stageMax) {
          if (iw > workWidth) {
            ratio = iw / workWidth
          }
          if (ih > workHeight) {
            ratio = ih / workHeight
          }
          fiw = Math.round(iw / ratio)
          fih = Math.round(ih / ratio)
        }
        if (fiw > 300) {
          const diff = fiw - 300
          fiw = fiw - diff
          fih = fih - diff

          if (fih < 20) {
            this.textMessage = "Your image too long"
            this.openSuccessFail = true
            return false
          }
        } else if (fih > 300) {
          const diff = fih - 300
          fiw = fiw - diff
          fih = fih - diff
          if (fiw < 20) {
            this.textMessage = "Your image too narrow"
            this.openSuccessFail = true
            return false
          }
        } else {
          this.image_name = file.name
          this.$store.commit("SET_ORDER_IMAGE", file)
          this.$store.commit("SET_SAVE_IMAGE", file)

          if (!this.user) {
            const formData = new FormData()
            const img = file
            formData.append("image", img)
            this.uploadRotatedForUnAuth(formData).then((image) => {
              this.$store.commit("SET_ORIGINAL_IMAGE", image)
            })
          } else {
            this.$store.commit("SET_ORIGINAL_IMAGE", file)
          }

          this.image_url = image_url
        }
      }
    },
    toCrop() {
      if (this.image_url) {
        this.$store.commit("SHOW_LOADING", true)
        const id = this.$route.params.id
        const page = id
          ? `/edit-order/customize-artwork/${id}`
          : "/new-order/customize-artwork"

        this.$router
          .push(page)
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
      } else {
        this.textMessage = "Please upload an image"
        this.openSuccessFail = true
      }
    }
  },
  computed: {
    ...mapGetters([
      "order_image",
      "product",
      "user",
      "edited_order",
      "save_order_image",
      "original_image"
    ]),
    getRoute() {
      const id = this.$route.params.id
      return id
        ? `/edit-order/quantity-pricing/${id}`
        : "/new-order/quantity-pricing"
    }
  },
  created() {
    // this.$store.commit("CLEAR_STEPS_DATA", "artwork-upload")
    if (!this.product) {
      const id = this.$route.params.id
      const page = id
        ? `/edit-order/configure-label/${id}`
        : "/new-order/configure-label"

      this.$router.push(page).catch(() => {})
    }

    if (this.edited_order && this.order_image && this.order_image.path) {
      if (this.original_image) {
        if (this.original_image.path) {
          this.image_url = `${process.env.VUE_APP_API_URL}/${this.original_image.path}`
          this.image_name = this.original_image.name
        } else {
          this.image_url = URL.createObjectURL(this.original_image)
          this.image_name = this.original_image.name
        }
      } else {
        this.image_url = `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
        this.image_name = this.order_image.name
      }
    } else if (this.edited_order && !this.order_image.path) {
      this.image_name = this.order_image.name
      this.image_url = URL.createObjectURL(this.order_image)
    } else if (this.order_image) {
      this.image_name = this.order_image.name
      this.image_url = URL.createObjectURL(this.order_image)
    }
  },
  components: {
    SuccessFailPopup
  }
}
</script>
