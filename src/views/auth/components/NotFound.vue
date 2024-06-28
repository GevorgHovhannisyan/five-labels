<template>
  <div class="content">
    <div class="page_container">
      <div class="not_found_page">
        <img src="/images/404error.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.not_found_page {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  img {
    width: 50%;
  }
}
</style>
