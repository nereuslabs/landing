(function () {
    "use strict";

    /* —— Mobile menu toggle —— */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !expanded);
            nav.style.display = expanded ? "none" : "flex";
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                nav.style.display = "";
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* —— Smooth scroll for anchor links —— */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* —— Toast notification —— */
    const toast = document.getElementById("toast");

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message || toast.textContent;
        toast.classList.add("toast--show");
        setTimeout(() => toast.classList.remove("toast--show"), 3000);
    }

    /* —— Notify form (stub without backend) —— */
    const form = document.getElementById("notify-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = this.querySelector("input[name='email']");
            if (input && input.value.trim()) {
                showToast("Спасибо! Мы свяжемся с вами, когда Nereus станет доступен.");
                this.reset();
            }
        });
    }

    /* —— Reveal on scroll —— */
    const revealElements = document.querySelectorAll(
        ".agent-node, .feature, .step, .chat-preview, .notify, .hero__badge"
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal--visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => {
        el.classList.add("reveal");
        revealObserver.observe(el);
    });
})();
