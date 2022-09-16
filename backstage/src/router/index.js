import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '../views/Home.vue'
import Square from '../views/Square'
import Window from '../views/Window'
import Dish from '../views/Dish'
import User from '../views/User'
const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  children: [{
    path: '/home/square',
    name: 'Square',
    component: Square
  },
  {
    path: '/home/user',
    name: 'User',
    component: User
  },
  {
    path: '/home/window',
    name: 'Window',
    component: Window
  },
  {
    path: '/home/dish',
    name: 'dish',
    component: Dish
  },
]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router