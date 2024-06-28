<template>
  <div class="popup_block submit_popup" :class="{ showed: openPopup }">
    <div class="popup_inner">
      <div class="popup_container" :class="{ btn_popup: hasButton }">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div
          class="section_subtitle color_black"
          v-if="checkout_status === 200"
        >
          {{ text ? text : "Your order successfully confirmed" }}
        </div>
        <div class="status_icon" v-if="checkout_status === 200">
          <img src="/images/success.svg" width="200" height="200" />
        </div>

        <div class="section_subtitle" v-if="checkout_status === 400">
          {{ text ? text : "Something went wrong" }}
        </div>
        <div class="status_icon" v-if="checkout_status === 400">
          <img src="/images/fail.svg" width="200" height="200" />
        </div>

        <div v-if="hasButton">
          <a class="custom_a start_btn" @click="closePopup">Get started</a>
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
      type: String,
      default: null
    },
    checkout_status: {
      type: Number
    },
    hasButton: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")
        const popup = document.querySelector(".submit_popup")
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
    }
  },
  created() {
    if (this.openPopup) {
      document.body.classList.add("popup_opened")
    }
  }
}
</script>
