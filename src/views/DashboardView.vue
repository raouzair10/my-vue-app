<template>
  <div class="dashboard">
    <Sidebar />
    <TodoList />
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import TodoList from '../components/TodoList.vue'
</script>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
}
</style>
