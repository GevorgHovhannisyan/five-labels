<template>
  <div
    class="popup_block invoice_popup print_doc"
    :class="{ showed: openPopup }"
  >
    <div class="popup_inner">
      <div class="popup_container">
        <button class="popup_close icon_close" @click="closePopup"></button>
        <div class="section_subtitle">Order information</div>
        <div class="product_info">
          <div class="image_block">
            <div class="image_inner">
              <img
                :src="artwork_review_image"
                alt=""
                title=""
                width="200"
                height="170"
              />
            </div>
          </div>
          <div class="info_block">
            <!-- <div class="order_number">#201436 Mat oval label</div> -->
            <ul class="details_list">
              <li>
                <span class="detail_type">Shape:</span>
                <span class="detail_info">{{ invoice_data.shape_name }}</span>
              </li>
              <li>
                <span class="detail_type">Corners:</span>
                <span class="detail_info">{{ invoice_data.corner_name }}</span>
              </li>
              <li>
                <span class="detail_type">Roll direction:</span>
                <span class="detail_info">{{
                  invoice_data.roll_direction
                }}</span>
              </li>
              <li>
                <span class="detail_type">Size:</span>
                <span class="detail_info">{{ invoice_data.size_name }}</span>
              </li>
              <li>
                <span class="detail_type">Finish:</span>
                <span class="detail_info">{{ invoice_data.finish_name }}</span>
              </li>
              <li>
                <span class="detail_type">Material:</span>
                <span class="detail_info">{{ invoice_data.finish_name }}</span>
              </li>
              <li>
                <span class="detail_type">Quantity:</span>
                <span class="detail_info">{{ invoice_data.quantity }}</span>
              </li>
              <li v-if="invoice_data.postal_code">
                <span class="detail_type">Zip code:</span>
                <span class="detail_info">{{ invoice_data.postal_code }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="summary_block">
          <div class="price_includes">
            <div class="price_label">Price</div>
            <table>
              <tr>
                <td>Per label</td>
                <td>$ {{ invoice_data.labels }}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>
                  Free
                  <!-- $ {{ invoice_data.shipping }} -->
                </td>
              </tr>
            </table>
          </div>
          <div class="price_total">
            <div class="price_label">Total price</div>
            <div class="price_size">$ {{ invoice_data.total_price }}</div>
          </div>
        </div>

        <div class="popup_actions">
          <a
            class="save_btn custom_a"
            @click="downloadDocument(artwork_review_image)"
            >Download</a
          >

          <!-- <a
            :href="`${artwork_review_image}`"
            download=""
            class="download_btn icon_pdf"
            @click="downloadDocument"
            >Download</a
          > -->
          <button
            class="print_btn icon_print"
            aria-label="print"
            @click="printDocument"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import printStyle from "@/helpers/styleForReview"
import { saveAs } from "file-saver"
export default {
  props: {
    invoice_data: {
      type: Object,
      required: true
    },
    openPopup: {
      type: Boolean
    },
    text: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(["artwork_review_image"])
  },
  watch: {
    openPopup(val) {
      if (val) {
        document.body.classList.add("popup_opened")

        const popup = document.querySelector(".print_doc")
        popup.addEventListener("click", (event) => {
          const hasClass = event.target.classList.contains("popup_inner")
          if (hasClass) {
            this.closePopup()
          }
        })
      }
    }
  },
  methods: {
    closePopup() {
      document.body.classList.remove("popup_opened")
      this.$emit("closePopup")
    },
    async downloadDocument(image) {
      saveAs(image, "artwork-image.jpg")

      // this.$emit("downloadDocument")
      // this.closePopup()
    },
    printContent(data) {
      // const styles = printStyle
      var mywindow = window.open(
        "Order Information",
        "new div",
        "height=400,width=600"
      )

      mywindow.document.write("<html><head><title></title>")
      mywindow.document.write(`<style type="text/css"> ${printStyle}  </style>`)
      mywindow.document.write("</head><body >")

      mywindow.document.write(
        '<div class="popup_block showed invoice_popup">' + data + "</div>"
      )

      mywindow.document.write("</body></html>")
      mywindow.document.title = "Order Information"

      mywindow.document.querySelector(".popup_actions").style.display = "none"
      mywindow.document.querySelector(".popup_close.icon_close").style.display =
        "none"
      mywindow.focus()

      setTimeout(() => {
        mywindow.print()
        mywindow.close()
      }, 1000)
    },

    printDocument() {
      const el = document.querySelector(".print_doc").innerHTML
      this.printContent(el)
    }
  },
  created() {
    if (this.openPopup) {
      document.body.classList.add("popup_opened")
    }
  }
}
</script>
