import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://izyrbosdmlxqobqwunpn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6eXJib3NkbWx4cW9icXd1bnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NzIyMjYsImV4cCI6MjA4NTQ0ODIyNn0._LrajI_OxnVpZnjkNjMTZKr0Ka41M9MG-znMc7XuZYM';
const supabase = createClient(supabaseUrl, supabaseKey);

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

function toggleModal() {
    if (!modal) return;
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        inputTitle.value = '';
        inputTitle.focus();
    }
}

if (btnNewTask) btnNewTask.addEventListener("click", toggleModal);
if (btnCancell) btnCancell.addEventListener("click", toggleModal);

if (modal) {
    modal.addEventListener("click", (e) => {
        if (modal === e.target) { toggleModal() }
    });
}

async function loadTasks() {
    try {
        let { data: tasks, error } = await supabase
            .from('tasks')
            .select("*")
            .order('created_at', { ascending: true });

        if (error) throw error;

        Object.values(columns).forEach(col => {
            const oldCards = col.querySelectorAll('.card');
            oldCards.forEach(card => card.remove())
        });

        tasks.forEach(task => {
            createCardOnScreen(task);
        })

    } catch (error) {
        console.log("error when loading", error)
    }
};

function createCardOnScreen(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${task.id}`;

    card.innerText = task.title || task.titulo || "no title";
    card.setAttribute('data-id', task.id);
    card.draggable = true;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete'

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTaskFromSupabase(task.id, card);
    });

    card.appendChild(deleteBtn)

    if (task.status === 'doing') card.classList.add('inprogress');
    if (task.status === 'done') card.classList.add('done');

    settingDragAndDrop(card);

    const status = task.status || 'todo';
    const destinyColumn = columns[status] || columns['todo'];
    destinyColumn.appendChild(card);
}

async function saveTask(e) {
    if (e) e.preventDefault();

    const title = inputTitle.value;
    if (!title) return alert('Please, write a title');

    btnSave.innerText = "Saving...";
    btnSave.disabled = true;

    try {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ title: title, status: 'todo' }])
            .select();

        if (error) throw error;

        if (data && data.length > 0) {
            createCardOnScreen(data[0]);
            toggleModal();
        }

    } catch (error) {
        console.error('ERROR: ', error);
        alert('Error on Database: ' + (error.message || error.error_description));
    } finally {
        btnSave.innerText = "Save Task";
        btnSave.disabled = false;
    }
}

if (btnSave) btnSave.addEventListener("click", saveTask);
if (inputTitle) inputTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveTask();
})

let draggedCard = null;

function settingDragAndDrop(card) {
    if (!card) return;

    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
        setTimeout(() => (card.style.display = 'none'), 0);
    });

    card.addEventListener('dragend', () => {
        draggedCard = null;
        card.classList.remove('dragging');
        card.style.display = '';

        updateTaskStatus(card);
    });
}

const allColumns = document.querySelectorAll('.contentList');

allColumns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('over');
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('over');

        if (draggedCard) {
            column.appendChild(draggedCard);
            draggedCard.classList.remove("done", "inprogress");

            if (column.id === "list2") {
                draggedCard.classList.add("inprogress");
            }
            else if (column.id === "list3") {
                draggedCard.classList.add("done");
            }
        }
    });
});

async function updateTaskStatus(card) {
    const parentId = card.parentElement.id;
    let newStatus = 'todo'

    if (parentId === 'list2') newStatus = 'doing';
    if (parentId === 'list3') newStatus = 'done';

    const id = card.getAttribute('data-id')

    const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) { console.log('error updating status: ', error) }
}

async function deleteTaskFromSupabase(id, cardElement) {
    const confirmDelete = confirm('Are you sure you want delete this taks?')

    if (!confirmDelete) return;

    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;

        cardElement.style.maxHeight = cardElement.scrollHeight + 'px';
        cardElement.style.transition = "all 0.5s ease";
        cardElement.style.overflow = "hidden";

        setTimeout(() => {
            //hiding animation
            cardElement.style.opacity = "0";
            cardElement.style.maxHeight = "0";
            cardElement.style.marginTop = "0";
            cardElement.style.marginBottom = "0";
            cardElement.style.paddingTop = "0";
            cardElement.style.paddingBottom = "0";
            cardElement.style.border = "none";
            cardElement.style.boxShadow = "none";
        }, 10);

        setTimeout(() => {
            cardElement.remove();
        }, 500);

    } catch (error) {
        console.log('Error when deleting', error);
        alert('Error when deleting', error.message);
    }
}

//edit button

loadTasks();
