import axios from "axios"

export default {
  userGet(id) {
    return axios.get(`/user/${id}`)
  },
  userLogin(payload) {
    return axios.post("/user/login", payload)
  },
  userRegister(payload) {
    return axios.post("/registration", payload)
  },
  authGoogle(payload) {
    return axios.post("/auth/google", payload)
  },
  userForgotPass(payload) {
    return axios.post("/user/forgotPassword", payload)
  },
  userGetByToken(params) {
    return axios.get(`/user/forgotPass/${params}`)
  },
  recoveryPassword({ token, password }) {
    return axios.put(`/user/forgotPass/${token}`, { password })
  },
  updateUser(payload) {
    return axios.put(`/user`, payload)
  },
  updateUserPassword(payload) {
    return axios.put(`/user/changePass`, payload)
  },
  addCard(payload) {
    return axios.post("/userPaymentMethod", payload)
  },
  getAddresses() {
    return axios.get("/userShipingAddress")
  },
  getAddress(id) {
    return axios.get(`/userShipingAddress/${id}`)
  },
  addShippingAddress(payload) {
    return axios.post("/userShipingAddress", payload)
  },
  editShippingAddress(payload) {
    return axios.put(`/userShipingAddress`, payload)
  },
  deleteShippingAddress(id) {
    return axios.delete("/userShipingAddress", { data: { id: id } })
  },
  getPaymentMethods() {
    return axios.get("/userPaymentMethod")
  },
  updatePaymentMethods(payload) {
    return axios.put(`/userPaymentMethod`, payload)
  },
  removePaymentMethod(id) {
    return axios.delete("/userPaymentMethod", { data: { id: id } })
  },
  sendContactMessage(payload) {
    return axios.post("/userMessage", payload)
  },
  refreshToken() {
    return axios.get("/token")
  },
  getAboutContent() {
    return axios.get("/aboutUs")
  },
  getArticle(id) {
    return axios.get(`/articles/${id}`)
  },
  getNotifications(params) {
    return axios.get(`/user/notifications`, { params })
  },
  readNotification(payload) {
    return axios.post(`/notificationUsers/read`, payload)
  },
  getContact() {
    return axios.get("/contact")
  },
  setFCMtoken(payload) {
    return axios.post(`/fcmToken`, payload)
  },
  getSiteConfigs() {
    return axios.get("/config")
  }
}
