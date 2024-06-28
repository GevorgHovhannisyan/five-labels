<template>
  <div class="content homepage">
    <div class="main_screen">
      <div class="page_container">
        <div class="images_block">
          <div class="slogan_image">
            <picture>
              <source
                media="(min-width:960px)"
                :srcset="getImage('web_slogan.svg')"
              />
              <img
                :src="getImage('mobile_slogan.svg')"
                alt=""
                title=""
                sizes="(min-width:960px) 487px, 253px"
              />
            </picture>
          </div>
          <div class="collage">
            <img
              :src="getImage('top_image.svg')"
              alt=""
              title=""
              sizes="(min-width: 960px) 720px, 320px"
            />
          </div>
        </div>
        <div class="create_form">
          <div class="field_block">
            <span class="label cus">Shape</span>
            <div class="loading_parent" v-if="shapeLoading">
              <SmallLoader />
            </div>
            <v-select
              v-model="shape"
              :options="shapes"
              @input="shapeChanged(true)"
              :clearable="false"
              :searchable="false"
              :reduce="(shape) => shape.id"
              @open="openedSelect('.shape')"
              class="shape"
            >
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes" class="icon_down"></span>
              </template>
            </v-select>
          </div>
          <div class="field_block">
            <span class="label">Corners</span>
            <v-select
              v-model="corner"
              :options="corners"
              :clearable="false"
              :searchable="false"
              @input="shapeChanged(true)"
              :disabled="disableCorner"
              class="corner"
              :reduce="(corner) => corner.id"
              @open="openedSelect('.corner')"
            >
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes" class="icon_down"></span>
              </template>
            </v-select>
          </div>
          <div class="field_block">
            <span class="label">Size</span>
            <div class="loading_parent" v-if="sizeLoading">
              <SmallLoader />
            </div>
            <div
              class="custom_select home_p"
              :class="{ opened: toogle_select }"
            >
              <div class="drop_btn_home" @click="openSizeDrop">
                <input
                  name="size"
                  v-model="size_name"
                  placeholder="Select size"
                  class="size_inp"
                  readonly
                />
              </div>
              <div
                class="drop_block_home"
                :class="{
                  home_opened: toogle_select,
                  no_result: !sizes.length
                }"
                data-noresult="No results"
              >
                <div class="list_filter">
                  <label>
                    <span class="name_block">height</span>
                    <input
                      maxlength="5"
                      oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
                      data-param="height"
                      @input="changeWidth($event)"
                      class="home_input_height"
                    />
                    <span class="param_unit">in</span>
                  </label>
                  <label>
                    <span class="name_block">width</span>
                    <input
                      maxlength="5"
                      :disabled="shape === 5 || shape === 7"
                      oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
                      data-param="width"
                      class="home_input_width"
                    />
                    <span class="param_unit">in</span>
                  </label>
                </div>
                <ul class="select_list home_die">
                  <li
                    @click="checkSize(die)"
                    v-for="(die, index) in sizes"
                    :key="index"
                    :class="{ selected: die.id === size }"
                  >
                    <span data-param="height">{{ die.height }}</span> x
                    <span data-param="width">{{ die.width }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="field_block">
            <span class="label">Finish</span>
            <div class="loading_parent" v-if="finishLoading">
              <SmallLoader />
            </div>
            <v-select
              v-model="finish"
              :options="finishes"
              :clearable="false"
              :searchable="false"
              :reduce="(finish) => finish.id"
              class="shape_sel"
              @open="openedSelect('.shape_sel')"
            >
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes" class="icon_down"></span>
              </template>
            </v-select>
          </div>
          <div class="btn_block">
            <button
              type="submit"
              :disabled="!isOrderValid"
              aria-label="get started"
              @click="getOrder"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>

    <HowWorks />
    <About />
    <Advantages />
    <Partners />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { detectContentHeight } from "@/helpers/mainHelper.js"
import HowWorks from "./components/HowWorks"
import About from "./components/About"
import Advantages from "./components/Advantages"
import Partners from "./components/Partners"
import SmallLoader from "@/components/core/SmallLoader"
import $ from "jquery"
export default {
  data() {
    return {
      shape: null,
      corner: null,
      size: null,
      size_name: null,
      finish: null,
      toogle_select: false,
      corners: [
        { label: "Rounded", id: "rounded" },
        { label: "Sharp", id: "sharp" }
      ],
      shapeLoading: false,
      sizeLoading: false,
      finishLoading: false,
      disableCorner: false
      // corner_list: []
    }
  },
  computed: {
    ...mapGetters(["shapes", "sizes", "finishes", "user"]),
    getImage() {
      return (img) => {
        return require(`../../assets/images/${img}`)
      }
    },
    isOrderValid() {
      return this.shape && this.size && this.finish
    }
  },
  methods: {
    ...mapActions([
      "getShapes",
      "getSizes",
      "getFinishes",
      "bulkCarts",
      "getCartCount"
    ]),
    changeWidth(event) {
      if (this.shape === 5 || this.shape === 7) {
        document.querySelector(".home_input_width").value = event.target.value
      }
    },
    getOrder() {
      this.$store.commit("SHOW_LOADING", true)
      this.$store.commit("SET_PRODUCT_MATERIALS", {
        shape: this.shape,
        corner: this.corner,
        size: this.size,
        finish: this.finish
      })
      setTimeout(() => {
        this.$router
          .push("/new-order/configure-label")
          .then(() => {
            this.$store.commit("SHOW_LOADING", false)
          })
          .catch(() => {})
      }, 500)
    },
    async shapeChanged(fromInp) {
      document.querySelector(".home_die").scrollTop = 0
      if (this.shape === 6 || this.shape === 7) {
        this.disableCorner = true
        const findNull = this.corners.find((c) => c.id === null)
        if (findNull) {
          this.corner = null
        } else {
          this.corners.push({ label: "-", id: null })
          this.corner = null
        }
      } else {
        if (!this.corner) {
          this.corner = "rounded"
        }
        this.disableCorner = false
        const findNull = this.corners.find((c) => c.id === null)
        if (findNull) {
          const index = this.corners.findIndex((c) => c.id === null)
          this.corners.splice(index, 1)
        }

        // this.corners[1].disabled = false
        // this.corners[1].label = "Sharp"
      }

      if (fromInp) {
        this.sizeLoading = true
        this.finishLoading = true
      }

      if (this.shape) {
        this.sizeChanged()
      }
      let params = {}
      if (this.corner) {
        params = {
          shape_id: this.shape,
          corner_type: this.corner
        }
      } else {
        params = {
          shape_id: this.shape
          // corner_type: 'rounded'
        }
      }
      await this.getSizes(params).then(() => {
        if (this.sizes.length) {
          this.size = this.sizes[0].service_id
          this.size_name = this.sizes[0].title
          this.sizeLoading = false
        } else {
          this.sizeLoading = false
          this.size = null
          this.size_name = "No size available"
        }
      })
    },
    async sizeChanged() {
      const params = {
        shape_id: this.shape
      }
      await this.getFinishes(params)
        .then(() => {
          this.$store.commit("SHOW_LOADING", false)
          if (this.finishes.length) {
            this.finish = this.finishes[0].id
            setTimeout(() => {
              this.finishLoading = false
            }, 200)
          } else {
            this.finishLoading = false
            this.finish = null
          }
        })
        .catch(() => {
          this.$store.commit("SHOW_LOADING", false)
        })
    },
    checkSize(size) {
      this.size = size.id
      document.querySelector(".custom_select").classList.remove("opened")
      // document.querySelector(".drop_block_home").style.display = "none"
      this.size_name = size.title
      this.toogle_select = false
    },
    openSizeDrop() {
      this.toogle_select = !this.toogle_select
      document.querySelector(".home_input_height").value = ""
      document.querySelector(".home_input_width").value = ""
      setTimeout(() => {
        // const ul = document.querySelector(".drop_block_home .select_list")
        const ul = document.querySelector(".drop_block_home")

        const heigth = document.querySelector(".home_p").offsetHeight
        const header = document.querySelector(".header")
        const titleHeigth = document.querySelector(".cus").offsetHeight
        const isInViewport = this.isInViewport(ul)

        let scroll = 0

        if (window.scrollY) {
          scroll = window.scrollY
        }

        if (!isInViewport) {
          const drop_block_home = document
            .querySelector(".drop_block_home")
            .getBoundingClientRect().top
          const headertop = header.offsetHeight
          window.scrollTo({
            top:
              drop_block_home - headertop - heigth - titleHeigth - 5 + scroll,
            behavior: "smooth"
          })
        }

        let no_result = document
          .querySelector(".drop_block_home")
          .classList.contains("no_result")
        if (no_result) {
          document
            .querySelector(".drop_block_home")
            .classList.remove("no_result")
        }
        let select_list = document.querySelectorAll(".select_list li.no_height")
        let select_list_width = document.querySelectorAll(
          ".select_list li.no_width"
        )

        if (select_list && select_list.length) {
          for (const li of document.querySelectorAll("li.no_height")) {
            li.classList.remove("no_height")
          }
        }

        if (select_list_width && select_list_width.length) {
          for (const li of document.querySelectorAll(
            ".select_list li.no_width"
          )) {
            li.classList.remove("no_width")
          }
        }
      }, 200)
    },
    openedSelect(classname) {
      let scroll = 0
      if (window.scrollY) {
        scroll = window.scrollY
      }
      setTimeout(() => {
        const ul = document.querySelector(classname + " ul")
        const heigth = document.querySelector(classname).offsetHeight
        const header = document.querySelector(".header")
        const titleHeigth = document.querySelector(".cus").offsetHeight
        const isInViewport = this.isInViewport(ul)
        if (!isInViewport) {
          const top = ul.getBoundingClientRect().top
          const headertop = header.offsetHeight
          window.scrollTo({
            top: top - headertop - heigth - titleHeigth - 5 + scroll,
            behavior: "smooth"
          })
        }
      }, 200)
    },
    isInViewport(el) {
      const rect = el.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      )
    }
  },
  async created() {
    // this.corner_list = [...this.corners]
    this.shapeLoading = true
    this.sizeLoading = true
    this.finishLoading = true

    this.getShapes(true).then(() => {
      if (this.shapes.length) {
        this.shape = this.shapes[0].id
        this.corner = "rounded"
        setTimeout(() => {
          this.shapeLoading = false
        }, 200)

        this.shapeChanged()
      } else {
        this.shapeLoading = false
      }
    })
    const local_carts = localStorage.getItem("local_carts")

    if (local_carts && JSON.parse(local_carts).length) {
      let carts = JSON.parse(local_carts)
      const send_carts = []
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].sticker_id) {
          send_carts.push({
            sticker_id: carts[i].sticker_id,
            qty: carts[i].qty
          })
        } else {
          send_carts.push({
            product_id: carts[i].product_id,
            shape_id: carts[i].shape_id,
            die_id: carts[i].die_id,
            finishing_id: carts[i].finishing_id,
            material_id: carts[i].material_id,
            label_direction_id: carts[i].label_direction_id,
            count: 0,
            price: carts[i].price,
            discount: 0,
            qty: carts[i].qty,
            image: carts[i].image ? carts[i].image : null,
            price_per_label: carts[i].price_per_label,
            postal_code: carts[i].postal_code,
            rotated_images: carts[i].rotated_images,
            original_image: carts[i].original_image,
            shipping_price: carts[i].shipping_price
          })
        }
      }
      if (this.user) {
        await this.bulkCarts(send_carts).then(() => {
          this.getCartCount()
          localStorage.removeItem("local_carts")
        })
      }
    }

    setTimeout(() => {
      window.scrollTo(0, 0)
      detectContentHeight()
      const that = this
      $(".content.homepage").click((e) => {
        if (
          !$(e.target).is(".drop_block_home") &&
          !$(e.target).is(".drop_block_home *") &&
          !$(e.target).is(".size_inp")
        ) {
          $(".drop_block_home").parent().removeClass("opened")
          that.toogle_select = false
        }
      })

      $(".list_filter input").on("keyup change", (e) => {
        let paramType = $(e.currentTarget).data("param")
        let paramValue = $(e.currentTarget).val()
          ? parseFloat($(e.currentTarget).val())
          : null
        if (paramValue) {
          $(".select_list li").each((index, item) => {
            let compareVal = parseFloat(
              $(item)
                .find('[data-param="' + paramType + '"]')
                .text()
            )
            if (compareVal == paramValue) {
              $(item).addClass("equal_" + paramType)
            } else if (
              compareVal >= paramValue - 0.25 &&
              compareVal <= paramValue + 0.25
            ) {
              $(item).removeClass("no_" + paramType)
            } else {
              $(item).addClass("no_" + paramType)
            }
          })
        } else {
          $(".select_list li").removeClass(
            "no_" + paramType + " equal_" + paramType
          )
          $(".select_list").parent().removeClass("no_result")
        }

        if ($(".select_list").height() < 50) {
          $(".select_list").parent().addClass("no_result")
        } else {
          $(".select_list").parent().removeClass("no_result")
        }
      })
    }, 100)
  },
  components: {
    Partners,
    HowWorks,
    About,
    Advantages,
    SmallLoader
  }
}
</script>

<style lang="scss">
.corner .vs__dropdown-option.vs__dropdown-option--disabled {
  opacity: 0.5;
  background: unset;
  color: black;
}

.loading_parent {
  position: absolute;
  height: 100%;
  border-radius: 4px;
  background: #e4eff3;
  width: 100%;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  @media screen and (max-width: 960px) {
    height: 50px;
  }
}

.homepage .corner {
  &.vs--disabled {
    .vs__actions {
      cursor: default;

      .icon_down.vs__open-indicator {
        background: none !important;
        cursor: default;
      }
    }

    .vs__selected {
      font-size: 45px;
    }

    .vs__selected-options {
      cursor: default;
    }

    .vs__selected {
      cursor: default;
    }
  }
}
.home_inner_loader {
  position: relative;
  overflow: hidden;
}
</style>
