/* eslint-disable */

import * as types from "@/store/mutation-types"
import router from "@/router"
import api from "@/services/api/auth"

export default {
  userGet({ commit }, id) {
    return new Promise((resolve, reject) => {
      // commit("SHOW_LOADING", true)
      api
        .userGet(id)
        .then((response) => {
          if (response.status === 200) {
            commit(types.SAVE_USER, { user: response.data })
          }
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  userLogin({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .userLogin(payload)
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.setItem(
              "user",
              JSON.stringify(response.data.user)
            )
            window.localStorage.setItem("token", response.data.token)

            localStorage.setItem("token_expires_in", new Date())

            commit(types.SAVE_USER, response.data)
            commit(types.SAVE_TOKEN, response.data.token)
            let uri = window.location.search.substring(1)
            let params = new URLSearchParams(uri)
            const page = params.get("page")

            if (page) {
              router
                .push(`/${page}`)
                .then(() => {
                  setTimeout(() => {
                    commit(types.SHOW_LOADING, false)
                  }, 500)
                })
                .catch(() => {
                  setTimeout(() => {
                    commit(types.SHOW_LOADING, false)
                  }, 500)
                })
            } else {
              router
                .push("/")
                .then(() => {
                  setTimeout(() => {
                    commit(types.SHOW_LOADING, false)
                  }, 500)
                })
                .catch(() => {})
            }

            resolve(response)
          }
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          reject(error)
        })
    })
  },
  authGoogle({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .authGoogle(payload)
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.setItem(
              "user",
              JSON.stringify(response.data.user)
            )
            window.localStorage.setItem("token", response.data.token)
            localStorage.setItem("token_expires_in", new Date())

            commit(types.SAVE_USER, response.data)
            commit(types.SAVE_TOKEN, response.data.token)

            let uri = window.location.search.substring(1)
            let params = new URLSearchParams(uri)
            const page = params.get("page")

            if (page) {
              router.push(`/${page}`).catch(() => {})
            } else {
              router.push("/").catch(() => {})
            }
            setTimeout(() => {
              commit(types.SHOW_LOADING, false)
            }, 200)
            resolve(response)
          }
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          reject(error)
        })
    })
  },
  userRegister({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("SHOW_LOADING", true)

      api
        .userRegister(payload)
        .then((response) => {
          if (response.data.success) {
            router.push("/auth/login")
          }
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  userForgotPass({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .userForgotPass(payload)
        .then((response) => {
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  userGetByToken({ commit }, params) {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      api
        .userGetByToken(params)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  recoveryPassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      api
        .recoveryPassword(payload)
        .then((response) => {
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  updateUserPassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .updateUserPassword(payload)
        .then((response) => {
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  updateUser({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .updateUser(payload)
        .then((response) => {
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  sendContactMessage({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .sendContactMessage(payload)
        .then((response) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  addCard({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .addCard(payload)
        .then((response) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  addShippingAddress({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .addShippingAddress(payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getAddresses({ commit }, noLoader) {
    return new Promise((resolve, reject) => {
      if (!noLoader) {
        commit(types.SHOW_LOADING, true)
      }
      api
        .getAddresses()
        .then((response) => {
          commit(types.SET_ADDRESSES, response.data)
          setTimeout(() => {
            if (!noLoader) {
              commit(types.SHOW_LOADING, false)
            }
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  deleteShippingAddress({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .deleteShippingAddress(payload)
        .then((response) => {
          commit(types.DELETE_SHIPPING_ADDRESS, payload)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  getShippingAddress({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .getAddress(payload)
        .then((response) => {
          commit(types.SET_ADDRESS, response.data)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  editShippingAddress({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .editShippingAddress(payload)
        .then((response) => {
          // commit(types.SET_ADDRESS, response.data)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  getPaymentMethods({ commit }, { noLoader }) {
    return new Promise((resolve, reject) => {
      if (!noLoader) {
        commit(types.SHOW_LOADING, true)
      }
      api
        .getPaymentMethods()
        .then((response) => {
          commit(types.SET_PAYMENT_METHODS, response.data)
          setTimeout(() => {
            if (!noLoader) {
              commit(types.SHOW_LOADING, false)
            }
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  updatePaymentMethods({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .updatePaymentMethods(payload)
        .then((response) => {
          // commit(types.SET_PAYMENT_METHODS, response.data)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  removePaymentMethod({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .removePaymentMethod(payload)
        .then((response) => {
          commit(types.DELETE_PAYMENT_METHOD, payload)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  getAboutContent({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .getAboutContent(payload)
        .then((response) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  getArticle({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING, true)
      api
        .getArticle(payload)
        .then((response) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  getNotifications({ commit }, payload) {
    return new Promise((resolve, reject) => {
      // commit(types.SHOW_LOADING, true)
      api
        .getNotifications(payload)
        .then((response) => {
          commit(types.SET_NOTOFICATIONS, response.data)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 200)

          reject(error)
        })
    })
  },
  readNotification({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .readNotification(payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getContact({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getContact()
        .then((response) => {
          commit(types.SET_CONTACT, response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  setFCMtoken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .setFCMtoken(payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSiteConfigs({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getSiteConfigs()
        .then((response) => {
          commit("SET_SITE_CONFIGS", response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  userLogout({ commit }) {
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("tokenExpiration")
    window.localStorage.removeItem("user")
    commit(types.LOGOUT)
    router.push({
      name: "login"
    })
  }
}
