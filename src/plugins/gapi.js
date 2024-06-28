import Vue from "vue"
import GAuth from "vue-google-oauth2"
Vue.use(GAuth, {
  clientId: process.env.VUE_APP_GAUTH,
  scope: "email",
  prompt: "select_account",
  fetch_basic_profile: false
})

export default GAuth
