<template>
  <div class="h-screen w-full flex justify-center bg-blue-100">
  <Title>Home | {{ pageTitle }}</Title>
	  <div class="bg-white rounded shadow p-6 m-4 w-5/6">
        <div class="mb-4">
            <h1 class="text-2xl">Todo List</h1>
            <div class="flex mt-4">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 mr-4" placeholder="Add Todo" v-model="title" @keyup.native.enter="addTodo">
                <client-only>
                  <div class="px-3 mr-4 w-200">
                    <Datepicker class="p-2 border-2 rounded" v-model="date"></Datepicker>
                  </div>
                </client-only>
                <button class="flex-no-shrink p-2 border-2 rounded hover:text-gray-400" @click="addTodo">Add</button>
            </div>
            <div class="text-red-500" v-if="errors">{{ errors }}</div>
             <div class="flex mt-4">
                <input class="shadow appearance-none border rounded w-100 py-2 px-3 mr-4" placeholder="Filter by title" v-model="filterText" @input="updateTodos">
                <label class="md:w-2/3 block text-gray-500 font-bold">
                  <input class="mr-2 leading-tight" type="checkbox" v-model="hideCompleted" @change="updateTodos">
                  <span class="text-sm">
                    Hide completed
                  </span>
                </label>
            </div>
        </div>
        <div>
            <div v-for="todo in todos" :key="todo.id" class="flex mb-4 items-center">
                <p :class="{'line-through': todo.completed}" class="w-full"><span>{{ todo.date }} - </span>{{ todo.title }}</p>
                <button v-if="!todo.completed" class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-gray-400" @click="setComplete(todo.id)">Done</button>
                <button class="flex-no-shrink p-2 ml-2 border-2 rounded hover:text-gray-400" @click="removeTodo(todo.id)">Remove</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
  import Datepicker from 'vue3-datepicker'

  const { getTodos, setTodos } = useStorage()

  const pageTitle = useState('pageTitle')

  const date = ref(new Date())
  const title = ref('')
  const todos = ref([])
  const errors = ref('')
  const filterText = ref('')
  const hideCompleted = ref(false)

  onMounted(() => {
    let myTodos = getTodos()

    if (!myTodos) {
      myTodos = {
        offset: 0,
        data: []
     }
      setTodos(myTodos)
    }

    todos.value = applyFilters(myTodos.data);
  })

  // Add a todo to the list
  function addTodo() {

    const myTodos = getTodos()

    const todoDate = new Date(date.value).toLocaleDateString()

    // Validation
    if (title.value.length < 1) {
      errors.value = 'Title cannot be empty'
      setTimeout(() => errors.value = '', 3000)
      return
    }
    for (let todo of myTodos.data) {
      if (title.value.toLowerCase() === todo.title.toLowerCase() && todoDate === todo.date) {
        errors.value = 'Already in the list'
        setTimeout(() => errors.value = '', 3000)
        return
      }
    }

    myTodos.data.push(
      {
        id: myTodos.offset,
        title: title.value,
        date: todoDate,
        completed: false
      }
    );
    myTodos.offset += 1;

    setTodos(myTodos)

    title.value = ''
    todos.value = applyFilters(myTodos.data);
  }

  // Remove the selected todo from the list
  function removeTodo(id) {
    let myTodos = getTodos()

    const newTodos = myTodos.data.filter(item => item.id !== id);
    myTodos.data = newTodos;

    setTodos(myTodos)
    todos.value = applyFilters(myTodos.data);
  }

  // Mark the selected todo as completed
  function setComplete(id) {
   let myTodos = getTodos()

    const newTodos = myTodos.data.map(item => {
      if (item.id === id) {
        item.completed = true;
      }
      return item
    });

    myTodos.data = newTodos;

    setTodos(myTodos)
    todos.value = applyFilters(myTodos.data);
  }

  // Update the todos view
  function updateTodos() {
    let myTodos = getTodos()
    todos.value = applyFilters(myTodos.data);
  }

  // filter an array of todos by title and status
  function applyFilters(todos) {
    const filteredTodos = todos.filter(item => {
      let matchText = true;
      if (filterText.value !== '') {
        matchText = item.title.toLowerCase().includes(filterText.value.toLowerCase());
      }
      let matchStatus = true;
      if (hideCompleted.value) {
        matchStatus = item.completed === false
      }
      return matchText && matchStatus;
    });
    return filteredTodos
  }


</script>
