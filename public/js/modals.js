//create task modal
const modal = document.getElementById('modal-overlay');
const btnNewTask = document.getElementById('btn-new-task');
const btnCancell = document.getElementById('btn-cancell');
const inputTitle = document.getElementById('input-title');

// edit task modal
const modalEdit = document.getElementById('edit-task-modal');
const inputEditTitle = document.getElementById('input-edit-title');
const btnEditCancel = document.getElementById('btn-edit-cancel');

export let editingTaskId = null;
export let editingCardElement = null;

export const columns = {
    'todo': document.getElementById('list1'),
    'doing': document.getElementById('list2'),
    'done': document.getElementById('list3')
};

// create task modal
export function toggleModal() {
    if (!modal) return;
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        inputTitle.value = '';
        inputTitle.focus();
    }
}

// edit task modal
export function openEditModal(currentTitle) {
    if (!modalEdit) return;
    modalEdit.classList.remove('hidden');
    if (inputEditTitle) {
        inputEditTitle.value = currentTitle || '';
        inputEditTitle.focus();
    }
}

export function closeEditModal() {
    if (!modalEdit) return;
    modalEdit.classList.add('hidden');
    editingTaskId = null;
    editingCardElement = null;
}

export function setEditingTask(id, cardElement) {
    editingTaskId = id;
    editingCardElement = cardElement;
}

export function getInputTitle() {
    return inputTitle;
}

export function getInputEditTitle() {
    return inputEditTitle;
}

//event listeners
if (btnNewTask) btnNewTask.addEventListener("click", toggleModal);
if (btnCancell) btnCancell.addEventListener("click", toggleModal);
if (btnEditCancel) btnEditCancel.addEventListener("click", closeEditModal);

if (modal) {
    modal.addEventListener("click", (e) => {
        if (modal === e.target) { toggleModal(); }
    });
}

if (modalEdit) {
    modalEdit.addEventListener('click', (e) => {
        if (modalEdit === e.target) { closeEditModal(); }
    });
}
