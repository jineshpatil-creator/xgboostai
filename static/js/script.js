document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      const button = form.querySelector("button[type='submit']");
      if (button) {
        button.disabled = true;
        button.querySelector("span").textContent = "Calculating estimate...";
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {

    const resultCard = document.querySelector(".result-card.has-result");
    const errorMessage = document.querySelector(".alert-danger, .field-error");

    if (resultCard) {
        setTimeout(function () {
            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 300);
    }

    else if (errorMessage) {
        errorMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

});
