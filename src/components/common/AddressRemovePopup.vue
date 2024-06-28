<template>
  <div
    class="popup_block remove_popup addr_rem_popup"
    :class="{ showed: openPopup }"
  >
    <div class="popup_inner">
      <div class="popup_container">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div class="popup_description">
          Are you sure you want to remove the address from Shipping Addresses?
        </div>
        <div class="popup_actions">
          <button
            class="cancel_btn popup_close"
            aria-label="cancel"
            @click="closePopup"
          >
            Cancel
          </button>
          <button class="save_btn" aria-label="remove" @click="submitPopup">
            Remove
          </button>
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
    text: {
      type: Object
    }
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")
        const popup = document.querySelector(".addr_rem_popup")
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

<style></style>
