export default [
  {
    path: "/cart",
    name: "cart",
    meta: {
      requiresAuth: false
    },
    component: () => import(/* webpackChunkName: "cart" */ "@/views/cart/Cart")
  },
  {
    path: "/checkout",
    name: "checkout",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "checkout" */ "@/views/cart/Checkout")
  }
]
