<template>
  <div class="uploaded_image">
    <div :id="containerId"></div>
    <div :id="roll_sizes" v-show="false"></div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from "vuex"
import {
  setupCanvas,
  addCropeGroupNode,
  addImageNode,
  addTransformer,
  // addShapeNode,
  fitImage,
  centerVertical,
  rotateImageDeg,
  centerHorizontal,
  cropImage,
  setupCanvasRoll,
  addImage
} from "@/utils/konvaHelper"
import { svgPaths } from "@/utils/data"

const emptyRollImage = require("@/assets/images/rollEmpty.png")

const bottom_first_src = require("@/assets/images/bottom_f-svg.svg")
const left_first_src = require("@/assets/images/left_f-svg.svg")
const right_first_src = require("@/assets/images/right_f-svg.svg")
const top_first_src = require("@/assets/images/top_f-svg.svg")
export default {
  methods: {
    ...mapActions(["uploadImageForUnAuth", "uploadRotatedForUnAuth"])
  },
  mounted() {
    let imageEmpty = null
    let emptyRoll = new Image()
    emptyRoll.src = emptyRollImage
    emptyRoll.onload = () => {
      imageEmpty = emptyRoll
    }

    let bottom_f = null
    let left_f = null
    let right_f = null
    let top_f = null

    let bottom_first = new Image()
    let left_first = new Image()
    let right_first = new Image()
    let top_first = new Image()

    bottom_first.src = bottom_first_src
    left_first.src = left_first_src
    right_first.src = right_first_src
    top_first.src = top_first_src

    bottom_first.onload = async () => {
      bottom_f = bottom_first
    }
    left_first.onload = async () => {
      left_f = left_first
    }
    right_first.onload = async () => {
      right_f = right_first
    }
    top_first.onload = async () => {
      top_f = top_first
    }

    const canvasSize = {
      width: 500,
      height: 500
    }
    let svgPath = svgPaths.squeare
    let shape = "squeare"
    if (this.product_shape === 4) {
      svgPath = svgPaths.rectangle
      shape = "rectangle"
    } else if (this.product_shape === 6) {
      svgPath = svgPaths.elips
      shape = "elips"
    } else if (this.product_shape === 7) {
      svgPath = svgPaths.circule
      shape = "circule"
    }
    const { layer } = setupCanvas(
      this.containerId,
      canvasSize,
      svgPaths.squeare
    )
    setupCanvasRoll(this.roll_sizes)
    addCropeGroupNode(layer, svgPath, shape)
    let imageNode
    let name_image = " "
    const imageObj = new Image()
    if (this.edited_order) {
      if (this.original_image) {
        if (this.original_image.path) {
          imageObj.src = `${process.env.VUE_APP_API_URL}/${this.original_image.path}`
          name_image = this.original_image.name
        } else {
          imageObj.src = URL.createObjectURL(this.original_image)
          name_image = this.original_image.name
        }
      }
    } else {
      if (this.order_image) {
        if (this.order_image.path) {
          imageObj.src = `${process.env.VUE_APP_API_URL}/${this.order_image.path}`
          name_image = this.order_image.name
        } else {
          if (this.save_order_image) {
            imageObj.src = URL.createObjectURL(this.save_order_image)
            name_image = this.save_order_image.name
          } else {
            name_image = this.order_image.name
            imageObj.src = URL.createObjectURL(this.order_image)
          }
        }
      }
    }

    imageObj.crossOrigin = "anonymous"
    imageObj.onload = () => {
      imageNode = addImageNode(layer, imageObj, shape)
      addTransformer(imageNode)
    }

    this.$root.$on("fitImage", () => {
      fitImage(imageObj)
    })
    this.$root.$on("centerVertical", () => {
      centerVertical()
    })
    this.$root.$on("centerHorizontal", () => {
      centerHorizontal()
    })

    this.$root.$on("rotateImage", () => {
      rotateImageDeg()
    })
    this.$root.$on("cropManually", () => {
      const { new_file } = cropImage(name_image)

      if (!this.user) {
        const formData = new FormData()
        formData.append("image", new_file)
        this.uploadImageForUnAuth(formData)
      }

      this.$store.commit("NO_SAVE_IMAGE", new_file)

      let imageObjs = new Image()
      imageObjs.src = URL.createObjectURL(new_file)
      imageObjs.crossOrigin = "anonymous"
      imageObjs.onload = async () => {
        // const { rotatedImages } = await addImage(imageEmpty, imageObjs);
        const { rotatedImages } = await addImage([top_f, bottom_f], imageObjs)

        if (!this.user) {
          setTimeout(async () => {
            if (rotatedImages && rotatedImages.length) {
              const images = []
              for (let i = 0; i < rotatedImages.length; i++) {
                let id
                const formData = new FormData()
                const img = rotatedImages[i].file
                formData.append("image", img)
                await this.uploadRotatedForUnAuth(formData).then((image) => {
                  let title = ""
                  if (rotatedImages[i].id === 16) {
                    title = "Top first"
                    id = 16
                  } else if (rotatedImages[i].id === 18) {
                    title = "Right side first"
                    id = 18
                  } else if (rotatedImages[i].id === 19) {
                    title = "Left side first"
                    id = 19
                  } else if (rotatedImages[i].id === 17) {
                    title = "Bottom first"
                    id = 17
                  }
                  images.push({
                    ...image,
                    id,
                    title,
                    src: `${process.env.VUE_APP_API_URL}/${image.path}`
                  })
                })
                this.$store.commit("SET_ROTATED_IMAGES", images)
              }
            }
          }, 200)
        } else {
          this.$store.commit("SET_ROTATED_IMAGES", rotatedImages)
        }
      }
    })
  },
  data() {
    return {
      containerId: "konva_container",
      roll_sizes: "roll_sizes",
      showKonva: false
    }
  },
  destroyed() {
    this.$root.$off("fitImage")
    this.$root.$off("centerVertical")
    this.$root.$off("centerHorizontal")
    this.$root.$off("rotateImage")
    this.$root.$off("cropManually")
  },
  computed: {
    ...mapGetters([
      "order_image",
      "product_shape",
      "user",
      "save_order_image",
      "edited_order",
      "original_image"
    ])
  }
}
</script>

<style lang="scss">
.uploaded_image canvas {
  border: 1px solid red !important;
}
</style>
