import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* TAB SWITCH */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  };
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  userName.textContent = user.displayName || "User";
  email.textContent = user.email;
  userRole.textContent = localStorage.getItem("role") || "mentee";

  profilePic.src = user.photoURL ||
    `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;

  const refDoc = doc(db, "users", user.uid);
  const snap = await getDoc(refDoc);

  if (snap.exists()) {
    const d = snap.data();
    aboutView.textContent = d.about || "";
    collegeView.textContent = d.college || "";
    degreeView.textContent = d.degree || "";
    companyView.textContent = d.company || "";
    jobView.textContent = d.jobTitle || "";
    locationView.textContent = d.location || "";
  }

  /* ABOUT */
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

  /* PROFILE */
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
    Object.assign(collegeView, { textContent: data.college });
    Object.assign(degreeView, { textContent: data.degree });
    Object.assign(companyView, { textContent: data.company });
    Object.assign(jobView, { textContent: data.jobTitle });
    Object.assign(locationView, { textContent: data.location });
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
