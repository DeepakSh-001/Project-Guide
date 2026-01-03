console.log("✅ contact.js loaded");

// INIT EmailJS
emailjs.init("1mA9JZN7cVkRnUYeW"); 

const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

if (!form || !sendBtn) {
  console.error("❌ Contact form elements not found");
}

form.addEventListener("submit", function (e) {
  e.preventDefault(); // 🔑 PREVENT PAGE RELOAD

  console.log("📨 Form submit triggered");

  sendBtn.classList.add("loading");
  sendBtn.disabled = true;

  emailjs.sendForm(
    "service_3b2xgo8",   
    "template_1xpjq3f", 
    form
  )
  .then(() => {
    console.log("✅ Email sent");
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
    form.reset();
    modal.classList.add("show");
  })
  .catch((error) => {
    console.error("❌ EmailJS error:", error);
    alert("Failed to send message. Check console.");
    sendBtn.classList.remove("loading");
    sendBtn.disabled = false;
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});
