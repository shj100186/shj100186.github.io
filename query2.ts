import { QueryClient, useQuery } from '@tanstack/vue-query';
import { computed, ref, watchEffect } from 'vue';

interface Todo {
  id: number;
  title: string;
}

let a = 0

// 데이터 가져오기 함수
async function fetchTodoById(id: number): Promise<Todo> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: id,
        title: `title ${a++}`,
      });
    }, 1000);
  });
}

export const useTodo2 = (id:number, enabled:boolean = true) => {
  const refID = ref<number>(id)
  const refEnabled = ref<boolean>(enabled)
  const useEnabled = computed(() => refEnabled)

  const queryClient = new QueryClient()
  const queryKey = ['todo2', refID]
  const query = useQuery({
      queryKey,
      queryFn: () => fetchTodoById(refID.value),
      enabled: useEnabled.value
    }, queryClient)

  // setID
  const setID = (id:number) => {
    refID.value = id
  }

  // setEnabled
  const setEnabled = (enabled:boolean) => {
    refEnabled.value = enabled
  }

  // loading
  const { isLoading:_isLoading, isFetching, isPending, isRefetching } = query
  const isLoading = ref<boolean>(false)
  watchEffect(() => {
    isLoading.value = [_isLoading.value, isFetching.value, isPending.value, isRefetching.value].includes(true)
  })

  // refetch
  const refetch = async () => {
    // 삭제 후 갱신하려 하면 실패함
    queryClient.removeQueries({queryKey})

    // 상황에 따라 queryFN 실행
    await queryClient.invalidateQueries({queryKey}) 
    // 무조건 queryFN 실행(?)
    // await queryClient.refetchQueries({queryKey})
  }

  // remove
  const remove = () => {
    // 쿼리 했으면 뭔가 있음
    console.log(queryClient.getQueriesData({queryKey}).length)
    queryClient.removeQueries({queryKey})
    // 지워짐
    console.log(queryClient.getQueriesData({queryKey}).length)
  }

  return { isLoading, data:query.data, error:query.error, refetch, remove, setID, setEnabled }
}
