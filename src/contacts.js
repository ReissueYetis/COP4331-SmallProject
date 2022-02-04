function getContactInfo(form) {
    let contact = {}
    contact = $.extend({id: userId}, form.serializeArray().map(function(x){ {}[x.name] = x.value }))
    // console.log(contact)
    return contact
}

// handle search contact
$("#searchForm").on("search", function(event){
    event.preventDefault()
    $.ajax({
        url: urlBase + API.searchCon,
        data: {
            id:readCookie("id"),
            search:$("#searchForm").val()
        },
        type: "POST",
        dataType: "json",
    })
    .done(function (response, status){//TODO: display results, errors
    })
    .fail(function (xhr, status){
    })
    .always(function(xhr, status){
        console.log(xhr, status)
    })
})

// handle add contact
$(function() {
    $("#addConForm").validate({
        submitHandler: function (form, event) {
            event.preventDefault()
            console.log(event)
            $.ajax({
                url: urlBase + API.delCon,
                data: getContactInfo($("#addConForm")),
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            })
            .done()//TODO: functions to process response for client
            .fail()
            .always(function(xhr, status){
                console.log(xhr, status)
            })
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
})

// handle edit contact
$(function() {
    // will probably need to change the selector to not reference unique ID's
    $("#editConForm").validate({
        submitHandler:  function (form, event) {
            event.preventDefault()
            event.stopPropagation()
            // console.log(event)
            $.ajax({
                url: urlBase + API.editCon,
                data: getContactInfo($("#editConForm")),
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            })// response and remote validation handling
            .done()//TODO: functions to process response for client
            .fail()
            .always(function(xhr, status){
                console.log(xhr, status)
            })
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
})
$("#editConForm").on("keydown", function(){
    // $("#editAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

// handle account deletion
$(function(){
    $("#accDelForm").validate({
        submitHandler: function (form, event){
            event.preventDefault()
            // postHandler(getLoginInfo($("#accDelForm")), API.login)
            $.ajax({
                url: urlBase + API.delAcc,
                data: getLoginInfo($("#accDelForm")),
                type: "POST",
                dataType: "json",
            })// response and remote validation handling
            .done(function(response, status) {
                if (response.error === "") {
                    $("#delAccAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.accDelSucc)
                    doLogout()
                } else {
                    $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(response.error)
                }
            })
            .fail(function (xhr, status) {
                $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.accDelErr)
            })
            .always(function(xhr, status){
                console.log(xhr, status)
            })
        },// validation settings for form
        rules: {
            login: "required",
            password: "required"
        },
        messages: {
            login: "Please enter your username",
            password: "Please enter your password"
        }
    })
})

// Reset alert badges on keypress
$("#accDelForm").on("keydown",function(){
    $("#delAccAlert").addClass("collapse").removeClass("alert-danger alert-success")
})
$("#addConForm").on("keydown", function(){
    // $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
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
$.validator.setDefaults({
    errorClass: "is-invalid",

    validClass: "is-valid",

    errorPlacement: function(error, element){
        $(element).next().append(error)
    }
});
