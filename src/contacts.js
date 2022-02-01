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
        contacts[x.name] = x.value;
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
    addConForm.serializeArray().map(function(x){contacts[x.name] = x.value;});
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

addConForm.on("submit", function (event) {
    event.preventDefault()
    $ajax({
        url: "https://cop4331.acobble.io/API/AddContact.php",
        data: contacts,
        type: "POST",
        dataType: "json",
        success: function(response) {
            console.log(response)
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

$.validator.setDefaults({
        errorClass: ":invalid",

        validClass: ":valid",
//     highlight: function (element/*errorClass, validClass*/) {
//         $(element).addClass("is-invalid").removeClass("is-valid");
//         //$(element.form).find("[data-valmsg-for=" + element.id + "]").addClass("invalid-feedback");
//     },
//     unhighlight: function (element) {
//         $(element).addClass("is-valid").removeClass("is-invalid");
//         //$(element.form).find("[data-valmsg-for=" + element.id + "]").removeClass("invalid-feedback");
//     }
//     highlight: function (element, errorClass, validClass) {
//         $(element).addClass('is-invalid');
//         $(element).closest('.form-group').find('span').show();
//     },
//     unhighlight: function (element, errorClass, validClass) {
//         $(element).removeClass('is-invalid');
//         $(element).closest('.form-group').find('span').hide();
//     },
//     errorElement: 'span',
//     // errorPlacement: function (error, element) {
//     //     error.addClass('invalid-feedback');
//     //     element.closest('.form-group').append(error);
//     // },
//     highlight: function (element, errorClass, validClass) {
//         $(element).addClass('is-invalid');
//
//     },
//     unhighlight: function (element, errorClass, validClass) {
//         $(element).removeClass('is-invalid');
//     }
});

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
    accDelForm.class.add("was-validated")
});
//})
// jQuery unobtrusive validation defaults

    // });
// });
