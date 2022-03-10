export function useStorage() {

  // Get the todos from localstorage
  function getTodos() {
    return JSON.parse(localStorage.getItem("todos"));
  }

   // Put the todos in the localstorage
  function setTodos(myTodos) {
    localStorage.setItem("todos", JSON.stringify(myTodos));
  }

  return { getTodos, setTodos }
}
