<template>
  <div>
    <h1 v-if="user">Welcome, {{ user.username }}</h1>
    <button v-if="user" @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}
</script>

<style scoped>

</style>
