import Vue from "vue"
import axios from "axios"
import router from "@/router"
// import moment from "moment"
// let delayTimer = null

axios.defaults.baseURL = process.env.VUE_APP_API_URL || ""
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // clearTimeout(delayTimer)
    // delayTimer = setTimeout(() => {
    //   const expires_in = localStorage.getItem("token_expires_in")
    //   const expire_date = moment(expires_in)
    //   const dateNow = moment()
    //   const diff = dateNow.diff(expire_date, "minutes")

    //   if (diff >= 60) {
    //     axios.post("user/refreshToken").then(({ data }) => {
    //       if (data && data.token) {
    //         localStorage.setItem("token", data.token)
    //         localStorage.setItem("token_expires_in", new Date())
    //       }
    //     })
    //   }
    // }, 5000)

    return response
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      // store.commit('CLEAR_AUTH');

      // store.commit("LOGOUT")
      if (router.history.current.path.includes("profile")) {
        window.location.reload()
      }
    }
    // Do something with response error
    return Promise.reject(error)
  }
)

axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // If request is different than any of the URLS in whiteList
    // then send Authorization header with token from localstorage
    const whiteList = ["/user/login", "/registration", "/user/forgotPassword"]
    if (whiteList.indexOf(config.url) === -1 && localStorage.getItem("token")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)

    // Do something with response error
  }
)

// eslint-disable-next-line no-shadow
Plugin.install = (Vue) => {
  Vue.axios = axios
  window.axios = axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios
      }
    },
    $axios: {
      get() {
        return axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
