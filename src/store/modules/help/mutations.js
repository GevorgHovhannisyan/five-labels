import * as types from "@/store/mutation-types"

export default {
  [types.SET_FAQ_LIST](state, faq_list) {
    state.faq_list = faq_list
  },
  [types.SET_ARTICLES](state, articles) {
    state.articles = articles
  }
}
