/* =================================
   MAIN.JS - vanilla JavaScript only
================================= */

(function () {
    "use strict";

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (selector, scope) => (scope || document).querySelector(selector);
    const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

    /* ---------- Typing animation ---------- */
    const typingElement = $("#typing");
    const messages = [
        "Passionate About Technology",
        "Learning and Building Projects",
        "Aspiring Software Developer"
    ];

    if (typingElement) {
        let messageIndex = 0;
        let characterIndex = 0;
        let deleting = false;

        const typeEffect = function () {
            const current = messages[messageIndex];
            characterIndex += deleting ? -1 : 1;
            typingElement.textContent = current.substring(0, characterIndex);

            let speed = deleting ? 40 : 80;

            if (!deleting && characterIndex === current.length) {
                deleting = true;
                speed = 1500;
            } else if (deleting && characterIndex === 0) {
                deleting = false;
                messageIndex = (messageIndex + 1) % messages.length;
                speed = 400;
            }
            setTimeout(typeEffect, speed);
        };

        if (reduceMotion) {
            typingElement.textContent = messages[0];
        } else {
            typeEffect();
        }
    }

    /* ---------- Theme toggle (remembers choice) ---------- */
    const themeToggle = $("#themeToggle");
    const themeMeta = $('meta[name="theme-color"]');

    const syncTheme = function () {
        const isLight = root.getAttribute("data-theme") === "light";
        if (themeToggle) {
            themeToggle.textContent = isLight ? "☾" : "☀";
            themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
        }
        if (themeMeta) {
            themeMeta.setAttribute("content", getComputedStyle(root).getPropertyValue("--bg-primary").trim());
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            root.setAttribute("data-theme", next);
            try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
            syncTheme();
        });
    }
    syncTheme();

    /* ---------- Navbar: scroll state, mobile menu, active link ---------- */
    const navbar = $("#navbar");
    const menuToggle = $("#menuToggle");
    const navMenu = $("#navMenu");

    window.addEventListener("scroll", function () {
        if (navbar) { navbar.classList.toggle("scrolled", window.scrollY > 20); }
    }, { passive: true });

    const setMenu = function (open) {
        if (!menuToggle || !navMenu) return;
        navMenu.classList.toggle("active", open);
        menuToggle.textContent = open ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", String(open));
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            setMenu(!navMenu.classList.contains("active"));
        });
        $$("a", navMenu).forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });
        document.addEventListener("click", function (event) {
            if (!navbar.contains(event.target)) { setMenu(false); }
        });
    }

    if ("IntersectionObserver" in window) {
        const links = $$("a", navMenu);
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        $$("main > section[id]").forEach(function (section) { sectionObserver.observe(section); });
    }

    /* ---------- Scroll reveal (staggered) ---------- */
    const revealElements = $$(".reveal");

    revealElements.forEach(function (element) {
        const index = Array.from(element.parentElement.children).indexOf(element);
        element.style.setProperty("--delay", Math.min(index, 5) * 0.07 + "s");
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(function (element) { revealObserver.observe(element); });
    } else {
        revealElements.forEach(function (element) { element.classList.add("visible"); });
    }

    /* ---------- Cursor spotlight on cards ---------- */
    $$(".spot").forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", event.clientX - rect.left + "px");
            card.style.setProperty("--my", event.clientY - rect.top + "px");
        });
    });

    /* ---------- Timeline "Show more" ---------- */
    $$(".toggle-more").forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".timeline-card");
            const expanded = card.classList.toggle("expanded");
            button.textContent = expanded ? "Show less" : "Show more";
            button.setAttribute("aria-expanded", String(expanded));
        });
    });

    /* ---------- Family flip cards (tap / keyboard) ---------- */
    $$(".flip-card").forEach(function (card) {
        const flip = function () {
            const flipped = card.classList.toggle("flipped");
            card.setAttribute("aria-pressed", String(flipped));
        };
        card.addEventListener("click", flip);
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                flip();
            }
        });
    });

    /* ---------- Image fallback (shows a placeholder if a photo is missing) ---------- */
    $$(".media img").forEach(function (img) {
        const wrapper = img.closest(".media");
        const markEmpty = function () { wrapper.classList.add("is-empty"); };
        img.addEventListener("error", markEmpty);
        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) { markEmpty(); }
    });

    /* ---------- Lightbox (images + write-ups) ---------- */
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightboxImage");
    const lightboxMedia = $("#lightboxMedia");
    const lightboxTitle = $("#lightboxTitle");
    const lightboxText = $("#lightboxText");
    const lightboxClose = $("#lightboxClose");
    let lastFocused = null;

    const openLightbox = function (trigger) {
        const title = trigger.getAttribute("data-title") || "";
        const text = trigger.getAttribute("data-text") || "";

        lastFocused = trigger;
        lightboxMedia.classList.remove("is-empty");
        lightboxMedia.setAttribute("data-placeholder", title);
        lightboxImage.setAttribute("src", trigger.getAttribute("data-lightbox"));
        lightboxImage.setAttribute("alt", title || "Expanded view");
        lightboxTitle.textContent = title;
        lightboxText.textContent = text;
        lightboxText.hidden = !text;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        lightboxClose.focus();
    };

    const closeLightbox = function () {
        if (!lightbox.classList.contains("active")) return;
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.removeAttribute("src");
        document.body.classList.remove("no-scroll");
        if (lastFocused) { lastFocused.focus(); }
    };

    if (lightbox && lightboxImage) {
        $$("[data-lightbox]").forEach(function (item) {
            item.addEventListener("click", function () { openLightbox(item); });
        });
        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) { closeLightbox(); }
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") { closeLightbox(); }
            if (event.key === "Tab" && lightbox.classList.contains("active")) {
                event.preventDefault();
                lightboxClose.focus();
            }
        });
    }

    /* ---------- Footer year ---------- */
    const currentYear = $("#currentYear");
    if (currentYear) { currentYear.textContent = new Date().getFullYear(); }
})();