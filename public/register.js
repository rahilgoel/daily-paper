import { auth } from './firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';

document.getElementById('registerBtn').addEventListener('click', async () => {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const errorMsg = document.getElementById('registerErrorMsg');

  errorMsg.textContent = '';
  errorMsg.style.color = 'red';

  if (!email || !password) {
    errorMsg.textContent = 'Please enter both email and password';
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    errorMsg.style.color = 'green';
    errorMsg.textContent = 'Account created successfully!';
    setTimeout(() => {
      window.location.href = 'preferences.html';
    }, 1500);
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-in-use') {
      errorMsg.textContent = 'An account with this email already exists. Please log in.';
    } else if (error.code === 'auth/weak-password') {
      errorMsg.textContent = 'Password should be at least 6 characters.';
    } else {
      errorMsg.textContent = error.message;
    }
  }
});