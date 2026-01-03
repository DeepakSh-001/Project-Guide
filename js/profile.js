import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ---------- DOM ---------- */
const editAbout = document.getElementById("editAbout");
const saveAbout = document.getElementById("saveAbout");
const aboutView = document.getElementById("aboutView");
const aboutInput = document.getElementById("aboutInput");

const editProfile = document.getElementById("editProfile");
const saveProfile = document.getElementById("saveProfile");
const profileView = document.getElementById("profileView");
const profileEdit = document.getElementById("profileEdit");

const collegeView = document.getElementById("collegeView");
const degreeView = document.getElementById("degreeView");
const companyView = document.getElementById("companyView");
const jobView = document.getElementById("jobView");
const locationView = document.getElementById("locationView");

const collegeInput = document.getElementById("collegeInput");
const degreeInput = document.getElementById("degreeInput");
const companyInput = document.getElementById("companyInput");
const jobInput = document.getElementById("jobInput");
const locationInput = document.getElementById("locationInput");

const profilePic = document.getElementById("profilePic");
const uploadPic = document.getElementById("uploadPic");
const goDashboardBtn = document.getElementById("goDashboardBtn");

/* ---------- TABS ---------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

/* ---------- AUTH ---------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userName.textContent = user.displayName || "User";
  email.textContent = user.email;

  const role = localStorage.getItem("role") || "mentee";
  userRole.textContent = role;

  goDashboardBtn.onclick = () => {
    window.location.href =
      role === "mentor" ? "mentor-dashboard.html" : "mentee-dashboard.html";
  };

  profilePic.src =
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const d = snap.data();
    aboutView.textContent = d.about || "No description yet.";
    collegeView.textContent = d.college || "";
    degreeView.textContent = d.degree || "";
    companyView.textContent = d.company || "";
    jobView.textContent = d.jobTitle || "";
    locationView.textContent = d.location || "";
  }

  /* ABOUT EDIT */
  editAbout.addEventListener("click", () => {
    aboutInput.value = aboutView.textContent;
    aboutView.classList.add("hidden");
    aboutInput.classList.remove("hidden");
    saveAbout.classList.remove("hidden");
  });

  saveAbout.addEventListener("click", async () => {
    await setDoc(userRef, {
      about: aboutInput.value,
      updatedAt: serverTimestamp()
    }, { merge: true });

    aboutView.textContent = aboutInput.value;
    aboutView.classList.remove("hidden");
    aboutInput.classList.add("hidden");
    saveAbout.classList.add("hidden");
  });

  /* PROFILE EDIT */
  editProfile.addEventListener("click", () => {
    collegeInput.value = collegeView.textContent;
    degreeInput.value = degreeView.textContent;
    companyInput.value = companyView.textContent;
    jobInput.value = jobView.textContent;
    locationInput.value = locationView.textContent;

    profileView.classList.add("hidden");
    profileEdit.classList.remove("hidden");
  });

  saveProfile.addEventListener("click", async () => {
    const data = {
      college: collegeInput.value,
      degree: degreeInput.value,
      company: companyInput.value,
      jobTitle: jobInput.value,
      location: locationInput.value,
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, data, { merge: true });

    collegeView.textContent = data.college;
    degreeView.textContent = data.degree;
    companyView.textContent = data.company;
    jobView.textContent = data.jobTitle;
    locationView.textContent = data.location;

    profileEdit.classList.add("hidden");
    profileView.classList.remove("hidden");
  });

  /* PHOTO UPLOAD */
  uploadPic.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const picRef = ref(storage, `profile-pictures/${user.uid}`);
    await uploadBytes(picRef, file);
    profilePic.src = await getDownloadURL(picRef);
  });
});
