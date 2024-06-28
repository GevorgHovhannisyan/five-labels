import * as types from "@/store/mutation-types"

export default {
  [types.SET_SHAPES](state, shapes) {
    state.shapes = shapes
  }
}
