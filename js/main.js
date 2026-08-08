(function () {
    "use strict";

    /* ===== OS Detection for Shortcut Badges ===== */
    function detectOS() {
        const userAgent = window.navigator.userAgent || "";
        const platform = window.navigator.platform || "";
        const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K", "macOS"];
        
        if (macosPlatforms.indexOf(platform) !== -1 || /Mac|iPhone|iPod|iPad/i.test(userAgent)) {
            return "mac";
        }
        return "other";
    }

    const isMac = detectOS() === "mac";
    const osShortcutText = isMac ? "⌘K" : "Ctrl+K";

    // Update shortcut badges on load
    document.addEventListener("DOMContentLoaded", () => {
        const badgeEl = document.getElementById("cmd-k-shortcut");
        if (badgeEl) {
            badgeEl.textContent = osShortcutText;
        }
    });

    /* ===== Sticky Header Scroll Effect ===== */
    const siteHeader = document.getElementById("site-header");
    if (siteHeader) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) {
                siteHeader.classList.add("scrolled");
            } else {
                siteHeader.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    /* ===== Draggable Header (Swipe Up to Hide / Down to Show) ===== */
    (function initDraggableHeader() {
        const header = document.getElementById("site-header");
        const handle = document.getElementById("header-drag-handle");
        if (!header || !handle) return;

        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        let isHidden = false;
        const THRESHOLD = 60;

        function onStart(e) {
            const touch = e.touches ? e.touches[0] : e;
            startY = touch.clientY;
            currentY = startY;
            isDragging = true;
            header.classList.add("header--dragging");
        }

        function onMove(e) {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            currentY = touch.clientY;
            const delta = currentY - startY;

            if (!isHidden && delta < 0) {
                const translateY = Math.max(delta, -header.offsetHeight);
                header.style.transform = "translateY(" + translateY + "px)";
            } else if (isHidden && delta > 0) {
                const translateY = Math.min(delta - header.offsetHeight, 0);
                header.style.transform = "translateY(" + translateY + "px)";
            }
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;
            header.classList.remove("header--dragging");

            const delta = currentY - startY;

            if (!isHidden && delta < -THRESHOLD) {
                header.classList.add("header--hidden");
                header.style.transform = "";
                isHidden = true;
            } else if (isHidden && delta > THRESHOLD) {
                header.classList.remove("header--hidden");
                header.style.transform = "";
                isHidden = false;
            } else {
                header.style.transform = "";
            }
        }

        handle.addEventListener("touchstart", onStart, { passive: true });
        handle.addEventListener("touchmove", onMove, { passive: true });
        handle.addEventListener("touchend", onEnd, { passive: true });

        handle.addEventListener("mousedown", onStart);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onEnd);
    })();

    /* ===== Mobile Menu Toggle ===== */
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const expanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !expanded);
            nav.classList.toggle("open", !expanded);
            document.body.style.overflow = !expanded ? "hidden" : "";
        });

        nav.addEventListener("click", (e) => {
            if (e.target.tagName === "A" || e.target.closest("a")) {
                menuToggle.setAttribute("aria-expanded", "false");
                nav.classList.remove("open");
                document.body.style.overflow = "";
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 768) {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.style.overflow = "";
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
        setTimeout(() => toast.classList.remove("toast--show"), 4000);
    }

    /* ===== Form Handler & Email Validation ===== */
    const form = document.getElementById("notify-form");
    const emailInput = document.getElementById("cta-email");
    const emailError = document.getElementById("email-error");

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }

    if (form && emailInput) {
        emailInput.addEventListener("input", () => {
            emailInput.classList.remove("is-invalid");
            if (emailError) emailError.textContent = "";
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const val = emailInput.value.trim();

            if (!val || !validateEmail(val)) {
                emailInput.classList.add("is-invalid");
                if (emailError) emailError.textContent = "Пожалуйста, введите корректный e-mail адрес.";
                emailInput.focus();
                return;
            }

            showToast("Спасибо за интерес к Nereus! Доступ будет выслан на " + val);

            const ctaBlock = this.closest(".cta-block");
            if (ctaBlock) {
                const thanks = document.createElement("div");
                thanks.className = "cta__thanks";
                thanks.innerHTML =
                    '<h3 class="cta__thanks-text">✓ Заявка зарегистрирована!</h3>' +
                    '<p class="cta__thanks-sub">Приглашение в тестирование выслано на <strong>' +
                    escapeHtml(val) +
                    '</strong>.</p>';

                const title = ctaBlock.querySelector(".cta__title");
                const text = ctaBlock.querySelector(".cta__text");
                const links = ctaBlock.querySelector(".cta__links");

                if (title) title.style.display = "none";
                if (text) text.style.display = "none";
                if (links) links.style.display = "none";

                this.style.display = "none";
                ctaBlock.appendChild(thanks);
            }
        });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (m) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[m];
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

    /* ===== Command Palette Modal (Cmd+K / Ctrl+K) ===== */
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
        // Support OS-specific command shortcut (Cmd+K on Mac, Ctrl+K on Windows/Linux)
        const isTriggerKey = isMac ? e.metaKey : e.ctrlKey;
        if (isTriggerKey && e.key.toLowerCase() === "k") {
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
            } else if (action === "sim") {
                triggerSimulationPulse();
            }
        });
    }

    function triggerSimulationPulse() {
        if (window.nereusGraphPulse) {
            window.nereusGraphPulse();
        }
        showToast("Импульс графа агентов активирован!");
        const graphDemo = document.getElementById("graph-demo");
        if (graphDemo) {
            graphDemo.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    /* ===== Live GitHub Issues Roadmap Fetcher ===== */
    async function fetchGitHubRoadmap() {
        const timelineContainer = document.getElementById("github-timeline");
        if (!timelineContainer) return;

        try {
            const res = await fetch("https://api.github.com/repos/nereuslabs/Nereus/issues?state=all&per_page=30");
            if (!res.ok) throw new Error("GitHub API status " + res.status);

            const data = await res.json();
            const issues = data.filter(item => !item.pull_request);
            if (!issues || issues.length === 0) return;

            timelineContainer.innerHTML = "";

            // i18n helpers
            function tr(key) {
                return (window.nereusI18n && window.nereusI18n.t)
                    ? window.nereusI18n.t(key)
                    : "";
            }

            // Split into completed (closed) and active (open)
            const completed = issues
                .filter(i => i.state === "closed")
                .sort((a, b) => b.number - a.number);
            const active = issues
                .filter(i => i.state === "open")
                .sort((a, b) => a.number - b.number);

            const ITEMS_PER_PAGE = 3;

            function createIssueItem(issue, isClosed) {
                const statusClass = isClosed ? "status--done" : "status--active";
                const statusKey = isClosed ? "roadmap.status.done" : "roadmap.status.active";
                const dotClass = isClosed ? "timeline__dot--done" : "timeline__dot--active";
                const dotSymbol = isClosed ? "✓" : "●";

                const itemEl = document.createElement("div");
                itemEl.className = "timeline__item reveal reveal--visible";
                itemEl.innerHTML = `
                    <div class="timeline__dot ${dotClass}">${dotSymbol}</div>
                    <div class="timeline__content">
                        <h3 class="timeline__title">
                            <a href="${issue.html_url}" target="_blank" rel="noopener">${escapeHtml(issue.title)}</a>
                        </h3>
                        <span class="timeline__status ${statusClass}">${tr(statusKey)}</span>
                    </div>
                `;
                return itemEl;
            }

            function renderGroup(titleKey, groupIssues, isClosed) {
                if (groupIssues.length === 0) return;

                const groupEl = document.createElement("div");
                groupEl.className = "timeline__group";

                const groupTitle = document.createElement("div");
                groupTitle.className = "timeline__group-title";
                groupTitle.textContent = tr(titleKey);
                groupEl.appendChild(groupTitle);

                const itemsContainer = document.createElement("div");
                itemsContainer.className = "timeline__group-items";
                groupIssues.forEach((issue) => {
                    itemsContainer.appendChild(createIssueItem(issue, isClosed));
                });
                groupEl.appendChild(itemsContainer);

                const allItems = itemsContainer.querySelectorAll(".timeline__item");
                if (groupIssues.length > ITEMS_PER_PAGE) {
                    allItems.forEach((item, i) => {
                        if (i >= ITEMS_PER_PAGE) item.classList.add("timeline__item--hidden");
                    });

                    const moreBtn = document.createElement("button");
                    moreBtn.className = "timeline__more-btn";
                    moreBtn.type = "button";
                    moreBtn.textContent = tr("roadmap.more");
                    moreBtn.addEventListener("click", () => {
                        allItems.forEach((item) => item.classList.remove("timeline__item--hidden"));
                        moreBtn.style.display = "none";
                    });
                    groupEl.appendChild(moreBtn);
                }

                timelineContainer.appendChild(groupEl);
            }

            renderGroup("roadmap.completed", completed, true);
            renderGroup("roadmap.active", active, false);
        } catch (err) {
            console.warn("GitHub Issues fetch active fallback:", err);
        }
    }

    fetchGitHubRoadmap();

    // Expose for i18n language switching
    window.nereusRefreshRoadmap = fetchGitHubRoadmap;

    /* ===== Canvas Graph Visualizer (Hero only) ===== */
    function createGraphCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animFrameId = null;
        let nodes = [];
        let edges = [];
        let pulseActive = false;
        let mouseX = -1000;
        let mouseY = -1000;
        let canvasW = 0;
        let canvasH = 0;

        function resizeCanvas() {
            const wrap = canvas.parentElement;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvasW = rect.width;
            canvasH = rect.height;
            canvas.width = canvasW * dpr;
            canvas.height = canvasH * dpr;
            canvas.style.width = canvasW + "px";
            canvas.style.height = canvasH + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function initNodes() {
            const cx = canvasW / 2;
            const cy = canvasH / 2;
            const r = Math.min(canvasW, canvasH) * 0.32;
            const nodeRadius = 48;

            nodes = [
                { id: 0, x: cx, y: cy - r * 0.65, label: "Coach", sub: "coaching", color: "#88BDF2", radius: nodeRadius, glow: 0 },
                { id: 1, x: cx - r * 0.82, y: cy + r * 0.3, label: "Tutor", sub: "learning", color: "#BDDDFC", radius: nodeRadius, glow: 0 },
                { id: 2, x: cx + r * 0.82, y: cy + r * 0.3, label: "Examiner", sub: "examining", color: "#88BDF2", radius: nodeRadius, glow: 0 },
            ];

            edges = [
                { from: 0, to: 1, label: "Plan", color: "#88BDF2" },
                { from: 1, to: 2, label: "RAG Context", color: "#BDDDFC" },
                { from: 2, to: 0, label: "Route", color: "#88BDF2" },
            ];
        }

        function drawFrame(time) {
            ctx.clearRect(0, 0, canvasW, canvasH);
            const t = time * 0.001;

            edges.forEach((edge, i) => {
                const from = nodes[edge.from];
                const to = nodes[edge.to];

                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.strokeStyle = "rgba(106, 137, 167, 0.4)";
                ctx.lineWidth = 2;
                ctx.stroke();

                const speed = pulseActive ? 1.2 : 0.45;
                const progress = ((t * speed + i * 0.33) % 1);
                const px = from.x + (to.x - from.x) * progress;
                const py = from.y + (to.y - from.y) * progress;

                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#BDDDFC";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(px, py, 12, 0, Math.PI * 2);
                const pGrad = ctx.createRadialGradient(px, py, 0, px, py, 12);
                pGrad.addColorStop(0, "rgba(189, 221, 252, 0.6)");
                pGrad.addColorStop(1, "rgba(189, 221, 252, 0)");
                ctx.fillStyle = pGrad;
                ctx.fill();
            });

            nodes.forEach((node, i) => {
                const pulse = 0.5 + 0.5 * Math.sin(t * 2.5 + i * 2.1);
                const activeGlow = node.glow > 0 ? node.glow : 0;
                const glowR = node.radius + 14 + pulse * 6 + activeGlow * 16;

                ctx.beginPath();
                ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
                const glowGrad = ctx.createRadialGradient(node.x, node.y, node.radius * 0.5, node.x, node.y, glowR);
                glowGrad.addColorStop(0, "rgba(136, 189, 242, 0.35)");
                glowGrad.addColorStop(1, "rgba(136, 189, 242, 0)");
                ctx.fillStyle = glowGrad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#293644";
                ctx.fill();
                ctx.strokeStyle = "#88BDF2";
                ctx.lineWidth = 2.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius - 5, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(189, 221, 252, 0.3)";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(node.label, node.x, node.y - 6);

                ctx.font = '500 10px "JetBrains Mono", monospace';
                ctx.fillStyle = "#BDDDFC";
                ctx.fillText(node.sub, node.x, node.y + 10);

                if (node.glow > 0) {
                    node.glow -= 0.02;
                }
            });

            animFrameId = requestAnimationFrame(drawFrame);
        }

        function startCanvas() {
            if (animFrameId) return;
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

        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            nodes.forEach((node) => {
                const dx = mouseX - node.x;
                const dy = mouseY - node.y;
                if (Math.sqrt(dx * dx + dy * dy) < node.radius + 15) {
                    node.glow = 1.2;
                }
            });
        });

        window.addEventListener("resize", () => {
            resizeCanvas();
            initNodes();
        });

        const section = canvas.closest("section");
        if (section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startCanvas();
                    } else {
                        stopCanvas();
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(section);
        } else {
            startCanvas();
        }
    }

    createGraphCanvas("agent-canvas");

    /* ===== Interactive Chat Demo ===== */
    (function initChatDemo() {
        const chatMessages = document.getElementById("chat-messages");
        const chatTyping = document.getElementById("chat-typing");
        const startOverlay = document.getElementById("chat-start-overlay");
        const startBtn = document.getElementById("chat-start-btn");
        if (!chatMessages) return;

        const conversation = [
            { role: "user", agent: null, text: "Объясни мне, пожалуйста, что такое замыкания в JavaScript и зачем они нужны?" },
            { role: "agent", agent: "Агент-Тренер", role: "coaching", text: "Хороший вопрос! Сначала давай убедимся, что ты понимаешь область видимости функций. Знаешь ли ты, что такое область видимости (scope)?" },
            { role: "user", agent: null, text: "Да, это где переменные доступны. Глобальная и локальная в функциях." },
            { role: "agent", agent: "Агент-Тренер", role: "coaching", text: "Отлично! Теперь передаю контекст Агенту-Репетитору для углублённого объяснения." },
            { role: "agent", agent: "Агент-Репетитор", role: "learning", text: "Замыкание (closure) — это когда функция «запоминает» переменные из внешней области видимости, даже после того, как внешняя функция завершилась. Например:\n\n<code>function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2</code>" },
            { role: "user", agent: null, text: "Понял! А count не удаляется, потому что внутренняя функция на него ссылается?" },
            { role: "agent", agent: "Агент-Репетитор", role: "learning", text: "Именно так! Внутренняя функция поддерживает ссылку на переменную count через замыкание. Это ключевой механизм для инкапсуляции состояния в JavaScript." },
            { role: "agent", agent: "Агент-Экзаменатор", role: "examining", text: "Проверочная задача: Напиши функцию createMultiplier(n), которая возвращает новую функцию, умножающую аргумент на n. Используй замыкание." },
            { role: "user", agent: null, text: "function createMultiplier(n) {\n  return (x) => x * n;\n}\nconst double = createMultiplier(2);\ndouble(5); // 10" },
            { role: "agent", agent: "Агент-Экзаменатор", role: "examining", text: "Верно! Отличное понимание замыканий. Оценка: A. Рекомендую изучить следующую тему — IIFE и модульный паттерн." },
        ];

        let currentMsg = 0;
        let isPlaying = false;
        let cancelFlag = false;

        function addMessage(msg) {
            const div = document.createElement("div");
            div.className = "chat-msg chat-msg--" + (msg.role === "user" ? "user" : "agent");

            const avatar = document.createElement("div");
            avatar.className = "chat-msg__avatar";
            avatar.textContent = msg.role === "user" ? "U" : msg.agent.charAt(0);

            const content = document.createElement("div");

            if (msg.role === "agent") {
                const tag = document.createElement("div");
                tag.className = "chat-msg__agent-tag";
                tag.textContent = msg.agent + " · " + msg.role;
                content.appendChild(tag);
            }

            const bubble = document.createElement("div");
            bubble.className = "chat-msg__bubble";
            bubble.innerHTML = msg.text.replace(/\n/g, "<br>").replace(/<code>([\s\S]*?)<\/code>/g, '<pre style="background:rgba(0,0,0,0.3);padding:0.5rem;border-radius:0.375rem;margin:0.4rem 0;font-size:0.8rem;overflow-x:auto;color:#BDDDFC">$1</pre>');

            const meta = document.createElement("div");
            meta.className = "chat-msg__meta";
            meta.textContent = msg.role === "user" ? "Student" : msg.agent;
            if (msg.role === "agent") meta.textContent += " · " + msg.role;

            content.appendChild(bubble);
            content.appendChild(meta);

            div.appendChild(avatar);
            div.appendChild(content);

            chatMessages.appendChild(div);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    div.classList.add("visible");
                });
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping(show) {
            if (chatTyping) chatTyping.classList.toggle("active", show);
        }

        function playConversation() {
            if (isPlaying) return;
            isPlaying = true;
            cancelFlag = false;
            currentMsg = 0;
            chatMessages.innerHTML = "";
            showTyping(false);

            function showNext() {
                if (cancelFlag || currentMsg >= conversation.length) {
                    isPlaying = false;
                    showTyping(false);
                    return;
                }

                const msg = conversation[currentMsg];
                const delay = msg.role === "user" ? 800 : 1400;

                showTyping(true);

                setTimeout(() => {
                    if (cancelFlag) { isPlaying = false; showTyping(false); return; }
                    showTyping(false);
                    addMessage(msg);
                    currentMsg++;
                    setTimeout(showNext, 600);
                }, delay);
            }

            showNext();
        }

        if (startBtn) {
            startBtn.addEventListener("click", () => {
                if (startOverlay) startOverlay.classList.add("chat-box__start-overlay--hidden");
                playConversation();
            });
        }
    })();

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

    document.querySelectorAll(".reveal-stagger").forEach((container) => {
        const children = container.querySelectorAll(":scope > .reveal");
        children.forEach((child, i) => {
            child.dataset.revealDelay = String((i + 1) * 80);
        });
    });
})();
