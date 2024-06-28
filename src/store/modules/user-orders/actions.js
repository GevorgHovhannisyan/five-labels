/* eslint-disable */

import * as types from "@/store/mutation-types"
import api from "@/services/api/userOrders"

export default {
  getUserOrders({ commit }, params) {
    commit("SHOW_LOADING", true)
    return new Promise((resolve, reject) => {
      api
        .getUserOrders(params)
        .then((response) => {
          commit(types.SET_USER_ORDERS, { data: response.data, user: true })
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
  orderCheckout({ commit }, payload) {
    commit(types.SHOW_LOADING, true)

    return new Promise((resolve, reject) => {
      api
        .orderCheckout(payload)
        .then((response) => {
          // commit(types.SET_USER_ORDERS, response.data)
          resolve(response)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
            if (response.data.redirect_url) {
              window.open(response.data.redirect_url, "")
            }
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 300)
        })
    })
  },
  moveToArchive({ commit }, payload) {
    commit(types.SHOW_LOADING, true)

    return new Promise((resolve, reject) => {
      api
        .moveToArchive(payload)
        .then((response) => {
          // commit(types.SET_USER_ORDERS, response.data)
          resolve(response)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
            if (response.data.redirect_url) {
              window.open(response.data.redirect_url, "")
            }
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            commit(types.SHOW_LOADING, false)
          }, 300)
        })
    })
  },
  getCartCount({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getCartCount()
        .then((response) => {
          commit(types.SET_COUNT, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getContents({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getContents()
        .then((response) => {
          let arr = []
          let hasIndustries = null
          if (response.data.length) {
            arr = response.data.filter((p) => p.category === 1)
            hasIndustries = response.data.find((p) => p.category === 2)
          }
          commit(types.SET_CONTENT, arr)
          if (hasIndustries) {
            commit("SET_HAS_INDUSTRIES", hasIndustries)
          }
          resolve(arr)
          // commit(types.SET_CONTENT, response.data)
          // resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSections({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getSections()
        .then((response) => {
          commit(types.SET_CONTENT, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getContent({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      api
        .getContentPage(id)
        .then((response) => {
          // commit(types.SET_CONTENT, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getContentPage({ state, commit }, page) {
    const findContent = state.content.find((c) => c.button_url == page)
    return new Promise((resolve, reject) => {
      if (findContent) {
        api
          .getContentPage(findContent.id)
          .then((response) => {
            // commit(types.SET_CONTENT, response.data)
            resolve(response.data)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        reject(500)
      }
    })
  },
  getPrivacyTerms({ state, commit }) {
    return new Promise((resolve, reject) => {
      api
        .getPrivacyTerms()
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteOrder({ commit }, id) {
    return new Promise((resolve, reject) => {
      api
        .deleteOrder(id)
        .then((response) => {
          // if (response.status === 200) {
          commit(types.DELETE_ORDER, id)
          // }
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getContentCatgory({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getContents(params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
