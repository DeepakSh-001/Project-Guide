import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

/* ================= TAB SWITCHING ================= */

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-section").forEach(s => s.classList.add("hidden"));

    tab.classList.add("active");
    document.getElementById(`${tab.dataset.tab}Section`).classList.remove("hidden");
  });
});

/* ================= AUTH ================= */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // BASIC INFO
  document.getElementById("userName").textContent = user.displayName || "User";
  document.getElementById("email").textContent = user.email;
  document.getElementById("userRole").textContent = localStorage.getItem("role") || "mentee";

  // PROFILE IMAGE
  const profilePic = document.getElementById("profilePic");
  profilePic.src = user.photoURL ||
    `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;

  // LOAD PROFILE DATA
  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const d = snap.data();

    document.getElementById("aboutText").textContent = d.about || "";

    collegeView.textContent = d.college || "";
    degreeView.textContent = d.degree || "";
    companyView.textContent = d.company || "";
    jobView.textContent = d.jobTitle || "";
    locationView.textContent = d.location || "";
  }

  loadBlogs(user.uid);
});

/* ================= ABOUT EDIT ================= */

editAboutBtn.onclick = () => {
  aboutInput.value = aboutText.textContent;
  aboutText.classList.add("hidden");
  aboutInput.classList.remove("hidden");
  saveAboutBtn.classList.remove("hidden");
};

saveAboutBtn.onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "users", user.uid), {
    about: aboutInput.value.trim(),
    updatedAt: serverTimestamp()
  }, { merge: true });

  aboutText.textContent = aboutInput.value;
  aboutText.classList.remove("hidden");
  aboutInput.classList.add("hidden");
  saveAboutBtn.classList.add("hidden");
};

/* ================= PROFILE EDIT ================= */

editProfileBtn.onclick = () => {
  collegeInput.value = collegeView.textContent;
  degreeInput.value = degreeView.textContent;
  companyInput.value = companyView.textContent;
  jobInput.value = jobView.textContent;
  locationInput.value = locationView.textContent;

  profileView.classList.add("hidden");
  profileEdit.classList.remove("hidden");
};

saveProfileBtn.onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const data = {
    college: collegeInput.value,
    degree: degreeInput.value,
    company: companyInput.value,
    jobTitle: jobInput.value,
    location: locationInput.value,
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", user.uid), data, { merge: true });

  collegeView.textContent = data.college;
  degreeView.textContent = data.degree;
  companyView.textContent = data.company;
  jobView.textContent = data.jobTitle;
  locationView.textContent = data.location;

  profileEdit.classList.add("hidden");
  profileView.classList.remove("hidden");
};

/* ================= BLOGS ================= */

async function loadBlogs(uid) {
  const blogsList = document.getElementById("blogsList");
  blogsList.innerHTML = "";

  const q = query(
    collection(db, "blogs"),
    where("authorId", "==", uid)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    blogsList.innerHTML = "<p>No blogs written yet.</p>";
    return;
  }

  snapshot.forEach(doc => {
    const blog = doc.data();
    const div = document.createElement("div");
    div.className = "profile-card";
    div.innerHTML = `
      <h4>${blog.title}</h4>
      <p>${blog.excerpt || ""}</p>
    `;
    blogsList.appendChild(div);
  });
}

/* ================= PHOTO UPLOAD ================= */

uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  const picRef = ref(storage, `profile-pictures/${user.uid}`);

  await uploadBytes(picRef, file);
  profilePic.src = await getDownloadURL(picRef);
});
