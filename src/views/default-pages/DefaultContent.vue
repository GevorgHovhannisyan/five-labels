<template>
  <div class="content">
    <div class="help_page">
      <div class="page_container">
        <h1 class="article_title">
          {{ title }}
        </h1>
        <div class="article_inner">
          <div class="video_block">
            <div class="block_inner">
              <LazyYoutube
                v-if="youtube_active && youtubeLink"
                ref="youtubeLazyVideo"
                :src="youtubeLink"
                max-width="720px"
                aspect-ratio="16:9"
                thumbnail-quality="standard"
              />
              <img
                v-else-if="!youtube_active && image"
                class="video_preview"
                alt=""
                title=""
                :src="image"
                sizes="(min-width: 640px) 756px, (min-width: 480px) 640px, (min-width: 400px) 450px, 288px"
              />
            </div>
          </div>
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
      description: null,
      image: null,
      youtubeLink: "",
      youtube_active: false
    }
  },
  methods: {
    ...mapActions(["getContentPage"]),
    fetchPage() {
      this.getContentPage(this.$route.params.page)
        .then((page) => {
          this.title = page.title
          this.description = page.description
          if (page.files && page.files.length) {
            this.image = `${process.env.VUE_APP_API_URL}/${page.files[0].path}`
          }
          this.youtubeLink = page.youtube_link
          this.youtube_active = page.youtube_active
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
    if (this.$route.params.page) {
      setTimeout(async () => {
        if (this.content.length) {
          await this.fetchPage()
        } else {
          setTimeout(async () => {
            await this.fetchPage()
          }, 500)
        }
      }, 200)
    }

    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>
