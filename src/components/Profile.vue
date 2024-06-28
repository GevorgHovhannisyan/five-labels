<template>
  <div>Profile</div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t("myProfile.TITLE")} - %s`
    }
  },
  data() {
    return {
      dialog: false,
      triggerChangePassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      searchInput: ""
    }
  },
  computed: {
    name: {
      get() {
        return this.$store.state.profile.profile.name
      },
      set(value) {
        const data = {
          key: "name",
          value
        }
        this.addProfileData(data)
      }
    },
    email() {
      return this.$store.state.profile.profile.email
    },
    phone: {
      get() {
        return this.$store.state.profile.profile.phone
      },
      set(value) {
        const data = {
          key: "phone",
          value
        }
        this.addProfileData(data)
      }
    },
    allCities() {
      return this.$store.state.cities.allCities
    },
    city: {
      get() {
        return this.$store.state.profile.profile.city
      },
      set(value) {
        const data = {
          key: "city",
          value
        }
        this.addProfileData(data)
      }
    },
    country: {
      get() {
        return this.$store.state.profile.profile.country
      },
      set(value) {
        const data = {
          key: "country",
          value
        }
        this.addProfileData(data)
      }
    },
    urlTwitter: {
      get() {
        return this.$store.state.profile.profile.urlTwitter
      },
      set(value) {
        const data = {
          key: "urlTwitter",
          value
        }
        this.addProfileData(data)
      }
    },
    urlGitHub: {
      get() {
        return this.$store.state.profile.profile.urlGitHub
      },
      set(value) {
        const data = {
          key: "urlGitHub",
          value
        }
        this.addProfileData(data)
      }
    }
  },
  methods: {
    ...mapActions([
      "changeMyPassword",
      "getProfile",
      "getAllCities",
      "addProfileData",
      "saveProfile"
    ]),
    async submit() {
      await this.saveProfile({
        name: this.name,
        phone: this.phone,
        city: this.city,
        country: this.country,
        urlTwitter: this.urlTwitter,
        urlGitHub: this.urlGitHub
      })
    },
    close() {
      this.triggerChangePassword = false
      this.dialog = false
    },
    async save() {
      try {
        await this.changeMyPassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })
        this.oldPassword = ""
        this.newPassword = ""
        this.confirmPassword = ""
        this.triggerChangePassword = false
        this.close()
        return
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.oldPassword = ""
        this.newPassword = ""
        this.confirmPassword = ""
        this.triggerChangePassword = false
        this.close()
      }
    }
  },
  async mounted() {
    await this.getProfile()
    await this.getAllCities()
  }
}
</script>
