document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SCROLL REVEAL ANIMATION
    // ==========================================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        }, { threshold: 0.12 });

        revealElements.forEach(el => {
            observer.observe(el);
        });

    } else {

        revealElements.forEach(el => {
            el.classList.add("visible");
        });

    }


    // ==========================================
    // 2. FORM SUBMISSION ANIMATION
    // ==========================================

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


    // ==========================================
    // 3. AUTOMATIC SCROLL TO PREDICTION RESULT
    // ==========================================

    const resultCard = document.querySelector(
        "#estimate-result.has-result"
    );

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


    // ==========================================
    // 4. SCROLL TO VALIDATION ERRORS
    // ==========================================

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


    // ==========================================
    // 5. COVERCAST AUTOMATIC HERO SLIDER
    // ==========================================

    const heroSlider = document.querySelector(".hero-slider");

    if (heroSlider) {

        const backgroundSlides = heroSlider.querySelectorAll(
            ".hero-slide"
        );

        const textSlides = heroSlider.querySelectorAll(
            ".hero-text"
        );

        const navigationDots = heroSlider.querySelectorAll(
            ".hero-dot"
        );

        const totalSlides = Math.min(
            backgroundSlides.length,
            textSlides.length
        );

        let currentSlide = 0;

        let sliderInterval = null;

        const slideDuration = 6000;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


        // ------------------------------------------
        // DISPLAY SELECTED SLIDE
        // ------------------------------------------

        function showSlide(index) {

            if (totalSlides === 0) return;

            currentSlide = (index + totalSlides) % totalSlides;

            backgroundSlides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );

            });

            textSlides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === currentSlide
                );

            });

            navigationDots.forEach((dot, i) => {

                dot.classList.toggle(
                    "active",
                    i === currentSlide
                );

                dot.setAttribute(
                    "aria-current",
                    i === currentSlide ? "true" : "false"
                );

            });

        }


        // ------------------------------------------
        // STOP AUTOMATIC SLIDER
        // ------------------------------------------

        function stopSlider() {

            if (sliderInterval) {

                clearInterval(sliderInterval);

                sliderInterval = null;

            }

        }


        // ------------------------------------------
        // START AUTOMATIC SLIDER
        // ------------------------------------------

        function startSlider() {

            stopSlider();

            if (reducedMotion || totalSlides <= 1) return;

            if (document.hidden) return;

            sliderInterval = setInterval(() => {

                showSlide(currentSlide + 1);

            }, slideDuration);

        }


        // ------------------------------------------
        // NAVIGATION DOT CLICK
        // ------------------------------------------

        navigationDots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                showSlide(index);

                startSlider();

            });

        });


        // ------------------------------------------
        // PAUSE WHEN MOUSE HOVERS
        // ------------------------------------------

        heroSlider.addEventListener("mouseenter", () => {

            stopSlider();

        });

        heroSlider.addEventListener("mouseleave", () => {

            startSlider();

        });


        // ------------------------------------------
        // PAUSE WHEN KEYBOARD FOCUS ENTERS
        // ------------------------------------------

        heroSlider.addEventListener("focusin", () => {

            stopSlider();

        });

        heroSlider.addEventListener("focusout", (event) => {

            if (!heroSlider.contains(event.relatedTarget)) {

                startSlider();

            }

        });


        // ------------------------------------------
        // PAUSE WHEN BROWSER TAB IS INACTIVE
        // ------------------------------------------

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {

                stopSlider();

            } else {

                startSlider();

            }

        });


        // ------------------------------------------
        // INITIALIZE SLIDER
        // ------------------------------------------

        showSlide(0);

        startSlider();

    }

});
