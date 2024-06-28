<template>
  <div class="content">
    <div class="products_page">
      <div class="started_section">
        <div class="page_container">
          <h1 class="section_title">Sample pack</h1>
          <div class="media_block">
            <img
              v-if="pageContent.image"
              :src="pageContent.image"
              sizes="(min-width: 1200px) 927px, (min-width: 960px) 600px, (min-width: 768px) 480px, (min-width: 576px) 768px, (min-width: 400px) 576px, 400px"
              alt="Custom labels"
              title="Custom labels"
            />
          </div>
          <div class="info_block">
            <div class="description_block">
              {{ pageContent.description }}
            </div>
            <a class="start_btn custom_a" @click="toSticker">Order now</a>
          </div>
        </div>
      </div>
      <div v-for="(section, index) in sections" :key="index">
        <div class="full_range_section" v-if="index % 2 === 0">
          <div class="page_container">
            <h2 class="section_title">{{ section.name }}</h2>
          </div>
          <div class="info_section">
            <div class="page_container">
              <h2 class="block_title">
                {{ section.title }}
              </h2>
              <div class="media_block">
                <div class="video_block">
                  <div class="block_inner">
                    <LazyYoutube
                      ref="youtubeLazyVideo"
                      :src="section.youtube_link"
                      v-if="section.youtube_active && section.youtube_link"
                      max-width="720px"
                      aspect-ratio="16:9"
                      thumbnail-quality="standard"
                      enablejsapi
                      injectPlayerScript
                    />

                    <img
                      v-else-if="!section.youtube_active && section.image"
                      :src="section.image"
                      sizes="(min-width: 1200px) 927px, (min-width: 960px) 600px, (min-width: 768px) 480px, (min-width: 576px) 768px, (min-width: 400px) 576px, 400px"
                      alt=""
                      title=""
                    />
                  </div>
                </div>
              </div>
              <div class="description_block">
                {{ section.description }}
              </div>
            </div>
          </div>
        </div>

        <div class="started_section" v-else>
          <div class="page_container">
            <h1 class="section_title">{{ section.name }}</h1>

            <div class="media_block">
              <LazyYoutube
                ref="youtubeLazyVideo"
                :src="section.youtube_link"
                v-if="section.youtube_active && section.youtube_link"
                max-width="720px"
                aspect-ratio="16:9"
                thumbnail-quality="standard"
                enablejsapi
                injectPlayerScript
              />
              <img
                v-else-if="!section.youtube_active && section.image"
                :src="section.image"
                sizes="(min-width: 1200px) 927px, (min-width: 960px) 600px, (min-width: 768px) 480px, (min-width: 576px) 768px, (min-width: 400px) 576px, 400px"
                alt=""
                title=""
              />
            </div>
            <div class="info_block">
              <h2 class="block_title_">
                {{ section.title }}
              </h2>
              <div class="description_block">
                {{ section.description }}
              </div>
              <!-- <a class="start_btn custom_a" @click="toSticker">Buy now</a> -->
              <!-- <router-link class="start_btn" to="/stickers">
          Buy now
        </router-link> -->
              <!-- <a href="#" class="start_btn">Buy now</a> -->
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
  methods: {
    ...mapActions(["getContentCatgory"]),

    toSticker() {
      this.$store.commit("SHOW_LOADING", true)
      this.$router
        .push("/stickers")
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    }
  },
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)

    this.getContentCatgory({ category: 9 }).then((contents) => {
      if (contents.length) {
        this.pageContent = contents[0]
        if (this.pageContent.files.length) {
          this.pageContent.image = `${process.env.VUE_APP_API_URL}/${this.pageContent.files[0].path}`
        }
      }
    })
    this.getContentCatgory({ category: 10 }).then((contents) => {
      const data = []

      if (contents.length) {
        for (let i = 0; i < contents.length; i++) {
          if (contents[i].files.length) {
            contents[
              i
            ].image = `${process.env.VUE_APP_API_URL}/${contents[i].files[0].path}`
          }
          data.push(contents[i])
        }
      }
      this.sections = data
    })
  }
}
</script>

<style lang="scss" scoped>
.started_section {
  padding: 25px 0;
}
</style>
