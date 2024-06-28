export default [
  {
    path: "/industries/:page",
    name: "industries",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "industries" */ "@/views/default-pages/DefaultContent"
      )
  },
  {
    path: "/industries",
    name: "industries",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "industries" */ "@/views/custom-labels/Industries"
      )
  },
  {
    path: "/custom-labels",
    name: "custom-labels",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "custom-labels" */ "@/views/custom-labels/Labels"
      )
  },
  {
    path: "/stickers",
    name: "stickers",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "stickers" */ "@/views/stickers/Stickers")
  },
  {
    path: "/sample-pack",
    name: "sample-pack",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "sample-pack" */ "@/views/sample-pack/SamplePack"
      )
  },
  {
    path: "/cannabis",
    name: "cannabis",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "cannabis" */ "@/views/default-pages/Cannabis"
      )
  },
  {
    path: "/canned-drinks",
    name: "canned-drinks",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "canned-drinks" */ "@/views/default-pages/CannedDrinks"
      )
  },
  {
    path: "/cofee-shops",
    name: "cofee-shops",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "cofee-shops" */ "@/views/default-pages/CofeeShops"
      )
  },
  {
    path: "/logo-stickers",
    name: "logo-stickers",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "logo-stickers" */ "@/views/default-pages/LogoStickers"
      )
  },
  {
    path: "/music",
    name: "music",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(/* webpackChunkName: "music" */ "@/views/default-pages/Music")
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "privacy-policy" */ "@/views/policy-terms/PolicyTermsView"
      )
  },
  {
    path: "/terms-conditions",
    name: "terms-conditions",
    meta: {
      requiresAuth: false
    },
    component: () =>
      import(
        /* webpackChunkName: "terms-conditions" */ "@/views/policy-terms/PolicyTermsView"
      )
  }
]
