<template>
  <div class="content">
    <div class="products_page">
      <div class="started_section">
        <div class="page_container">
          <h1 class="section_title">
            {{ page_data.title }}
          </h1>
          <div class="media_block">
            <img
              v-if="getImage(page_data.files)"
              class="video_preview"
              alt=""
              title=""
              :src="getImage(page_data.files)"
              sizes="(min-width: 960px) 565px, 280px"
            />
          </div>
          <div class="info_block">
            <div class="description_block">
              {{ page_data.description }}
            </div>
            <a class="custom_a start_btn" @click="toCreateOrder">Get started</a>
          </div>
        </div>
      </div>

      <div class="more_about" v-if="sections.length">
        <div class="page_container">
          <h2 class="section_title">
            More about custom cannabis stickers and labels
          </h2>
          <div class="about_sliders">
            <slick
              class="top_slider"
              :options="top_slider_options"
              v-if="sections.length"
            >
              <div
                class="slide_block"
                v-for="(section, index) in sections"
                :key="index"
              >
                <div class="slide_inner">
                  <div class="image_block">
                    <img
                      alt=""
                      title=""
                      :src="getImage(section.images)"
                      width="280"
                      height="290"
                    />
                  </div>
                  <div class="info_block">
                    <div class="section_subtitle">{{ section.title }}</div>
                    <div class="description_block">
                      {{ section.description }}
                    </div>
                  </div>
                </div>
              </div>
            </slick>
            <slick
              class="thumbs_slider"
              :options="thumb_slider_options"
              v-if="sections.length"
            >
              <div
                class="slide_block"
                v-for="(section, index) in sections"
                :key="index"
              >
                <div class="image_block">
                  <img
                    alt=""
                    title=""
                    :src="getImage(section.images)"
                    width="280"
                    height="290"
                  />
                </div>
              </div>
              <div class="slide_block" v-if="!sections.length">
                <div class="image_block"></div>
              </div>
            </slick>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import "@/assets/sass/products.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  data() {
    return {
      sections: [],
      page_data: {},
      top_slider_options: {
        arrows: false,
        asNavFor: ".thumbs_slider",
        infinite: false,
        responsive: [
          {
            breakpoint: 576,
            settings: {
              dots: true
            }
          }
        ]
      },
      thumb_slider_options: {
        slidesToShow: 4,
        arrows: true,
        asNavFor: ".about_sliders .top_slider",
        focusOnSelect: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 960,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      }
    }
  },
  created() {
    setTimeout(() => {
      detectContentHeight()
      this.getContents().then(() => {
        if (this.has_industries) {
          this.getContent(this.has_industries.id).then((res) => {
            this.page_data = res
            this.sections = res.sections
          })
        } else {
          this.$router.push("/")
        }
      })
    }, 150)
  },
  computed: {
    ...mapGetters(["has_industries"]),
    getImage() {
      return (files) => {
        if (files && files.length) {
          return `${process.env.VUE_APP_API_URL}/${files[0].path}`
        } else {
          return null
        }
      }
    }
  },
  methods: {
    ...mapActions(["getContents", "getContent"]),
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
  }
}
</script>
