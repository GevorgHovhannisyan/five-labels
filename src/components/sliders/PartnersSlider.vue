<template>
  <div class="partners_list">
    <div class="page_container">
      <slick
        ref="slick_partners"
        class="partners_slider"
        :options="slickOptions"
      >
        <div
          class="slide_block slick-slide"
          v-for="(partner, index) in partners"
          :key="index"
        >
          <a
            v-if="partner.button_url"
            :href="partner.button_url"
            target="_blank"
            class="partner_block custom_a"
          >
            <img
              :src="getImage(partner)"
              alt=""
              title=""
              width="132"
              height="59"
            />
          </a>
          <div v-else class="partner_block custom_a">
            <img
              :src="getImage(partner)"
              alt=""
              title=""
              width="132"
              height="59"
            />
          </div>
        </div>
      </slick>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    partners: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      slickOptions: {
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 960,
            settings: {
              slidesToShow: 5
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 2
            }
          }
        ]
      }
    }
  },
  computed: {
    getImage() {
      return (partner) => {
        return `${process.env.VUE_APP_API_URL}/${partner.image.path}`
      }
    }
  }

  // All slick methods can be used too, example here
}
</script>
