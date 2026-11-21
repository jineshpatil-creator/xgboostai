document.addEventListener("DOMContentLoaded", () => {

    // 1. Scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
    });


    // 2. Form submission animation
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", () => {

            const button = form.querySelector("button[type='submit']");

            if (button) {
                button.disabled = true;

                const buttonText = button.querySelector("span");

                if (buttonText) {
                    buttonText.textContent = "Calculating estimate...";
                }
            }
        });
    }


    // 3. Automatically scroll to prediction result
    const resultCard = document.querySelector("#estimate-result.has-result");

    if (resultCard) {

        const parentReveal = resultCard.closest(".reveal");

        if (parentReveal) {
            parentReveal.classList.add("visible");
        }

        setTimeout(() => {
            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 500);
    }


    // 4. Scroll to validation errors
    else {

        const errorMessage = document.querySelector(
            ".alert-danger, .field-error"
        );

        if (errorMessage) {
            errorMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

});
