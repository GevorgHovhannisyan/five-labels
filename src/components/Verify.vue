<template>
  <div>VERIFY</div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t("verify.TITLE")} - %s`
    }
  },
  methods: {
    ...mapActions(["sendVerify"])
  },
  async mounted() {
    await this.sendVerify(this.$route.params.id)
  }
}
</script>
