export default [
  {
    path: "/new-order",
    name: "new-order",
    redirect: "/new-order/configure-label",

    component: () =>
      import(
        /* webpackChunkName: "new-order" */ "@/views/new-orders/NewOrders"
      ),
    children: [
      {
        name: "configure-label",
        path: "configure-label",
        meta: {
          title: "Configure label"
        },
        component: () =>
          import(
            /* webpackChunkName: "configure-label" */ "@/views/new-orders/components/ConfigureLabel"
          )
      },
      {
        path: "roll-direction",
        name: "roll-direction",
        meta: {
          title: "Roll direction"
        },
        component: () =>
          import(
            /* webpackChunkName: "roll-direction" */ "@/views/new-orders/components/RollDirection"
          )
      },
      {
        path: "quantity-pricing",
        name: "quantity-pricing",
        meta: {
          title: "Quantity and Pricing"
        },

        component: () =>
          import(
            /* webpackChunkName: "quantity-pricing" */ "@/views/new-orders/components/QuantityPricing"
          )
      },
      {
        path: "artwork-uploading",
        name: "artwork-uploading",
        meta: {
          title: "Artwork uploading"
        },

        component: () =>
          import(
            /* webpackChunkName: "artwork-uploading" */ "@/views/new-orders/components/ArtworkUploading"
          )
      },
      {
        path: "customize-artwork",
        name: "customize-artwork",
        meta: {
          title: "Customize artwork"
        },

        component: () =>
          import(
            /* webpackChunkName: "customize-artwork" */ "@/views/new-orders/components/CustomizeArtwork"
          )
      },
      {
        path: "artwork-review",
        name: "artwork-review",
        meta: {
          title: "Artwork review"
        },

        component: () =>
          import(
            /* webpackChunkName: "artwork-review" */ "@/views/new-orders/components/ArtworkReview"
          )
      }
    ]
  },
  {
    path: "/edit-order",
    name: "edit-order",
    redirect: "/edit-order/configure-label/:id",

    component: () =>
      import(
        /* webpackChunkName: "new-order" */ "@/views/new-orders/NewOrders"
      ),
    children: [
      {
        name: "configure-label",
        path: "configure-label/:id",
        meta: {
          title: "Configure label"
        },
        component: () =>
          import(
            /* webpackChunkName: "configure-label" */ "@/views/new-orders/components/ConfigureLabel"
          )
      },
      {
        path: "roll-direction/:id",
        name: "roll-direction",
        meta: {
          title: "Roll direction"
        },
        component: () =>
          import(
            /* webpackChunkName: "roll-direction" */ "@/views/new-orders/components/RollDirection"
          )
      },
      {
        path: "quantity-pricing/:id",
        name: "quantity-pricing",
        meta: {
          title: "Quantity and Pricing"
        },

        component: () =>
          import(
            /* webpackChunkName: "quantity-pricing" */ "@/views/new-orders/components/QuantityPricing"
          )
      },
      {
        path: "artwork-uploading/:id",
        name: "artwork-uploading",
        meta: {
          title: "Artwork uploading"
        },

        component: () =>
          import(
            /* webpackChunkName: "artwork-uploading" */ "@/views/new-orders/components/ArtworkUploading"
          )
      },
      {
        path: "customize-artwork/:id",
        name: "customize-artwork",
        meta: {
          title: "Customize artwork"
        },

        component: () =>
          import(
            /* webpackChunkName: "customize-artwork" */ "@/views/new-orders/components/CustomizeArtwork"
          )
      },
      {
        path: "artwork-review/:id",
        name: "artwork-review",
        meta: {
          title: "Artwork review"
        },

        component: () =>
          import(
            /* webpackChunkName: "artwork-review" */ "@/views/new-orders/components/ArtworkReview"
          )
      }
    ]
  }
]
