import emailjs from "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/emailjs.min.js";

emailjs.init("YOUR_PUBLIC_KEY");

const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  sendBtn.classList.add("loading");
  sendBtn.disabled = true;

  emailjs.sendForm(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    form
  )
  .then(() => {
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
    form.reset();
    modal.classList.add("show");
  })
  .catch(() => {
    alert("Something went wrong. Please try again.");
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
  });
});

closeModal.onclick = () => {
  modal.classList.remove("show");
};
