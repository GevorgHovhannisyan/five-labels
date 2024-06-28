<template>
  <div>
    <div class="articles_list">
      <ul>
        <li v-for="(article, index) in articles.data" :key="index">
          <!-- @click="$router.push(`/article/${article.id}`)" -->
          <router-link custom :to="`/help/article/${article.id}`">
            <a class="article_block">
              <span class="article_image">
                <img
                  :src="getArticleImg(article)"
                  alt=""
                  title=""
                  sizes="(min-width: 960px) 490px, (min-width: 768px) 400px, (min-width: 640px) 288px, (min-width: 400px) 480px, 360px"
                />
              </span>
              <span class="info_block">
                <span class="article_title">{{ article.title }}</span>
                <span class="article_date">{{
                  getArticleDate(article.create_date)
                }}</span>
              </span>
            </a>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="paging" v-if="articles.count > page_items_count">
      <Pagination :totalPages="totalPages" @setPage="setPage($event)" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import Pagination from "@/components/core/Pagination"
export default {
  data() {
    return {
      opened_faq: null,
      page: 1,
      page_items_count: 8,
      totalPages: 0
    }
  },
  computed: {
    ...mapGetters(["articles"]),
    getArticleDate() {
      return (create_date) => {
        return this.$moment(create_date).format("DD/MM/YYYY")
      }
    },
    getArticleImg() {
      return (article) => {
        if (article.images && article.images.length) {
          return `${process.env.VUE_APP_API_URL}/${article.images[0].path}`
        } else {
          return "/images/no_product_image.png"
        }
      }
    }
  },
  methods: {
    ...mapActions(["getArticles"]),
    async setPage(pageNumber) {
      this.page = pageNumber
      const params = {
        page: this.page,
        page_items_count: this.page_items_count
      }
      await this.getArticles(params)
    }
  },
  async mounted() {
    const params = {
      page: this.page,
      page_items_count: this.page_items_count
    }
    await this.getArticles(params)
    this.totalPages = Math.ceil(this.articles.count / this.page_items_count)
  },
  components: {
    Pagination
  }
}
</script>
