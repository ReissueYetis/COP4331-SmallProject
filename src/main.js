const urlBase = 'https://cop4331.acobble.io';

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

async function sha256(password){
    const encoder = new TextEncoder("utf-8")
    const data = encoder.encode(password)
    const hash = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
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
    else {
        let loginInfo = getLoginInfo()
        //console.log(loginInfo)
        postJSON(urlBase + "/API/Login.php", loginInfo, "log", event)
    }
}

/*
function userLogin(event, xhr){
    event.preventDefault();
    //let loginInfo = getLoginInfo()
    //console.log(JSON.stringify(loginInfo));
    console.log(xhr.status)
    console.log(xhr.response)

    let userInput = document.getElementById("loginUser");
    let passInput = document.getElementById("loginPass")

    let userLogMsg = document.getElementById("userValMsg")
    let passLogMsg = document.getElementById("passValMsg")

    //let postObj = postJSON(urlBase + "/API/Login.php", loginInfo)
    //let response = JSON.parse(postObj)

    if (xhr.response.error !== "" && postObj.status === 200) {
        userInput.classList.add("is-invalid")
        passInput.classList.add("is-invalid")
        userLogMsg.innerHTML = response.error;

    } else if (xhr.status !== 200) {
        userInput.classList.add("is-invalid")
        passInput.classList.add("is-invalid")
        userLogMsg.innerHTML = "Login error, please try again.";
        passLogMsg.innerHTML = "Login error, please try again.";

    } else {
        userInput.classList.add("is-valid")
        passInput.classList.add("is-valid")
        userLogMsg.innerHTML = "Login error, please try again.";
        passLogMsg.innerHTML = "Login error, please try again.";
    }
    event.stopPropagation();
    loginForm.classList.add('was-validated');
    // console.log(loginResult);
}
*/

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
        //console.log(regInfo)
        postJSON(urlBase + "/API/Register.php", regInfo, "reg", event)
    }
    event.stopPropagation();
    regForm.classList.add('was-validated');
}

/*
function userRegister(event, post){
    event.preventDefault();
    //let regInfo = getRegInfo()
    console.log(xhr.status)
    console.log(xhr.response)

    let userInput = document.getElementById("regUser");
    let passInput = document.getElementById("regPass");

    let userValMsg = document.getElementById("regUserMsg")
    let passValMsg = document.getElementById("regPassValMsg")

    //let postObj = postJSON(urlBase + "/API/Register.php", regInfo)
    //let response = JSON.parse(postObj)

    if (xhr.response.error !== "" && postObj.status === 200) {
        userInput.classList.add("is-invalid")
        userValMsg.innerHTML = response.error;

    } else if (xhr.status !== 200){
        userInput.classList.add("is-invalid")
        userValMsg.innerHTML = "Registration error."
        passValMsg.innerHTML = "Registration error."

    } else {
        userInput.classList.add("is-valid")
        userValMsg.innerHTML = "Registration Successful."
        passValMsg.innerHTML = "Registration Successful."
    }
    event.stopPropagation();
    regForm.classList.add('was-validated');
}*/


function postJSON(url, json_data, submitType, event) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(json_data)
    xhr.send(JSON.stringify(json_data));
    //var postRespons

    event.preventDefault();
    xhr.onload = function () { // myCallback(xhr.status, xhr.response)
        //xhr.onload = //const status = xhr.status
        if (submitType === "reg") {
            let userInput = document.getElementById("regUser");
            //let passInput = document.getElementById("regPass");

            let userValMsg = document.getElementById("regUserMsg")
            let passValMsg = document.getElementById("regPassValMsg")

            if (xhr.status === 200){
                //let regInfo = getRegInfo()
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
            //return true;
            //} else {
            //  myCallback(status, xhr.response);
            //return false;
            //}
            //postResponse = JSON.stringify(xhr)
        } else {
            let userInput = document.getElementById("loginUser");
            let passInput = document.getElementById("loginPass")

            let userLogMsg = document.getElementById("userValMsg")
            let passLogMsg = document.getElementById("passValMsg")

            if (xhr.status === 200){
                //let loginInfo = getLoginInfo()
                //console.log(JSON.stringify(loginInfo));
                console.log(xhr.status)
                console.log(xhr.response)

                //let postObj = postJSON(urlBase + "/API/Login.php", loginInfo)
                //let response = JSON.parse(postObj)

                if (xhr.response.error !== "") {
                    userInput.classList.add("is-invalid")
                    passInput.classList.add("is-invalid")
                    userLogMsg.innerHTML = xhr.response.error;

                } else {
                    userInput.classList.add("is-valid")
                    passInput.classList.add("is-valid")
                    userLogMsg.innerHTML = "Login success!";
                    passLogMsg.innerHTML = "Login success!";
                }
            } else {
                userInput.classList.add("is-invalid")
                passInput.classList.add("is-invalid")
                userLogMsg.innerHTML = "Login error, please try again.";
                passLogMsg.innerHTML = "Login error, please try again.";
            }
            loginForm.classList.add('was-validated');
        }
        //    xhr.onload = userLogin(event, xhr)
        //console.log(xhr.status)
        //console.log(xhr.response)
        //}
    };
    event.stopPropagation();
    //let responseObj = JSON.parse(xhr.responseText)
    //console.log(postResponse)
    //return postResponse
}

function myCallback(status, data) {
    console.log(status);
    console.log(data);
}

makeEventListeners()

