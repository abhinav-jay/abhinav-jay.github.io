
document.addEventListener("DOMContentLoaded", () => {

	const nav = document.querySelector(".glass-nav");
	const indicator = document.querySelector(".nav-indicator");
	const navLinks = [...document.querySelectorAll(".nav-link")];

	if (!nav || !indicator || !navLinks.length) return;

	// Get all matching page sections
	const sections = navLinks
		.map(link => document.getElementById(link.dataset.section))
		.filter(Boolean);

	// Reduced motion preference
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)"
	);

	// Move the shared active indicator
	function updateIndicator(link) {
		if (!link) return;

		const navRect = nav.getBoundingClientRect();
		const linkRect = link.getBoundingClientRect();

		// Calculate position relative to navbar's padding box
		const x = linkRect.left - navRect.left - nav.clientLeft;
		const y = linkRect.top - navRect.top - nav.clientTop;

		indicator.style.width = `${linkRect.width}px`;
		indicator.style.height = `${linkRect.height}px`;

		indicator.style.transform = `translate(${x}px, ${y}px)`;
	}

	// Change active navigation item
	function setActiveSection(id) {

		let activeLink = null;

		navLinks.forEach(link => {

			const isActive = link.dataset.section === id;

			link.classList.toggle("active", isActive);

			if (isActive) {
				link.setAttribute("aria-current", "location");
				activeLink = link;
			} else {
				link.removeAttribute("aria-current");
			}

		});

		if (activeLink) {
			updateIndicator(activeLink);
		}
	}

	// Smooth scrolling when clicking navigation
	navLinks.forEach(link => {

		link.addEventListener("click", event => {

			const target = document.getElementById(
				link.dataset.section
			);

			if (!target) return;

			event.preventDefault();

			target.scrollIntoView({
				behavior: prefersReducedMotion.matches
				? "auto"
				: "smooth",
				block: "start"
			});

		});

	});

	// Observe visible sections
	const observer = new IntersectionObserver(entries => {

		const visibleSections = entries
			.filter(entry => entry.isIntersecting)
			.sort((a, b) =>
				b.intersectionRatio - a.intersectionRatio
			);

		if (visibleSections.length) {
			setActiveSection(visibleSections[0].target.id);
		}

	}, {
		rootMargin: "-20% 0px -40% 0px",
		threshold: [0, 0.2, 0.4, 0.6, 0.8]
	});

	sections.forEach(section => {
		observer.observe(section);
	});

	// Handle browser back and forward navigation
	window.addEventListener("hashchange", () => {

		const id = location.hash.slice(1);

		if (sections.some(section => section.id === id)) {
			setActiveSection(id);
		}

	});

	// Reposition indicator when window resizes
	window.addEventListener("resize", () => {

		const activeLink = nav.querySelector(".nav-link.active");

		updateIndicator(activeLink);

	});

	// Reposition when fonts finish loading
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(() => {
			const activeLink = nav.querySelector(".nav-link.active");
			updateIndicator(activeLink);
		});
	}

	// Initial active section
	const initialSection = location.hash.slice(1);

	if (sections.some(section => section.id === initialSection)) {
		setActiveSection(initialSection);
	} else {
		setActiveSection(sections[0]?.id);
	}

	// Ensure correct initial indicator position
	requestAnimationFrame(() => {
		const activeLink = nav.querySelector(".nav-link.active");
		updateIndicator(activeLink);
	});

});

