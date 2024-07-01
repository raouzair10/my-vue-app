import { createStore } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:3000'

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    todos: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    setTodos(state, todos) {
      state.todos = todos
    },
    addTodo(state, todo) {

    },
    updateTodo(state, todo) {

    },
    deleteTodo(state, todo) {

    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.get(`${apiUrl}/users?username=${username}`)
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
        const response = await axios.get(`${apiUrl}/users?username=${username}`)
        if (response.data.length > 0) {
          throw new Error('Username is already taken')
        }
        const newUser = await axios.post(`${apiUrl}/users`, {
          'username': username,
          'password': password,
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
    async fetchTodos({ commit }, user_id) {
      try {
        const response = await axios.get(`${apiUrl}/todos?user_id=${user_id}`)
        const todos = response.data
        commit('setTodos', todos)
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
    todos: state => state.todos,
  },
})

export default store
