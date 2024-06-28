import axios from "axios"

export default {
  getUserOrders(params) {
    return axios.get("/userOrder", { params })
  },
  orderCheckout(payload) {
    return axios.put("/userOrder/checkout", payload)
  },
  deleteOrder(id) {
    return axios.delete("/userOrder", { data: { id: id } })
  },
  getCartCount() {
    return axios.get("/userOrderCount")
  },
  getContents(params) {
    return axios.get("/content", { params })
  },
  getSections() {
    return axios.get("/section")
  },
  getContentPage(id) {
    return axios.get(`/content/${id}`)
  },
  getPrivacyTerm(id) {
    return axios.get(`/privacyAndTerm/${id}`)
  },
  getPrivacyTerms() {
    return axios.get(`/privacyAndTerm`)
  },
  moveToArchive(id) {
    return axios.put(`/user/moveToArchive`, { id })
  }
}
