<template>
  <div>
    <div class="content sign_page">
      <div class="page_container">
        <div class="sign_inner">
          <div class="left_col">
            <h1 class="section_title">Welcome to FiveLabels</h1>
            <div class="short_description">
              Best printing quality to satisfy customers
            </div>
            <div class="image_block">
              <img
                src="~@/assets/images/x1/sign_image.png"
                alt=""
                title=""
                srcset="
                  ~@/assets/images/x1/sign_image.png 1x,
                  ~@/assets/images/x2/sign_image.png 2x
                "
                sizes="(min-width: 960px) 630px, 300px"
              />
            </div>
          </div>
          <div class="right_col">
            <ul
              class="sign_switch"
              v-if="
                getPage !== 'forgotPassword' && getPage !== 'recovery-password'
              "
            >
              <li :class="{ current_page: getPage === 'login' }">
                <router-link
                  custom
                  class="login_link"
                  to="/auth/login"
                  v-slot="{ navigate, href }"
                >
                  <a :href="href" @click="navigate">Log in</a>
                </router-link>
              </li>
              <li :class="{ current_page: getPage === 'register' }">
                <router-link
                  custom
                  class="login_link"
                  to="/auth/register"
                  v-slot="{ navigate, href }"
                >
                  <a :href="href" @click="navigate">Sign up</a>
                </router-link>
              </li>
            </ul>
            <h2
              v-else-if="getPage === 'forgotPassword'"
              class="section_subtitle"
            >
              Forgot Password
            </h2>
            <h2
              v-else-if="getPage === 'recovery-password'"
              class="section_subtitle"
            >
              Recovery password
            </h2>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/sass/sign.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  },
  computed: {
    getPage() {
      return this.$route.name
    }
  }
}
</script>
