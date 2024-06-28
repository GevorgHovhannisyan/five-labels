/* eslint-disable */

import * as types from "@/store/mutation-types"
import api from "@/services/api/product"

export default {
  getShapes({ commit }) {
    return new Promise((resolve, reject) => {
      // if (!fromHome) {
      //   commit("SHOW_LOADING", true)
      // }

      api
        .getShapes()
        .then((response) => {
          commit(types.SET_SHAPES, response.data)
          setTimeout(() => {
            // commit("SHOW_LOADING", false)
          }, 300)

          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)

          reject(error)
        })
    })
  },
  getCorners({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getCorners()
        .then((response) => {
          commit(types.SET_CORNERS, response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSizes({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getSizes(params)
        .then((response) => {
          commit(types.SET_SIZES, response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getFinishes({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getFinishes(params)
        .then((response) => {
          commit(types.SET_FINISHES, response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getMaterials({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getMaterials(params)
        .then((response) => {
          commit(types.SET_MATERIALS, response.data)
          resolve(response)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  filterProduct({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .filterProduct(params)
        .then((response) => {
          commit(types.SET_PRODUCT, response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getDirections({ commit }, params) {
    return new Promise((resolve, reject) => {
      api
        .getDirections(params)
        .then((response) => {
          commit(types.SET_DIRECTIONS, response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getQuantity({ commit }, params) {
    commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .getQuantity(params)
        .then((response) => {
          commit(types.SET_QUANTITIES, response.data)
          resolve(response.data)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  getStickers({ commit }) {
    commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .getStickers()
        .then((response) => {
          commit("SET_STICKERS", response.data)
          resolve(response.data)
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  orderSticker({ commit }, payload) {
    commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .orderSticker(payload)
        .then((response) => {
          resolve(response.data)

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
  uploadRotatedForUnAuth({ commit }, payload) {
    // commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .uploadImageForUnAuth(payload)
        .then((response) => {
          resolve(response.data)
          // commit("SET_ROTATED_URLS", response.data)
          setTimeout(() => {
            // commit("SHOW_LOADING", false)
          }, 300)
        })
        .catch((error) => {
          reject(error)
          setTimeout(() => {
            // commit("SHOW_LOADING", false)
          }, 300)
        })
    })
  },
  uploadImageForUnAuth({ commit }, payload) {
    commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .uploadImageForUnAuth(payload)
        .then((response) => {
          resolve(response.data)
          commit("SET_IMAGE", response.data)
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
  addOrderToCart({ commit }, payload) {
    commit("SHOW_LOADING", true)

    return new Promise((resolve, reject) => {
      api
        .addOrderToCart(payload)
        .then((response) => {
          resolve(response.data)

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
  calculateQuantity({ commit }, { params, noLoader }) {
    if (!noLoader) {
      commit("SHOW_LOADING", true)
    }
    return new Promise((resolve, reject) => {
      api
        .calculateQuantity(params)
        .then((response) => {
          resolve(response.data)
          commit(types.SET_CALCULATE, response.data)
          commit(types.SET_SAVE_QTY, { data: response.data, params })
          setTimeout(() => {
            if (!noLoader) {
              commit(types.SHOW_LOADING, false)
            }
          }, 400)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  getUserOrder({ commit }, payload) {
    commit("SHOW_LOADING", true)
    return new Promise((resolve, reject) => {
      api
        .getUserOrder(payload)
        .then((response) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 400)
          resolve(response)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  updateUserOrder({ commit }, { payload, noLoader }) {
    if (!noLoader) {
      commit("SHOW_LOADING", true)
    }

    return new Promise((resolve, reject) => {
      api
        .updateUserOrder(payload)
        .then((response) => {
          setTimeout(() => {
            if (!noLoader) {
              commit(types.SHOW_LOADING, false)
            }
          }, 400)
          resolve(response.data)
        })
        .catch((error) => {
          setTimeout(() => {
            commit("SHOW_LOADING", false)
          }, 300)
          reject(error)
        })
    })
  },
  bulkCarts({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api
        .bulkCarts(payload)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
