import { QueryClient, useQuery } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

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

export const useTodo = (id:number) => {
  const refID = ref<number>(id)

  const queryClient = new QueryClient()
  const queryKey = ['todo', refID]
  const query = useQuery({
      queryKey,
      queryFn: () => fetchTodoById(refID.value)
    }, queryClient)

  // setID
  const setID = (id:number) => {
    refID.value = id
  }

  // loading
  const { isLoading:_isLoading, isFetching, isPending, isRefetching } = query
  const isLoading = ref<boolean>(false)
  watch([_isLoading, isFetching, isPending, isRefetching], (values) => {
    isLoading.value = values.includes(true)
  })

  // refetch
  const refetch = async () => {
    await queryClient.invalidateQueries({queryKey}) // 상황에 따라 queryFN 실행
    // await queryClient.refetchQueries({queryKey}) // 무조건 queryFN 실행
  }

  // remove
  const remove = () => {
    console.log(queryClient.getQueriesData({queryKey}).length)
    queryClient.removeQueries({queryKey})
    console.log(queryClient.getQueriesData({queryKey}).length)
  }

  return { isLoading, data:query.data, error:query.error, refetch, remove, setID }
}
