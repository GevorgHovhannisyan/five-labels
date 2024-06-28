<template>
  <div>RESET PASS</div>
</template>

<script>
import router from "@/router"
import { mapActions } from "vuex"

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t("resetPassword.TITLE")} - %s`
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      password: "",
      confirmPassword: ""
    }
  },
  methods: {
    ...mapActions(["resetPassword"]),
    async submit() {
      await this.resetPassword({
        id: this.id,
        password: this.password
      })
    }
  },
  computed: {
    showChangePasswordInputs() {
      return this.$store.state.resetPassword.showChangePasswordInputs
    }
  },
  created() {
    if (this.$store.state.auth.isTokenSet) {
      router.push({ name: "home" })
    }
  }
}
</script>
