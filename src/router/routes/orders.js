export default [
  {
    path: "/orders",
    name: "orders",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "orders" */ "@/views/orders/Orders"),
    children: [
      {
        name: "active-orders",
        path: "active-orders",
        //   title: "Configure label",
        component: () =>
          import(
            /* webpackChunkName: "active-orders" */ "@/views/orders/components/ActiveOrders"
          )
      },
      // {
      //   path: "cart",
      //   name: "cart",
      //   //   title: "Roll direction",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "cart" */ "@/views/orders/components/Cart"
      //     )
      // },
      {
        path: "cart-orders",
        name: "cart-orders",
        //   title: "Quantity and Pricing",

        component: () =>
          import(
            /* webpackChunkName: "cart-orders" */ "@/views/orders/components/CartOrders"
          )
      },
      // {
      //   path: "new-order",
      //   name: "new-order",
      //   // title: "Artwork uploading",

      //   component: () =>
      //     import(
      //       /* webpackChunkName: "new-order" */ "@/views/orders/components/NewOrder"
      //     )
      // },
      {
        path: "order-history",
        name: "order-history",
        // title: "Customize artwork",

        component: () =>
          import(
            /* webpackChunkName: "order-history" */ "@/views/orders/components/OrderHistory"
          )
      }
    ]
  }
]
