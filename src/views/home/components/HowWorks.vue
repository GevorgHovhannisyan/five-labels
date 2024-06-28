<template>
  <!-- v-if="isMount" -->
  <div class="how_works" v-if="isMount" ref="how_works">
    <div class="page_container">
      <h2 class="section_title">How it works</h2>
      <div class="work_steps" v-if="windowWidth > 960">
        <div class="step_block">
          <div class="step_inner">
            <div class="step_title">Choose label shape</div>
            <ul class="shapes_list">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <span class="mouse_block"></span>
          </div>
        </div>
        <div class="step_block">
          <div class="step_inner">
            <div class="step_title">Add your changes</div>
            <div class="image_block">
              <img
                src="~@/assets/images/image.svg"
                alt=""
                title=""
                width="111"
                height="126"
              />
            </div>
            <div class="action_block" data-text="upload your art">
              upload your art
            </div>
          </div>
        </div>
        <div class="step_block">
          <div class="step_inner">
            <div class="step_title">Place an order</div>
            <div class="image_block">
              <img
                src="~@/assets/images/skeleton.svg"
                alt=""
                title=""
                width="192"
                height="100"
              />
            </div>
            <div class="action_block">checkout</div>
          </div>
        </div>
      </div>

      <slick
        v-else
        ref="slick-works"
        class="work_steps"
        :options="slickOptions"
      >
        <div class="step_block">
          <div class="step_inner">
            <div class="step_title">Choose label shape</div>
            <ul class="shapes_list">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <span class="mouse_block"></span>
          </div>
        </div>
        <div class="step_block st2">
          <div class="step_inner">
            <div class="step_title">Add your changes</div>
            <div class="image_block">
              <img
                src="~@/assets/images/image.svg"
                alt=""
                title=""
                width="111"
                height="126"
              />
            </div>
            <div class="action_block" data-text="upload your art">
              upload your art
            </div>
          </div>
        </div>
        <div class="step_block">
          <div class="step_inner">
            <div class="step_title">Place an order</div>
            <div class="image_block">
              <img
                src="~@/assets/images/skeleton.svg"
                alt=""
                title=""
                width="192"
                height="100"
              />
            </div>
            <div class="action_block">checkout</div>
          </div>
        </div>
      </slick>
      <span class="steps_way">
        <svg width="1373" height="34" viewBox="0 0 1373 34" fill="none">
          <path
            d="M1 21V21C55.7956 7.38413 112.047 0.5 168.509 0.5H827.5H1175.5L1251.39 6.82413C1292.61 10.259 1333.18 19.2317 1372 33.5V33.5"
            stroke="#373435"
            stroke-linecap="round"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { animate_home } from "@/helpers/mainHelper"
export default {
  computed: {
    ...mapGetters(["shapes"]),
    windowWidth() {
      return window.innerWidth
    }
  },
  data() {
    return {
      isMount: false,
      slickOptions: {
        autoplay: false,
        arrows: false,
        infinite: false,
        autoplaySpeed: 4000,
        speed: 2050,
        draggable: false,
        swipe: false,
        touchMove: false
      }
    }
  },
  created() {
    const home_scope = this
    home_scope.isMount = true
    const box = document.querySelector(".how_works")

    if (home_scope.isInViewport(box)) {
      animate_home()
    } else {
      setTimeout(() => {
        animate_home()
      }, 500)
    }

    document.addEventListener("scroll", function () {
      if (home_scope.isInViewport(box)) {
        animate_home()
      }
    })
  },
  destroyed() {
    window.removeEventListener("scroll", () => {}, false)
  },
  methods: {
    isInViewport() {
      if (this.$refs.how_works) {
        const rect = this.$refs.how_works.getBoundingClientRect()
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        )
      }
    }
  }
}
</script>
