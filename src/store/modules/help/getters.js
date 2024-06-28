export default {
  faq_list: (state) => {
    const list = {
      list_1: [],
      list_2: []
    }

    if (state.faq_list.length) {
      const count = state.faq_list.length
      const firstCnt = Math.round(count / 2)
      list.list_1 = state.faq_list.slice(0, firstCnt)
      list.list_2 = state.faq_list.slice(firstCnt)
    }

    return list
  },
  articles: (state) => {
    return state.articles
  }
}
