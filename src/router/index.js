import Vue from 'vue'
import Router from 'vue-router'
import Grid from '@/components/Grid'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Grid',
      component: Grid
    }
  ]
})
