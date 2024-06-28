<template>
  <div class="contacts_section">
    <div class="page_container">
      <div class="contacts_list">
        <h2 class="section_title">Contact info</h2>
        <ul class="socials_list">
          <li v-if="contact.instagram">
            <a
              :href="contact.instagram.value"
              target="_blank"
              class="icon_instagram"
              >instagram</a
            >
          </li>
          <li v-if="contact.facebook">
            <a
              :href="contact.facebook.value"
              target="_blank"
              class="icon_facebook"
              >facebook</a
            >
          </li>
          <li v-if="contact.twitter">
            <a
              :href="contact.twitter.value"
              target="_blank"
              class="icon_twitter"
              >twitter</a
            >
          </li>
          <li v-if="contact.linkedin">
            <a
              :href="contact.linkedin.value"
              target="_blank"
              class="icon_linkedin"
              >linkedin</a
            >
          </li>
        </ul>
        <div class="contact_block icon_phone">
          <a :href="`tel:${contact.contact_phone1.value}`">{{
            contact.contact_phone1 ? contact.contact_phone1.value : ""
          }}</a>
          <a :href="`tel:${contact.contact_phone2.value}`">{{
            contact.contact_phone2 ? contact.contact_phone2.value : ""
          }}</a>
        </div>
        <div class="contact_block icon_mail">
          <a :href="`mailto:${contact.email.value}`">{{
            contact.email.value
          }}</a>
        </div>
      </div>
      <ValidationObserver
        ref="contact_form"
        slim
        v-slot="{ handleSubmit, reset }"
      >
        <form
          class="contact_form"
          @submit.prevent="handleSubmit(sendMessage)"
          @reset.prevent="reset"
          autocomplete="off"
        >
          <ValidationProvider
            name="name"
            v-slot="{ errors }"
            slim
            rules="required"
          >
            <div class="contact_field" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="message.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  @input="checkLength(message.name, 'name')"
                />
                <span class="field_name">Name</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="email"
            v-slot="{ errors }"
            slim
            rules="required|email"
          >
            <div class="contact_field" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="message.email"
                  type="text"
                  name="email"
                  :disabled="user && user.email"
                  :class="{ disabled_field: user && user.email }"
                  placeholder="Email address"
                  @input="checkLength(message.email, 'email')"
                />
                <span class="field_name">Email address</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="subject"
            v-slot="{ errors }"
            slim
            rules="required"
          >
            <div class="contact_field" :class="{ has_error: errors[0] }">
              <label>
                <input
                  v-model="message.subject"
                  type="text"
                  name="subject"
                  placeholder="subject"
                  @input="checkLength(message.subject, 'subject')"
                />
                <span class="field_name">Subject</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="message"
            v-slot="{ errors }"
            slim
            rules="required"
          >
            <div class="contact_field" :class="{ has_error: errors[0] }">
              <label>
                <textarea
                  v-model="message.message"
                  name="message"
                  placeholder="Message"
                  @input="checkLength(message.message, 'message')"
                ></textarea>
                <span class="field_name">Message</span>
              </label>
              <span class="error_message">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <button class="submit_btn" @click="checkInvalids">
            Send message
          </button>
        </form>
      </ValidationObserver>
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="openSuccessFail = false"
      :checkout_status="200"
      text="Message successfully sent"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { scrollFunction } from "@/helpers/validationScroll"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
export default {
  data() {
    return {
      message: {},
      openSuccessFail: false
    }
  },
  computed: {
    ...mapGetters(["user", "contact"])
  },
  created() {
    if (this.user && this.user.email) {
      this.message.email = this.user.email
    }
  },
  methods: {
    ...mapActions(["sendContactMessage"]),
    async sendMessage() {
      await this.sendContactMessage(this.message)
        .then(() => {
          this.message = {}
          if (this.user && this.user.email) {
            this.message.email = this.user.email
          }

          this.$refs.contact_form.reset()
          this.openSuccessFail = true
        })
        .catch((err) => {
          if (
            err &&
            err.response.data &&
            err.response.data.message ===
              "User Can't send message with another email"
          ) {
            this.$refs.contact_form.setErrors({
              email: [err.response.data.message]
            })
          }
        })
    },
    checkInvalids() {
      setTimeout(() => {
        const errorField = document.querySelectorAll(".has_error")
        const header = document.querySelector(".header")
        if (errorField && errorField.length) {
          let scrollElement = errorField[0]
          scrollFunction(scrollElement.offsetTop, header.offsetHeight)
        }
      }, 300)
    },
    checkLength(value, type) {
      if (type === "name") {
        this.message[type] = value.slice(0, 40)
      } else if (type === "email") {
        this.message[type] = value.slice(0, 50)
      } else if (type === "subject") {
        this.message[type] = value.slice(0, 250)
      } else if (type === "message") {
        this.message[type] = value.slice(0, 3000)
      }
    }
  },
  components: {
    SuccessFailPopup
  }
}
</script>
