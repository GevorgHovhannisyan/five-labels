export default [
  {
    path: "/auth",
    name: "auth",
    meta: {
      requiresAuth: false
    },
    redirect: "/auth/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/auth/Auth"),
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        name: "login",
        path: "login",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "@/views/auth/components/Login"
          )
      },
      {
        path: "register",
        name: "register",
        component: () =>
          import(
            /* webpackChunkName: "register" */ "@/views/auth/components/Register"
          )
      },
      {
        path: "forgot-password",
        name: "forgotPassword",
        component: () =>
          import(
            /* webpackChunkName: "forgotPassword" */ "@/views/auth/components/ForgotPassword"
          )
      },
      {
        path: "recoveryPassword/:token",
        name: "recovery-password",
        component: () =>
          import(
            /* webpackChunkName: "recovery-password" */ "@/views/auth/components/RecoveryPassword"
          )
      }
    ]
  },

  // {
  //   path: "/recoveryPassword/:token",
  //   name: "recoveryPassword",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "recoveryPassword" */ "@/views/auth/components/SetNewPassword"
  //     )
  // },
  {
    path: "/not-found",
    name: "not-found",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "recovery-password" */ "@/views/auth/components/NotFound"
      )
  }
]
