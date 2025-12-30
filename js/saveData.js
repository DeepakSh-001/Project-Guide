document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("regName").value,
      email: document.getElementById("regEmail").value,
      password: document.getElementById("regPassword").value,
      phone: document.getElementById("regPhone").value,
      createdAt: new Date().toISOString()
    };

    const response = await fetch(
      "https://meetinsider-210731711520.asia-south1.run.app", // 👈 YOUR CLOUD URL
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      alert("Account Created");
      form.reset();
    } else {
      alert("Error saving data");
    }
  });
});
