<template>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <h4>loading : {{ isLoading ? 'loading...' : 'done' }}</h4>
    <h3>{{ data?.title }}</h3>
    <p>ID: {{ data?.id }}</p>
    <h4>loading2 : {{ isLoading2 ? 'loading...' : 'done' }}</h4>
    <h3>{{ data2?.title }}</h3>
    <p>ID2: {{ data2?.id }}</p>
    <button @click="onNext">next</button>
    <button @click="onPrev">prev</button>
    <button @click="onRefetch">refetch</button>
    <button @click="onRemove">remove</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useTodo } from './query'
import { useTodo2 } from './query2';

const todoId = ref(1);
const { data, error, isLoading, refetch, remove, setID } = useTodo(todoId.value);

const { data: data2, isLoading: isLoading2, setEnabled } = useTodo2(100, false);

watchEffect(() => {
  const isValid = data.value?.id !== undefined
  setEnabled(isValid)
})

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
