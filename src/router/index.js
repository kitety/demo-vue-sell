import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import apiSeller from '@/components/api/seller'
// import apiRating from '@/components/api/ratings'
// import apiGoods from '@/components/api/goods'
import goods from '@/components/goods/goods'
import seller from '@/components/seller/seller'
import rating from '@/components/rating/rating'
// import appData from '../../data.json'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect: '/goods'
      // component: HelloWorld
    },
    // {
    //   path: '/apiseller',
    //   name: 'apiseller',
    //   component: seller
    // },
    // {
    //   path: '/apigoods',
    //   name: 'apigoods',
    //   component: apiGoods
    // },
    // {
    //   path: '/apirating',
    //   name: 'apirating',
    //   component: apiRating
    // }
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/rating',
      name: 'rating',
      component: rating
    }
  ]
})
