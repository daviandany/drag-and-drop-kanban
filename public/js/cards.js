const modal = document.getElementById('modal-overlay');
const btnNewTask = document.getElementById('btn-new-task');
const btnCancell = document.getElementById('btn-cancell');
const btnSave = document.getElementById('btn-save');
const inputTitle = document.getElementById('input-title');

const columns = {
    'todo': document.getElementById('list1'),
    'doing': document.getElementById('list2'),
    'done': document.getElementById('list3')
};

function toggleModal(){
    modal.classList.toggle('hidden');

    if(!modal.classList.contains('hidden')){
        inputTitle.value = '';
        inputTitle.focus();
    }
}

btnNewTask.addEventListener("click", toggleModal)
btnCancell.addEventListener("click", toggleModal)

modal.addEventListener("click", (e) => {
    if(modal === e.target){ toggleModal() }
});

async function loadTasks(){
    try{
        const awnser = await fetch('/api/tasks');
        const tasks = await awnser.json();

        Object.values(columns).forEach(col => {
            const oldCards = col.querySelectorAll(".card");
            oldCards.forEach(card => card.remove());
        });

        tasks.forEach(task => {
            createCardOnScreen(task);

        });
    }   catch(error) {
        console.log('error loading tasks: ', error)
    }
};

function createCardOnScreen(task){

    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${task.id}`;
    card.innerHTML = task.title;
    card.setAttribute('data-id', task.id);
    card.draggable = true;

    settingDragAndDrop(card);

    const destinyColumn = columns[task.status] || columns['todo'];
    destinyColumn.appendChild(card);
}

async function saveTask(){
    const title = inputTitle.value;
    if(!title) return alert('please write a title');
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            const task = await response.json();
            createCardOnScreen(task);
            toggleModal();
        }
    } catch (error) {
        console.log('Error saving task:', error);
        alert('Error saving task');
    }
}

function settingDragAndDrop(card){
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', this.id);
}

function dragEnd() {
    console.log('Drag Ended');
}

btnSave.addEventListener('click', saveTask);
inputTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        saveTask();
    }
});

loadTasks();