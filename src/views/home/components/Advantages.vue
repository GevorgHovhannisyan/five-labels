<template>
  <div class="advantages">
    <div class="page_container">
      <ul class="advantages_list">
        <li v-for="(advantage, index) in advantages" :key="index">
          <div class="icon_block">
            <img
              v-if="advantage.files.length"
              :src="getImage(advantage.files)"
              alt=""
              title=""
              sizes="{min-width: 960px) 82px, 82px"
            />
          </div>
          <div class="title_block">{{ advantage.title }}</div>
          <div class="text_block">
            {{ advantage.description }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      advantages: []
    }
  },
  methods: {
    ...mapActions(["getContentCatgory"])
  },
  mounted() {
    this.getContentCatgory({ category: 7 }).then((contents) => {
      this.advantages = contents
    })
  },
  computed: {
    getImage() {
      return (files) => {
        return `${process.env.VUE_APP_API_URL}/${files[0].path}`
      }
    }
  }
}
</script>
