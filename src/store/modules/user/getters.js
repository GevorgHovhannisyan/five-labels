export default {
  user: (state) => state.user,
  token: (state) => state.token,
  isTokenSet: (state) => state.isTokenSet,
  addresses: (state) => state.addresses,
  edit_address: (state) => state.edit_address,
  payment_methods: (state) => state.payment_methods,
  notifications: (state) => state.notifications,
  contact: (state) => state.contact,
  order_min_quantity: (state) => state.order_min_quantity,
  order_max_quantity: (state) => state.order_max_quantity
}
