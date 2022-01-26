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

loginForm.addEventListener('submit', function(event) {

    let userInput = document.getElementById("loginUser");
    let passInput = document.getElementById("loginPass");

    if (loginForm.checkValidity() === false) {//!userInput.checkValidity() || !passInput.checkValidity()
        event.preventDefault();
        event.stopPropagation();
        // return;
    }
    if (!doLogin(userInput, passInput)){
        event.preventDefault();
        event.stopPropagation();

        userInput.setCustomValidity(badLoginMsg);
        document.getElementById("userValMsg").innerHTML = badLoginMsg;

        passInput.setCustomValidity(badLoginMsg);
        document.getElementById("passValMsg").innerHTML = badLoginMsg;
        // return;
    }

    loginForm.classList.add('was-validated');
}, false);

// regForm.addEventListener('input', function(event) {
//     const formData = new FormData(regForm);
//     const password = formData.get("password").toString();
//     const repeatPassword = formData.get("repeatPassword");
//
//     // Validate the pattern again.
//     isPasswordValid = passwordPattern.test(password);
//     isPasswordMatch = repeatPassword !== '' && password === repeatPassword;
// }, false);

regForm.addEventListener('submit', function(event) {

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
    }*/

    regForm.classList.add('was-validated');
}, false);

function doLogin(login, password){
    userId = 0;
    firstName = "";
    lastName = "";

    //	var hash = md5( password );

    let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                userId = jsonObject.id;

                if( userId < 1 )
                {
                    // document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return false;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                // saveCookie();

                window.location.href = "color.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        // document.getElementById("passValMsg").innerHTML = err.message;
        return false;
    }

}

function doRegister(login, password){

}

// placeholder existing username validation, needs API call

// placeholder wrong/non-existent username/password, needs API call

// (function () {
//     'use strict'
//
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation')
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



/*
form.addEventListener('submit', function(event) {
    // If either the form is invalid or the passwords don't match, stop!
    if (
        form.checkValidity() === false ||
        (isPasswordValid !== true && isPasswordMatch !== true)
    ) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
});
 */