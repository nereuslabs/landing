(function () {
    "use strict";

    /* ===== Mobile Menu Toggle ===== */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !expanded);
            nav.classList.toggle("open", !expanded);
        });

        nav.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                menuToggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("open");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ===== Smooth Scroll ===== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* ===== Toast Notification ===== */
    const toast = document.getElementById("toast");

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message || toast.textContent;
        toast.classList.add("toast--show");
        setTimeout(() => toast.classList.remove("toast--show"), 3500);
    }

    /* ===== Notify Form Handler ===== */
    const form = document.getElementById("notify-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const input = this.querySelector("input[name='email']");
            if (input && input.value.trim()) {
                showToast("Спасибо за интерес к Nereus! Доступ будет отправлен.");

                const ctaBlock = this.closest(".cta-block");
                if (ctaBlock) {
                    const thanks = document.createElement("div");
                    thanks.className = "cta__thanks";
                    thanks.innerHTML =
                        '<h3 class="cta__thanks-text">✓ Запрос зарегистрирован!</h3>' +
                        '<p class="cta__thanks-sub">Мы свяжемся с вами по контакту ' +
                        input.value.trim() + ' при открытии бета-теста.</p>';

                    const title = ctaBlock.querySelector(".cta__title");
                    const text = ctaBlock.querySelector(".cta__text");
                    const hint = ctaBlock.querySelector(".cta__hint");

                    if (title) title.style.display = "none";
                    if (text) text.style.display = "none";
                    if (hint) hint.style.display = "none";

                    this.style.display = "none";
                    ctaBlock.appendChild(thanks);
                }
            }
        });
    }

    /* ===== FAQ Accordion ===== */
    const faqButtons = document.querySelectorAll(".faq-button");
    faqButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const expanded = this.getAttribute("aria-expanded") === "true";

            faqButtons.forEach((otherBtn) => {
                if (otherBtn !== this) {
                    otherBtn.setAttribute("aria-expanded", "false");
                    const otherContent = otherBtn.nextElementSibling;
                    if (otherContent) otherContent.classList.remove("faq-content--open");
                }
            });

            this.setAttribute("aria-expanded", !expanded);
            const content = this.nextElementSibling;
            if (content && content.classList.contains("faq-content")) {
                content.classList.toggle("faq-content--open", !expanded);
            }
        });
    });

    /* ===== Command Palette Modal (Cmd+K) ===== */
    const cmdModal = document.getElementById("cmd-modal");
    const cmdBtn = document.getElementById("cmd-k-btn");
    const cmdInput = document.getElementById("cmd-input");
    const cmdList = document.getElementById("cmd-list");

    function openCmdModal() {
        if (!cmdModal) return;
        cmdModal.classList.add("cmd-modal--open");
        cmdModal.setAttribute("aria-hidden", "false");
        if (cmdInput) {
            cmdInput.value = "";
            cmdInput.focus();
            filterCmdItems("");
        }
    }

    function closeCmdModal() {
        if (!cmdModal) return;
        cmdModal.classList.remove("cmd-modal--open");
        cmdModal.setAttribute("aria-hidden", "true");
    }

    if (cmdBtn) {
        cmdBtn.addEventListener("click", openCmdModal);
    }

    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (cmdModal && cmdModal.classList.contains("cmd-modal--open")) {
                closeCmdModal();
            } else {
                openCmdModal();
            }
        }
        if (e.key === "Escape" && cmdModal && cmdModal.classList.contains("cmd-modal--open")) {
            closeCmdModal();
        }
    });

    if (cmdModal) {
        cmdModal.addEventListener("click", (e) => {
            if (e.target === cmdModal) closeCmdModal();
        });
    }

    function filterCmdItems(query) {
        if (!cmdList) return;
        const items = cmdList.querySelectorAll(".cmd-item");
        const q = query.toLowerCase().trim();

        items.forEach((item) => {
            const text = item.innerText.toLowerCase();
            if (!q || text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener("input", (e) => filterCmdItems(e.target.value));
    }

    if (cmdList) {
        cmdList.addEventListener("click", (e) => {
            const item = e.target.closest(".cmd-item");
            if (!item) return;

            const action = item.getAttribute("data-action");
            const target = item.getAttribute("data-target");

            closeCmdModal();

            if (action === "goto" && target) {
                const targetEl = document.querySelector(target);
                if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    /* ===== Canvas Agent Graph Visualization ===== */
    const agentCanvas = document.getElementById("agent-canvas");

    if (agentCanvas) {
        const ctx = agentCanvas.getContext("2d");
        let animFrameId = null;
        let nodes = [];
        let edges = [];
        let mouseX = 0;
        let mouseY = 0;
        let canvasW = 0;
        let canvasH = 0;

        function resizeCanvas() {
            const wrap = agentCanvas.parentElement;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvasW = rect.width;
            canvasH = rect.height;
            agentCanvas.width = canvasW * dpr;
            agentCanvas.height = canvasH * dpr;
            agentCanvas.style.width = canvasW + "px";
            agentCanvas.style.height = canvasH + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function initNodes() {
            const cx = canvasW / 2;
            const cy = canvasH / 2;
            const r = Math.min(canvasW, canvasH) * 0.32;

            nodes = [
                { x: cx, y: cy - r * 0.7, label: "Coach", color: "#8b5cf6", radius: 22, pulse: 0 },
                { x: cx - r * 0.85, y: cy + r * 0.15, label: "Tutor", color: "#06b6d4", radius: 22, pulse: 0 },
                { x: cx + r * 0.85, y: cy + r * 0.15, label: "Examiner", color: "#f59e0b", radius: 22, pulse: 0 },
            ];

            edges = [
                { from: 0, to: 1, color: "#8b5cf6" },
                { from: 1, to: 2, color: "#06b6d4" },
                { from: 2, to: 0, color: "#f59e0b" },
            ];
        }

        function drawFrame(time) {
            ctx.clearRect(0, 0, canvasW, canvasH);

            const t = time * 0.001;

            /* Draw edges with animated particles */
            edges.forEach((edge, i) => {
                const from = nodes[edge.from];
                const to = nodes[edge.to];

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.strokeStyle = edge.color + "30";
                ctx.lineWidth = 1.5;
                ctx.stroke();

                /* Animated particle along edge */
                const progress = ((t * 0.4 + i * 0.33) % 1);
                const px = from.x + (to.x - from.x) * progress;
                const py = from.y + (to.y - from.y) * progress;

                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = edge.color + "aa";
                ctx.fill();

                /* Glow */
                ctx.beginPath();
                ctx.arc(px, py, 8, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
                grad.addColorStop(0, edge.color + "40");
                grad.addColorStop(1, edge.color + "00");
                ctx.fillStyle = grad;
                ctx.fill();
            });

            /* Draw nodes */
            nodes.forEach((node, i) => {
                node.pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.1);

                /* Outer glow */
                const glowR = node.radius + 12 + node.pulse * 6;
                ctx.beginPath();
                ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
                const glowGrad = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, glowR);
                glowGrad.addColorStop(0, node.color + "25");
                glowGrad.addColorStop(1, node.color + "00");
                ctx.fillStyle = glowGrad;
                ctx.fill();

                /* Node circle */
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#0e1015";
                ctx.fill();
                ctx.strokeStyle = node.color + "80";
                ctx.lineWidth = 2;
                ctx.stroke();

                /* Inner bright ring */
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius - 4, 0, Math.PI * 2);
                ctx.strokeStyle = node.color + "40";
                ctx.lineWidth = 1;
                ctx.stroke();

                /* Label */
                ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = "#f8fafc";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(node.label, node.x, node.y);
            });

            /* Mouse proximity interaction */
            const dx = mouseX - nodes[0].x;
            const dy = mouseY - nodes[0].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200;
                nodes.forEach((node) => {
                    node.x += dx * force * 0.02;
                    node.y += dy * force * 0.02;
                });
            }

            animFrameId = requestAnimationFrame(drawFrame);
        }

        function startCanvas() {
            resizeCanvas();
            initNodes();
            animFrameId = requestAnimationFrame(drawFrame);
        }

        function stopCanvas() {
            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        }

        agentCanvas.addEventListener("mousemove", (e) => {
            const rect = agentCanvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        agentCanvas.addEventListener("mouseleave", () => {
            mouseX = canvasW / 2;
            mouseY = canvasH / 2;
        });

        window.addEventListener("resize", () => {
            resizeCanvas();
            initNodes();
        });

        /* Start canvas animation when hero is visible */
        const heroSection = document.querySelector(".hero");
        if (heroSection) {
            const heroObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            startCanvas();
                            heroObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            heroObserver.observe(heroSection);
        }
    }

    /* ===== Staggered Scroll Reveal ===== */
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.revealDelay || "0", 10);

                    if (delay > 0) {
                        setTimeout(() => {
                            el.classList.add("reveal--visible");
                        }, delay);
                    } else {
                        el.classList.add("reveal--visible");
                    }

                    revealObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });

    /* Auto-assign staggered delays to children of containers with .reveal-stagger */
    document.querySelectorAll(".reveal-stagger").forEach((container) => {
        const children = container.querySelectorAll(":scope > .reveal");
        children.forEach((child, i) => {
            child.dataset.revealDelay = String((i + 1) * 80);
        });
    });
})();