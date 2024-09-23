<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
    <button @click="mutateData">Mutate Data</button>
    <div v-if="isFetching">Loading...</div>
    <div v-if="isMutating">Mutating...</div>
  </div>
</template>

<script setup>
import { useQuery, useMutation, useIsFetching, useIsMutating } from '@tanstack/vue-query';

const isFetching = useIsFetching({
  predicate: (query) => query.queryKey.includes('defaultLoader')
});

const isMutating = useIsMutating({
  filter: (mutation) => mutation.options.mutationKey?.includes('defaultLoader')
});

const { refetch: fetchData } = useQuery({
  queryKey: ['fetchData', 'defaultLoader'],
  queryFn: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Fetched data');
      }, 2000);
    });
  }
});

const mutation = useMutation({
  mutationKey: ['mutateData', 'defaultLoader'],
  mutationFn: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Mutated data');
      }, 2000);
    });
  }
});

const mutateData = () => {
  mutation.mutate();
};
</script>
