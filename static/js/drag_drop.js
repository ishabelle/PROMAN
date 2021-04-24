import {dataHandler} from "./data_handler.js";

export let drag = {
    initDragAndDrop: function () {
        let cards = document.querySelectorAll('.card');
        let cardSlots = document.querySelectorAll('.board-column-content');
        initCards(cards);
        initCardSlots(cardSlots);
    }
};


function initCards(cards) {
    for (const card of cards) {
        initCard(card);
    }
}


function initCard(card) {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
    card.setAttribute("draggable", "true");
}


function initCardSlots(cardSlots) {
    for (const slot of cardSlots) {
        initSlot(slot);
    }
}


function initSlot(slot) {
    slot.addEventListener('dragenter', DragEnter);
    slot.addEventListener('dragover', DragOver);
    slot.addEventListener('dragleave', DragLeave);
    slot.addEventListener('drop', Drag_drop);
}


function dragStart(e) {
    this.classList.add('dragged');
    e.dataTransfer.setData("card", e.target.className);
}


function dragEnd() {
    this.classList.remove('dragged');
    let oldId = this.id;
    let newId = this.parentNode.dataset.status;
    let data = {'new_id': newId, 'old_id': oldId};
    dataHandler._api_post('http://127.0.0.1:5005/drag_drop', data, (response) => {
        let res = response;
    })
}


function DragEnter(e) {
    if (e.dataTransfer.types.includes("card")) {
        e.preventDefault();
    }
}


function DragOver(e) {
    e.preventDefault();
}


function DragLeave(e) {
}


function Drag_drop(e) {
    if (e.dataTransfer.types.includes("card")) {
        let cardElement = document.querySelector('.dragged');
        e.currentTarget.appendChild(cardElement);
        e.preventDefault();
    }
}