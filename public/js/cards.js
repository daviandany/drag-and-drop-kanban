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
    if(modal === e){ toggleModal() }
});