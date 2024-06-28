<template>
  <div class="content">
    <div class="about_page">
      <div class="page_container">
        <h1 class="section_title">About us</h1>
        <div class="main_info">
          <div class="image_block">
            <img
              v-if="getImage"
              class="video_preview"
              alt=""
              title=""
              :src="getImage"
              sizes="(min-width: 960px) 565px, (min-width: 640px) 480px, (min-width: 480px) 600px, (min-width: 400px) 480px, 360px"
            />
          </div>
          <div class="text_block">
            {{ description }}
          </div>
        </div>
        <div class="why_us">
          <h2 class="section_title">Why us?</h2>
          <ul>
            <li v-for="(why_us, index) in why_us_list" :key="index">
              <div class="image_block">
                <img
                  :src="getImageContent(why_us)"
                  alt=""
                  title=""
                  sizes="(min-width: 1200px) 140px, (min-width: 960px) 125px, 115px"
                />
              </div>
              <div class="title_block">{{ why_us.title }}</div>
              <div class="description_block">
                {{ why_us.description }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="partners_section">
        <div class="page_container">
          <h2 class="section_title">Partners</h2>
        </div>
        <PartnersSlider v-if="partners.length" :partners="partners" />
      </div>
      <ContactUs />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import PartnersSlider from "@/components/sliders/PartnersSlider"
import ContactUs from "./components/ContactUs"
import "@/assets/sass/about.scss"

export default {
  computed: {
    getImage() {
      if (this.image) {
        return `${process.env.VUE_APP_API_URL}/${this.image.path}`
      } else {
        return null
      }
    },
    getImageContent() {
      return (why_us) => {
        if (why_us.files && why_us.files.length) {
          return `${process.env.VUE_APP_API_URL}/${why_us.files[0].path}`
        } else {
          return null
        }
      }
    }
  },
  components: {
    PartnersSlider,
    ContactUs
  },
  methods: {
    ...mapActions(["getAboutContent", "getBannerGroups", "getWhyUsSection"])
  },
  data() {
    return {
      description: null,
      image: null,
      partners: [],
      why_us_list: []
    }
  },
  async created() {
    await this.getAboutContent().then((res) => {
      if (res.data.length) {
        const data = res.data[0]
        this.description = data.description
        if (data.images && data.images.length) {
          this.image = data.images[0]
        }
      }
    })

    await this.getBannerGroups().then((groups) => {
      if (groups.length) {
        const findPartners = groups.find((b) => b.slug == "partners")
        if (findPartners) {
          this.partners = findPartners.banners
        }
      }
    })

    await this.getWhyUsSection().then((groups) => {
      this.why_us_list = groups
    })

    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>
