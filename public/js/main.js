const deleteBtn = document.querySelectorAll('.delete-button')
const todoBtn = document.querySelectorAll('button.not')
const todoComplete = document.querySelectorAll('button.completed')
const assignUserDropdowns = document.querySelectorAll('.assign-user')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoBtn).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(assignUserDropdowns).forEach(dropdown => {
    dropdown.addEventListener('change', async (event) => {
      const userId = event.target.value;
      const todoId = event.target.closest('.todo-item').dataset.id;
  
      try {
        const response = await fetch(`/todos/assignTodo/${todoId}/${userId}`, {
          method: 'PUT',
          headers: {'Content-type': 'application/json'}
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.ok}`);
        }
  
        const data = await response.json();
        console.log(data);
        location.reload();
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    });
  });

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// On window content loaded

window.addEventListener('DOMContentLoaded', (event) => {
    const todoInput = document.querySelector('.todo-input');
    if (todoInput) {
        todoInput.focus();
    }
});