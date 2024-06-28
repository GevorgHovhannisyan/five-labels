import Vue from "vue"
import i18n from "@/plugins/i18n"
import App from "@/App.vue"
import router from "@/router"
import { store } from "@/store"

// import "@/plugins/googleMaps"
import "@/plugins/axios"
import "@/plugins/veevalidate"
import "@/plugins/common"
import "@/plugins/googleAnalytics"
import "@/plugins/vueSelect"
import "@/plugins/slickCarousel"
// import "@/plugins/moment"
import "./registerServiceWorker"

import CoolLightBox from "vue-cool-lightbox"
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css"
Vue.use(CoolLightBox)

import VueMoment from "vue-moment"
import moment from "moment-timezone"

require("dotenv").config()

Vue.prototype.$moment = VueMoment

Vue.use(VueMoment, {
  moment
})

import InputFacade from "vue-input-facade"
Vue.use(InputFacade)

import LazyYoutube from "vue-lazytube"
Vue.use(LazyYoutube)

import Paginate from "vuejs-paginate"
Vue.component("paginate", Paginate)

import "@/assets/sass/main.scss"
import "@/assets/sass/fonts.css"
Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  created() {
    store.dispatch("setLocale", store.getters.locale)
  }
}).$mount("#app")

if (window.Cypress) {
  // Only available during E2E tests
  window.app = app
}
