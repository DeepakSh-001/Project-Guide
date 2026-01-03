import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
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

/* ELEMENTS */
const profilePic = document.getElementById("profilePic");
const uploadPic = document.getElementById("uploadPic");
const userNameEl = document.getElementById("userName");
const userRoleEl = document.getElementById("userRole");
const emailEl = document.getElementById("email");
const sessionInfo = document.getElementById("sessionInfo");

/* ABOUT */
const aboutText = document.getElementById("aboutText");
const aboutInput = document.getElementById("aboutInput");
const editAboutBtn = document.getElementById("editAboutBtn");
const saveAboutBtn = document.getElementById("saveAboutBtn");

/* PROFILE */
const profileView = document.getElementById("profileView");
const profileEdit = document.getElementById("profileEdit");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const collegeInput = document.getElementById("collegeInput");
const degreeInput = document.getElementById("degreeInput");
const companyInput = document.getElementById("companyInput");
const jobInput = document.getElementById("jobInput");
const locationInput = document.getElementById("locationInput");

const collegeView = document.getElementById("collegeView");
const degreeView = document.getElementById("degreeView");
const companyView = document.getElementById("companyView");
const jobView = document.getElementById("jobView");
const locationView = document.getElementById("locationView");

/* AUTH */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userNameEl.textContent = user.displayName || "User";
  emailEl.textContent = user.email;
  userRoleEl.textContent = localStorage.getItem("role") || "mentee";

  profilePic.src = user.photoURL ||
    `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists()) {
    const d = snap.data();
    aboutText.textContent = d.about || "";
    collegeView.textContent = d.college || "";
    degreeView.textContent = d.degree || "";
    companyView.textContent = d.company || "";
    jobView.textContent = d.jobTitle || "";
    locationView.textContent = d.location || "";
  }

  sessionInfo.innerHTML = `
    <li>Sessions taken: 0</li>
    <li>Upcoming sessions: 0</li>
  `;
});

/* UPLOAD PHOTO */
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  const picRef = ref(storage, `profile-pictures/${user.uid}`);
  await uploadBytes(picRef, file);
  profilePic.src = await getDownloadURL(picRef);
});

/* ABOUT EDIT */
editAboutBtn.onclick = () => {
  aboutInput.value = aboutText.textContent;
  aboutText.classList.add("hidden");
  aboutInput.classList.remove("hidden");
  saveAboutBtn.classList.remove("hidden");
};

saveAboutBtn.onclick = async () => {
  const user = auth.currentUser;
  await setDoc(doc(db, "users", user.uid), {
    about: aboutInput.value,
    updatedAt: serverTimestamp()
  }, { merge: true });

  aboutText.textContent = aboutInput.value;
  aboutText.classList.remove("hidden");
  aboutInput.classList.add("hidden");
  saveAboutBtn.classList.add("hidden");
};

/* PROFILE EDIT */
editProfileBtn.onclick = () => {
  profileView.classList.add("hidden");
  profileEdit.classList.remove("hidden");
};

saveProfileBtn.onclick = async () => {
  const user = auth.currentUser;

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
