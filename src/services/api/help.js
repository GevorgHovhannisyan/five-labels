import axios from "axios"

export default {
  getFaqList() {
    return axios.get(`/faq`)
  },
  getArticles(params) {
    return axios.get(`/articles`, { params })
  },
  getBannerGroups() {
    return axios.get(`/bannerGroup`)
  },
  getWhyUsSection() {
    return axios.get(`/content/?category=4`)
  }
}
