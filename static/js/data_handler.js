import {dom} from "./dom.js";


export let dataHandler = {
    _data: {},
    _api_get: function (url, callback) {
            fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    _api_post: function (url, data, callback) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json_response => callback(json_response));
    },
    init: function () {
    },
    getBoards: function (callback) {
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getStatuses: function (callback) {
        this._api_get('/get-statuses', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCardsByStatusId: function (callback) {
        this._api_get("/get-cards", (response) => {
            callback(response);
        });
    },
    createNewCard: function (board_id, status_id, callback) {
        let data = {"board_id": board_id, "status_id": status_id};
        dataHandler._api_post("/create-card", data, (response) => {
            callback(response);
        });
    },
    deleteCardDataHandler: function (card_id, callback) {
        dataHandler._api_post("/delete-card", card_id, (response) => {
            callback(response);
        });
        callback();
    },
    createColumn: function (board_id, callback) {
        let data = {"board_id": board_id};
        this._api_post("create-status", data, (response) => {
            callback(response);
        });
    },
    deleteBoard: function (board_id) {
        let board = document.querySelector(`#boardSection${board_id}`);
        board.remove();
        dataHandler._api_post("/delete-board", board_id, (response) => {
            let res = response;
        });
    }
};
