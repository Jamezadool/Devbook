
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('password-strength');
    const strengthBar = strengthElement.querySelector('.strength-bar');
    const strengthText = strengthElement.querySelector('.strength-text');
    
    if (password.length === 0) {
        strengthElement.style.display = 'none';
        return;
    }
    
    strengthElement.style.display = 'block';
    
    let strength = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Remove previous strength classes
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    
    if (strength <= 2) {
        strengthBar.classList.add('strength-weak');
        feedback = 'Weak';
    } else if (strength <= 4) {
        strengthBar.classList.add('strength-medium');
        feedback = 'Medium';
    } else {
        strengthBar.classList.add('strength-strong');
        feedback = 'Strong';
    }
    
    strengthText.textContent = feedback;
}

function checkUsername(username) {
    // Simulate username availability check
    console.log('Checking username:', username);
}

function showForgotPassword() {
    alert('Forgot password functionality would redirect to password reset page');
}

// Form submission handlers
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const loginError = document.querySelector('#login-error');
    const loginPayload = {
        email: document.querySelector('#login-username').value,
        password: document.querySelector('#login-password').value
    }
    const loginBtn = document.querySelector('#login-btn');
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in";
    try{
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(loginPayload)
        });
        const response = await res.json();
        if(response.success){
            window.location.href="/homepage/index.html";
        }else{
            loginError.innerHTML = response.error;
            loginBtn.disabled = false;
            loginBtn.textContent = "Sign in";
            setTimeout(() => {
                loginError.innerHTML = "";
            }, 4000);
        }
    }catch(err){
        console.log(`An error ${err}`);
    }
});

document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const termsChecked = document.getElementById('terms-agreement').checked;
    if (!termsChecked) {
        alert('Please agree to the Terms of Service');
        return;
    }
    const errorLogging = document.querySelector('#error');
    const signupBtn = document.querySelector('#signup-btn');
    signupBtn.disabled = true;
    signupBtn.textContent = "Creating account...";
    const signupPayload = {
        username: document.querySelector('#signup-username').value,
        email: document.querySelector('#signup-email').value,
        password: document.querySelector('#signup-password').value
    }
    try{
        const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(signupPayload)
    });
        const response = await res.json();
        if(response.success){
            const verificationDisplay = document.querySelector('.confirmationcode');
            verificationDisplay.style.display = "flex";
            errorLogging.innerHTML = response.message;
            errorLogging.style.color = "green";
            signupBtn.disabled = false;
            signupBtn.textContent = "Create account";
            setTimeout(() => {
                errorLogging.innerHTML = "";
                errorLogging.style.color = "";
            }, 6000)
        }else{
            errorLogging.innerHTML = response.error;
            signupBtn.disabled = false;
            signupBtn.textContent = "Create account";
            setTimeout(() => {
                errorLogging.innerHTML = "";
            }, 4000)
        }
    }catch(err)
    {
        console.log(`this is the error from catch block ${err}`);
    }
});

// Add input focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#1f6feb';
        this.style.boxShadow = '0 0 0 3px rgba(31, 111, 235, 0.3)';
    });
    
    input.addEventListener('blur', function() {
        this.style.borderColor = '#30363d';
        this.style.boxShadow = 'none';
    });
});



// function checkUsername(username) {
//     // Simulate username availability check
//     // console.log('Checking username:', username);
//     const usernameChecked = document.querySelector('#username-checked');
//     const username = document.querySelector('#signup-username');
//     setTimeout(() => {
//         fetch('http://localhost:3000/checkusername', {
//             method: 'POST',
//             headers: {'Content-Type' : 'application/json'},
//             body: JSON.stringify(username)
//         })
//         .then(res => res.json())
//         .then(checkedusername => {
//             //a conditional statement would be here to determine if the database return okay to use or not... the response would be sent to usernameChecked, and while its an error, we change the text color to red.
//         })
//     }, 2000);
// }

// function showForgotPassword() {
//     alert('Forgot password functionality would redirect to password reset page');
// }

// document.getElementById('signup-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const termsChecked = document.getElementById('terms-agreement').checked;
//     if (!termsChecked) {
//         alert('Please agree to the Terms of Service');
//         return;
//     }
// });

// // Add input foFcus effects
// document.querySelectorAll('.form-input').forEach(input => {
//     input.addEventListener('focus', function () {
//         this.style.borderColor = '#1f6feb';
//         this.style.boxShadow = '0 0 0 3px rgba(31, 111, 235, 0.3)';
//     });

//     input.addEventListener('blur', function () {
//         this.style.borderColor = '#30363d';
//         this.style.boxShadow = 'none';
//     });
// });
