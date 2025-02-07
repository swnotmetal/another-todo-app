const form = document.getElementById('todoform')
const todoInput = document.getElementById('newtodo')
const todoList = document.getElementById('todos-list')
const notificationEl = document.querySelector(".notification")

let edittodoID = -1
let todos = JSON.parse(localStorage.getItem('todos')) || []


const todoCounter = document.createElement('div')
todoCounter.className = 'todo-counter'
todoList.parentNode.insertBefore(todoCounter, todoList)

renderTodos() //1st render

// form submission

form.addEventListener('submit', function (e) {
    e.preventDefault()

    saveTodo();
    renderTodos()
    localStorage.setItem('todos', JSON.stringify(todos))
})

function saveTodo() {
    
    const todoValue = todoInput.value
    const isDuplicate = todos.some((t) => t.value.toUpperCase() === todoValue.toUpperCase())
    const isTooShort = todoValue.length < 3
    const isEmpty = todoValue === ''

    if(isEmpty || isTooShort) {
        showNotification(isEmpty? "Todo input is empty" : "The input must be at least 3 characters")
        todoInput.classList.add('input-error')
    } else if(isDuplicate) {
        showNotification('The same todo already exists')
        todoInput.classList.add('input-error')
        return
    }else{
        if(edittodoID >= 0) {
            //udpate edit action
            todos = todos.map((todo, index) => ({
                
                    ...todo,
                    value: index === edittodoID ? todoValue : todo.value,
                
            }))
            edittodoID = -1 // refresh
        }else {
            todos.push({
                value: todoValue,
                checked: false, 
                color: '#' + Math.floor(Math.random()*16777215).toString(16) // generate a random color         
            })
            
        }
        todoInput.classList.remove('input-error')
        todoInput.value = '' // clearing input
        updateTodoCounter()
    }
}

function renderTodos() {

    if(todos.length === 0) {
        todoList.innerHTML = '<center>Add Something To Do!</center>'
        todoCounter.style.display = 'none'
        return 
    }

    todoCounter.style.display = 'block'
    updateTodoCounter()
    //clear before every rerender
    todoList.innerHTML=''
    todos.forEach((todo, index) => {
        todoList.innerHTML += `<div class="todo" id=${index}>
                <i 
                class="${todo.checked ?'bi-check-circle-fill': 'bi bi-circle' } "
                style="color : ${todo.color}"
                data-action="check"
                ></i>
                <p class="${todo.checked ?'checked': '' }" data-action="check">${todo.value}</p>
                <i class="bi bi-pencil-square" data-action="edit"></i>
                <i class="bi bi-trash3-fill" data-action="delete"></i>
            </div> `
    })
}

todoList.addEventListener('click', (e) => {
    const t = e.target 
    const parentEl = t.parentNode

    if(parentEl.className !== 'todo') return

    const todo =  parentEl
    const todoID = Number(todo.id)

    //action
    const action = t.dataset.action

    action === "check" && checkTodo(todoID)
    action === "edit" && editTodo(todoID)
    action === "delete" && deleteTodo(todoID)

    console.log(todoID, action);
})

function checkTodo(todoID) {
    todos = todos.map((todo, index ) => {
    
            return {
                ...todo,
                checked: index === todoID? !todo.checked : todo.checked            
        } 
    })

 renderTodos()
 localStorage.setItem('todos', JSON.stringify(todos))
}

function editTodo(todoID) {
    todoInput.value = todos[todoID].value
    edittodoID = todoID

}

function deleteTodo(todoID) {
    todos = todos.filter((todo, index) => index !== todoID)
    edittodoID = -1
    renderTodos()
    localStorage.setItem('todos', JSON.stringify(todos))
}

function showNotification(msg) {
    notificationEl.innerHTML = msg
    
    notificationEl.classList.add('notif-enter')
    setTimeout(() => {
        notificationEl.classList.remove('notif-enter')

    }, 2000) //timeout after 2s
}

function updateTodoCounter() {
    const openTodos = todos.filter(todo => !todo.checked).length
    if (openTodos === 0) {
        todoCounter.style.display = 'none'
    } else {
        todoCounter.style.display = 'block'
        todoCounter.textContent = `${openTodos} items remaining`
    }
}

document.querySelector('.container').addEventListener('click', () => {
    document.body.classList.add('blur');
});

// Remove blur when clicking outside container
document.body.addEventListener('click', (e) => {
    if (!e.target.closest('.container')) {
        document.body.classList.remove('blur');
    }
});