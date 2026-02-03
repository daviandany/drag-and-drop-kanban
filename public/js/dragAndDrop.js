import { updateTaskStatus } from './taskOperations.js';

let draggedCard = null;

export function settingDragAndDrop(card) {
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
