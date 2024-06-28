<template>
  <div
    class="popup_block remove_popup notification_popup"
    :class="{ showed: openPopup }"
  >
    <div class="popup_inner">
      <div class="popup_container">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div class="popup_description">
          <h3>{{ notif.title }}</h3>
          {{ notif.description }}
        </div>

        <div class="popup_actions" v-if="!notif.notification_id">
          <button
            class="cancel_btn popup_close"
            aria-label="cancel"
            @click="closePopup"
          >
            Cancel
          </button>
          <button class="save_btn" aria-label="remove" @click="goOrders">
            Go to orders
          </button>
        </div>

        <div
          class="popup_actions"
          :class="{ user_notif: notif.notification_id }"
          v-else
        >
          <button
            class="cancel_btn popup_close"
            aria-label="cancel"
            @click="closePopup"
          >
            OK
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
    notif: {
      type: Object
    }
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")
        const popup = document.querySelector(".notification_popup")
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
    goOrders() {
      this.closePopup()
      if (this.$route.name !== "active-orders") {
        this.$router.push("/orders/active-orders")
      }
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
