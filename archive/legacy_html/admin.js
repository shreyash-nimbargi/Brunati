const AUTH = {
    user: "brunati@2001",
    pass: "Brun@t1"
};

function handleLogin() {

    const u = document.getElementById('username').value;
    const p = document.getElementById('passcode').value;
    const error = document.getElementById('error');

    if (u === AUTH.user && p === AUTH.pass) {

        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';

    } 
    else {

        error.style.display = 'block';

        const container = document.getElementById('login-container');

        container.style.transform = 'translateX(10px)';

        setTimeout(() => {
            container.style.transform = 'translateX(-10px)'
        }, 100);

        setTimeout(() => {
            container.style.transform = 'translateX(0)'
        }, 200);
    }
}


document.addEventListener('keypress', function (e) {

    if (e.key === 'Enter') {
        handleLogin();
    }

});