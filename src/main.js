const urlBase = 'https://cop4331.acobble.io/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

let isPasswordMatch = false;
let isPasswordValid = false;
const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;

const regForm = document.getElementById("regForm");
const loginForm = document.getElementById("loginForm");

const badLoginMsg = "Login not recognized";
const badUserRegMsg = "Username taken"
const badPassMsg = "Password Requirements:<ul><li>Must contain a number, a special character, an uppercase letter, and a lower case letter</li><li>Is at least 8 characters long</li></ul>";
const passMismatch = "Passwords do not match";



// regForm.addEventListener('input', function(event) {
//     const formData = new FormData(regForm);
//     const password = formData.get("password").toString();
//     const repeatPassword = formData.get("repeatPassword");
//
//     // Validate the pattern again.
//     isPasswordValid = passwordPattern.test(password);
//     isPasswordMatch = repeatPassword !== '' && password === repeatPassword;
// }, false);

/*regForm.addEventListener('submit', function(event) {

    let userInput = document.getElementById("regUser");
    let passInput = document.getElementById("regPass");
    let repeatInput = document.getElementById("regRepeatPass");

    if (!regForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        // return;
    }

    if (passInput.validity.patternMismatch){
        passInput.setCustomValidity(badPassMsg);
        document.getElementById("regPassValMsg").innerHTML = badPassMsg;
        event.preventDefault();
        event.stopPropagation();
        // return;
    }

    const formData = new FormData(regForm);
    const password = formData.get("password").toString();
    const repeatPassword = formData.get("repeatPassword");
    isPasswordMatch = password === repeatPassword;

    if (isPasswordMatch !== true){
        passInput.setCustomValidity(passMismatch);
        document.getElementById("regPassValMsg").innerHTML = passMismatch;

        repeatInput.setCustomValidity(passMismatch);
        document.getElementById("regRepeatValMsg").innerHTML = passMismatch;
        event.preventDefault();
        event.stopPropagation();
        // return;
    }

    /*
    if(!doRegister(userInput, passInput)){
        event.preventDefault();
        event.stopPropagation();

        userInput.setCustomValidity(badUserRegMsg);
        document.getElementById("regUserValMsg").innerHTML = badUserRegMsg;
        return;
    }

    regForm.classList.add('was-validated');
}, false);



function doRegister(login, password){
*/
// (function () {
//     'use strict'
//
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     let forms = document.querySelectorAll('.needs-validation')
//
//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//         .forEach(function (form) {
//             form.addEventListener('submit', function (event) {
//                 if (!form.checkValidity()) {
//                     event.preventDefault()
//                     event.stopPropagation()
//                 }
//
//                 form.classList.add('was-validated')
//             }, false)
//         })
// })()

function makeEventListeners (){
    makeLoginEventListeners()
    makeRegEventListeners()
}

function getLoginInfo(){
    let login = document.getElementById("loginUser").value
    let password = document.getElementById("loginPass").value
    return {login,password}
}

function getRegInfo(){
    let fName = document.getElementById("regFName").value
    let lName = document.getElementById("regFName").value
    let user = document.getElementById("regUser").value
    let password = document.getElementById("regPass").value
    return {fName, lName, user, password}
}

function userLogin(event){
    let loginInfo = getLoginInfo()
    console.log(JSON.stringify(loginInfo));
    // const loginCon = await fetch('/API/Login.php',{
    //     method: 'POST',
    //     body: JSON.stringify(loginInfo)
    // });
    // const loginResult = await loginCon.json();
    if(!postJSON(urlBase + "/API/Login.php", loginInfo, callback)) {

        let userInput = document.getElementById("loginUser");
        let passInput = document.getElementById("loginPass");

        userInput.setCustomValidity(badLoginMsg);
        document.getElementById("userValMsg").innerHTML = badLoginMsg;

        passInput.setCustomValidity(badLoginMsg);
        document.getElementById("passValMsg").innerHTML = badLoginMsg;

        event.preventDefault();
        event.stopPropagation();

        // throw Error(`Request rejected with status ${loginResult.status}`);
    }
    loginForm.classList.add('was-validated');
    // console.log(loginResult);
}

function postJSON(url, json_data, callback) {
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.responseType = "json";
    // xhr.send(JSON.stringify(json_data));
    // xhr.onload = function() {
    //     var status = xhr.status;
    //     if (status === 200) {
    //         callback(null, xhr.response);
    //         return true;
    //     } else {
    //         callback(status, xhr.response);
    //         return false;
    //     }
    // }
    return false;
}

function callback(status, data) {
    console.log(data);
}

// postJSON("/API/Login.php", {"login": "Test55", "password": "44"}, callback);

function loginSubmit(event) {

    let userInput = document.getElementById("loginUser");
    let passInput = document.getElementById("loginPass");
    let loginInfo = getLoginInfo();

    if (!loginForm.checkValidity()) {//!userInput.checkValidity() || !passInput.checkValidity()
        event.preventDefault();
        // event.stopPropagation();
    }
    loginForm.classList.add('was-validated');

}


function userRegistration(){
    let regInfo = getRegInfo();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase+"/API/Register.php",true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                let jsonObject = JSON.parse( xhr.response );
                userId = jsonObject.id;

                if( userId < 1 )
                {
                    document.getElementById("regUserValMsg").innerHTML = badUserRegMsg;
                    console.log(badUserRegMsg);
                }
            }
        };
        xhr.send(JSON.stringify(regInfo));
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function makeLoginEventListeners(){
    let loginButton = document.getElementById("loginButton")
    loginForm.addEventListener('submit', function(event){
        loginSubmit(event)
    });
    loginForm.addEventListener("submit", function(event) {
        userLogin(event)
    });
}

function makeRegEventListeners(){
    let regButton = document.getElementById("regButton")
    regButton.addEventListener("click", userRegistration)
}

makeEventListeners()
