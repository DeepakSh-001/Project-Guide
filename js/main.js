<script>
  const words = [
    "Insider",
    "Engineer",
    "Recruiter",
    "Alumni",
    "Hiring Manager",
    "Founder"
  ];

  let index = 0;
  const wordElement = document.getElementById("dynamic-word");

  setInterval(() => {
    wordElement.style.opacity = 0;
    wordElement.style.transform = "translateY(10px)";

    setTimeout(() => {
      index = (index + 1) % words.length;
      wordElement.textContent = words[index];
      wordElement.style.opacity = 1;
      wordElement.style.transform = "translateY(0)";
    }, 400);
  }, 2500);
</script>
