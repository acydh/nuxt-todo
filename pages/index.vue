<template>
  <div class="h-screen w-full flex justify-center bg-blue-100">
	  <div class="bg-white rounded shadow p-6 m-4 w-5/6">
        <div class="mb-4">
            <h1 class="text-2xl">Todo List</h1>
            <div class="flex mt-4">
                <input class="shadow appearance-none border rounded w-full py-2 px-3 mr-4" placeholder="Add Todo" v-model="title">
                <button class="flex-no-shrink p-2 border-2 rounded" @click="addTodo">Add</button>
            </div>
            <div class="text-red-500" v-if="errors">{{ errors }}</div>
             <div class="flex mt-4">
                <input class="shadow appearance-none border rounded w-100 py-2 px-3 mr-4" placeholder="Filter by title" v-model="filterText" @input="filterTodos()">
                <label class="md:w-2/3 block text-gray-500 font-bold">
                  <input class="mr-2 leading-tight" type="checkbox" v-model="showCompleted" @change="filterTodos()">
                  <span class="text-sm">
                    Hide completed
                  </span>
                </label>
            </div>
        </div>
        <div>
            <div v-for="todo in todos" :key="todo.id" class="flex mb-4 items-center">
                <p :class="{'line-through': todo.completed}" class="w-full">{{ todo.title }}</p>
                <button v-if="!todo.completed" class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-gray-400" @click="setComplete(todo.id)">Done</button>
                <button class="flex-no-shrink p-2 ml-2 border-2 rounded hover:text-gray-400" @click="removeTodo(todo.id)">Remove</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>

  const title = ref('')
  const todos = ref([])
  const errors = ref('')
  const filterText = ref('')
  const showCompleted = ref(false)

  onMounted(() => {
    let myTodos = getTodos()
    todos.value = (myTodos && myTodos.data.length > 0) ? myTodos.data : [];
  })

  function addTodo() {
    let myTodos = getTodos()

    // Guard against inserting an empty todo
    if (title.value.length < 1) {
      errors.value = 'Title cannot be empty'
      setTimeout(() => errors.value = '', 3000)
      return
    }

    // If data has been found
    if (myTodos) {
      // Add a todo
      myTodos.offset += 1;
      myTodos.data.push(
        {
          id: myTodos.offset,
          title: title.value,
          completed: false
        }
      );
    // If nothing has been found
    } else {
      // Create a todos base structure and add the first one
      myTodos = {
        offset: 0,
        data: [{
          id: 0,
          title: title.value,
          completed: false
        }]
      }
    }
    title.value = ''
    setTodos(myTodos)
  }

  function removeTodo(id) {
    let myTodos = getTodos()

    // remove the selected todo from the array
    const newTodos = myTodos.data.filter(item => item.id !== id);
    myTodos.data = newTodos;

   setTodos(myTodos)
  }

  function setComplete(id) {
   let myTodos = getTodos()

    // find the selected todo and mark it complete
    const newTodos = myTodos.data.map(item => {
      if (item.id === id) {
        item.completed = true;
      }
      return item
    });
    
    myTodos.data = newTodos;

    setTodos(myTodos)
  }

  function filterTodos() {

    let myTodos = getTodos()

    // find the todos containing the selected text and also check against status filter
    const newTodos = myTodos.data.filter(item => {
      let matchText = true;
      if (filterText.value !== '') {
        matchText = item.title.toLowerCase().includes(filterText.value.toLowerCase());
      }
      let matchStatus = true;
      if (showCompleted.value) {
        matchStatus = item.completed === false
      }
      return matchText && matchStatus;
    });

    myTodos.data = newTodos;

    todos.value = (myTodos && myTodos.data.length > 0) ? myTodos.data : [];
  }


  // Get the todos from localstorage
  function getTodos() {
    return JSON.parse(localStorage.getItem("todos"));
  }

  // Put the todos in the localstorage
  function setTodos(myTodos) {
    // Update the localstorage with the new values
    localStorage.setItem("todos", JSON.stringify(myTodos));
    // Update the page with the updated todo list and reset filter text
    filterText.value = ''
    todos.value = (myTodos && myTodos.data.length > 0) ? myTodos.data : [];
  }

</script>
