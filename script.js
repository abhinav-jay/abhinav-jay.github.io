
const menuToggle = document.getElementById("menu-toggle");
const navContent = document.getElementById("nav-content");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// ---------- Mobile navigation ----------

function closeMenu() {
	navContent.classList.remove("open");
	menuToggle.classList.remove("active");
	menuToggle.setAttribute("aria-expanded", "false");
	menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
	const isOpen = navContent.classList.toggle("open");

	menuToggle.classList.toggle("active", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute(
		"aria-label",
		isOpen ? "Close navigation menu" : "Open navigation menu"
	);
});

navContent.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", closeMenu);
});

// Close the mobile menu with Escape.
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeMenu();
		menuToggle.focus();
	}
});

// ---------- Theme switch ----------

function applyTheme(theme) {
	const isLight = theme === "light";

	document.body.classList.toggle("light-theme", isLight);
	themeIcon.textContent = isLight ? "☾" : "☀";

	themeToggle.setAttribute(
		"aria-label",
		isLight ? "Switch to dark theme" : "Switch to light theme"
	);

	document
		.querySelector('meta[name="theme-color"]')
		.setAttribute("content", isLight ? "#f7f8fc" : "#0b1020");
}

// Restore saved preference, or use the system preference.
let savedTheme = null;

try {
	savedTheme = localStorage.getItem("portfolio-theme");
} catch {
	// Storage may be unavailable; use the system preference.
}

const initialTheme =
	savedTheme === "light" || savedTheme === "dark"
	? savedTheme
	: window.matchMedia("(prefers-color-scheme: light)").matches
	? "light"
	: "dark";

applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {
	const nextTheme = document.body.classList.contains("light-theme")
		? "dark"
		: "light";

	applyTheme(nextTheme);

	try {
		localStorage.setItem("portfolio-theme", nextTheme);
	} catch {
		// Theme still works for the current page session.
	}
});

// Close mobile navigation if the window is resized to desktop.
window.addEventListener("resize", () => {
	if (window.innerWidth > 850) {
		closeMenu();
	}
});

const homepage = document.querySelector(".homepage");
const follower = document.querySelector(".follower");

let isInside = false;
let lastX = 0;
let lastY = 0;

function updateFollower() {
  const rect = homepage.getBoundingClientRect();

  const inside =
    lastX >= rect.left &&
    lastX <= rect.right &&
    lastY >= rect.top &&
    lastY <= rect.bottom;

  if (inside) {
    isInside = true;
    follower.style.position = "fixed";
    follower.style.left = `${lastX}px`;
    follower.style.top = `${lastY}px`;
  } else if (isInside) {
    isInside = false;

    const pos = follower.getBoundingClientRect();

    follower.style.position = "absolute";
    follower.style.left = `${pos.left + window.scrollX}px`;
    follower.style.top = `${pos.top + window.scrollY}px`;
  }
}

document.addEventListener("mousemove", (e) => {
  lastX = e.clientX;
  lastY = e.clientY;
  updateFollower();
});

window.addEventListener("scroll", updateFollower, { passive: true });
