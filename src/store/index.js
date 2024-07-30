import { createStore } from 'vuex'
import axios from 'axios'

const apiUrl = 'http://localhost:5000/api'

const store = createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    todos: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      state.todos = []
      sessionStorage.removeItem('user')
    },
    setTodos(state, todos) {
      state.todos = todos
    },
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    updateTodo(state, updatedTodo) {
      const index = state.todos.findIndex(todo => todo._id === updatedTodo._id)
      if (index !== -1) {
        state.todos.splice(index, 1, updatedTodo)
      }
    },
    deleteTodo(state, todoId) {
      state.todos = state.todos.filter(todo => todo._id !== todoId)
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post(`http://localhost:3000`, { transition: 'LOGIN', data: {username, password} })
        // const response = await axios.post(`${apiUrl}/users/login`, { username, password })
        const user = response.data
        commit('setUser', user)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async signup({ commit }, { username, password }) {
      try {
        const response = await axios.post(`${apiUrl}/users/signup`, { username, password })
        const user = response.data
        commit('setUser', user)
        return { success: true }
      } catch (error) {
        return { success: false, message: error.response.data.message }
      }
    },
    async logout({ commit }) {
      try {
        await axios.post(`http://localhost:3000`, { transition: 'LOGOUT' })
        commit('clearUser')
      } catch (error) {
        console.log(error)
      }
    },
    async fetchTodos({ commit }, userId) {
      try {
        const response = await axios.post(`http://localhost:3000`, { transition: 'FETCH_TODOS', data: {userId} })
        // const response = await axios.get(`${apiUrl}/todos/${userId}`)
        const todos = response.data
        commit('setTodos', todos)
      } catch (error) {
        console.log(error)
      }
    },
    async addTodo({ commit }, newTodo) {
      try {
        const response = await axios.post(`http://localhost:3000`, { transition: 'ADD_TODO', data: {newTodo} })
        // const response = await axios.post(`${apiUrl}/todos`, newTodo)
        console.log(response.data)
        commit('addTodo', response.data)
      } catch (error) {
        console.log(error)
      }
    },
    async deleteTodo({ commit }, todoId) {
      try {
        await axios.delete(`${apiUrl}/todos/${todoId}`)
        commit('deleteTodo', todoId)
      } catch (error) {
        console.log(error)
      }
    },
    async updateTodo({ commit }, todo) {
      try {
        const response = await axios.put(`${apiUrl}/todos/${todo._id}`, todo)
        commit('updateTodo', response.data)
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
