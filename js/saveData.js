document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
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
      alert("Data saved to Google Cloud");
      form.reset();
    } else {
      alert("Error saving data");
    }
  });
});
