export default [
  {
    path: "/about",
    name: "about",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/about/About")
  }
]
