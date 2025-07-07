// Yea yea yea, I know semantic markups and I know click events are should be done on JavaScript. I'm just trying to have fun here. :)

// P.S. No space for username pleassse...

const username = document.querySelector('#username');
const email = document.querySelector('#femail');
const password = document.querySelector('#fpass');

async function register()
{
    const payload = {
        username: username.value,
        email: email.value,
        password: password.value
    }
    try
    {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(payload)
        });

        const data = await response.json;
        console.log(data.message);
    }catch(err)
    {
        console.log(`this error is from catch block, error: ${err}`);
    }

    //you can do the same with wht u did in the signup, check if it's successful or not, then log them in.
}


function loginbtn(e){
    const progressBar = document.querySelector('.c-form__progress');
    alert("Hello");
    progressBar.style.background = "red";

    //this works, so you can fetch the result from the backend and if its false, make it red with try again, and if successful, it finishs showing the login successful and it loads them to the main page.
}