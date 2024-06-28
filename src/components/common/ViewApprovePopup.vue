<template>
  <div
    class="popup_block approve_popup view_approved"
    :class="{ showed: openPopup }"
  >
    <div class="popup_inner">
      <div class="popup_container">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div class="section_subtitle">View your approved proof</div>
        <div class="image_block">
          <img :src="image" alt="" title="" width="397" height="281" />
        </div>
        <div class="popup_actions">
          <!-- :href="image" target="_blank" download -->
          <a class="save_btn custom_a" @click="downloadAnImage(image)"
            >Download</a
          >
          <button
            class="cancel_btn popup_close"
            aria-label="cancel"
            @click="closePopup"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { saveAs } from "file-saver"

export default {
  props: {
    openPopup: {
      type: Boolean
    },
    text: {
      type: Object
    }
  },
  data() {
    return {
      // image: null
    }
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")
        const popup = document.querySelector(".view_approved")
        popup.addEventListener("click", (event) => {
          const hasClass = event.target.classList.contains("popup_inner")
          if (hasClass) {
            this.closePopup()
          }
        })
      }
    }
  },
  methods: {
    closePopup() {
      document.body.classList.remove("popup_opened")
      this.$emit("closePopup")
    },
    submitPopup() {
      this.$emit("submitAction")
      this.closePopup()
    },
    async downloadAnImage(image) {
      saveAs(image, "artwork-image.jpg")
    }
  },
  computed: {
    ...mapGetters(["order_image", "edited_order"]),
    image() {
      if (this.edited_order && this.order_image && this.order_image.path) {
        return `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
      } else if (
        this.edited_order &&
        this.order_image &&
        !this.order_image.path
      ) {
        return URL.createObjectURL(this.order_image)
      } else if (this.order_image) {
        return URL.createObjectURL(this.order_image)
      } else {
        return null
      }
    }
  },
  created() {
    if (this.openPopup) {
      document.body.classList.add("popup_opened")
      if (this.edited_order && this.order_image && this.order_image.path) {
        return `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
      } else if (
        this.edited_order &&
        this.order_image &&
        !this.order_image.path
      ) {
        return URL.createObjectURL(this.order_image)
      } else if (this.order_image) {
        return URL.createObjectURL(this.order_image)
      } else {
        return null
      }
    }
  }
}
</script>

<style></style>
