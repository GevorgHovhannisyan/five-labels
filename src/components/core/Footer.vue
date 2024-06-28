<template>
  <div class="footer">
    <div class="page_container">
      <div class="contacts_section">
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
        <div class="contact_block icon_mail" v-if="contact.email">
          <a :href="`mailto:${contact.email.value}`">{{
            contact.email.value
          }}</a>
        </div>
        <div class="cart_block">
          <img src="/images/stripe.png" alt="stripe" title="stripe" />
        </div>
      </div>
      <div class="footer_bottom">
        <div class="copyrights">
          © All rights reserved

          <div class="privacy_security">
            <div class="privacy__policy">
              <router-link to="/privacy-policy">Privacy</router-link>
            </div>
            <div class="privacy__policy">
              <router-link to="/terms-conditions"
                >Terms & Conditions</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  methods: {
    ...mapActions(["getContact"])
  },
  computed: {
    ...mapGetters(["contact"])
  },
  async created() {
    await this.getContact()
  }
}
</script>

<style>
.footer {
  background-image: url("~@/assets/images/footer_bg.jpg");
}
</style>
