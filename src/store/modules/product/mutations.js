import * as types from "@/store/mutation-types"

export default {
  [types.SET_SHAPES](state, shapes) {
    state.shapes = shapes
  },
  [types.SET_CORNERS](state, corners) {
    state.corners = corners
  },
  [types.SET_SIZES](state, sizes) {
    if (sizes.length) {
      sizes.map((s) => (s.title = `${s.height}" x ${s.width}"`))
    }
    state.sizes = sizes
  },
  [types.SET_FINISHES](state, finishes) {
    state.finishes = finishes
  },
  [types.SET_MATERIALS](state, materials) {
    state.materials = materials
  },
  [types.SET_PRODUCT](state, product) {
    state.product = product
  },
  ["SET_STICKERS"](state, stickers) {
    if (stickers.length) {
      stickers.map((sticker) => {
        sticker.quantity = 1
      })
    }
    state.stickers = stickers
  },
  [types.SET_DIRECTIONS](state, directions) {
    state.directions = directions
  },
  [types.SET_QUANTITIES](state, quantities) {
    state.quantities = quantities
  },
  [types.SET_CALCULATE](state, calculate_data) {
    state.calculate_data = calculate_data
  },
  [types.SET_PRODUCT_MATERIALS](state, material) {
    if ("shape" in material) state.shape = material.shape
    if ("corner" in material) state.corner = material.corner
    if ("size" in material) state.size = material.size
    if ("finish" in material) state.finish = material.finish
    if ("material" in material) state.material = material.material
  },
  [types.SET_PRODUCT_INFORMATION](state, info) {
    if (info.direction) state.direction = info.direction
    if (info.quantity) state.quantity = info.quantity
    if ("custom_qty" in info) {
      state.quantity = +info.quantity
      state.custom_quantity = info.custom_qty
    }
    if ("zip_code" in info) state.zip_code = info.zip_code

    if ("shippingCost" in info && !info.shippingCost) {
      if (state.calculate_data) {
        state.calculate_data.shippingCost = 0
      }
    }
  },
  [types.SET_ORDER_IMAGE](state, image) {
    state.order_image = image
  },
  [types.SET_SAVE_IMAGE](state, image) {
    state.save_order_image = image
  },
  SET_ORIGINAL_IMAGE(state, original_image) {
    state.original_image = original_image
  },
  [types.NO_SAVE_IMAGE](state, image) {
    state.no_save_image = image
  },

  [types.SET_ROTATED_IMAGES](state, images) {
    state.rotated_images = images
  },
  [types.SET_IMAGE](state, image) {
    state.image_for_bulk = image
  },
  [types.SET_ARTWORK_REVIEW_IMAGE](state, image) {
    state.artwork_review_image = image
  },
  [types.CLEAR_STEPS_DATA](state, step) {
    if (step === "configure-label") {
      state.direction = null
      state.quantity = null
      // state.order_image = null
      state.calculate_data = null
      state.zip_code = null
    } else if (step === "roll-direction") {
      state.quantity = null
      // state.order_image = null
      state.calculate_data = null
      state.zip_code = null
    } else if (step === "quantity-pricing") {
      // state.order_image = null
    }
  },
  [types.SET_EDIT_ORDER](state, { order, calculate_data }) {
    if ("label_direction_id" in order) {
      state.direction = order.label_direction_id
    }
    if ("qty" in order) {
      state.quantity = order.qty
    }
    if ("shape_id" in order) {
      state.shape = order.shape_id
    }
    if ("die_id" in order) {
      state.size = order.die_id
      if (order.shape_id === 6 || order.shape_id === 7) {
        state.corner = 0
      } else {
        if (order.die && order.die.name.at(-1) === "C") {
          state.corner = "sharp"
        } else {
          state.corner = "rounded"
        }
      }
    }

    if ("finishing_id" in order) {
      state.finish = order.finishing_id
    }
    if ("material_id" in order) {
      state.material = order.material_id
    }
    if ("postal_code" in order) {
      state.zip_code = order.postal_code
    }
    if ("image" in order) {
      state.order_image = order.image
    }
    if ("id" in order) {
      state.edited_order = order.id
    }

    if ("rotated_images" in order) {
      const r_images = []
      if (order.rotated_images.length) {
        for (let i = 0; i < order.rotated_images.length; i++) {
          let id
          let title = ""
          if (i === 0) {
            title = "Top first"
            id = 16
          } else if (i === 1) {
            title = "Right side first"
            id = 18
          } else if (i === 2) {
            title = "Left side first"
            id = 19
          } else if (i === 3) {
            title = "Bottom first"
            id = 17
          }

          const src = `${process.env.VUE_APP_API_URL}/${order.rotated_images[i].path}`
          r_images.push({ ...order.rotated_images[i], id, src, title })
        }
      }
      state.rotated_images = r_images
    }

    if (order.original_image) {
      state.original_image = order.original_image
    }
    // state.corner = "rounded"
    state.custom_quantity = true

    if (calculate_data) {
      state.calculate_data = calculate_data
    }
  },
  CLEAR_ALL_STEPS(state) {
    state.direction = null
    state.quantity = null
    state.calculate_data = null
    state.zip_code = null
    state.quantity = null
    state.image_for_bulk = null
    state.edited_order = null
    state.rotated_images = []
    state.order_image = null
    state.original_image = null
    state.no_save_image = null
    state.size = null
    state.finish = null
    state.material = null
    state.save_order_image = null
    state.artwork_review_image = null
    state.custom_quantity = true
    state.product = null
  }
}
