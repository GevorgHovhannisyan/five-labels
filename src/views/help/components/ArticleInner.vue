<template>
  <div>
    <h1 class="article_title">
      {{ title }}
    </h1>
    <div class="article_inner">
      <div class="video_block">
        <div class="block_inner">
          <LazyYoutube
            v-if="youtubeLink"
            ref="youtubeLazyVideo"
            :src="youtubeLink"
            max-width="720px"
            aspect-ratio="16:9"
            thumbnail-quality="standard"
          />
          <img
            v-else-if="image"
            class="video_preview"
            alt=""
            title=""
            :src="image"
            sizes="(min-width: 640px) 756px, (min-width: 480px) 640px, (min-width: 400px) 450px, 288px"
          />
        </div>
      </div>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      youtubeLink: null,
      image: null,
      content: null
    }
  },
  methods: {
    ...mapActions(["getArticle"])
  },
  async created() {
    await this.getArticle(this.$route.params.id).then((res) => {
      const data = res.data
      this.content = data.description
      this.title = data.title
      if (data.youtube_link) {
        this.youtubeLink = data.youtube_link
      }
      if (data.images && data.images.length) {
        this.image = `${process.env.VUE_APP_API_URL}/${data.images[0].path}`
      }
    })
  }
}
</script>

<style lang="scss">
.article_inner {
  p img {
    display: block;
    width: 100%;
    height: auto;
    margin: 40px 0;
  }
}
</style>
