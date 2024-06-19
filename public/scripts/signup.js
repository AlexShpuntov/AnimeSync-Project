const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  nameError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';
  try {
    const response = await fetch('/signup', { 
      method: 'POST', 
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value, 
        password: form.password.value
      }),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    if (data.errors) {
      nameError.textContent = data.errors.name;
      emailError.textContent = data.errors.email;
      passwordError.textContent = data.errors.password;

      nameError.classList.add('error-margin');
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