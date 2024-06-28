export default [
  {
    path: "/help",
    name: "help",
    meta: {
      requiresAuth: false
    },
    redirect: "/help/articles",
    component: () => import(/* webpackChunkName: "help" */ "@/views/help/Help"),
    children: [
      {
        name: "articles",
        path: "articles",
        component: () =>
          import(
            /* webpackChunkName: "articles" */ "@/views/help/components/Articles"
          )
      },
      {
        name: "article-inner",
        path: "article/:id",
        component: () =>
          import(
            /* webpackChunkName: "articles-inner" */ "@/views/help/components/ArticleInner"
          )
      },
      {
        path: "faq",
        name: "faq",
        component: () =>
          import(/* webpackChunkName: "faq" */ "@/views/help/components/Faq")
      }
    ]
  }
]
