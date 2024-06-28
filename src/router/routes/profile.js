export default [
  {
    path: "/profile",
    name: "profile",
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/profile/Profile"),
    children: [
      {
        name: "edit-profile",
        path: "edit-profile",
        component: () =>
          import(
            /* webpackChunkName: "edit-profile" */ "@/views/profile/components/EditProfile"
          )
      },
      {
        name: "payment-methods",
        path: "payment-methods",
        component: () =>
          import(
            /* webpackChunkName: "payment-methods" */ "@/views/profile/components/PaymentMethods"
          )
      },
      {
        path: "payment-methods/add-card",
        name: "add-card",
        component: () =>
          import(
            /* webpackChunkName: "add-card" */ "@/views/profile/components/AddCard"
          )
      },
      {
        path: "shipping-addresses",
        name: "shipping-addresses",
        component: () =>
          import(
            /* webpackChunkName: "shipping-addresses" */ "@/views/profile/components/ShippingAddresses"
          )
      },
      {
        path: "shipping-address/add",
        name: "add-shipping-addresses",
        component: () =>
          import(
            /* webpackChunkName: "add-shipping-addresses" */ "@/views/profile/components/AddAddress"
          )
      },
      {
        path: "shipping-address/edit/:id",
        name: "edit-shipping-address",
        component: () =>
          import(
            /* webpackChunkName: "edit-shipping-address" */ "@/views/profile/components/EditAddress"
          )
      },
      {
        path: "account-settings",
        name: "account-settings",
        component: () =>
          import(
            /* webpackChunkName: "account-settings" */ "@/views/profile/components/AccountSettings"
          )
      }
    ]
  }
]
