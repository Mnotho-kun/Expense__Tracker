document.addEventListener('DOMContentLoaded', function () {
    var input = document.querySelector("#phone");
    var iti = window.intlTelInput(input, {
        // options here
        preferredCountries: ['us', 'gb'],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });
});

const form = document.getElementById('form')
const username_input = document.getElementById('username-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e)=>{
    // e.preventDefault()

    let errors = []

    if(username_input){
        errors = getSignUpFormErrors(username_input.value, email_input.value, password_input.value, repeat_password_input.value)
    }
    else{
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }
    if(errors.length > 0){
        e.preventDefault()
        error_message.innerText = errors.join(" . ")
    }
})

function getSignUpFormErrors(username, email, password, repeatPassword){
    let errors = []

    if(username === '' || username == null){
        errors.push('Username is required')
        username_input.parentElement.classList.add('incorrect')
    }
    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password.length < 8){
        errors.push('Password must have at leat 8 characters')
        password_input.parentElement.classList.add('incorrect')
    }
    if(password !== repeatPassword){
        errors.push('Password does not match repeated password')
        password_input.parentElement.classList.add('incorrect')
        repeat_password_input.parentElement.classList.add('incorrect')
    }
    return errors;
}
function getLoginFormErrors(email, password){
    let errors = []

    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }

    return errors
}
const allinputs = [username_input, email_input, password_input, repeat_password_input].filter(input => input != null)
allinputs.forEach(input =>{
    input.addEventListener('input', ()=>{
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})

