<template>
  <div class="product_images">
    <CoolLightBox
      v-if="images.length"
      :items="images"
      :index="index"
      @close="index = null"
    >
    </CoolLightBox>

    <div class="big_image">
      <img
        v-if="getBigImage"
        :src="getBigImage"
        sizes="(min-width: 960px) 460px, 280px"
      />
      <button
        v-if="product && product.material_data && product.material_data.images"
        @click="setIndex"
        class="zoom_btn icon_zoom"
        aria-label="zoom"
      ></button>
    </div>
    <slick
      v-if="slideImages.length && windowWidth > 575"
      ref="order_slider"
      class="small_images"
      :options="slickOptions"
    >
      <div
        class="image_block"
        v-for="(image, index) in slideImages"
        :key="index"
      >
        <div
          class="image_inner"
          :class="{ selected: image.path == current_image }"
          @click="current_image = image.path"
        >
          <img
            :src="image.src"
            :srcset="image.src"
            sizes="(min-width: 960px) 100px, 0"
          />
        </div>
      </div>
    </slick>
    <div class="description_block">
      {{
        product && product.material_data
          ? product.material_data.description
          : ""
      }}
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      images: [],
      current_image: null,
      index: null,
      slickOptions: {
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        infinite: false
      }
    }
  },
  watch: {
    product(product) {
      this.bindData(product)
    }
  },
  async created() {
    await this.bindData(this.product)
  },
  computed: {
    ...mapGetters(["product"]),
    getBigImage() {
      if (this.images.length) {
        const findImage = this.images.find((i) => i.path === this.current_image)
        if (findImage) {
          return findImage.src
        } else {
          return "/images/no_product_image.png"
        }
      } else {
        return "/images/no_product_image.png"
      }
    },
    windowWidth() {
      return window.innerWidth
    },
    slideImages() {
      return this.images
    }
  },
  methods: {
    bindData(product) {
      this.images = []
      if (
        product &&
        product.material_data &&
        product.material_data.images &&
        product.material_data.images.length
      ) {
        product.material_data.images.map((pr) => {
          pr.src = `${process.env.VUE_APP_API_URL}/${pr.path}`
        })
        setTimeout(() => {
          this.images = product.material_data.images
        }, 500)
        this.current_image = product.material_data.images[0].path
      }
    },
    setIndex() {
      const index = this.images.findIndex((i) => i.path === this.current_image)
      this.index = index
    }
  }
}
</script>
