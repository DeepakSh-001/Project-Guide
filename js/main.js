/* ================= NAVBAR ================= */
document.getElementById("navbar").innerHTML = `
<header>
  <div class="navbar">
    <h1>MeetInsider</h1>
    <nav>
      <a href="how-to-use.html">How It Works</a>
      <a href="about.html">About</a>
      <a href="blog.html">Resources</a>
      <a href="faq.html">FAQs</a>
      <a href="login.html">Login</a>
    </nav>
  </div>
</header>
`;

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
const words = ["Insider", "Software Engineer", "Data Analyst", "Accountant","HR", "Alumni", "Cloud Architect", "Cloud Architect", "Proffessor", "Investment Banker", "& Others"];
let index = 0;
const wordEl = document.getElementById("dynamic-word");

setInterval(() => {
  index = (index + 1) % words.length;
  wordEl.textContent = words[index];
}, 2000);

