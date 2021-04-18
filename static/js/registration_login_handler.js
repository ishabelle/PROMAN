import {dataHandler} from "./data_handler.js";

export let start = function start() {

    let regSub = document.querySelector('.signupbtn');
    let closeBtn = document.querySelector('.close');
    let closeLogin = document.querySelector('.close-login');
    let regModal = document.querySelector('.registration-modal');
    let regBtn = document.querySelector('#regBtn');
    let flashModal = document.querySelector('.flash-message');
    let loginFlash = document.querySelector('#login-flash');
    let loginModal = document.querySelector('.login-modal');
    let loginBtn = document.querySelector('#login');
    let loginSub = document.querySelector('.loginbtn');
    let result = [];

    function init() {
        openModal(regBtn, regModal);
        closeModal(closeBtn, regModal);
        if (localStorage.getItem('username') === null) {openModal(loginBtn, loginModal)}
        if (localStorage.getItem('username') !== null) {logout()}
        closeModal(closeLogin, loginModal);
        checkRegData();
        checkLoginData();
    }

    function closeModal(btn, modal) {
        btn.addEventListener('click', () => {
            modal.style.display = 'none'
        })
    }

    function openModal(btn, modal) {
        btn.addEventListener('click', () => {
            clearReg();
            flashModal.innerHTML = '';
            flashModal.style.display = 'none';
            loginFlash.innerHTML = '';
            loginFlash.style.display = 'none';
            modal.style.display = 'block'
        })
    }

    function checkRegData() {
        regSub.addEventListener('click', () => {
            result = [];
            let username = document.querySelector('#username').value;
            let email = document.querySelector('#email').value;
            let password = document.querySelector('#psw').value;
            let passwordAgain = document.querySelector('#psw-repeat').value;
            if (username === '' || email === '' || password === '' || passwordAgain === '') {
                alertMessage('Please fill every field!', flashModal)
            } else {
                checkReg(username, email, password, passwordAgain)
                    .then((response) => {
                        if (response === false) {
                            saveData(username, email, password);
                            regModal.style.display = 'none';
                            loginModal.style.display = 'block';
                            loginFlash.innerHTML = '';
                            loginFlash.style.display = 'none';
                            checkLoginData();
                        } else {
                            clearReg()
                        }
                    })
            }
        })
    }

    function checkReg(username, email, password, passwordAgain) {
        return new Promise(resolve => {
            checkUsername(username, () => checkEmail(email, () => checkPasswords(password, passwordAgain, () => resolve(result.includes(false)))))
        })

    }

    function checkUsername(username, callback) {
        let data = {'username': username};
        dataHandler._api_post('/check_username', data, (response) => {
            if (response === 'True') {
                alertMessage('This username is already taken! Chose another!', flashModal);
                result.push(false);
                callback()
            } else {
                result.push(true);
                callback()
            }
        })
    }

    function checkEmail(email, callback) {
        let data = {'email': email};
        dataHandler._api_post('/check_email', data, (response) => {
            if (response === 'True') {
                alertMessage('This email is already taken!', flashModal);
                result.push(false);
                callback()
            } else {
                result.push(true);
                callback()
            }
        })
    }

    function checkPasswords(psw, pswAgain, callback) {
        let data = {'psw': psw, 'pswAgain': pswAgain};
        dataHandler._api_post('/check_passwords', data, (response) => {
            if (response === 'True') {
                alertMessage('The passwords are different!', flashModal);
                result.push(false);
                callback()
            } else {
                result.push(true);
                callback()
            }
        })
    }

    function alertMessage(message, modal) {
        modal.innerHTML = '';
        modal.style.display = 'none';
        let text = `<span id="flash-message">&times</span><p>${message}</p>`;
        modal.insertAdjacentHTML("beforeend", text);
        modal.style.display = 'block';
        let flashClose = modal.querySelector('#flash-message');
        closeModal(flashClose, modal);
    }

    function saveData(username, email, password) {
        let data = {'username': username, 'email': email, 'password': password};
        dataHandler._api_post('/save_data', data, (response) => {
            let res = response
        })
    }

    function clearReg() {
        document.querySelector('#username').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#psw').value = '';
        document.querySelector('#psw-repeat').value = '';
    }

    function checkLoginData() {
        loginSub.addEventListener('click', () => {
            result = [];
            let username = document.querySelector('#user').value;
            let password = document.querySelector('#password').value;
            if (username === '' || password === '') {
                alertMessage('Please fill every field!', loginFlash)
            } else {
                checkLogin(username, password)
            }
        })
    }

    function checkLogin(username, password) {
        let data = {'username': username, 'password': password};
        dataHandler._api_post('/check_login', data, (response) => {
            if (response !== 'False') {
                localStorage.setItem('id', response);
                localStorage.setItem('username', username);
                clearLogin();
                loginModal.style.display = 'none';
                location.reload();
                logout();
            } else if (response === 'False') {
                alertMessage('Wrong password or username!', loginFlash);
                clearLogin();
            }
        })
    }

    function clearLogin() {
        document.querySelector('#user').value = '';
        document.querySelector('#password').value = '';
    }

    function logout() {
        let logoutBtn = document.querySelector('#logout');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            location.reload()
        })
    }

    init();
};