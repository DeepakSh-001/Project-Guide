/* ================= NAVBAR + GLOBAL ================= */
import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ================= NAVBAR ================= */
  const navbar = document.getElementById("navbar");

  if (navbar) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || "User";
        const initial = name.charAt(0).toUpperCase();

        navbar.innerHTML = `
          <header class="topbar">
            <div class="navbar">

              <div class="logo">MeetInsider</div>

              <!-- CENTER NAV -->
              <nav class="nav-center">
                <a href="index.html">Home</a>
                <a href="blog.html">Resources</a>
                <a href="faq.html">FAQs</a>
                <a href="about.html">About Us</a>
              </nav>

              <!-- RIGHT ACTIONS -->
              <div class="nav-actions">
                <button id="themeToggle" title="Toggle dark mode">🌙</button>

                <div class="avatar-wrapper">
                  <div class="avatar" id="avatarBtn">${initial}</div>
                  <div class="dropdown" id="avatarMenu">
                    <a href="profile.html">Profile</a>
                    <a href="#" id="dashboardLink">Dashboard</a>
                    <hr>
                    <a href="#" id="logoutBtn">Logout</a>
                  </div>
                </div>
              </div>

            </div>
          </header>
        `;

        /* Avatar dropdown */
        const avatarBtn = document.getElementById("avatarBtn");
        const avatarMenu = document.getElementById("avatarMenu");

        if (avatarBtn && avatarMenu) {
          avatarBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            avatarMenu.classList.toggle("open");
          });

          document.addEventListener("click", () => {
            avatarMenu.classList.remove("open");
          });
        }

        /* Dashboard redirect */
        const dashboardLink = document.getElementById("dashboardLink");
        if (dashboardLink) {
          dashboardLink.onclick = () => {
            const role = localStorage.getItem("role");
            window.location.href =
              role === "mentor"
                ? "mentor-dashboard.html"
                : "mentee-dashboard.html";
          };
        }

        /* Logout */
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
          logoutBtn.onclick = async (e) => {
            e.preventDefault();
            await signOut(auth);
            localStorage.clear();
            window.location.href = "login.html";
          };
        }

        setupDarkMode();

      } else {
        navbar.innerHTML = `
          <header class="topbar">
            <div class="navbar">
              <div class="logo">MeetInsider</div>
              <nav class="nav-center">
                <a href="index.html">Home</a>
                <a href="blog.html">Resources</a>
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
  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = `
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
  }

  /* ================= HERO TEXT ANIMATION ================= */
  const words = ["Insider", "Alumni"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const dynamicWord = document.getElementById("dynamic-word");
const strikeLine = document.querySelector(".strike-line");

/* ---------- STRIKE ANIMATION (Stop guessing) ---------- */
if (strikeLine) {
  function animateStrike() {
    strikeLine.classList.add("active");
    setTimeout(() => {
      strikeLine.classList.remove("active");
    }, 800);
  }

  // run strike once on load
  setTimeout(animateStrike, 800);
}

/* ---------- TYPEWRITER ANIMATION (Insider) ---------- */
if (dynamicWord) {
  const typingSpeed = 120;
  const deletingSpeed = 80;
  const pauseAfterType = 1200;

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      dynamicWord.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        setTimeout(() => (isDeleting = true), pauseAfterType);
      }
    } else {
      dynamicWord.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(
      typeEffect,
      isDeleting ? deletingSpeed : typingSpeed
    );
  }

  setTimeout(typeEffect, 1000);
}

  /* ================= BOOK SESSION ================= */
  const payBtn = document.getElementById("payBtn");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      const service = document.getElementById("service")?.value;
      const duration = document.getElementById("duration")?.value;
      const date = document.getElementById("date")?.value;
      const time = document.getElementById("time")?.value;

      if (!date || !time) {
        alert("Please select date and time");
        return;
      }

      alert(
        `Proceeding to payment\n\nService: ${service}\nDuration: ${duration}\nDate: ${date}\nTime: ${time}`
      );
    });
  }

});

/* ================= DARK MODE ================= */
function setupDarkMode() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const isDark = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", isDark);
  btn.textContent = isDark ? "☀️" : "🌙";

  btn.onclick = () => {
    const dark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    btn.textContent = dark ? "☀️" : "🌙";
  };
}
