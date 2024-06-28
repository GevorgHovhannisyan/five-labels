export default {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("token") || null,
  isTokenSet: !!localStorage.getItem("token"),
  addresses: [],
  edit_address: {},
  payment_methods: [],
  notifications: [],
  contact: {
    contact_phone1: {},
    contact_phone2: {},
    email: {},
    instagram: {},
    facebook: {},
    twitter: {},
    linkedin: {}
  },
  order_min_quantity: null,
  order_max_quantity: null
}
