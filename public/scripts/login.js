const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  emailError.textContent = '';
  passwordError.textContent = '';
  try {
    const response = await fetch('/login', { 
      method: 'POST', 
      body: JSON.stringify({
        email: form.email.value, 
        password: form.password.value
      }),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    if (data.errors) {
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;

      emailError.classList.add('error-margin');
      passwordError.classList.add('error-margin');
    }
    if (data.user) {
      location.assign('/');
    }
  }
  catch (err) {
    console.log(err);
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const mainTitleSpan = document.getElementById('main-title');
  mainTitleSpan.addEventListener('click', function (event) {
    if (event.target === this) {
      window.location.href = '/';
    }
  });
});