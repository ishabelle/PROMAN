import {dom} from "./dom.js"
import {start} from "./registration_login_handler.js";


function init() {
    dom.init();
    dom.loadBoards();
    dom.createAddBoardButton(start);
    dom.addBoard();
    dom.addPrivateBoard();
}

init();
