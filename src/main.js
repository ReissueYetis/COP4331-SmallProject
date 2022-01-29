const urlBase = 'https://cop4331.acobble.io/';

const regForm = document.getElementById("regForm");
const loginForm = document.getElementById("loginForm");

let isPasswordMatch = false;
const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;

const badLoginMsg = "Username or password not recognized";
const badPassMsg = "Password Requirements:<ul><li>Must contain a number, a special character, an uppercase letter, and a lower case letter</li><li>Is at least 8 characters long</li></ul>";
const passMismatch = "Passwords do not match";
const noPassEntered = "Please enter a password."
const noUsername = "Please enter a username."
const badRegMsg = "Username already exists"

function makeEventListeners (){
    makeLoginEventListeners()
    makeRegEventListeners()
}

function getLoginInfo(){
    let login = document.getElementById("loginUser").value
    let password = sha256(document.getElementById("loginPass").value)
    return {login,password}
}

async function sha256(password){
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
}

function getRegInfo(){
    let firstName = document.getElementById("regFName").value
    let lastName = document.getElementById("regFName").value
    let login = document.getElementById("regUser").value
    let password = sha256(document.getElementById("regPass").value)
    return {firstName, lastName, login, password}
}

function makeLoginEventListeners(){
    loginForm.addEventListener("submit", function(event){
        loginSubmit(event)
    }, false);
}

function makeRegEventListeners(){
    regForm.addEventListener("submit", function(event){
        registerSubmit(event)
    }, false)

}

function loginSubmit(event) {
    event.preventDefault();

    if (!loginForm.checkValidity()) {//!userInput.checkValidity() || !passInput.checkValidity()
        event.stopPropagation();
        loginForm.classList.add('was-validated');
    }
    else{
        userLogin(event)
    }
}

function userLogin(event){
    event.preventDefault();
    let loginInfo = getLoginInfo()
    console.log(JSON.stringify(loginInfo));
    let userInput = document.getElementById("loginUser");
    let passInput = document.getElementById("loginPass")

    if(!postJSON(urlBase + "/API/Login.php", loginInfo, myCallback)) {
        userInput.classList.add("is-invalid")
        passInput.classList.add("is-invalid")
        document.getElementById("userValMsg").innerHTML = badLoginMsg;
        document.getElementById("passValMsg").innerHTML = badLoginMsg;

    } else {
        userInput.classList.add("is-valid")
    }
    event.stopPropagation();
    loginForm.classList.add('was-validated');
    // console.log(loginResult);
}

function registerSubmit(event) {
    event.preventDefault();

    let userInput = document.getElementById("regUser");

    const formData = new FormData(regForm);
    const password = formData.get("regPass").toString();
    const repeatPassword = formData.get("regRepeatPass");

    isPasswordMatch = password === repeatPassword;
    if (userInput.value === ""){
        document.getElementById("regUserMsg").innerHTML = noUsername;
    }
    if (password === "") {
        document.getElementById("regPassValMsg").innerHTML = noPassEntered;

        if(repeatPassword === "") {
            document.getElementById("repeatPassMsg").innerHTML = noPassEntered;
        }

    } else if (!isPasswordMatch) {
        document.getElementById("regPassValMsg").innerHTML = passMismatch;
        document.getElementById("repeatPassMsg").innerHTML = passMismatch;

        regForm.classList.add('is-invalid');

    } else {
        userRegister(event)
    }
    event.stopPropagation();
    regForm.classList.add('was-validated');
}

function userRegister(event){
    event.preventDefault();
    let regInfo = getRegInfo()
    console.log(JSON.stringify(regInfo));
    let userInput = document.getElementById("regUser");

    if(!postJSON(urlBase + "/API/Register.php", regInfo, myCallback)) {
        userInput.classList.add("is-invalid")
        document.getElementById("regUserMsg").innerHTML = badRegMsg;

    } else {
        userInput.classList.add("is-valid")
    }
    event.stopPropagation();
    regForm.classList.add('was-validated');
}

function postJSON(url, json_data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(json_data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
            return true;
        } else {
            callback(status, xhr.response);
            return false;
        }
    }
    return false;
}

function myCallback(status, data) {
    console.log(data);
}

makeEventListeners()

