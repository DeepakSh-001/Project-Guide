import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* DOM */
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

/* TABS */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  userName.textContent = user.displayName || "User";
  email.textContent = user.email;
  userRole.textContent = localStorage.getItem("role") || "mentee";

  profilePic.src =
    user.photoURL ||
    `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;

  const refDoc = doc(db, "users", user.uid);
  const snap = await getDoc(refDoc);

  if (snap.exists()) {
    const d = snap.data();
    aboutView.textContent = d.about || "No description yet.";
    collegeView.textContent = d.college || "";
    degreeView.textContent = d.degree || "";
    companyView.textContent = d.company || "";
    jobView.textContent = d.jobTitle || "";
    locationView.textContent = d.location || "";
  }

  editAbout.onclick = () => {
    aboutInput.value = aboutView.textContent;
    aboutView.classList.add("hidden");
    aboutInput.classList.remove("hidden");
    saveAbout.classList.remove("hidden");
  };

  saveAbout.onclick = async () => {
    await setDoc(refDoc, { about: aboutInput.value, updatedAt: serverTimestamp() }, { merge: true });
    aboutView.textContent = aboutInput.value;
    aboutView.classList.remove("hidden");
    aboutInput.classList.add("hidden");
    saveAbout.classList.add("hidden");
  };

  editProfile.onclick = () => {
    collegeInput.value = collegeView.textContent;
    degreeInput.value = degreeView.textContent;
    companyInput.value = companyView.textContent;
    jobInput.value = jobView.textContent;
    locationInput.value = locationView.textContent;
    profileView.classList.add("hidden");
    profileEdit.classList.remove("hidden");
  };

  saveProfile.onclick = async () => {
    const data = {
      college: collegeInput.value,
      degree: degreeInput.value,
      company: companyInput.value,
      jobTitle: jobInput.value,
      location: locationInput.value,
      updatedAt: serverTimestamp()
    };

    await setDoc(refDoc, data, { merge: true });

    collegeView.textContent = data.college;
    degreeView.textContent = data.degree;
    companyView.textContent = data.company;
    jobView.textContent = data.jobTitle;
    locationView.textContent = data.location;

    profileEdit.classList.add("hidden");
    profileView.classList.remove("hidden");
  };

  uploadPic.onchange = async (e) => {
    const file = e.target.files[0];
    const picRef = ref(storage, `profile-pictures/${user.uid}`);
    await uploadBytes(picRef, file);
    profilePic.src = await getDownloadURL(picRef);
  };
});
