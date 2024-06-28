<template>
  <div class="partners_section">
    <div class="page_container">
      <h2 class="section_title">
        Trusted by large and small businesses everywhere
      </h2>
    </div>
    <PartnersSlider v-if="partners.length" :partners="partners" />
  </div>
</template>

<script>
import { mapActions } from "vuex"
import PartnersSlider from "@/components/sliders/PartnersSlider"
export default {
  components: { PartnersSlider },
  data() {
    return {
      partners: []
    }
  },
  methods: {
    ...mapActions(["getBannerGroups"])
  },
  async mounted() {
    this.getBannerGroups().then((groups) => {
      if (groups.length) {
        const findPartners = groups.find((b) => b.slug == "partners")
        if (findPartners) {
          this.partners = findPartners.banners
        }
      }
    })
  }
}
</script>
