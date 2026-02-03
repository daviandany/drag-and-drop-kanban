import { supabase } from './supabase.js';
import { getInputTitle, getInputEditTitle, closeEditModal } from './modals.js';
import { loadTasks, saveTask } from './taskOperations.js';

const btnSave = document.getElementById('btn-save');
const btnEditSave = document.getElementById('btn-edit-save');
const inputTitle = getInputTitle();
const inputEditTitle = getInputEditTitle();

// new task enter
if (btnSave) btnSave.addEventListener("click", saveTask);
if (inputTitle) inputTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveTask();
});

// edit task enter
if (inputEditTitle) inputEditTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnEditSave.click();
});

if (btnEditSave) {
    btnEditSave.addEventListener('click', async () => {
        const newTitle = inputEditTitle.value.trim();
        if (!newTitle) return alert('Please enter a title');

        const modals = await import('./modals.js');
        if (!modals.editingTaskId) return;

        // show saving state
        btnEditSave.innerText = "Saving...";
        btnEditSave.disabled = true;

        try {
            const { error } = await supabase
                .from('tasks')
                .update({ title: newTitle })
                .eq('id', modals.editingTaskId);

            if (error) throw error;

            if (modals.editingCardElement) {
                modals.editingCardElement.childNodes[0].textContent = newTitle;
            }
            closeEditModal();
        } catch (error) {
            console.log('Error when editing: ', error);
            alert('Error when editing: ' + error.message);
        } finally {
            // reset button state
            btnEditSave.innerText = "Save";
            btnEditSave.disabled = false;
        }
    });
}

loadTasks();
