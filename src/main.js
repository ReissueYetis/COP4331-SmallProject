var urlBase = 'https://cop4331.acobble.io';

let userId = 0;
let firstName = "";
let lastName = "";

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

function hashPass(password){
    return sha256(password)
}

// function makeEventListeners (){
//     makeLoginEventListeners()
//     makeRegEventListeners()
// }

function getLoginInfo(){
    let login = document.getElementById("loginUser").value
    let password = sha256(document.getElementById("loginPass").value)
    //let password = document.getElementById("loginPass").value
    return {login,password}
}

function getRegInfo(){
    let firstName = document.getElementById("regFName").value
    let lastName = document.getElementById("regLName").value
    let login = document.getElementById("regUser").value
    let password = sha256(document.getElementById("regPass").value)
    //let password = document.getElementById("regPass").value
    return {firstName, lastName, login, password}
}

function loginSubmit(event) {
    event.preventDefault();

    if (!loginForm.checkValidity()) {//!userInput.checkValidity() || !passInput.checkValidity()
        event.stopPropagation();
        loginForm.classList.add('was-validated');
    }
    else {
        let loginInfo = getLoginInfo()
        console.log(loginInfo)
        postJSON("https://cop4331.acobble.io/API/Login.php", loginInfo, "log", event)
    }
    if (readCookie()){
        window.location.href = "contactsPage.html";
    }
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
        let regInfo = getRegInfo()
        console.log(regInfo)
        postJSON(urlBase + "/API/Register.php", regInfo, "reg", event)
    }
    event.stopPropagation();
    regForm.classList.add('was-validated');
}

function postJSON(url, json_data, submitType, event) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(json_data)
    xhr.send(JSON.stringify(json_data));

    event.preventDefault();
    xhr.onload = function () {
        let date = new Date();
        let data = xhr.response

        if (submitType === "reg") {
            let userInput = document.getElementById("regUser");

            let userValMsg = document.getElementById("regUserMsg")
            let passValMsg = document.getElementById("regPassValMsg")

            if (xhr.status === 200){
                console.log(xhr.status)
                console.log(xhr.response)

                if (xhr.response.error !== "") {
                    userInput.classList.add("is-invalid")
                    userValMsg.innerHTML = xhr.response.error;

                } else {
                    userInput.classList.add("is-valid")
                    let succMsg = document.getElementById("regSuccess")
                    succMsg.innerHTML = "Registration Success!."
                }
            } else {
                userInput.classList.add("is-invalid")
                userValMsg.innerHTML = "Registration error."
                passValMsg.innerHTML = "Registration error."
            }
            regForm.classList.add('was-validated');

        } else {
            let userInput = document.getElementById("loginUser")
            let passInput = document.getElementById("loginPass")

            let userLogMsg = document.getElementById("userValMsg")
            let passLogMsg = document.getElementById("passValMsg")
            if (xhr.status === 200){
                console.log(xhr.status)
                console.log(xhr.response)

                if (xhr.response.error !== "") {
                    userInput.classList.add("is-invalid")
                    passInput.classList.add("is-invalid")
                    userLogMsg.innerHTML = xhr.response.error;
                    passLogMsg.innerHTML = xhr.response.error;

                } else {
                    userInput.classList.add("is-valid")
                    passInput.classList.add("is-valid")
                    userLogMsg.innerHTML = "Login success!";
                    passLogMsg.innerHTML = "Login success!";

                    date.setTime(date.getTime()+(20*60*1000));
                    document.cookie = "firstName=" + data.firstName +
                        ";lastName=" + data.lastName +
                        ";userId=" + data.id +
                        ";expires=" + date.toUTCString();
                }
            } else {
                userInput.classList.add("is-invalid")
                passInput.classList.add("is-invalid")
                userLogMsg.innerHTML = "Login error, please try again.";
                passLogMsg.innerHTML = "Login error, please try again.";
            }
            loginForm.classList.add('was-validated');
        }
    };
    event.stopPropagation();
}

function myCallback(response) {
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(";");

    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] === "firstName" ) {
            firstName = tokens[1];
        }
        else if( tokens[0] === "lastName" ) {
            lastName = tokens[1];
        }
        else if( tokens[0] === "userId" ) {
            userId = parseInt( tokens[1].trim() );
        }
    }

    if( userId < 0 ) {
        return false
    } else {
        return true
        //document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

// makeEventListeners()

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

