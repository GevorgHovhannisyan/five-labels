import * as types from "@/store/mutation-types"

export default {
  [types.SET_USER_ORDERS](state, { data, user }) {
    let quantities = null
    if (localStorage.getItem("cart_to_checkout")) {
      quantities = JSON.parse(
        localStorage.getItem("cart_to_checkout")
      ).quantities
    }

    if (data.length) {
      data.map((o) => {
        o.selected = o.selected ? o.selected : false
        o.opened = false
        o.saveQty = o.qty
        if (quantities && Object.keys(quantities).length) {
          if (quantities[o.id]) {
            o.qty = quantities[o.id]
          }
        }
      })
    }
    if (!user) {
      setTimeout(() => {
        localStorage.setItem("local_carts", JSON.stringify(data))
      }, 10)
    }

    state.user_orders = data
  },
  SET_SAVE_QTY(state, { data, params }) {
    const qty = data.quantity
    if (state.user_orders.length) {
      for (let i = 0; i < state.user_orders.length; i++) {
        if (state.user_orders[i].id == params.order_id) {
          state.user_orders[i].saveQty = qty
        }
      }
    }
  },
  [types.SET_OLD_QTY](state, id) {
    const order_arr = []
    if (state.user_orders.length) {
      for (let i = 0; i < state.user_orders.length; i++) {
        if (state.user_orders[i].id == id) {
          state.user_orders[i].qty = state.user_orders[i].saveQty
        }
        order_arr.push(state.user_orders[i])
      }
    }
    state.user_orders = order_arr
  },
  EMPTY_ORDERS(state) {
    state.user_orders = []
  },
  [types.DELETE_ORDER](state, id) {
    const index = state.user_orders.findIndex((a) => a.id === id)
    state.user_orders.splice(index, 1)
  },
  [types.SET_CHECKOUT_INFO](state, info) {
    if (info) {
      localStorage.setItem("cart_to_checkout", JSON.stringify(info))
    } else {
      localStorage.removeItem("cart_to_checkout")
    }
    state.checkout_info = info
  },
  [types.SET_CHECKED_ORDERS](state, { data, user, quantities }) {
    if (state.user_orders.length && data && data.length) {
      for (let i = 0; i < state.user_orders.length; i++) {
        if (data.includes(state.user_orders[i].id)) {
          state.user_orders[i].selected = true
        } else {
          state.user_orders[i].selected = false
        }
        if (quantities && Object.keys(quantities).length) {
          if (quantities[state.user_orders[i].id]) {
            state.user_orders[i].qty = quantities[state.user_orders[i].id]
          }
        }
      }
    }
    setTimeout(() => {
      if (!user) {
        localStorage.setItem("local_carts", JSON.stringify(state.user_orders))
      }
    }, 200)
  },

  [types.SET_COUNT](state, data) {
    state.cart_count = data
  },
  [types.INCREASE_CART_COUNT](state) {
    state.cart_count.cartCount++
  },
  [types.DECREASE_CART_COUNT](state) {
    state.cart_count.cartCount--
  },
  [types.SET_CONTENT](state, content) {
    state.content = content
  },
  SET_HAS_INDUSTRIES(state, industiry) {
    state.has_industries = industiry
  }
}
