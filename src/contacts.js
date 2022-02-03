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
            id:userId,
            search:$("#searchForm").val()
        },
        type: "POST",
        dataType: "json",
    })
    .done(function (response, status){

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
        submitHandler: function (event) {
            event.preventDefault()
            console.log(event)
            $.ajax({
                url: urlBase + API.delCon,
                data: getContactInfo($("#addConForm")),
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            })
                .done()
                .fail()
                .always(function(xhr, status){
                    console.log(xhr, status)
                })
        },
        rules: {
            addFName: "required",
            addLName: "required",
            addEmail: "required",
            addPhone: {
                validPhone: true
            }
        },
        messages: {
            addFName: valMsg.noFName,
            addLName: valMsg.noLName,
            addEmail: valMsg.noEmail,
            addPhone: {
                validPhone: valMsg.badPhone
            }
        }
    })
})
$("#addConForm").on("keydown", function(){
    // $("#addConAlert").addClass("collapse").removeClass("alert-danger alert-success")
})

// handle edit contact
$(function() {
    $("#editConForm").validate({
        submitHandler:  function (event) {
            event.preventDefault()
            // console.log(event)
            $.ajax({
                url: urlBase + API.editCon,
                data: getContactInfo($("#editConForm")),
                type: "POST",
                dataType: "json",
                contentType: "application/json"
            })
            .done()
            .fail()
            .always(function(xhr, status){
                console.log(xhr, status)
            })
        },
        rules: {
            addFName: "required",
            addLName: "required",
            addEmail: "required",
            addPhone: {
                validPhone: true
            }
        },
        messages: {
            addFName: valMsg.noFName,
            addLName: valMsg.noLName,
            addEmail: valMsg.noEmail,
            addPhone: {
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
        submitHandler: function (event){
            event.preventDefault()
            // postHandler(getLoginInfo($("#accDelForm")), API.login)
            $.ajax({
                url: urlBase + API.register,
                data: getLoginInfo($("#accDelForm")),
                type: "POST",
                dataType: "json",
            })
                .done(function(response, status) {
                    if (response.error === "") {
                        $("#delAccAlert").removeClass("collapse alert-danger").addClass("alert-success").text(valMsg.loginSucc)
                        doLogout()
                    } else {
                        $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(xhr.response.error)
                    }
                })
                .fail(function (xhr, status) {
                    $("#delAccAlert").removeClass("collapse alert-success").addClass("alert-danger").text(valMsg.loginErr)
                })
                .always(function(xhr, status){
                    console.log(xhr, status)
                })
        },
        rules: {
            accDel: "required",
            passDel: "required"
        },
        messages: {
            accDel: "Please enter your username",
            passDel: "Please enter your password"
        }
    })
})
$("#accDelForm").on("keydown",function(){
    $("#accDelAlert").addClass("collapse").removeClass("alert-danger alert-success")
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
