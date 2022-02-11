const urlBase = 'https://cop4331.acobble.io/';
const site = "API/"

const API = {
    login: "Login.php",
    register: "Register.php",
    delAcc: "DeleteAccount.php",
    addCon: "AddContact.php",
    delCon: "DeleteContact.php",
    editCon: "EditContact.php",
    searchCon: "SearchContacts.php"
}

const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}/;
const phonePattern = /(^$)|^([0-9]{3}-[0-9]{3}-[0-9]{4})$/;

const valMsg = {
    // badLoginMsg : "Username or password not recognized",
    userExist : "Username already exists",
    badPassMsg : "Password Requirements:<ul><li>Contains an uppercase and lower-case letter, a number, and a special character</li><li>Is at least 8 characters long</li></ul>",
    passMismatch : "Passwords do not match",
    noUser : "Please enter a username.",
    noPass : "Please enter a password.",
    noFName: "Please enter first name",
    noLName: "Please enter last name",
    badEmail: "Please enter a valid E-mail address",
    badPhone: "\"XXX-XXX-XXXX\" or blank ",
    regSucc: "Registration Succes! You may now login",
    regErr: "Registration failed, please try again",
    loginSucc: "Login Success",
    loginErr: "Login failed, please try again",
    accDelSucc: "Account deletion successful",
    accDelErr: "Account deletion failed, please try again",
    addConSucc: "Contact created!",
    conExist: "Contact already exists",
    addConErr: "Contact creation failed, please try again"
}

let userId = -1;
let firstName = "";
let lastName = "";

function getLoginInfo(form){
    let formData = {}
    form.serializeArray().map(function(x){formData[x.name] = x.value;});
    formData.password = sha256(formData.password)
    //console.log(formData)
    return formData
}

function getRegInfo(){
    let firstName = document.getElementById("regFName").value
    let lastName = document.getElementById("regLName").value
    let login = document.getElementById("regUser").value
    let password = sha256(document.getElementById("regPass").value)
    //let password = hashPass(document.getElementById("regPass").value)
    //let password = hashPass(password)
    return {firstName, lastName, login, password}
}

function postHandler(data, callback ,endPoint) {
    console.log("POST HANDLER:\n", data, endPoint)
    let sendData = JSON.stringify(data)
    $.ajax({
        url: urlBase + site + endPoint,
        data: sendData,
        method: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        success: function (response, textStatus, xhr) {
            console.log("\n\t" + endPoint + ": SUCCESS:\n", response, textStatus)
            callback(response, textStatus, xhr)
        },
        error: function(xhr, textStatus, error){
            console.log("\n\t" + endPoint + ": ERROR:\n", textStatus, error)
            callback(null, textStatus, xhr)
        }
    }).always(function (xhr, status, error) {
        console.log("IN ALWAYS,\n XHR:\n", xhr, "\nSTATUS:\n", status, "\nERR:\n", error)
    })
}

// Callbacks
function regCB(response, status, xhr){
    //console.log("REG CB:", response, status, xhr)
    if (status !== "error") {
        if (response.error === "") {
            $("#regAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.regSucc)
        } else {
            $("#regAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.userExist)
            $("#regUser").removeClass("is-valid").addClass("is-invalid")
        }
    }else{
        $("#regAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.regErr)
    }
}

function loginCB(response, status, xhr){
    //console.log(response, status, xhr)
    if (status !== "error") {
        if (response.error === "") {
            // $("#loginAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.loginSucc)
            userId = response.id
            firstName = response.firstName;
            lastName = response.lastName;
            saveCookie()
            doLogin()

        } else {
            $("#loginAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
        }
    }
    else {
        $("#loginAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.loginErr)
    }
}

// event and validation handling
$(function() {
    // login
    $("#loginForm").validate({
        // event handler
        submitHandler: function (form, event) {
            event.preventDefault()
            let data = getLoginInfo($("#loginForm"))
            postHandler(data, loginCB, API.login)
        },
        // validator settings for login
        rules: {
            login: "required",
            password: "required",
        },
        messages: {
            login: valMsg.noUser,
            password: valMsg.noPass
        },
        errorClass: "is-invalid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })

    // register
    $("#regForm").validate({
        // event handler
        submitHandler: function(form, event){
            event.preventDefault()
            let data = getRegInfo()
            postHandler(data, regCB, API.register)
        },
        // validator settings for registration
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
            }
        },
        errorClass: "is-invalid",
        validClass: "is-valid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })
})

// functions to reset form fields and validation
$("#registerModal").on("hide.bs.modal", function(event){
    // addConForm[0].reset()
    $("#regForm").validate().resetForm()
    $("#regAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#regForm").on("keydown", function(){
    $("#regAlert").addClass("collapse").removeClass("alert-danger alert-success")
    // $("#regUser").removeClass("is-valid").removeClass("is-invalid")
})

$("#loginForm").on({
    "keydown": function () {
        $("#loginAlert").addClass("collapse").removeClass("alert-danger alert-success")
        // $("#loginPass").removeClass("is-valid")
        // $("#loginUser").removeClass("is-valid")
    },
    "keyup": function  () {
        // $("#loginPass").removeClass("is-valid")
        // $("#loginUser").removeClass("is-valid")
    }
})

function doLogin() {
    console.log(document.cookie)
    if (readCookie("id") > 0) {
       window.location.href = "home.html";
    }
}

function doLogout() {
    userId = -1;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function saveCookie() {
    let date = new Date();
    date.setTime(date.getTime()+(20*60*1000));
    document.cookie = "id=" + userId +
        ";firstName=" + firstName +
        ";lastName=" + lastName +
        ";expires=" + date.toUTCString();
    console.log(document.cookie)
}

function readCookie(key) {
    // userId = -1;
    let data = document.cookie;
    let splits = data.split(";");

    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === key) {
            return decodeURIComponent(tokens[1])
        }
        // else if (tokens[0] === "lastName") {
        //     lastName = tokens[1];
        // } else if (tokens[0] === "userId") {
        //     userId = parseInt(tokens[1].trim());
        // }
    }
    return "";
}

// global validation settings
$(function() {
    $.validator.addMethod("strongPass", function (value, element) {
        return passwordPattern.test(value)
    })
})
// $.validator.setDefaults({});


