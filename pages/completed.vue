<template>
  <div class="h-screen w-full flex justify-center bg-blue-100">
  <Title>Completed | {{ pageTitle }}</Title>
	  <div class="bg-white rounded shadow p-6 m-4 w-5/6">
        <div class="mb-4">
            <h1 class="text-2xl">Completed Todos</h1>
             <div class="flex mt-4">
                <input class="shadow appearance-none border rounded w-100 py-2 px-3 mr-4" placeholder="Filter by title" v-model="filterText" @input="updateTodos">
            </div>
        </div>
        <div>
            <div v-for="todo in todos" :key="todo.id" class="flex mb-4 items-center">
                <p class="w-full"><span>{{ todo.date }} - </span>{{ todo.title }}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
  import Datepicker from 'vue3-datepicker'

  const { getTodos } = useStorage()

  const pageTitle = useState('pageTitle')

  const todos = ref([])
  const filterText = ref('')

  onMounted(() => {
    let myTodos = getTodos()

    if (!myTodos) {
      myTodos = {
        offset: 0,
        data: []
     }
    }

    todos.value = applyFilters(myTodos.data);
  })

  // Update the todos view
  function updateTodos() {
    let myTodos = getTodos()
    todos.value = applyFilters(myTodos.data);
  }

  // filter an array of todos by title
  function applyFilters(todos) {
    const filteredTodos = todos.filter(item => {
      let matchText = true;
      if (filterText.value !== '') {
        matchText = item.title.toLowerCase().includes(filterText.value.toLowerCase());
      }
      return matchText && item.completed === true;
    });
    return filteredTodos
  }


</script>
