let addConForm = $("#addConForm")
let delConForm = $("#delConForm")
let editConForm = $("#editConForm")
let accDelForm = $("#accDelForm")

function getContactInfo(form) {
    let formData = {}

    formData = $.extend(formData, {id: userId}, form.serializeArray().map(function(x){ {}[x.name] = x.value }))
    return formData
}

editConForm.on("submit",  function (event) {
    event.preventDefault()
    console.log(event)
    let contacts = {}
    editConForm.serializeArray().map(function (x) {
        contacts[x.name] = x.value
    });
    console.log(contacts)
    $.ajax({
        url: "https://cop4331.acobble.io/API/EditContact.php",
        data: contacts,
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.error === "") {

            } else {

            }
        }
    })
})

addConForm.on("submit", function (event) {
    event.preventDefault()
    console.log(event)
    let contacts = {}
    addConForm.serializeArray().map(function(x){contacts[x.name] = x.value});
    console.log(contacts)
    $.ajax({
        url: "https://cop4331.acobble.io/API/AddContact.php",
        data: contacts,
        type: "POST",
        dataType: "json",
        success: function(response) {
            console.log(response)
            if (response.error === "") {

            } else {

            }
        }
    })
})

// addUserForm
accDelForm.on("submit", function (event) {
    event.preventDefault()
    console.log(event)
    let userN = $("#userDel").val()
    $.ajax({
        url: "https://cop4331.acobble.io/API/DeleteAccount.php",
        data: {
            login: userN,
            password: sha256($("#passDel").val())
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response)
            if (response.error === "") {
                doLogout()
            } else {
                console.log("bad username")
            }
        }
    })
})

$(function() {
    $.validator.addMethod("validPhone", function(value, element) {
        return phonePattern.test(value)
    })

    addConForm.validate({
        submitHandler: function(form, event) {
            event.preventDefault()
            let data = getContactInfo(form)
            $.ajax({
                url: urlBase + API.register,
                data: data,
                type: "POST",
                dataType: "json",
                success: function (response) {
                    myCallback(response, $("#regForm"), API.register)
                    form.classList.add("was-validated")
                },
                error: function (xhr, textStatus){
                    console.log("fail", xhr, +textStatus)
                    $("#regRepeatPass").addClass("is-invalid")
                    $("#regSuccess").addClass("invalid-feedback").text("Registration failed, please try again")
                }
            })
            form.classList.add("was-validated")
            // }).done(function (response) {
            //     myCallback(response, $("#regForm"), API.login)
            // }).fail(function (xhr, textStatus){
            //     console.log("fail", xhr, +textStatus)
            //     $("#postResponse").val("Registration failed, please try again").addClass("is-invalid")
            // })
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

    accDelForm.validate({
        rules: {
            accDel: "required",
            passDel: "required"
        },
        messages: {
            accDel: "Please enter your username",
            passDel: "Please enter your password"
        }
    })
    // console.log("yes yes?")
    // accDelForm.classList.add("was-validated")
})

$.validator.setDefaults({
    errorClass: "is-invalid",

    validClass: "is-valid",

    errorPlacement: function(error, element){
        $(element).next().append(error)
    }
});
