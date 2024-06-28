<template>
  <div class="content custom_labels_page">
    <div class="products_page">
      <div class="started_section">
        <div class="page_container">
          <h1 class="section_title">Custom labels</h1>
          <div class="media_block">
            <div class="ex_size_image">
              <img
                v-if="pageContent.image"
                :src="pageContent.image"
                sizes="(min-width: 1200px) 927px, (min-width: 960px) 600px, (min-width: 768px) 480px, (min-width: 576px) 768px, (min-width: 400px) 576px, 400px"
                alt="Custom labels"
                title="Custom labels"
              />
            </div>
          </div>
          <div class="info_block">
            <div class="description_block">
              {{ pageContent.description }}
            </div>
            <a class="custom_a start_btn" @click="toCreateOrder">Get started</a>
          </div>
        </div>
      </div>

      <div
        class="info_section"
        v-for="(section, index) in sections"
        :key="index"
      >
        <div class="page_container label_container">
          <div class="media_block">
            <div class="video_block">
              <div class="block_inner">
                <LazyYoutube
                  ref="youtubeLazyVideo"
                  v-if="section.youtube_active && section.youtube_link"
                  :src="section.youtube_link"
                  max-width="720px"
                  aspect-ratio="16:9"
                  thumbnail-quality="standard"
                  :thumbnail-listeners="{ load: loadVideo }"
                />

                <img
                  v-else-if="!section.youtube_active && section.files.length"
                  class="video_preview"
                  alt=""
                  title=""
                  :src="getImage(section.files)"
                  sizes="(min-width: 640px) 756px, (min-width: 480px) 640px, (min-width: 400px) 450px, 288px"
                />
              </div>
            </div>
          </div>
          <div class="info_asd">
            <h2 class="section_title">{{ section.title }}</h2>
            <div class="description_block">
              {{ section.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import "@/assets/sass/products.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  data() {
    return {
      pageContent: {},
      sections: []
    }
  },
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)

    this.getContentCatgory({ category: 5 }).then((contents) => {
      if (contents.length) {
        this.pageContent = contents[0]
        if (this.pageContent.files.length) {
          this.pageContent.image = `${process.env.VUE_APP_API_URL}/${this.pageContent.files[0].path}`
        }
      }
    })
    this.getContentCatgory({ category: 6 }).then((contents) => {
      this.sections = contents
    })
  },
  methods: {
    ...mapActions(["getContentCatgory"]),
    loadVideo() {},
    toCreateOrder() {
      this.$store.commit("SHOW_LOADING", true)

      this.$router
        .push("/new-order/configure-label")
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    }
  },
  computed: {
    getImage() {
      return (files) => {
        if (files.length) {
          return `${process.env.VUE_APP_API_URL}/${files[0].path}`
        } else {
          return null
        }
      }
    }
  }
}
</script>
