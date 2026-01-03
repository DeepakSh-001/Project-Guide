import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore, doc, getDoc, setDoc, collection,
  query, where, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

/* TAB SWITCH */
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-section").forEach(s => s.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  };
});

/* AUTH */
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

  sessionInfo.innerHTML = `
    <li>Sessions taken: 0</li>
    <li>Upcoming sessions: 0</li>
  `;

  loadBlogs(user.uid);
});

/* ABOUT */
editAboutBtn.onclick = () => {
  aboutInput.value = aboutView.textContent;
  aboutView.classList.add("hidden");
  aboutInput.classList.remove("hidden");
  saveAboutBtn.classList.remove("hidden");
};

saveAboutBtn.onclick = async () => {
  await setDoc(doc(db, "users", auth.currentUser.uid), {
    about: aboutInput.value,
    updatedAt: serverTimestamp()
  }, { merge: true });

  aboutView.textContent = aboutInput.value;
  aboutView.classList.remove("hidden");
  aboutInput.classList.add("hidden");
  saveAboutBtn.classList.add("hidden");
};

/* PROFILE DETAILS */
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
  const data = {
    college: collegeInput.value,
    degree: degreeInput.value,
    company: companyInput.value,
    jobTitle: jobInput.value,
    location: locationInput.value,
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });

  collegeView.textContent = data.college;
  degreeView.textContent = data.degree;
  companyView.textContent = data.company;
  jobView.textContent = data.jobTitle;
  locationView.textContent = data.location;

  profileEdit.classList.add("hidden");
  profileView.classList.remove("hidden");
};

/* PHOTO */
uploadPic.onchange = async (e) => {
  const file = e.target.files[0];
  const picRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
  await uploadBytes(picRef, file);
  profilePic.src = await getDownloadURL(picRef);
};

/* BLOGS */
async function loadBlogs(uid) {
  const q = query(collection(db, "blogs"), where("authorId", "==", uid));
  const snap = await getDocs(q);

  blogsList.innerHTML = snap.empty ? "No blogs yet." : "";

  snap.forEach(d => {
    const b = d.data();
    blogsList.innerHTML += `<p><b>${b.title}</b></p>`;
  });
}
