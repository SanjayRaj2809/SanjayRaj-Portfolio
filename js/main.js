
/* =================================
   TYPING ANIMATION
================================= */

const typingElement = document.getElementById("typing");

const messages = [
    "Passionate About Technology",
    "Learning and Building Projects",
    "Aspiring Software Developer"
];

let messageIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {

    if (!typingElement) return;

    const currentMessage = messages[messageIndex];

    if (deleting) {
        characterIndex--;
    } else {
        characterIndex++;
    }

    typingElement.textContent =
        currentMessage.substring(0, characterIndex);

    let speed = deleting ? 45 : 90;

    if (!deleting && characterIndex === currentMessage.length) {
        deleting = true;
        speed = 1400;
    }

    else if (deleting && characterIndex === 0) {
        deleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

if (typingElement) {
    typeEffect();
}


/* =================================
   NAVBAR SCROLL EFFECT
================================= */

const navbar = document.getElementById("navbar");

function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateNavbar);

updateNavbar();


/* =================================
   MOBILE NAVIGATION
================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", String(isOpen));

    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");

        });

    });
}


/* =================================
   DARK AND LIGHT THEME
================================= */

const themeToggle = document.getElementById("themeToggle");
const rootElement = document.documentElement;

function updateThemeButton() {

    if (!themeToggle) return;

    const currentTheme = rootElement.getAttribute("data-theme");

    themeToggle.textContent =
        currentTheme === "light" ? "☾" : "☀";

    themeToggle.setAttribute(
        "aria-label",
        currentTheme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
}

if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const currentTheme = rootElement.getAttribute("data-theme");

        if (currentTheme === "light") {
            rootElement.setAttribute("data-theme", "dark");
        } else {
            rootElement.setAttribute("data-theme", "light");
        }

        updateThemeButton();

    });

    updateThemeButton();
}


/* =================================
   SCROLL REVEAL ANIMATIONS
================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });

}


/* =================================
   IMAGE LIGHTBOX
================================= */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const lightboxItems = document.querySelectorAll("[data-lightbox]");

function openLightbox(imagePath) {

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = imagePath;

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeLightbox() {

    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.src = "";

    document.body.style.overflow = "";
}

lightboxItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const imagePath = item.getAttribute("data-lightbox");

        if (imagePath) {
            openLightbox(imagePath);
        }

    });

});

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeLightbox();
    }

});


/* =================================
   FOOTER CURRENT YEAR
================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
