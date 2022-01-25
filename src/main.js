(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    let forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function makeEventListeners (){
    makeLoginEventListeners()
}
function getLoginInfo(){
    let user = document.getElementById("loginUser").value
    let pass = document.getElementById("loginPass").value
    return {user,pass}
}
function userLogin(){
    let loginInfo= getLoginInfo()
    console.log(loginInfo.pass)

}
function makeLoginEventListeners(){
    let loginButton = document.getElementById("loginButton")
    loginButton.addEventListener("click",userLogin)
}
makeEventListeners()
