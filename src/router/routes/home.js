export default [
  {
    path: "/",
    name: "home",
    meta: {
      requiresAuth: false
    },
    component: () => import(/* webpackChunkName: "home" */ "@/views/home/Home")
  }
]
