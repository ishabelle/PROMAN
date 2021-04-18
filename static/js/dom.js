import {dataHandler} from "./data_handler.js";
import {drag} from "./drag_drop.js";

let user = localStorage.getItem('username');
let id = localStorage.getItem('id');
console.log(user)
console.log(id)
export let dom = {
    init: function () {
    },
    loadBoards: function () {
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards, dom.loadStatuses);
        });
    },
    showBoards: function (boards, callback) {
        for (let board of boards) {
            if (board['owner'] === null || board['owner'] === parseInt(id)) {
                const outerHtml = `
                <section class="board" id="boardSection${board.id}">
                    <div class="board-header" id="board${board.id}"><span class="board-title" id="title${board.id}">${board.title}</span>
                        <button class="board-add" data-column-id="${board.id}">Add column</button>
                        <button class="board-add" data-board-id="${board.id}">Add Card</button>
                        <i class="fa fa-trash" id="delete-board-button${board.id}" aria-hidden="true"></i>
                        <button class="board-toggle" id="toggle${board.id}"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="board-columns"  data-id="${board.id}" id="col${board.id}" data-open="${board.open}"></div>
                </section>`;
                let boardsContainer = document.querySelector('.board-container');
                boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                document.querySelector("[data-board-id=" + CSS.escape(board.id) + "]").addEventListener('click', dom.createCard);
                document.querySelector("[data-column-id=" + CSS.escape(board.id) + "]").addEventListener('click', dom.addColumn);
                dom.renameBoard(board.id, board.title);
                dom.deleteBoard(board.id);
                dom.boardOpenAndClose(board.id);
            }
            callback();
        }
    },
    loadStatuses: function () {
        dataHandler.getStatuses(function (statuses) {
            dom.showStatuses(statuses, dom.loadCards);
        });
    },
    showStatuses: function (statuses, callback) {
        let boards = document.querySelectorAll('.board-columns');
        for (let board of boards) {
            board.innerHTML = "";
        }
        for (let status of statuses) {
            const outerHtml = `
            <div class="board-column">
                <div class="board-column-title" id="status${status.id}">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}" data-status="${status.id}" id="status${status.id}"></div>
             `;
            let statusContainerBoard = document.querySelector("[data-id=" + CSS.escape(status.board_id) + "]");
            if (statusContainerBoard !== null) {
                statusContainerBoard.insertAdjacentHTML("beforeend", outerHtml);
                dom.renameStatus(status.id, status.title);
            }
        }
        callback();
    },
    loadCards: function () {
        dataHandler.getCardsByStatusId(function (cards) {
            dom.showCards(cards, dom.deleteCard)
        })
    },
    showCards: function (cards, callback) {
        let statuses = document.querySelectorAll('.board-column-content');
        for (let status of statuses) {
            status.innerHTML = "";
        }
        for (let card of cards) {
            const outerHtml = `<div class="card" id="${card.id}" data-cardId="${card.id}">
                                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                                    <div class="card-title" id="card${card.id}">${card.title}</div>
                               </div>`;
            let cardContainer = document.querySelector("[data-status-id=" + CSS.escape(card.status_id) + "]");
            cardContainer.insertAdjacentHTML("beforeend", outerHtml);
            dom.renameCards(card.id, card.title);
            drag.initDragAndDrop();
        }
        callback();
    },
    createAddBoardButton: function (callback) {
        let boardsContainer = document.querySelector('.board-container');
        if (user !== null) {
            const addButton = `<section class="add-board">
                                <div id="add-board">
                                    <button type="button" id="myBtn"><i class="fa fa-users"></i> ADD NEW BOARD</button>
                                    <button type="button" id="privBoard"><i class="fa fa-user-secret"></i> ADD PRIVATE BOARD</button>
                                    <br><br>
                                    <button value="registration" id="regBtn" hidden="true">Registration</button>
                                    <button value="logout" id="logout"><i class="fa fa-sign-out"></i> SIGN OUT</button>
                                    <br><br>
                                    <h4 style="color: #0f4c42">Logged in as <strong style="font-size: 25px">${user}</strong></h4>
                                </div>
                            </section>`;
            boardsContainer.insertAdjacentHTML('beforebegin', addButton);
            callback()
        } else {
            const addButton = `<section class="add-board">
                                <div id="add-board">
                                    <button value="registration" id="regBtn"><i class="fa fa-pencil-square-o"></i> REGISTER</button>
                                    <button value="login" id="login"><i class="fa fa-sign-in"></i> SIGN IN</button>
                                    <br><br>
                                    <button type="button" id="myBtn"><i class="fa fa-clone"></i> ADD NEW BOARD</button>
                                    
                                </div>
                            </section>`;
            boardsContainer.insertAdjacentHTML('beforebegin', addButton);
            callback()
        }
    },
    addBoard: function () {
        let addButton = document.querySelector('#myBtn');
        addButton.addEventListener('click', function () {
            let data = {'owner': null};
            dataHandler._api_post('http://127.0.0.1:5000/create-new-board', data, (response) => {
                let outerHtml = `
                        <section class="board" id="boardSection${response[0].id}">
                            <div class="board-header" id="board${response[0].id}"><span class="board-title" id="title${response[0].id}">${response[0].title}</span>
                                <button class="board-add" data-column-id="${response[0].id}">Add column</button>
                                <button class="board-add" data-board-id="${response[0].id}">Add Card</button>
                                <i class="fa fa-trash" id="delete-board-button${response[0].id}" aria-hidden="true"></i>
                                <button class="board-toggle" id="toggle${response[0].id}"><i class="fas fa-chevron-down"></i></button>
                            </div>
                            <div class="board-columns" data-id="${response[0].id}" id="col${response[0].id}" data-open="${response[0].open}"></div>
                        </section>
                    `;
                let boardsContainer = document.querySelector('.board-container');
                boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                dom.loadStatuses();
                dom.renameBoard(response[0].id, response[0].title);
                document.querySelector("[data-board-id=" + CSS.escape(response[0].id) + "]").addEventListener('click', dom.createCard);
                document.querySelector("[data-column-id=" + CSS.escape(response[0].id) + "]").addEventListener('click', dom.addColumn);
                dom.deleteBoard(response[0].id);
                dom.boardOpenAndClose(response[0].id)
            })
        });
    },
    addPrivateBoard: function () {
        let addButton = document.querySelector('#privBoard');
        addButton.addEventListener('click', function () {
            let data = {'owner': id};
            dataHandler._api_post('http://127.0.0.1:5000/create-private-board', data, (response) => {
                let outerHtml = `
                        <section class="board" id="boardSection${response[0].id}">
                            <div class="board-header" id="board${response[0].id}"><span class="board-title" id="title${response[0].id}">${response[0].title}</span>
                                <button class="board-add" data-column-id="${response[0].id}">Add column</button>
                                <button class="board-add" data-board-id="${response[0].id}">Add Card</button>
                                <i class="fa fa-trash" id="delete-board-button${response[0].id}" aria-hidden="true"></i>
                                <button class="board-toggle" id="toggle${response[0].id}"><i class="fas fa-chevron-down"></i></button>
                            </div>
                            <div class="board-columns" data-id="${response[0].id}" id="col${response[0].id}" data-open="${response[0].open}"></div>
                        </section>
                    `;
                let boardsContainer = document.querySelector('.board-container');
                boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
                dom.loadStatuses();
                dom.renameBoard(response[0].id, response[0].title);
                document.querySelector("[data-board-id=" + CSS.escape(response[0].id) + "]").addEventListener('click', dom.createCard);
                document.querySelector("[data-column-id=" + CSS.escape(response[0].id) + "]").addEventListener('click', dom.addColumn);
                dom.deleteBoard(response[0].id);
                dom.boardOpenAndClose(response[0].id)
            })
        });
    },
    createCard: function () {
        let board_id = this.dataset.boardId;
        let status_id = document.querySelector("[data-id=" + CSS.escape(board_id) + "]").querySelector('.board-column-content').dataset.statusId;
        dataHandler.createNewCard(board_id, status_id, function (cards) {
            dom.loadCards();
        })
    },
    renameBoard: function (id, title) {
        let boardTitle = document.getElementById(`title${id}`);
        boardTitle.addEventListener('click', () => {
            let boardDiv = document.getElementById(`board${id}`);
            boardDiv.removeChild(boardTitle);
            boardTitle = `<input class="board-title" id="title${id}" value="${title}" maxlength="16">`;
            boardDiv.insertAdjacentHTML("afterbegin", boardTitle);
            let inputField = document.getElementById(`title${id}`);
            inputField.addEventListener('focusout', () => {
                let title = document.getElementById(`title${id}`).value;
                if (title === '') {
                    title = 'unnamed'
                }
                let data = {"title": title, "id": id};
                dataHandler._api_post('http://127.0.0.1:5000/rename', data, () => {
                    let boardTitle = document.getElementById(`title${id}`);
                    let newTitle = `<span class="board-title" id="title${id}">${title}</span>`;
                    boardDiv.removeChild(boardTitle);
                    boardDiv.insertAdjacentHTML("afterbegin", newTitle);
                    dom.renameBoard(id, title);

                });
            })
        })
    },
    renameStatus: function (statusId, statusTitleOriginal) {
        let statusTitle = document.getElementById(`status${statusId}`);
        statusTitle.addEventListener('click', () => {
            statusTitle.outerHTML = `<input class="board-column-title" id="status${statusId}" value="${statusTitleOriginal}" maxlength="16">`;
            let inputField = document.getElementById(`status${statusId}`);
            inputField.addEventListener('focusout', () => {
                let title = inputField.value;
                if (title === '') {
                    title = 'unnamed'
                }
                let data = {"title": title, "id": statusId};
                dataHandler._api_post('http://127.0.0.1:5000/rename-status', data, () => {
                    let statusTitle = document.getElementById(`status${statusId}`);
                    statusTitle.outerHTML = `<div class="board-column-title" id="status${statusId}">${title}</div>`;
                    dom.renameStatus(statusId, title);

                });
            })
        })
    },
    renameCards: function (cardId, cardTitleOriginal) {
        let cardTitle = document.getElementById(`card${cardId}`);
        cardTitle.addEventListener('click', () => {
            cardTitle.outerHTML = `<input class="card-title" id="card${cardId}" value="${cardTitleOriginal}" style="width: 150px">`;
            let inputField = document.getElementById(`card${cardId}`);
            inputField.addEventListener('focusout', () => {
                let title = inputField.value;
                if (title === '') {
                    title = 'unnamed'
                }
                let data = {"title": title, "id": cardId};
                dataHandler._api_post('http://127.0.0.1:5000/rename-card', data, () => {
                    let cardTitle = document.getElementById(`card${cardId}`);
                    cardTitle.outerHTML = `<div class="card-title" id="card${cardId}">${title}</div>`;
                    dom.renameCards(cardId, title);

                });
            })
        })
    },
    deleteCard: function () {
        let deleteButtons = document.querySelectorAll(".card-remove");
        for (let deleteButton of deleteButtons) {
            deleteButton.addEventListener('click', function () {
                let cardId = deleteButton.parentNode.id;
                dataHandler.deleteCardDataHandler(cardId, dom.loadCards)
            });
        }
    },
    addColumn: function () {
        let board_id = this.dataset.columnId;
        dataHandler.createColumn(board_id, function (status) {
            const outerHtml = `
                <div class="board-column">
                    <div class="board-column-title" id="status${status.id}">${status.title}</div>
                <div class="board-column-content" data-status-id="${status.id}" data-status="${status.id}" id="status${status.id}"></div>
             `;
            let colContainer = document.querySelector('[data-id=' + CSS.escape(board_id) + ']');
            colContainer.insertAdjacentHTML("beforeend", outerHtml);
            drag.initDragAndDrop();
            dom.renameStatus(status.id, status.title)
        })
    },
    deleteBoard: function (board_id) {
        let deleteBoard = document.querySelector(`#delete-board-button${board_id}`);
        deleteBoard.addEventListener('click', function () {
            dataHandler.deleteBoard(board_id)
        });
    },
    boardOpenAndClose: function (board_id) {
        let toggle = document.querySelector(`#toggle${board_id}`);
        let col = document.querySelector(`#col${board_id}`);
        toggle.addEventListener('click', () => {
            if (col.dataset.open === 'true') {
                col.dataset.open = 'false';
                let data = {'boolean': col.dataset.open, 'id': board_id};
                dataHandler._api_post('http://127.0.0.1:5000/board-open-close', data, (response) => {
                });
            } else {
                col.dataset.open = 'true';
                let data = {'boolean': col.dataset.open, 'id': board_id};
                dataHandler._api_post('http://127.0.0.1:5000/board-open-close', data, (response) => {
                });
            }
        })
    }
};
