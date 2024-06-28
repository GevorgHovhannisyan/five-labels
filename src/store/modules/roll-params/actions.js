/* eslint-disable */

import * as types from "@/store/mutation-types"
import api from "@/services/api/auth"

export default {
  getShapess({ commit }) {
    return new Promise((resolve, reject) => {
      api
        .getShapes()
        .then((response) => {
          // if (response.status === 200) {
          commit(types.SET_SHAPES, response.data)
          // }
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
