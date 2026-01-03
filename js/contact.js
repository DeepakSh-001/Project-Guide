// ================= EMAILJS INIT =================
emailjs.init("1mA9JZN7cVkRnUYeW"); 

const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  sendBtn.classList.add("loading");
  sendBtn.disabled = true;

  emailjs.sendForm(
    "service_3b2xgo8",   
    "template_1xpjq3f",  
    this
  )
  .then(() => {
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
    form.reset();
    modal.classList.add("show");
  })
  .catch((error) => {
    alert("Failed to send message. Please try again.");
    console.error(error);
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});
