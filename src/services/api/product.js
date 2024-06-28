import axios from "axios"

export default {
  getShapes() {
    return axios.get(`/product/shapes`)
  },
  getCorners() {
    return axios.get(`/product/getCorners`)
  },
  getSizes(params) {
    return axios.get(`/product/sizes`, { params })
  },
  getFinishes(params) {
    return axios.get(`/product/finishes`, { params })
  },
  getMaterials(params) {
    return axios.get(`/product/materials`, { params })
  },
  getStickers() {
    return axios.get(`/sticker`)
  },
  orderSticker(payload) {
    return axios.post("/sticker/addToCart", payload)
  },
  filterProduct(params) {
    return axios.get(`/product/filter`, { params })
  },
  getDirections(params) {
    return axios.get(`/product/directions`, { params })
  },
  getQuantity(params) {
    return axios.get(`/product/quantities`, { params })
  },
  calculateQuantity(params) {
    return axios.get(`/product/calculate`, { params })
  },
  uploadImageForUnAuth(payload) {
    return axios.post("/userOrder/image/upload", payload)
  },
  addOrderToCart(payload) {
    return axios.post("/userOrder", payload)
  },
  getUserOrder(id) {
    return axios.get(`/userOrder/${id}`)
  },
  updateUserOrder(payload) {
    return axios.put(`/userOrder`, payload)
  },
  bulkCarts(payload) {
    return axios.post("/userOrder/bulk", payload)
  }
}
