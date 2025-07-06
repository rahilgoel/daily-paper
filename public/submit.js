import { addDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { usersCollection } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector("button");

  submitBtn.addEventListener("click", async () => {
    const email = document.querySelector('input[type="email"]').value;
    const preferences = Array.from(document.querySelectorAll('.topics button.selected')).map(btn => btn.textContent);

    try {
      await addDoc(usersCollection, {
        email: email,
        preferences: preferences,
        createdAt: new Date()
      });
      alert("Subscribed successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  });

  document.querySelectorAll('.topics button').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
    });
  });
});
