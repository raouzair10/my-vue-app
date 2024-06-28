import { createStore } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:3000/users'

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.get(`${apiUrl}?username=${username}`)
        const users = response.data
        if (users.length > 0) {
          const user = users.find(user => user.password === password)
          if (user) {
            commit('setUser', user)
            return { success: true }
          } else {
            throw new Error('Invalid password')
          }
        } else {
          throw new Error('User does not exist')
        }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    async signup({ commit }, { username, password }) {
      try {
        const response = await axios.get(`${apiUrl}?username=${username}`)
        if (response.data.length > 0) {
          throw new Error('Username is already taken')
        }
        const newUser = await axios.post(apiUrl, {
          username,
          password,
        })
        commit('setUser', newUser.data)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.message }
      }
    },
    logout({ commit }) {
      commit('clearUser')
    },
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
  },
})
