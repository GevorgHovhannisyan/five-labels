<template>
  <div id="app" class="page_wrapper">
    <Loader v-if="false" />

    <InnerLoader v-if="loading" />
    <Header />

    <router-view />

    <ShowInvoice
      :invoice_data="inviose_data"
      :openPopup="openInvoice"
      @closePopup="openInvoice = false"
      @submitAction="openInvoice = false"
    />

    <NotificationPopup
      :openPopup="show_notif_popup"
      @closePopup="show_notif_popup = false"
      :notif="notif_info"
    />

    <Footer />
  </div>
</template>

<script>
import Loader from "@/components/core/Loader"
import InnerLoader from "@/components/core/InnerLoader"
import Header from "@/components/core/Header"
import Footer from "@/components/core/Footer"
import { mapGetters, mapActions } from "vuex"
import ShowInvoice from "@/components/common/ShowInvoice"
import NotificationPopup from "@/components/common/NotificationPopup"

import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

export default {
  name: "App",
  metaInfo() {
    return {
      title: this.appTitle,
      htmlAttrs: {
        lang: this.$i18n.locale
      },
      meta: [
        {
          name: "google-signin-client_id",
          content: process.env.VUE_APP_GAUTH
        },
        { name: "msapplication-TileColor", content: "#ffc40d" },
        { name: "theme-color", content: "#ffffff" },
        {
          name: "apple-mobile-web-app-title",
          content: this.appTitle
        },
        { name: "application-name", content: this.appTitle }
      ]
    }
  },
  data() {
    return {
      inviose_data: {},
      notif_info: {},
      openInvoice: false,
      show_notif_popup: false,
      fcmToken: "",
      delayTimer: null
    }
  },
  components: {
    Loader,
    Footer,
    Header,
    InnerLoader,
    ShowInvoice,
    NotificationPopup
  },
  computed: {
    ...mapGetters(["user"]),
    appTitle() {
      return this.$store.getters.appTitle
    },
    loading() {
      return this.$store.getters.loading
    }
  },
  async created() {
    this.getSiteConfigs()

    this.$root.$on("showInvoice", (data) => {
      this.inviose_data = data
      this.openInvoice = true
    })

    this.$root.$on("showNotification", (data) => {
      this.notif_info = data
      this.show_notif_popup = true
    })
    if (this.user) {
      await this.userGet(this.user.id).catch((error) => {
        if (error && error.response && error.response.status === 401) {
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          this.$store.commit("LOGOUT")
        }
      })
    }
  },
  async mounted() {
    // Initialize Firebase
    const that = this
    if (this.user) {
      try {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            that.initFirebase()
          }
        })
      } catch (err) {
        // eslint-disable-next-line no-console
      }
    }

    this.$root.$on("initFirebase", () => {
      try {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            that.initFirebase()
          }
        })
      } catch (err) {
        // eslint-disable-next-line no-console
      }
    })
  },
  methods: {
    ...mapActions(["userGet", "setFCMtoken", "getSiteConfigs"]),
    initFirebase() {
      const apiKey = process.env.VUE_APP_FIREBASE_API_KEY
      const authDomain = process.env.VUE_APP_FIREBASE_DOMAIN
      const projectId = process.env.VUE_APP_FIREBASE_PROJ_ID || "five-89e9d"
      const storageBucket = process.env.VUE_APP_FIREBASE_BUCKET
      const messagingSenderId = process.env.VUE_APP_FIREBASE_SENDER
      const appId = process.env.VUE_APP_FIREBASE_APP
      const measurementId = process.env.VUE_APP_FIREBASE_MEASUREMENT
      const vapi = process.env.VUE_APP_FIREBASE_VAPI

      // TODO: Replace the following with your app's Firebase project configuration
      // See: https://firebase.google.com/docs/web/learn-more#config-object
      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId
      }

      if (this.user) {
        const app = initializeApp(firebaseConfig)

        // Initialize Firebase Cloud Messaging and get a reference to the service
        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        const messaging = getMessaging(app)
        getToken(messaging, { vapidKey: vapi })
          .then((currentToken) => {
            if (currentToken) {
              // console.log("currentToken", currentToken)
              this.setFCMtoken({ registration_token: currentToken })
              // Send the token to your server and update the UI if necessary
            } else {
              // Show permission request UI
              // eslint-disable-next-line no-console
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log("An error occurred while retrieving token. ", err)
          })
      }
    }
  },
  watch: {
    loading(loading) {
      if (loading) {
        document.body.classList.add("loading")
      } else {
        document.body.classList.remove("loading")
      }
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
