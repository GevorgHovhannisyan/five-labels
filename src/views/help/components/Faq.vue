<template>
  <div>
    <div class="faq_list">
      <ul>
        <li
          v-for="(faq, index) in faq_list.list_1"
          :key="index"
          :class="{ opened: opened_faq === faq.id }"
        >
          <button
            class="question_block"
            :data-text="`${faq.title}`"
            @click="openCloseFaq(faq)"
          >
            <span>
              {{ faq.title }}
              <span class="outline"></span>
            </span>
          </button>
          <div class="answer_block">
            {{ faq.description }}
          </div>
        </li>
      </ul>
      <ul>
        <li
          v-for="(faq, index) in faq_list.list_2"
          :key="index"
          :class="{ opened: opened_faq === faq.id }"
        >
          <button
            class="question_block"
            :data-text="`${faq.title}`"
            @click="openCloseFaq(faq)"
          >
            <span>
              {{ faq.title }}
              <span class="outline"></span>
            </span>
          </button>
          <div class="answer_block">
            {{ faq.description }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      opened_faq: null,
      delayTimer: null,
      canAgainClick: true
    }
  },
  computed: {
    ...mapGetters(["faq_list"])
  },
  methods: {
    ...mapActions(["getFaqList"]),
    openCloseFaq(faq) {
      if (this.canAgainClick) {
        this.canAgainClick = false
        this.opened_faq === faq.id
          ? (this.opened_faq = null)
          : (this.opened_faq = faq.id)

        setTimeout(() => {
          this.canAgainClick = true
        }, 500)
      }
    }
  },
  async mounted() {
    await this.getFaqList()
  }
}
</script>
