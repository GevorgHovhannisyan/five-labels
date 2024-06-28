import * as types from "@/store/mutation-types"

export default {
  CLEAR_AUTH(state) {
    state.token = null
    state.isTokenSet = false
  },
  [types.SAVE_TOKEN](state, token) {
    state.token = token
    state.isTokenSet = true
  },
  [types.LOGOUT](state) {
    state.user = null
    state.token = null
    state.isTokenSet = false
  },
  [types.SAVE_USER](state, user) {
    state.user = user.user
  },
  [types.SET_ADDRESSES](state, addresses) {
    if (addresses.length) {
      addresses.map((a) => {
        a.addr_name = `${a.postal_code}, ${a.address}, ${a.city}, ${a.state}, ${a.country}`
        a.label = a.addr_name
      })
    }
    state.addresses = addresses
  },
  [types.DELETE_SHIPPING_ADDRESS](state, id) {
    const index = state.addresses.findIndex((a) => a.id == id)
    state.addresses.splice(index, 1)
  },
  [types.SET_ADDRESS](state, address) {
    state.edit_address = address
    state.edit_address.default_address = address.default ? true : false
  },
  [types.SET_PAYMENT_METHODS](state, payment_methods) {
    state.payment_methods = payment_methods
  },
  [types.DELETE_PAYMENT_METHOD](state, id) {
    const index = state.payment_methods.findIndex((a) => a.id == id)
    state.payment_methods.splice(index, 1)
  },
  [types.SET_NOTOFICATIONS](state, notifications) {
    state.notifications = notifications
  },
  [types.SET_CONTACT](state, contact) {
    state.contact = {}
    if (contact.length) {
      for (let i = 0; i < contact.length; i++) {
        state.contact[contact[i].key] = contact[i]
      }
    }
  },
  SET_SITE_CONFIGS(state, site_configs) {
    state.order_min_quantity = site_configs.order_min_quantity
    state.order_max_quantity = site_configs.order_max_quantity
  }
}
