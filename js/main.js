/* ============================================
   Nereus Landing — Interactive Enhancements
   ============================================ */

(function () {
    "use strict";

    /* ---- Menu toggle (mobile) ---- */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !expanded);
            nav.style.display = expanded ? "none" : "flex";
        });

        // hide on resize
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                nav.style.display = "";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---- Smooth scroll offset for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ---- Toast notification ---- */
    const toast = document.getElementById("toast");
    if (toast) {
        window.showToast = function (message) {
            toast.textContent = message || toast.textContent;
            toast.classList.add("toast--show");
            setTimeout(() => toast.classList.remove("toast--show"), 3500);
        };
    }

    /* ---- Notify form (stub — no backend) ---- */
    const form = document.getElementById("notify-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = this.querySelector("input[name='email']");
            if (input && input.value.trim()) {
                if (typeof window.showToast === "function") {
                    window.showToast("Спасибо! Мы свяжемся с вами, когда Nereus станет доступен.");
                }
                this.reset();
            }
        });
    }

    /* ---- Coming soon subtle parallax on hero ---- */
    const hero = document.querySelector(".hero");
    if (hero) {
        let animationId = null;
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 10;

            if (!animationId) {
                animationId = requestAnimationFrame(() => {
                    hero.style.transform = `translate(${mouseX * 0.3}px, ${mouseY * 0.3}px)`;
                    animationId = null;
                });
            }
        });

        // Reset on mouse leave
        document.addEventListener("mouseleave", () => {
            hero.style.transform = "";
        });
    }

    /* ---- Animate elements on scroll (IntersectionObserver) ---- */
    const observerOptions = {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal--visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(
        ".card, .feature, .step, .agent-node, .code-block, .notify"
    ).forEach((el) => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });
})();
