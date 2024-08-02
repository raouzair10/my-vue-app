import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import store from '../store'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {

  try {
    if (from.name === 'login' && to.name === 'signup') {
      await axios.post(`http://localhost:3000`, { transition: 'GO_TO_SIGNUP', data: {} })
    }
  } catch (error) {
    console.log(error)
    return { name: 'login'}
  }
  try {
    if (from.name === 'signup' && to.name === 'login') {
      await axios.post(`http://localhost:3000`, { transition: 'GO_TO_LOGIN', data: {} })
    }
  } catch (error) {
    console.log(error)
    return { name: 'signup'}
  }  

  const isAuthenticated = store.getters.isAuthenticated
  if ((to.name === 'login' || to.name === 'signup') && isAuthenticated) {
    return { name: 'home' }
  } else if (to.name === 'home' && !isAuthenticated) {
    return { name: 'login' }
  } else {
    return
  }
})

export default router
