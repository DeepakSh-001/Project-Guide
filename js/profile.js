import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const collegeInput = document.getElementById("collegeInput");
const companyInput = document.getElementById("companyInput");
const jobTitleInput = document.getElementById("jobTitleInput");
const interestsInput = document.getElementById("interestsInput");
const saveDetailsBtn = document.getElementById("saveDetailsBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  userName.textContent = user.displayName;
  email.textContent = user.email;

  const role = localStorage.getItem("role") || "mentee";
  userRole.textContent = role;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const d = snap.data();
    collegeInput.value = d.college || "";
    companyInput.value = d.company || "";
    jobTitleInput.value = d.jobTitle || "";
    interestsInput.value = d.interests || [];
  }

  if (role === "mentor") {
    collegeInput.disabled = true;
    companyInput.disabled = true;
    jobTitleInput.disabled = true;
    interestsInput.disabled = true;
    saveDetailsBtn.style.display = "none";
  }

  saveDetailsBtn.onclick = async () => {
    await setDoc(userRef, {
      college: collegeInput.value,
      company: companyInput.value,
      jobTitle: jobTitleInput.value,
      interests: Array.from(interestsInput.selectedOptions).map(o => o.value),
      updatedAt: serverTimestamp()
    }, { merge: true });

    alert("Profile updated");
  };

  uploadPic.onchange = async (e) => {
    const file = e.target.files[0];
    const picRef = ref(storage, `profile-pictures/${user.uid}`);
    await uploadBytes(picRef, file);
    profilePic.src = await getDownloadURL(picRef);
  };
});
