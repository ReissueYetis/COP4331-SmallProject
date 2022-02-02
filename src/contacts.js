let addConForm = $("#addConForm")
let delConForm = $("#delConForm")
let editConForm = $("#editConForm")
let accDelForm = $("#accDelForm")

function getContactInfo() {
    let firstName = document.getElementById("regFName").value
    let lastName = document.getElementById("regLName").value
    let phoneNumber = document.getElementById("regUser").value
    return {firstName, lastName, phoneNumber, email}
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
    addConForm.validate({
        rules: {
            addFName: "required",
            addLName: "required",
            addEmail: "required",
            addPhone: "required"
        },
        messages: {
            addFName: "BOI WAT DA HELL BOI"
        }
    })
})

$(function() {
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
});

$.validator.setDefaults({
    errorClass: "is-invalid",

    validClass: "is-valid",

    errorPlacement: function(error, element){
        $(element).next().append(error)
    }
});
//})
// jQuery unobtrusive validation defaults

    // });
// });