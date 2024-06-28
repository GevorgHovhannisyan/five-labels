<template>
  <div class="content">
    <div class="help_page">
      <div class="page_container">
        <div v-if="$route.name !== 'article-inner'">
          <h1 class="section_title">Help</h1>
          <ul class="switch_links">
            <li
              :class="{
                current_page: $route.name === 'articles'
              }"
            >
              <router-link
                custom
                class="icon_article"
                to="/help/articles"
                v-slot="{ navigate, href }"
              >
                <a :href="href" @click="navigate">Articles</a>
              </router-link>
            </li>
            <li :class="{ current_page: $route.name === 'faq' }">
              <router-link
                custom
                class="icon_question"
                to="/help/faq"
                v-slot="{ navigate, href }"
              >
                <a :href="href" @click="navigate">FAQ</a>
              </router-link>
            </li>
          </ul>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/sass/info.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>
