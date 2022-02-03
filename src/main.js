const urlBase = 'https://cop4331.acobble.io/';
const extension = ".php"

const API = {
    login: "Login.php",
    register: "Register.php",
    delAcc: "DeleteAccount.php",
    addCon: "AddContact.php",
    delCon: "DeleteContact.php",
    editCon: "EditContact.php",
    searchCon: "SearchContact.php"
}

// let isPasswordMatch = false;
const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

const valMsg = {
    // badLoginMsg : "Username or password not recognized",
    userExist : "Username already exists",
    badPassMsg : "Password Requirements:<ul><li>Must contain a number, a special character, an uppercase letter, and a lower case letter</li><li>Is at least 8 characters long</li></ul>",
    passMismatch : "Passwords do not match",
    noUser : "Please enter a username.",
    noPass : "Please enter a password.",
    noFName: "Please enter first name",
    noLName: "Please enter last name",
    noEmail: "Please enter an E-mail",
    badPhone: "Please enter a valid phone number",
    regSucc: "Registration Succes!",
    regErr: "Registration failed, please try again",
    loginSucc: "Login Success",
    loginErr: "Login failed, please try again",
    accDelErr: "Account deletion failed, please try again"
}

let userId = 0;
let firstName = "";
let lastName = "";

function getLoginInfo(form){
    let formData = {}
    form.serializeArray().map(function(x){formData[x.name] = x.value;});
    formData.password = sha256(formData.password)
    console.log(formData)
    return formData
}

function getRegInfo(){
    let firstName = document.getElementById("regFName").value
    let lastName = document.getElementById("regLName").value
    let login = document.getElementById("regUser").value
    let password = sha256(document.getElementById("regPass").value)
    //let password = document.getElementById("regPass").value
    return {firstName, lastName, login, password}
}

$("#regForm").on("keydown", function(){
    $("#regAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#loginForm").on("keydown", function () {
    $("#loginAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$(function() {
    $("#loginForm").validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            $.ajax({
                url: urlBase + API.login,
                data: getLoginInfo($("#loginForm")),
                type: "POST",
                dataType: "json",
            })
            .done(function (response, status) {
                if (response.error === "") {
                    $("#loginAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.loginSucc)
                    saveCookie(response)
                } else {
                    $("#loginAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
                }
            })
            .fail(function (xhr, status) {
                $("#loginAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.loginErr)
            })
            .always(function(xhr, status){
                console.log(xhr, status)
            })
        },
        rules: {
            login: "required",
            password: "required",
        },
        messages: {
            login: valMsg.noUser,
            password: valMsg.noPass
        }
    })
})

$(function() {
    $("#regForm").validate({
        submitHandler: function(form, event){
            event.preventDefault()
            let data = getRegInfo()
            $.ajax({
                url: urlBase + API.register,
                data: data,
                type: "POST",
                dataType: "json",
            })
            .done(function(response, status){
                if (response.error === ""){
                    $("#regAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.regSucc)
                } else {
                    $("#regAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.userExist)
                }
            })
            .fail(function(xhr, status){
                $("#regAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.regErr)
            })
            .always(function(xhr, status){
                    console.log(xhr, status)
                })
        },
        rules: {
            regFName: "required",
            regLName: "required",
            regUser: {
                required: true,
            },
            regPass: {
                required: true,
                strongPass: true
            },
            regRepeatPass: {
                required: true,
                equalTo: "#regPass"
            },
            postResponse: {
                equalTo: ""
            }
        },
        messages: {
            regFName: valMsg.noFName,
            regLName: valMsg.noLName,
            regUser: valMsg.noUser,
            regPass: {
                required: valMsg.noPass,
                strongPass: valMsg.badPassMsg
            },
            regRepeatPass: {
                required: valMsg.noPass,
                equalTo: valMsg.passMismatch
            },
            postResponse: {
                equalTo: "Registration failed, please try again"
            }

        }
    })
})

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}
function saveCookie(data) {
    let date = new Date();
    date.setTime(date.getTime()+(20*60*1000));
    document.cookie = "id=" + data.id +
        ";firstName=" + data.firstName +
        ";lastName=" + data.lastName +
        ";expires=" + date.toUTCString();
}

function readCookie(key) {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(";");

    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] === "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    return userId >= 0;
}

$(function() {
    $.validator.addMethod("strongPass", function (value, element) {
        return passwordPattern.test(value)
    })
})
$.validator.setDefaults({
    errorClass: "is-invalid",

    validClass: "is-valid",

    errorPlacement: function(error, element){
        $(element).next().append(error)
    }
});

// const regForm = document.getElementById("regForm");
// const loginForm = document.getElementById("loginForm");

/*
function loginSubmit(event) {
    event.preventDefault();
    // loginForm.classList.remove('was-validated');

    if (!loginForm.checkValidity()) {//!userInput.checkValidity() || !passInput.checkValidity()
        event.stopPropagation();
        // loginForm.classList.add('was-validated');
    }
    else {
        let loginInfo = getLoginInfo()
        console.log(loginInfo)
        postJSON("https://cop4331.acobble.io/API/Login.php", loginInfo, "log", event)
        if (readCookie()){
            window.location.href = "home.html";
        }
    }
    loginForm.classList.add('was-validated');
}
*/

/*
function registerSubmit(event) {
    event.preventDefault();
    regForm.classList.remove('was-validated');

    let userInput = document.getElementById("regUser");

    const formData = new FormData(regForm);
    const password = formData.get("regPass").toString();
    const repeatPassword = formData.get("regRepeatPass").toString();
    // console.log(password + " ," + repeatPassword)

    isPasswordMatch = password === repeatPassword;
    if (userInput.value === ""){
        document.getElementById("regUserMsg").innerHTML = noUsername;
        regForm.classList.add('is-invalid');
    }
    if (password !== "" && !passwordPattern.test(password)){
        document.getElementById("regPassValMsg").innerHTML = badPassMsg;
        document.getElementById("repeatPassMsg").innerHTML = "";
        regForm.classList.add('is-invalid');
    }
    else if (password === "") {
        console.log("why why why ")
        document.getElementById("regPassValMsg").innerHTML = noPassEntered;

        if(repeatPassword === "") {
            document.getElementById("repeatPassMsg").innerHTML = noPassEntered;
        }
        regForm.classList.add('is-invalid');
    } else if (!isPasswordMatch && repeatPassword !== "") {
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
*/

/*
function postJSON(url, json_data, submitType, event) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    console.log(json_data)
    xhr.send(JSON.stringify(json_data));

    event.preventDefault();
    xhr.onload = function () {
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

        }
        else {
            let userInput = document.getElementById("loginUser")
            let passInput = document.getElementById("loginPass")

            let userLogMsg = document.getElementById("userValMsg")
            let passLogMsg = document.getElementById("passValMsg")
            if (xhr.status === 200){
                console.log(xhr.status)
                console.log(xhr.response)

                if (xhr.response.error !== "") {
                    loginForm.classList.remove('was-validated');
                    userInput.classList.add("is-invalid")
                    passInput.classList.add("is-invalid")
                    userLogMsg.innerHTML = xhr.response.error;
                    passLogMsg.innerHTML = xhr.response.error;

                } else {
                    userInput.classList.add("is-valid")
                    passInput.classList.add("is-valid")
                    userLogMsg.innerHTML = "Login success!";
                    passLogMsg.innerHTML = "Login success!";

                }
            } else {
                loginForm.classList.remove('was-validated');
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
*/

/*
function makeEventListeners (){
    makeLoginEventListeners()
    makeRegEventListeners()
}

makeEventListeners()
*/