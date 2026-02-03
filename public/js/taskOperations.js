import { supabase } from './supabase.js';
import { columns, toggleModal, openEditModal, setEditingTask, getInputTitle } from './modals.js';
import { settingDragAndDrop } from './dragAndDrop.js';

export async function loadTasks() {
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
}

// create a card element on screen
export function createCardOnScreen(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${task.id}`;

    card.innerText = task.title || task.titulo || "no title";
    card.setAttribute('data-id', task.id);
    card.draggable = true;

    // edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editTask(task.id, card);
    });

    // delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id, card);
    });

    card.appendChild(deleteBtn);
    card.appendChild(editBtn);

    if (task.status === 'doing') card.classList.add('inprogress');
    if (task.status === 'done') card.classList.add('done');

    settingDragAndDrop(card);

    const status = task.status || 'todo';
    const destinyColumn = columns[status] || columns['todo'];
    destinyColumn.appendChild(card);
}

// save a new task
export async function saveTask(e) {
    if (e) e.preventDefault();

    const inputTitle = getInputTitle();
    const btnSave = document.getElementById('btn-save');

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

// update task status after drag
export async function updateTaskStatus(card) {
    const parentId = card.parentElement.id;
    let newStatus = 'todo';

    if (parentId === 'list2') newStatus = 'doing';
    if (parentId === 'list3') newStatus = 'done';

    const id = card.getAttribute('data-id');

    const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) { console.log('error updating status: ', error); }
}

// edit task modal
export function editTask(id, cardElement) {
    setEditingTask(id, cardElement);
    const currentTitle = cardElement.childNodes[0].textContent;
    openEditModal(currentTitle);
}

// delete task with animation
export async function deleteTask(id, cardElement) {
    const confirmDelete = confirm('Are you sure you want delete this task?');

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
            // hiding animation
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
        alert('Error when deleting: ' + error.message);
    }
}
