<template>
  <div
    class="popup_block approve_popup approve_crop"
    :class="{ showed: openPopup }"
  >
    <div class="popup_inner">
      <div class="popup_container">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div class="section_subtitle">Approve your proof</div>
        <div class="popup_description">Please approve your proof</div>
        <div class="image_block">
          <img :src="image" alt="" title="" width="397" height="281" />
        </div>
        <div class="popup_actions">
          <button
            class="cancel_btn popup_close"
            @click="closePopup"
            aria-label="cancel"
          >
            Deny
          </button>
          <a class="save_btn custom_a" @click="submitPopup">Approve</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    openPopup: {
      type: Boolean
    },
    image: {
      type: String
    }
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")
        const popup = document.querySelector(".approve_crop")
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
    }
  },
  created() {
    if (this.openPopup) {
      document.body.classList.add("popup_opened")
    }
  }
}
</script>

<style scoped>
.custom_a {
  cursor: pointer;
}
</style>
