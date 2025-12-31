document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("regName")?.value || "",
      email: document.getElementById("regEmail")?.value || "",
      phone: document.getElementById("regPhone")?.value || "",
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(
        "https://meetinsider-210731711520.asia-south1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        console.warn("saveData.js backend response:", response.status, txt);
      }
    } catch (err) {
      console.warn("saveData.js network error (ignored):", err);
    }

    /* ❗ IMPORTANT
       DO NOT show alerts
       DO NOT reset form
       Auth.js controls UX & redirect
    */
  });
});
