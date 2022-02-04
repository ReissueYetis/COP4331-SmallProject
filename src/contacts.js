function getContactInfo(form) {
    let contact = {}
    contact = $.extend({id: userId}, form.serializeArray().map(function(x){ {}[x.name] = x.value }))
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

//TODO: finish functions to process search, add, edit, and delete for client
function addConCB(response, status, xhr){
    if (status !== "error") {
        if (response.error === "") {
            $("#addConAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.regSucc)
            // do something with new contact here
        } else {
            $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.userExist)
            // $("#loginPass").removeClass("is-valid")
            // $("#loginUser").removeClass("is-valid")
        }
    } else {
        $("#addConAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.addConErr)
    }
}
function editConCB(response, textStatus, xhr){

}
function deleteConCB(response, textStatus, xhr){

}

$("#searchForm").on("search", function(event){
    event.preventDefault()
    let data = $("#searchForm").val()
    //
})

// event and validation handling
$(function() {
    // add contact
    $("#addConForm").validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            // console.log(event)
            let data = getContactInfo($("#addConForm"))
            postHandler(data, addConCB, API.delCon)
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
    $("#editConForm").validate({
        submitHandler:  function (form, event) {
            event.preventDefault()
            event.stopPropagation()
            // console.log(event)
            let data = getContactInfo($("#editConForm"))
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

    //delete account
    $("#accDelForm").validate({
        submitHandler: function (form, event){
            event.preventDefault()
            let data = getLoginInfo($("#accDelForm"))
            postHandler(data, accDeleteCB, API.login)
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
$("#editConForm").on("keydown", function(){
    // $("#editAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#accDelForm").on("keydown",function(){
    $("#delAccAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#addConForm").on("keydown", function(){
    $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#logoutBtn").click(function (event){
    doLogout()
})

// validator settings
$(function() {
    $.validator.addMethod("validPhone", function (value, element) {
        return phonePattern.test(value)
    })
})
// $.validator.setDefaults({});
