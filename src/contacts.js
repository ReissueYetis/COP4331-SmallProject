let addConForm =  $("#addConForm")

function getFormInfo(form) {
    let data = {}
    form.serializeArray().map(function(x){ data[x.name] = x.value })
    let contact = {"userID": readCookie("id")}
    contact = $.extend(contact, data)
    // console.log(contact)
    return contact
}

// callbacks
function accDeleteCB(response, textStatus, xhr){
    if (textStatus !== "error") {
        if (response.error === "") {
            $("#delAccAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.accDelSucc)
            doLogout()
        } else {
            $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
        }
    }
    else {
        $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.accDelErr)
    }
}

$("#searchBar").on("keyup", function(event){
    // console.log(event)
    event.stopPropagation()
    let data = {
        "userId" : readCookie("id"), //55
        "search" : $("#searchBar").val()
    }
    // console.log(data)
    postHandler(data, searchCB, API.searchCon)
})

// event and validation handling
$(function() {
    // add contact
    addConForm.validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            // console.log(event)

            let data = getFormInfo($("#addConForm"))
            postHandler(data, addConCB, API.addCon)
        },
        rules: {
            firstName: "required",
            lastName: "required",
            emailAddress: "required",
            phoneNumber: {
                validPhone: true
            }
        },
        messages: {
            firstName: valMsg.noFName,
            lastName: valMsg.noLName,
            emailAddress: valMsg.badEmail,
            phoneNumber: {
                validPhone: valMsg.badPhone
            }
        },
        errorClass: "is-invalid",
        validClass: "is-valid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })

    // edit contact
    // will probably need to change the selector to not reference unique ID's
    /*
    $("#editConForm").validate({
        submitHandler:  function (form, event) {
            event.preventDefault()
            event.stopPropagation()
            // console.log(event)
            let data = getFormInfo($("#editConForm"))
            postHandler(data, editConCB, API.editCon)
        },
        rules: {
            firstName: "required",
            lastName: "required",
            emailAddress: "required",
            phoneNumber: {
                validPhone: true
            }
        },
        messages: {
            firstName: valMsg.noFName,
            lastName: valMsg.noLName,
            emailAddress: valMsg.badEmail,
            phoneNumber: {
                validPhone: valMsg.badPhone
            }
        }
    })
    */

    //delete account
    $("#accDelForm").validate({
        submitHandler: function (form, event){
            event.preventDefault()
            let data = getLoginInfo($("#accDelForm"))
            postHandler(data, accDeleteCB, API.delAcc)
        },// validation settings for form
        rules: {
            login: "required",
            password: "required"
        },
        messages: {
            login: "Please enter your username",
            password: "Please enter your password"
        },
        errorClass: "is-invalid",
        errorPlacement: function(error, element){
            $(element).next().append(error)
        }
    })
})

// functions to reset form fields and validation
$("#addConModal").on("hide.bs.modal", function(event){
    addConForm[0].reset()
    $("#addConForm").validate().resetForm()
    $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#editConForm").on("keydown", function(){
    // $("#editAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#accDelForm").on("keydown",function(){
    $("#delAccAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
addConForm.on("keydown", function(){
    $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

$("#logoutBtn").click(function (event){
    doLogout()
})


$(function() {
    $(document).ready(function(){
        if (readCookie("id") < 0){
            window.location.href = "index.html";
        }
    });
})

// validator settings
$(function() {
    $.validator.addMethod("validPhone", function (value, element) {
        return phonePattern.test(value)
    })
})
// $.validator.setDefaults({});
function makeContactDiv(contact){
    let contactDiv = document.createElement("div");
}

function fillContactDiv(contact,contactDiv){
    // setting contact attributes
    contact.setAttribute("class","contact");
    contact.setAttribute("id",contact.ID);
    // adding the name part
    let contactName = document.createElement("div");
    contactName.setAttribute("class","contactNameText");
    contactName.innerHTML = contact.firstName +" "+contact.lastName;
    // add the button
    let extendButton = document.createElement("button");
    extendButton.setAttribute("class","contactExtendButton");
    extendButton.setAttribute("contactID",contact.ID);
    // here we would add the event listener
    contact.appendChild(contactName);
}
/*
function getContactInfo(contact){
  let email = contact.email;
  let phoneNum = contact.phoneNum;
  let contactInfoDiv = document.createElement("div");
  contactInfoDiv.innerHTML = email + "  "+ phoneNum;
  return contactInfoDiv;
}
*/
function basicCallback(response, status, xhr) {
    console.log("GENERIC CALLBACK\n", response + "\n", status+"\n", xhr+"\n");
}

/*
function postJSONSearch(url, json_data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(json_data));
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            myCallback(null, xhr.response);
        } else {
            myCallback(status, xhr.response);
        }
    }
}
*/

// let demoRequest = {"userId":"55","search":""};
// postJSONSearch("https://cop4331.acobble.io/Search.php",demoRequest);
