
// DOM Elements
let taskbutton = document.getElementById("add-task-button")
let modalOverLay = document.getElementById("modal-overlay-new")
let taskNameInput = document.getElementById("task-name")
let closeIconOverlay = document.getElementById("close-icon-overlay")
let taskDescription = document.getElementById("task-description")
let modalForm = document.getElementById("modal-overlay-form")
let toDoItemsSection = document.getElementById("to-do-list-section")
let progressCounter = document.querySelector(".left-p-container h3")

// Delete Modal Elements
const deleteModal = document.getElementById("modal-overlay-delete")
const cancelDeleteBtn = document.getElementById("cancel-delete-btn")
const confirmDeleteBtn = document.getElementById("confirm-delete-btn")


let todolist = []
let isEditing = false;
let editingTaskId = null;
let taskIdToDelete = null;


// Open Add Task Modal
taskbutton.addEventListener("click", remodalOverlay)
function remodalOverlay(){
    modalOverLay.classList.remove("modal-overlay-new")
    modalOverLay.classList.add("modal-overlay-new-visible")
    taskNameInput.focus()
}


// Close Add Task Modal
closeIconOverlay.addEventListener("click", closeModalOverlayTask)
function closeModalOverlayTask(){
    if(modalOverLay.classList.contains("modal-overlay-new-visible")){
        modalOverLay.classList.remove("modal-overlay-new-visible")
        modalOverLay.classList.add("modal-overlay-new")
    }
}



// collect form data and save in local Storage
modalForm.addEventListener("submit", formData)

function formData(event){
    event.preventDefault()

    let taskName = taskNameInput.value.trim();
    let taskDesc = taskDescription.value.trim();

    if (taskName === "" || taskDesc === "") {
        alert("Please fill in both the task name and description.");
        return;
    }


    if (isEditing) {
        todolist = todolist.map(item => {
            if (item.id === editingTaskId) {
                return {
                    ...item,
                    reTASK: taskName,
                    reDESCRIPTION: taskDesc
                };
            }
            return item;
        });

        isEditing = false;
        editingTaskId = null;
    } else{

        const aCreateTask = {
            id: Date.now(),
            reTASK : taskName,
            reDESCRIPTION : taskDesc,
            completed : false,
            deadline: selectedDeadline
        }

        todolist.push(aCreateTask)
    
    }


    localStorage.setItem("todolistItems", JSON.stringify(todolist));
    modalForm.reset();
    closeModalOverlayTask();
    PrintTodolistItems(); 
}

modalForm.reset();


// Retrieve data from local storage
function fetchtodolistItmes(){
    if(localStorage.getItem("todolistItems")){
        todolist = JSON.parse(localStorage.getItem("todolistItems"))
    }
    PrintTodolistItems()
}
fetchtodolistItmes()





// Print Retrieved Data on UI
function PrintTodolistItems(){
    toDoItemsSection.innerHTML = ``
    todolist.forEach((item)=>{
        let UIresnametask = item.reTASK
        let UIrestaskDesription = item.reDESCRIPTION


        let todolistItemDiv = document.createElement("div")
        todolistItemDiv.classList.add("group-contanier")

        let todolisticonsDiv = document.createElement("div")
        todolisticonsDiv.classList.add("three-icons-container")



        // Complete icon
        let todolistCompleteDiv = document.createElement("div")
        todolistCompleteDiv.classList.add("complete-icon-c")
        let completeIconImg = document.createElement("img")
        completeIconImg.height = 20
        if (item.completed){
            completeIconImg.src = "./resources-folder/complete-icon-mark.svg"
        } else {
            completeIconImg.src = "./resources-folder/check-complete-icon-new.svg"
        }
        todolistCompleteDiv.appendChild(completeIconImg)
        todolistCompleteDiv.addEventListener("click", () => toggleComplete(item.id))


        // Edit icon
        let todolistEditDiv = document.createElement("div")
        todolistEditDiv.classList.add("edit-icon-c")
        let editIconImg = document.createElement("img")
        editIconImg.src = "./resources-folder/edit-icon.svg"
        editIconImg.height = 24
        todolistEditDiv.appendChild(editIconImg)
        todolistEditDiv.addEventListener("click", () => editTask(item.id))

        // Delete icon
        let todolistDelete = document.createElement("div")
        todolistDelete.classList.add("delete-icon-c")
        let deleteIconImg = document.createElement("img")
        deleteIconImg.src = "./resources-folder/delete-icon.svg"
        deleteIconImg.height = 24
        deleteIconImg.style.cursor = "pointer"

        deleteIconImg.addEventListener("click", (e) => {
        e.stopPropagation(); 
        openDeleteModal(item.id); 
        })

        todolistDelete.appendChild(deleteIconImg)
        

        let todolistTaskandDescription = document.createElement("div")
        todolistTaskandDescription.classList.add("task-name-and-description-container")

        let todolistName = document.createElement("h3")
        todolistName.textContent = UIresnametask

        let todolistDescriptionText = document.createElement("p")
        todolistDescriptionText.textContent = UIrestaskDesription

        if (item.completed) {
            todolistName.style.textDecoration = "line-through"
            todolistDescriptionText.style.textDecoration = "line-through"
            todolistName.style.opacity = "0.6"
            todolistDescriptionText.style.opacity = "0.6"
        }


        let declineAndPriority = document.createElement("div")
        declineAndPriority.classList.add("decline-and-Priority-c-s")

        let deadlineText = document.createElement("p")
        deadlineText.textContent = "Deadline: " + (item.deadline || "Today");

        let priorityText = document.createElement("p")
        priorityText.textContent = "Priority: High"


        // Append
        todolistTaskandDescription.append(todolistName,todolistDescriptionText)
        todolisticonsDiv.append(todolistCompleteDiv,todolistEditDiv,todolistDelete)
        todolistItemDiv.append(todolisticonsDiv,todolistTaskandDescription, declineAndPriority)
        toDoItemsSection.append(todolistItemDiv)
        declineAndPriority.append(deadlineText, priorityText)


        
        updateTaskCounter()
        
    })
   

}



function updateTaskCounter() {
    const totalTasks = todolist.length
    const completedTasks = totalTasks
    progressCounter.textContent = `${completedTasks}/${totalTasks}`
}



function toggleComplete(taskId) {
    todolist = todolist.map(item => {
      if (item.id === taskId) {
        if (!item.completed) {
          celebrate(); 
        }
        return { ...item, completed: !item.completed };
      }
      return item;
    });
  
    localStorage.setItem("todolistItems", JSON.stringify(todolist));
    fetchtodolistItmes();
  }


// edit task function define
function editTask(taskId) {
    const taskToEdit = todolist.find(item => item.id === taskId);

    if (taskToEdit) {
        isEditing = true;
        editingTaskId = taskId;

        // Prefill the modal
        taskNameInput.value = taskToEdit.reTASK;
        taskDescription.value = taskToEdit.reDESCRIPTION;

        // Show the modal
        modalOverLay.classList.add("modal-overlay-new-visible");
        taskNameInput.focus();
    }
}


// Delete Modal Logic
function openDeleteModal(taskId) {

    taskIdToDelete = taskId;
    deleteModal.classList.add("show");

    console.log("Delete modal triggered for task ID:", taskId);

    
}

cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("show");
    taskIdToDelete = null;
})

confirmDeleteBtn.addEventListener("click", () => {
    if (taskIdToDelete !== null) {
        deleteItem(taskIdToDelete);
        deleteModal.classList.remove("show");
        taskIdToDelete = null;
    }
})



function deleteItem(taskId){
    todolist = todolist.filter(item => item.id !== taskId);
    localStorage.setItem("todolistItems", JSON.stringify(todolist));
    fetchtodolistItmes();
}


// Creating deadline function  


let selectedDeadline = "Today";


const todayBtn = document.querySelector(".today-button");
const tomorrowBtn = document.querySelector(".tomorrow-button");
const weekendBtn = document.querySelector(".weekend-button");


todayBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectedDeadline = "Today";
  highlightSelected(todayBtn);
});


tomorrowBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectedDeadline = "Tomorrow";
  highlightSelected(tomorrowBtn);
});


weekendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  selectedDeadline = "Weekend";
  highlightSelected(weekendBtn);
});


function highlightSelected(selectedBtn) {
  [todayBtn, tomorrowBtn, weekendBtn].forEach(btn => {
    btn.style.backgroundColor = "#fff";
    btn.style.color = "#6676EB";
  });
  selectedBtn.style.backgroundColor = "#6676EB";
  selectedBtn.style.color = "#fff";
}


function celebrate() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }