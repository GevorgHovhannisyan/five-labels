<template>
  <div class="custom_inner_block">
    <CoolLightBox
      :items="rotated_images_box"
      :index="index"
      @close="index = null"
    >
    </CoolLightBox>

    <div class="canvas"></div>

    <div class="final_image">
      <img
        v-if="getBigImage"
        :src="getBigImage"
        sizes="(min-width: 960px) 460px, 280px"
      />
      <button
        @click="setIndex"
        class="zoom_btn icon_zoom"
        aria-label="zoom"
      ></button>
    </div>
    <div ref="final_slider" class="final_small">
      <div class="image_block" @click="setCurrentImage(24)">
        <div
          class="image_inner not_important"
          :class="{ selected: 24 == current_image }"
        >
          Not Important
        </div>
      </div>
      <div
        class="image_block"
        v-for="(image, index) in rotated_images"
        :key="index"
      >
        <div
          class="image_inner"
          :class="{ selected: image.id == current_image }"
          @click="setCurrentImage(image.id)"
        >
          <img :src="image.src" sizes="(min-width: 960px) 100px, 0" />
          {{ image.title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      current_image: 1,
      index: null,
      rotated_images_box: []
    }
  },
  computed: {
    ...mapGetters([
      "order_image",
      "edited_order",
      "rotated_images",
      "product_direction",
      "directions"
    ]),
    order_image_link() {
      if (this.edited_order && this.order_image && this.order_image.path) {
        return `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
      } else if (this.edited_order && !this.order_image.path) {
        return URL.createObjectURL(this.order_image)
      } else if (this.order_image) {
        return URL.createObjectURL(this.order_image)
      } else {
        return false
      }
    },
    getBigImage() {
      if (this.current_image == 24) {
        return this.rotated_images[0].src
      } else {
        const findImage = this.rotated_images.find(
          (i) => i.id === this.current_image
        )
        if (findImage) {
          return findImage.src
        } else {
          return false
        }
      }
    },
    windowWidth() {
      return window.innerWidth
    }
  },
  methods: {
    setCurrentImage(imageId) {
      this.current_image = imageId

      if (imageId == 24) {
        this.$store.commit(
          "SET_ARTWORK_REVIEW_IMAGE",
          this.rotated_images[0].src
        )
      } else {
        const image_source = this.rotated_images.filter(
          (item) => item.id === imageId
        )
        this.$store.commit("SET_ARTWORK_REVIEW_IMAGE", image_source[0].src)
      }

      this.$store.commit("SET_PRODUCT_INFORMATION", { direction: imageId })
    },
    setIndex() {
      if (this.current_image == 24) {
        this.index = this.rotated_images_box.length - 1
      } else {
        const index = this.rotated_images.findIndex(
          (i) => i.id === this.current_image
        )
        this.index = index
      }
    }
  },
  created() {
    this.rotated_images_box = JSON.parse(JSON.stringify(this.rotated_images))
    this.rotated_images_box.push({
      ...this.rotated_images_box[0],
      id: 16,
      service_id: 24
    })

    if (this.rotated_images[0] && this.rotated_images[0].src) {
      this.$store.commit("SET_ARTWORK_REVIEW_IMAGE", this.rotated_images[0].src)

      if (this.product_direction) {
        // if (this.product_direction === 24) {
        //   this.$store.commit("SET_PRODUCT_INFORMATION", { direction: 16 })
        //   this.current_image = 16
        // } else {
        this.current_image = this.product_direction
        // }
      }
    } else {
      setTimeout(() => {
        if (this.rotated_images[0] && this.rotated_images[0].src) {
          this.$store.commit(
            "SET_ARTWORK_REVIEW_IMAGE",
            this.rotated_images[0].src
          )
        }
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
.image_inner {
  position: relative;

  .roll_small_image {
    position: absolute;
    top: 40px !important;
    padding: 0 !important;
    width: 26% !important;
    height: 26% !important;

    &.top_side {
      transform: rotate(90deg);
      right: 25px;
    }

    &.bottom_side {
      transform: rotate(270deg);
      right: 25px;
    }

    &.right_side {
      transform: rotate(180deg);
      right: 25px;
    }

    &.left_side {
      right: 25px;
    }
  }
}

.order_steps .final_small .image_inner.selected img {
  background: aliceblue;
}
</style>
