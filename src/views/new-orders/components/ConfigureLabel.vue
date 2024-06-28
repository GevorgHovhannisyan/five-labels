<template>
  <div class="custom_inner_block conf_label">
    <div class="col_inner">
      <h2 class="section_subtitle">Configure label</h2>
      <div class="fields_group">
        <div class="field_block">
          <span class="label cust">Shape</span>

          <div class="loading_parent" v-if="shapeLoading">
            <SmallLoader />
          </div>

          <v-select
            v-model="shape"
            :options="shapes"
            @input="shapeChanged(true, true)"
            :clearable="false"
            :searchable="false"
            :reduce="(shape) => shape.service_id"
            class="size_drop shap"
            @open="openedSelect('.shap')"
          >
            <template #open-indicator="{ attributes }">
              <span v-bind="attributes" class="icon_down"></span>
            </template>
          </v-select>
        </div>
        <div class="field_block" :class="{ no_drop_cursor: disableCorner }">
          <span class="label">Corners</span>
          <v-select
            v-model="corner"
            :options="corners"
            :clearable="false"
            :searchable="false"
            :disabled="disableCorner"
            @input="shapeChanged(true, true)"
            :reduce="(corner) => corner.id"
            class="size_drop corner_conf corn"
            @open="openedSelect('.corn')"
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
          <div class="custom_select_conf" :class="{ opened: toogle_select }">
            <div class="drop_btn" @click="openSizeStep">
              <input
                name="size"
                class="size_inp"
                v-model="size_name"
                placeholder="Select size"
                readonly
              />
            </div>
            <div
              class="drop_block_conf"
              data-noresult="No results"
              :class="{
                home_opened: toogle_select,
                no_result: !sizes.length
              }"
            >
              <div class="list_filter">
                <label>
                  <span class="name_block">height</span>
                  <input
                    maxlength="5"
                    oninput="this.value=this.value.replace(/[^0-9.]/g,'');"
                    data-param="height"
                    @input="changeWidth($event)"
                    class="step_input_height"
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
                    class="step_input_width"
                  />
                  <span class="param_unit">in</span>
                </label>
              </div>
              <ul class="select_list step_size_list">
                <li
                  @click="checkSize(die)"
                  v-for="(die, index) in sizes"
                  :key="index"
                  :class="{ selected: die.service_id === size }"
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
            @input="finishChanged(true)"
            :searchable="false"
            :reduce="(finish) => finish.service_id"
            class="size_drop fin"
            @open="openedSelect('.fin')"
          >
            <template #open-indicator="{ attributes }">
              <span v-bind="attributes" class="icon_down"></span>
            </template>
          </v-select>
          <!-- <span class="compare_btn">Compare materials</span> -->
        </div>
        <div class="field_block">
          <span class="label">Material</span>
          <div class="loading_parent" v-if="materialLoading">
            <SmallLoader />
          </div>
          <v-select
            v-model="material"
            :options="materials"
            :clearable="false"
            @input="materialChanged(true)"
            :searchable="false"
            label="title"
            :reduce="(material) => material.service_id"
            @open="openedSelect('.mat')"
            class="size_drop mat"
          >
            <template #open-indicator="{ attributes }">
              <span v-bind="attributes" class="icon_down"></span>
            </template>
          </v-select>
          <!-- <span class="compare_btn">Compare materials</span> -->
        </div>
      </div>
    </div>
    <div class="btns_block">
      <a
        @click="toDirections"
        :class="{ disabled_next_step: !validConfigs }"
        class="next_btn icon_right custom_a"
        >Next</a
      >
    </div>
    <SuccessFailPopup
      :openPopup="openSuccessFail"
      @closePopup="closePopup"
      :checkout_status="400"
      :text="err_text"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import SuccessFailPopup from "@/components/common/SuccessFailPopup"
// import InnerLoader from "@/components/core/InnerLoader"
import SmallLoader from "@/components/core/SmallLoader"

import $ from "jquery"
export default {
  props: {
    setOrderConfigs: {
      type: Number
    }
  },
  data() {
    return {
      shape: null,
      corner: null,
      size: null,
      finish: null,
      material: null,
      openSuccessFail: false,
      toogle_select: false,
      size_name: null,
      err_text: null,
      // innerLoader: false,
      corners: [
        { label: "Rounded", id: "rounded" },
        { label: "Sharp", id: "sharp" }
        // { label: "-", id: null }
        // this.corners.push()
      ],
      disableCorner: false,

      shapeLoading: false,
      sizeLoading: false,
      finishLoading: false,
      materialLoading: false

      // corner_list: []
    }
  },
  watch: {
    setOrderConfigs(val) {
      if (val) {
        if (val === 1) {
          this.toDirections()
        } else if (val === 2) {
          this.$store.commit("SET_PRODUCT_MATERIALS", {
            shape: this.shape,
            finish: this.finish,
            material: this.material,
            corner: this.corner,
            size: this.size
          })
        }
        // if (
        //   this.product_shape &&
        //   this.product_corner &&
        //   this.product_size &&
        //   this.product_finish &&
        //   this.product_material
        // )
      }
    }
  },
  computed: {
    ...mapGetters([
      "shapes",
      "sizes",
      "finishes",
      "materials",
      "product_shape",
      "product_corner",
      "product_size",
      "product_finish",
      "product_material",
      "product",
      "zip_code",
      "edited_order"
    ]),
    validConfigs() {
      return this.shape && this.finish && this.material && this.size
    }
  },
  async created() {
    setTimeout(() => {
      window.scrollTo(0, 0)
      const that = this
      $(".order_steps").click((e) => {
        if (
          !$(e.target).is(".drop_block_conf") &&
          !$(e.target).is(".drop_block_conf *") &&
          !$(e.target).is(".size_inp")
        ) {
          $(".drop_block_conf").parent().removeClass("opened")
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
    if (!this.$route.params.id) {
      this.shapeLoading = true
      this.sizeLoading = true
      this.finishLoading = true
      this.materialLoading = true

      await this.getShapes().then(() => {
        if (this.shapes.length) {
          if (this.product_shape) {
            this.shape = this.product_shape
            this.shapeChanged(false)
            setTimeout(() => {
              this.shapeLoading = false
            }, 200)
          } else if (this.shapes.length) {
            this.shape = this.shapes[0].service_id
            this.shapeChanged(true)
            setTimeout(() => {
              this.shapeLoading = false
            }, 200)
          }
        } else {
          // this.innerLoader = false
          this.shapeLoading = false

          this.$store.commit("SHOW_LOADING", false)
        }
      })
    } else {
      this.shapeLoading = true
      this.sizeLoading = true
      this.finishLoading = true
      this.materialLoading = true

      await this.getUserOrder(+this.$route.params.id)
        .then((res) => {
          const order_data = res.data
          this.$store.commit("SET_EDIT_ORDER", {
            order: { ...order_data, id: order_data.id }
          })
          if (!order_data.sticker_id) {
            const params = {
              product_id: order_data.product_id,
              shape_id: order_data.shape_id,
              finish_id: order_data.finishing_id,
              material_id: order_data.material_id,
              die_id: order_data.die_id,
              direction_id: order_data.label_direction_id,
              quantity: order_data.qty,
              order_id: order_data.id
            }

            if (this.zip_code) {
              params.postal_code = this.zip_code
            }

            if (this.product_corner === 0) {
              this.disableCorner = true

              this.corners.push({ label: "-", id: 0 })
            } else {
              const findNull = this.corners.find((c) => c.id === 0)
              this.disableCorner = false

              if (findNull && this.product_corner) {
                const index = this.corners.findIndex((c) => c.id === 0)
                this.corners.splice(index, 1)
              }
            }

            this.getShapes().then(() => {
              this.shape = this.product_shape
              this.corner = this.product_corner
              const params = { shape_id: this.shape, corner_type: +this.corner }
              this.getSizes(params).then(() => {
                this.size = this.product_size
                const size = this.sizes.find(
                  (s) => s.service_id === this.product_size
                )
                if (size) {
                  this.size_name = size.title
                }
                this.sizeLoading = false
              })
              this.shapeLoading = false
              this.getFinishes({ shape_id: this.shape }).then(async () => {
                this.finish = this.product_finish
                const params = {
                  shape_id: this.shape,
                  finish_id: this.finish
                }
                setTimeout(() => {
                  this.finishLoading = false
                }, 200)

                this.getMaterials(params).then(() => {
                  if (this.materials.length) {
                    this.material = this.product_material
                    this.filterAndGetDirections()
                    setTimeout(() => {
                      this.materialLoading = false
                    }, 200)
                  } else {
                    // this.innerLoader = false
                    this.material = null
                    setTimeout(() => {
                      this.materialLoading = false
                    }, 200)
                  }
                })
              })
            })

            this.calculateQuantity({ params }).then((res) => {
              this.$store.commit("SET_EDIT_ORDER", {
                order: { ...order_data, id: order_data.id },
                calculate_data: res.data
              })
            })
          } else {
            this.$router.push("/cart").then(() => {})
          }
        })
        .catch((err) => {
          if (err && err.response) {
            if (err.response.status === 401) {
              this.$router.push("/auth/login").catch(() => {})
            } else {
              this.err_text = "Could not find order"
              this.openSuccessFail = true
              // this.$router.push('/cart').then(() => {})
            }
          }
        })
    }
  },
  methods: {
    ...mapActions([
      "getShapes",
      "getSizes",
      "getFinishes",
      "getMaterials",
      "filterProduct",
      "getDirections",
      "calculateQuantity",
      "getUserOrder"
    ]),
    changeWidth(event) {
      if (this.shape === 5 || this.shape === 7) {
        document.querySelector(".step_input_width").value = event.target.value
      }
    },
    async toDirections() {
      if (this.validConfigs) {
        this.$store.commit("SET_PRODUCT_MATERIALS", {
          shape: this.shape,
          finish: this.finish,
          material: this.material,
          corner: +this.corner,
          size: this.size
        })

        await this.getDirections({
          product_id: this.product.service_id
        }).then((dirs) => {
          if (dirs.length) {
            // this.$store.commit("SHOW_LOADING", true)
            const id = this.$route.params.id
            const page = id
              ? `/edit-order/roll-direction/${id}`
              : "/new-order/roll-direction"
            this.$router
              .push(page)
              .then(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
              .catch(() => {
                this.$store.commit("SHOW_LOADING", false)
              })
          }
        })
      } else {
        this.err_text = "There are not enough parameters"
        this.openSuccessFail = true
      }
    },
    async filterAndGetDirections() {
      const payload = {
        shape_id: this.shape,
        finish_id: this.finish,
        material_id: this.material
      }
      await this.filterProduct(payload).then(() => {
        this.getDirections({
          product_id: this.product.service_id
        })
          .then(() => {
            // this.innerLoader = false
          })
          .catch(() => {})
      })
    },
    async shapeChanged(clear, fromCorner) {
      document.querySelector(".step_size_list").scrollTop = 0

      if (this.shape === 6 || this.shape === 7) {
        this.corners.push({ label: "-", id: 0 })

        this.disableCorner = true
        // const findNull = this.corners.find((c) => c.id === 0)
        // if (findNull) {
        this.corner = 0
        // } else {
        //     this.corner = null
        // }
        this.$store.commit("SET_PRODUCT_MATERIALS", {
          corner: 0
        })
      } else {
        this.disableCorner = false
        if (!fromCorner) {
          this.corner = "rounded"

          const findNull = this.corners.find((c) => c.id === 0)
          if (findNull) {
            if (!this.product_corner && this.disableCorner) {
              const index = this.corners.findIndex((c) => c.id === 0)
              this.corners.splice(index, 1)
            }
          }
        } else {
          const findNull = this.corners.find((c) => c.id === 0)
          if (findNull) {
            const index = this.corners.findIndex((c) => c.id === 0)
            this.corners.splice(index, 1)
          }

          if (this.corner === 0) {
            this.corner = "rounded"
          }
        }
      }

      if (clear) {
        if (!this.edited_order) {
          this.$store.commit("CLEAR_STEPS_DATA", "configure-label")
          this.$store.commit("SET_PRODUCT_MATERIALS", {
            finish: null,
            material: null,
            size: null
          })
        }
      }
      if (fromCorner) {
        this.sizeLoading = true
        this.finishLoading = true
        this.materialLoading = true
      }
      setTimeout(async () => {
        const params = { shape_id: this.shape }

        if (this.product_corner && !clear) {
          this.corner = this.product_corner
          params.corner_type = +this.corner
        } else if (this.corner) {
          params.corner_type = +this.corner
        } else if (!this.product_corner && this.disableCorner) {
          const findNull = this.corners.find((c) => c.id === 0)
          if (findNull) {
            this.corner = 0
          } else {
            this.corners.push({ label: "-", id: 0 })
            this.corner = 0
          }

          // this.$store.commit("SET_PRODUCT_MATERIALS", {
          //   corner: 0
          // })
        }

        // else {
        //   this.corner = this.corners[0].id
        // }

        await this.getSizes(params).then(() => {
          if (this.product_size && !clear) {
            this.size = this.product_size
            const size = this.sizes.find((s) => s.service_id === this.size)
            if (size) {
              this.size_name = size.title
            }

            if (this.edited_order) {
              this.$store.commit("SET_PRODUCT_MATERIALS", {
                size: this.size
              })
            }
            this.sizeChanged()
          } else if (this.sizes.length) {
            this.size = this.sizes[0].service_id
            const size = this.sizes.find((s) => s.service_id === this.size)
            if (size) {
              this.size_name = size.title
            }

            if (this.edited_order) {
              this.$store.commit("SET_PRODUCT_MATERIALS", {
                size: this.size
              })
            }
            // this.size_name =
            this.sizeChanged()
          } else {
            // this.innerLoader = false

            this.size = null
            this.size_name = "No options available"
          }

          setTimeout(() => {
            this.sizeLoading = false
          }, 100)
        })
      }, 500)
    },
    async finishChanged(clear) {
      if (clear) {
        this.clearStepsData()
      }
      const params = {
        shape_id: this.shape,
        finish_id: this.finish
      }

      await this.getMaterials(params).then(() => {
        if (this.materials.length) {
          this.material = this.materials[0].service_id

          this.filterAndGetDirections()
        }
      })
    },
    async sizeChanged(clear) {
      if (clear) {
        this.clearStepsData()
      }
      const params = {
        shape_id: this.shape
      }
      await this.getFinishes(params).then(async () => {
        if (this.product_finish) {
          this.finish = this.product_finish
        } else if (this.finishes.length) {
          this.finish = this.finishes[0].service_id
        }
        const params = {
          shape_id: this.shape,
          finish_id: this.finish
        }
        setTimeout(() => {
          this.finishLoading = false
        }, 100)

        await this.getMaterials(params).then(() => {
          if (this.product_material) {
            this.material = this.product_material
            this.filterAndGetDirections()
          } else if (this.materials.length) {
            this.material = this.materials[0].service_id

            this.filterAndGetDirections()
          } else {
            // this.innerLoader = false

            this.material = null
          }
          setTimeout(() => {
            this.materialLoading = false
          }, 100)
        })
      })
    },
    materialChanged(clear) {
      if (clear) {
        this.clearStepsData()
      }
      this.filterAndGetDirections()
    },
    clearStepsData() {
      if (!this.edited_order) {
        this.$store.commit("CLEAR_STEPS_DATA", "configure-label")
      }
    },
    checkSize(size) {
      this.size = size.service_id
      document.querySelector(".custom_select_conf").classList.remove("opened")
      // document.querySelector(".drop_block_conf").style.display = "none"
      this.size_name = size.title
      this.toogle_select = false
      this.sizeChanged(true)
      this.$store.commit("SET_PRODUCT_MATERIALS", { size: this.size })
    },
    closePopup() {
      if (this.$route.params.id) {
        this.openSuccessFail = false
        this.$router.push("/cart")
      } else {
        this.openSuccessFail = false
      }
    },
    openSizeStep() {
      this.toogle_select = !this.toogle_select
      document.querySelector(".step_input_height").value = ""
      document.querySelector(".step_input_width").value = ""
      setTimeout(() => {
        const ul = document.querySelector(".drop_block_conf")
        const heigth = document.querySelector(
          ".custom_select_conf"
        ).offsetHeight
        const header = document.querySelector(".header")
        const titleHeigth = document.querySelector(".cust").offsetHeight
        const isInViewport = this.isInViewport(ul)
        let scroll = 0

        if (window.scrollY) {
          scroll = window.scrollY
        }

        if (!isInViewport) {
          const drop_block_home = document
            .querySelector(".drop_block_conf")
            .getBoundingClientRect().top
          const headertop = header.offsetHeight
          window.scrollTo({
            top:
              drop_block_home - headertop - heigth - titleHeigth - 5 + scroll,
            behavior: "smooth"
          })
        }

        console.log(ul)

        let no_result = document
          .querySelector(".drop_block_conf")
          .classList.contains("no_result")

        if (no_result) {
          document
            .querySelector(".drop_block_conf")
            .classList.remove("no_result")
        }

        let select_list = document.querySelectorAll(
          ".step_size_list li.no_height"
        )
        let select_list_width = document.querySelectorAll(
          ".step_size_list li.no_width"
        )

        if (select_list && select_list.length) {
          for (const li of document.querySelectorAll("li.no_height")) {
            li.classList.remove("no_height")
          }
        }

        if (select_list_width && select_list_width.length) {
          for (const li of document.querySelectorAll(
            ".step_size_list li.no_width"
          )) {
            li.classList.remove("no_width")
          }
        }
      }, 100)
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
        const titleHeigth = document.querySelector(".cust").offsetHeight
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
  components: {
    SuccessFailPopup,
    // InnerLoader,
    SmallLoader
  }
}
</script>

<style lang="scss">
.custom_a {
  cursor: pointer;
}

.size_drop {
  .vs__dropdown-toggle {
    min-height: 50px;
  }

  .vs__dropdown-option.vs__dropdown-option--disabled {
    opacity: 0.5;
    background: unset;
    color: black;
  }
}

.conf_label .corner_conf {
  &.vs--disabled {
    .vs__actions {
      cursor: default;
    }
    .vs__selected {
      font-size: 35px;
      transition: 3s;
      cursor: default;
    }
    .vs__selected-options {
      cursor: default;
    }
    .icon_down.vs__open-indicator {
      cursor: default;
    }
  }
}

.custom_inner_block.conf_label {
  .inner_loader__ {
    position: relative;
    overflow: hidden;
  }

  .loading_parent {
    position: absolute;
    // max-width: 240px;
    height: 100%;
    border-radius: 4px;
    background: #f3f3f3;
    width: auto; //210px
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    left: 12px;
    height: 50px;
    right: 12px;
    text-align: center;
    margin: 0 auto;
    @media screen and (max-width: 960px) {
      height: 50px;
    }
  }
}

.disabled_next_step {
  background: #d9d9d9;
  color: #6c6c6c;
  pointer-events: none;
}
</style>
