import Vue from "vue"
import * as VueGoogleMaps from "vue2-google-maps"
// import "vuejs-google-maps/dist/vuejs-google-maps.css"
// || "AIzaSyAaT1eq4TgWo4hFRNLWyFBw3aSzplwe2jY"
const gapikey = process.env.VUE_APP_GAPI_KEY
console.log("gapikey", gapikey)
Vue.use(VueGoogleMaps, {
  load: {
    key: gapikey,
    libraries: "places",
    client_id: process.env.VUE_APP_GAUTH
  }
})

export default VueGoogleMaps
