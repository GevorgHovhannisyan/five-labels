<template>
  <div class="content">
    <div class="help_page">
      <div class="page_container">
        <h1 class="article_title">
          {{ title }}
        </h1>
        <div class="article_inner">
          <div v-html="description" v-if="description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/sass/info.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import { mapActions, mapGetters } from "vuex"
export default {
  data() {
    return {
      title: null,
      description: null
    }
  },
  methods: {
    ...mapActions(["getPrivacyTerms"]),
    fetchPage() {
      this.getPrivacyTerms()
        .then((pages) => {
          const name = this.$route.name
          if (pages.length) {
            if (name === "privacy-policy") {
              const findPolicy = pages.find((p) => p.key === "Privacy & Policy")
              if (findPolicy) {
                this.title = "Privacy & Policy"
                this.description = findPolicy.value
              }
            } else if (name === "terms-conditions") {
              const findPolicy = pages.find(
                (p) => p.key === "Terms & Conditions"
              )
              if (findPolicy) {
                this.title = "Terms & Conditions"
                this.description = findPolicy.value
              }
            }
          }
        })
        .catch((status) => {
          if (status === 500) {
            this.$router.push("/not-found")
          }
        })
    }
  },
  computed: {
    ...mapGetters(["content"])
  },
  watch: {
    "$route.params"() {
      this.fetchPage()
    }
  },
  async created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
    await this.fetchPage()
  }
}
</script>
