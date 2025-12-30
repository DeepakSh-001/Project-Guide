console.log("MAIN JS LOADED");

/* ===== NAVBAR ===== */
document.getElementById("navbar").innerHTML = `
<header>
  <div class="navbar">
    <h1>MeetInsider</h1>
    <nav>
      <a href="#">How It Works</a>
      <a href="#">About</a>
      <a href="#">Resources</a>
      <a href="#">Login</a>
    </nav>
  </div>
</header>
`;

/* ===== FOOTER ===== */
document.getElementById("footer").innerHTML = `
<footer>
  © 2025 MeetInsider — All rights reserved
</footer>
`;

/* ===== DYNAMIC TEXT ===== */
const words = ["Insider","Engineer","Recruiter","Alumni","Hiring Manager"];
let i = 0;
setInterval(() => {
  document.getElementById("dynamic-word").textContent = words[i++ % words.length];
}, 2000);

/* ===== CHATBOT ===== */
document.body.insertAdjacentHTML("beforeend", `
<div id="mi-chatbot">
  <div id="mi-chat-header">
    MeetInsider AI
    <span id="mi-chat-close">×</span>
  </div>
  <div id="mi-chat-body">
    <p><b>MeetInsider:</b> Hi 👋 Ask me about careers or interviews.</p>
  </div>
  <input id="mi-chat-input" placeholder="Type your question..." />
</div>

<div id="mi-chat-toggle">💬</div>
`);

const chatbot = document.getElementById("mi-chatbot");
const toggle = document.getElementById("mi-chat-toggle");
const closeBtn = document.getElementById("mi-chat-close");

toggle.onclick = () => chatbot.style.display = "block";
closeBtn.onclick = () => chatbot.style.display = "none";
