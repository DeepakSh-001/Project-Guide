import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ELEMENTS */
const profilePic = document.getElementById("profilePic");
const uploadPic = document.getElementById("uploadPic");
const userNameEl = document.getElementById("userName");
const userRoleEl = document.getElementById("userRole");
const emailEl = document.getElementById("email");

/* FIREBASE STORAGE */
const storage = getStorage();

/* 🔐 AUTH GUARD */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  /* BASIC INFO */
  userNameEl.textContent = user.displayName || "User";
  emailEl.textContent = user.email;

  /* ROLE (TEMP: from localStorage / later backend) */
  const role = localStorage.getItem("role") || "Mentor";
  userRoleEl.textContent = role;

  /* PROFILE PIC */
  if (user.photoURL) {
    profilePic.src = user.photoURL;
  } else {
    generateAvatar(user.displayName);
  }

  renderSessionInfo(role);
});

/* 🖼️ AVATAR FALLBACK */
function generateAvatar(name = "U") {
  const initial = name.charAt(0).toUpperCase();
  profilePic.src =
    `https://ui-avatars.com/api/?name=${initial}&background=0b5ed7&color=fff&size=120`;
}

/* 📤 UPLOAD PROFILE PICTURE */
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  if (!user) return;

  const picRef = ref(storage, `profile-pictures/${user.uid}`);

  try {
    await uploadBytes(picRef, file);
    const url = await getDownloadURL(picRef);

    profilePic.src = url;

    // Optional: update auth photoURL later
    console.log("Profile picture uploaded");
  } catch (err) {
    console.error("Upload failed:", err);
  }
});

/* 🎭 ROLE-BASED SESSION INFO */
function renderSessionInfo(role) {
  const sessionSection = document.querySelector(".card ul");

  if (!sessionSection) return;

  sessionSection.innerHTML = "";

  if (role === "Mentor") {
    sessionSection.innerHTML = `
      <li>Sessions given: 0</li>
      <li>Total earnings: ₹0</li>
      <li>Rating: ⭐⭐⭐⭐⭐</li>
    `;
  } else {
    sessionSection.innerHTML = `
      <li>Sessions taken: 0</li>
      <li>Upcoming sessions: 0</li>
    `;
  }
}

/* 🔀 TABS (BASIC SWITCHING) */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Later: show/hide sections
    console.log("Tab clicked:", tab.innerText);
  });
});
