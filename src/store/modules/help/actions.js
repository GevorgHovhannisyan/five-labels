/* eslint-disable */

import * as types from "@/store/mutation-types"
import api from "@/services/api/help"

export default {
  getFaqList({ commit }) {
    return new Promise((resolve, reject) => {
      commit("SHOW_LOADING", true)
      api
        .getFaqList()
        .then((response) => {
          commit(types.SET_FAQ_LIST, response.data)
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
  getArticles({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit("SHOW_LOADING", true)

      api
        .getArticles(params)
        .then((response) => {
          commit(types.SET_ARTICLES, response.data)
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
  getBannerGroups({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getBannerGroups(params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getWhyUsSection({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getWhyUsSection(params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
