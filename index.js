const cards = document.querySelectorAll(".card")
const contentLists = document.querySelectorAll(".contentList")

for(const card of cards){
    card.addEventListener("dragstart", dragStart)
    card.addEventListener("dragend", dragEnd)
}

for(const list of contentLists){
    list.addEventListener("dragover", dragOver)
    list.addEventListener("dragenter", dragEnter)
    list.addEventListener("dragleave", dragLeave)
    list.addEventListener("drop", dragDrop)
}

    

function dragStart(e){
    e.dataTransfer.setData("text/plain", this.id)
}

function dragEnd(){
    console.log("Drag Ended")
}

function dragOver(e){
    e.preventDefault()
    
}

function dragEnter(e){
    e.preventDefault();
    this.classList.add("over");
}

function dragLeave(){
    this.classList.remove("over");

}

function dragDrop(e){
    const cardId = e.dataTransfer.getData("text/plain");

    const card = document.getElementById(cardId);
    this.appendChild(card);

    this.classList.remove("over");

                // done card behavior

    const cardDone = e.dataTransfer.getData("text/plain");
    const doneCard = document.getElementById(cardDone)

    if(this.id === "list3"){
    doneCard.classList.add("done");
        } else {
            doneCard.classList.remove("done");
        }
                // in progress card behaivor

    const cardInProgress = e.dataTransfer.getData("text/plain")
    const inProgress = document.getElementById(cardInProgress);

        if(this.id === "list2"){
            inProgress.classList.add("inprogress");
        } else {
            inProgress.classList.remove("inprogress");
        }

}

