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

// loginForm.addEventListener('submit', function(event) {
//
//     let userInput = document.getElementById("loginUser");
//     let passInput = document.getElementById("loginPass");
//
//     if (loginForm.checkValidity() === false) {//!userInput.checkValidity() || !passInput.checkValidity()
//         event.preventDefault();
//         event.stopPropagation();
//         // return;
//     }
//     if (!doLogin(userInput, passInput)){
//         event.preventDefault();
//         event.stopPropagation();
//
//         userInput.setCustomValidity(badLoginMsg);
//         document.getElementById("userValMsg").innerHTML = badLoginMsg;
//
//         passInput.setCustomValidity(badLoginMsg);
//         document.getElementById("passValMsg").innerHTML = badLoginMsg;
//         // return;
//     }
//
//     loginForm.classList.add('was-validated');
// }, false);

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
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
function makeEventListeners (){
    makeLoginEventListeners()

}
function getLoginInfo(){
    let login = document.getElementById("loginUser").value
    let password = document.getElementById("loginPass").value
    return {login,password}

}

async function userLogin(){
    let loginInfo= getLoginInfo()
    const loginCon = await fetch('/API/Login.php',{
        method: 'POST',
        body: JSON.stringify(loginInfo)
    });
    const loginResult = await loginCon.json();
    if(!loginResult.ok) {
      throw Error(`Request rejected with status ${res.status}`);
    }
    console.log(loginResult);
}
function makeLoginEventListeners(){
    let loginButton = document.getElementById("loginButton")
    loginButton.addEventListener("click",userLogin)
}
makeEventListeners()
