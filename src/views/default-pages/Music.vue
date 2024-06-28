<template>
  <div class="content">
    <div class="help_page">
      <div class="page_container">
        <h1 class="article_title">
          Sticker Paper Cut Settings Guide for Silhouette, Cricut, and More
        </h1>
        <div class="article_inner">
          <div class="video_block">
            <!-- <script src="https://www.youtube.com/player_api"></script> -->
            <div class="block_inner">
              <LazyYoutube
                ref="youtubeLazyVideo"
                :src="youtubeLink"
                max-width="720px"
                aspect-ratio="16:9"
                thumbnail-quality="standard"
              />
            </div>
          </div>
          Using an electronic paper cutter like the Silhouette Cameo®, Cricut
          Explore®, or Brother ScanNCut®, is the easiest and most efficient way
          to create custom stickers. These versatile cutters coupled with
          high-quality sticker paper can help you create beautiful stickers of
          all kinds, and even custom product labels (Check out these ideas for
          other cutting machine projects)!
          <br />
          <br />Below you'll find a handy recommended settings guide for most of
          the popular cutting machine brands and products on the market. We
          tested all of our materials personally, to save you from wasting time
          and money trying to figure it out yourself! Just find your machine and
          click on it to be taken to a table specific to your machine that
          contains the proper cut settings for each material we offer.
          <br />
          <br />Included in the tables are various settings to produce kiss-cut
          and full-cut stickers. They vary for each paper electronic cutter and
          material, so you bookmark the page for future reference! You can also
          click the orange button under the table to download a printable cut
          settings PDF for your machine.
          <br />
          <br />Note: These settings are for OnlineLabels.com materials only.
          Cut settings may vary depending on the wear of your blade. If this is
          the case, continue to slightly increase or decrease pressure settings
          depending on your desired outcome.
          <img
            class="video_preview"
            alt=""
            title=""
            srcset="
              /images/x1/video_screen.jpg 1x,
              /images/x2/video_screen.jpg 2x
            "
            src="/images/x1/video_screen.jpg"
            sizes="(min-width: 640px) 756px, (min-width: 480px) 640px, (min-width: 400px) 450px, 288px"
          />
          First you’ll need to know which shipping carrier, fulfillment platform
          (e.g., ShipStation, ShippingEasy, etc.), or online marketplace (e.g.,
          Amazon FBA, Etsy, etc.) you’re shipping through. Each has a label
          generator you’ll need to use that’s specific to that platform.
          <br />
          <br />Once you have your label generated, you’ll need to print it on a
          compatible label size. We break down compatible sizes for each carrier
          and platform in this guide to small business shipping. Not sure which
          material to use? We recommend using direct thermal printing because
          it’s fast, accurate, and doesn’t use ink cartridges which makes it
          more economical (and also means no smudging!).
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/sass/info.scss"
import { detectContentHeight } from "@/helpers/mainHelper.js"
export default {
  data() {
    return {
      youtubeLink: "https://www.youtube.com/watch?v=HVw8G4ATp60"
    }
  },
  created() {
    setTimeout(() => {
      detectContentHeight()
    }, 300)
  }
}
</script>
