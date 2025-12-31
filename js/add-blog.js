import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const publishBtn = document.getElementById("publishBtn");

let currentUser = null;

/* 🔐 AUTH GUARD */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
});

/* 📝 SAVE BLOG */
publishBtn.addEventListener("click", () => {
  if (!currentUser) return;

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const file = document.getElementById("image").files[0];

  if (!title || !content) {
    alert("Title and content are required");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");

    blogs.push({
      title,
      content,
      image: file ? reader.result : "",

      authorName: currentUser.displayName || "Anonymous",
      authorUid: currentUser.uid,
      createdAt: Date.now()
    });

    localStorage.setItem("blogs", JSON.stringify(blogs));
    window.location.href = "blog.html";
  };

  if (file) reader.readAsDataURL(file);
  else reader.onload();
});
