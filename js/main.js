/* ================= NAVBAR ================= */
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const navbar = document.getElementById("navbar");

if (navbar) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navbar.innerHTML = `
        <header>
          <div class="navbar">
            <h2 class="logo">MeetInsider</h2>
            <nav>
              <a href="index.html">Home</a>
              <a href="blog.html">Resources</a>
              <a href="faq.html">FAQs</a>
              <a href="about.html">About Us</a>
              <a href="profile.html">${user.displayName || "Profile"}</a>
              <a href="#" id="logoutBtn">Logout</a>
            </nav>
          </div>
        </header>
      `;

      document
        .getElementById("logoutBtn")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          await signOut(auth);
          localStorage.clear();
          window.location.href = "login.html";
        });

    } else {
      navbar.innerHTML = `
        <header>
          <div class="navbar">
            <h2 class="logo">MeetInsider</h2>
            <nav>
              <a href="index.html">Home</a>
              <a href="blog.html">Resources</a>
              <a href="faq.html">FAQs</a>
              <a href="about.html">About Us</a>
              <a href="login.html">Login</a>
            </nav>
          </div>
        </header>
      `;
    }
  });
}


/* ================= FOOTER ================= */
document.getElementById("footer").innerHTML = `
<footer>
  <div class="footer-grid">
    <div>
      <h2>MeetInsider</h2>
      <p>1:1 mentorship from real insiders who’ve already walked the path.</p>
    </div>

    <div>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="book-session.html">Pricing</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="for-mentors.html"><b>For Mentors</b></a></li>
      </ul>
    </div>

    <div>
      <h3>Legal</h3>
      <ul>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms.html">Terms</a></li>
        <li><a href="trust-and-safety.html">Trust & Safety</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    © 2025 MeetInsider
  </div>
</footer>
`;

/* ================= DYNAMIC INSIDER TEXT ================= */
const words = ["Insider", "Engineer", "Recruiter", "Alumni", "Hiring Manager"];
let index = 0;
const wordEl = document.getElementById("dynamic-word");

setInterval(() => {
  index = (index + 1) % words.length;
  wordEl.textContent = words[index];
}, 2000);
