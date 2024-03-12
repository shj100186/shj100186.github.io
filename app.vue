<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <h3>{{ data?.title }}</h3>
    <p>ID: {{ data?.id }}</p>
    <button @click="onNext">next</button>
    <button @click="onPrev">prev</button>
    <button @click="onRefetch">refetch</button>
    <button @click="onRemove">remove</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTodo } from './query'

const todoId = ref(1);
const { data, isLoading, error, refetch, remove, setID } = useTodo(todoId.value);

const onNext = () => {  
  todoId.value += 1
  setID(todoId.value)
}

const onPrev = () => {
  todoId.value -= 1
  setID(todoId.value)
}

const onRefetch = () => {
  refetch()
}

const onRemove = () => {
  remove()
}

</script>
