<template>
  <div class="about_section">
    <div class="page_container">
      <h2 class="section_title">Something interesting about FiveLabels</h2>
      <div class="section_inner">
        <div class="info_block">
          <h3 class="subtitle_block">{{ content.title }}</h3>
          <div class="description_block">{{ content.description }}</div>
        </div>
        <div class="video_block">
          <div class="block_inner">
            <LazyYoutube
              v-if="content.youtube_link"
              ref="youtubeLazyVideo"
              :src="content.youtube_link"
              max-width="720px"
              aspect-ratio="16:9"
              thumbnail-quality="standard"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      content: {}
    }
  },
  methods: {
    ...mapActions(["getContentCatgory"])
  },
  async mounted() {
    await this.getContentCatgory({ category: 8 }).then((contents) => {
      if (contents.length) {
        this.content = contents[0]
      }
    })
  }
}
</script>
