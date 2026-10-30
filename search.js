
document.addEventListener("DOMContentLoaded", () => {

	const overlay = document.getElementById("searchOverlay");
	const trigger = document.getElementById("searchTrigger");
	const input = document.getElementById("searchInput");
	const resultsContainer = document.getElementById("searchResults");

	if (!overlay || !trigger || !input || !resultsContainer) return;

	const sections = [...document.querySelectorAll("section[id]")];

	let selectedIndex = 0;
	let currentResults = [];

	const icons = {
		home: `<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/></svg>`,
		about: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>`,
		education: `<svg viewBox="0 0 24 24"><path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
		projects: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 9h8M8 13h8M8 17h4"/></svg>`,
		interests: `<svg viewBox="0 0 24 24"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/></svg>`,
		contact: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`,
		default: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>`
	};

	// Get readable section title
	function getTitle(section) {
		return section.dataset.searchTitle ||
			section.querySelector("h1, h2, h3")?.textContent.trim() ||
			section.id.replace(/[-_]/g, " ").replace(/\b\w/g, char => char.toUpperCase());
	}

	// Get section description
	function getDescription(section) {
		const clone = section.cloneNode(true);

		clone.querySelectorAll("script, style, button, nav").forEach(el => el.remove());

		return clone.textContent
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 140);
	}

	// Build search index
	const searchIndex = sections.map(section => ({
		element: section,
		id: section.id,
		title: getTitle(section),
		description: getDescription(section),
		content: section.textContent.toLowerCase(),
		icon: icons[section.id] || icons.default
	}));

	// Open search
	function openSearch() {
		overlay.classList.add("open");
		document.body.style.overflow = "hidden";

		input.value = "";
		selectedIndex = 0;

		renderResults("");

		// Wait for the overlay to become visible
		setTimeout(() => {
			input.focus({ preventScroll: true });
		}, 300);
	}

	// Close search
	function closeSearch() {
		overlay.classList.remove("open");
		document.body.style.overflow = "";
		trigger.focus();
	}

	// Render search results
	function renderResults(query) {

		resultsContainer.innerHTML = "";
		selectedIndex = 0;

		const normalizedQuery = query.trim().toLowerCase();

		if (!normalizedQuery) {
			currentResults = searchIndex.slice(0, 6);
		} else {
			currentResults = searchIndex.filter(item => {
				return (
					item.title.toLowerCase().includes(normalizedQuery) ||
					item.description.toLowerCase().includes(normalizedQuery) ||
					item.content.includes(normalizedQuery) ||
					item.id.toLowerCase().includes(normalizedQuery)
				);
			});
		}

		if (!currentResults.length) {
			const empty = document.createElement("div");
			empty.className = "search-empty";
			empty.textContent = "No results found. Try another search.";
			resultsContainer.appendChild(empty);
			return;
		}

		currentResults.forEach((item, index) => {

			const button = document.createElement("button");
			button.type = "button";
			button.className = "search-result";

			button.innerHTML = `
		<div class="search-result-icon">
		    ${item.icon}
		</div>

		<div class="search-result-content">
		    <span class="search-result-title"></span>
		    <span class="search-result-description"></span>
		</div>
	    `;

			// Use textContent for page-derived text
			button.querySelector(".search-result-title").textContent = item.title;
			button.querySelector(".search-result-description").textContent =
				item.description || `Explore ${item.title}`;

			button.addEventListener("click", () => navigateTo(item));

			button.addEventListener("mouseenter", () => {
				selectedIndex = index;
				updateSelection();
			});

			resultsContainer.appendChild(button);
		});

		updateSelection();
	}

	// Highlight selected result
	function updateSelection() {
		const buttons = resultsContainer.querySelectorAll(".search-result");

		buttons.forEach((button, index) => {
			button.classList.toggle("selected", index === selectedIndex);
		});

		buttons[selectedIndex]?.scrollIntoView({
			block: "nearest"
		});
	}

	// Navigate to selected section
	function navigateTo(item) {

		closeSearch();

		history.pushState(null, "", `#${item.id}`);

		item.element.scrollIntoView({
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
			? "auto"
			: "smooth",
			block: "start"
		});

	}

	// Search as user types
	input.addEventListener("input", () => {
		renderResults(input.value);
	});

	// Keyboard navigation inside search
	input.addEventListener("keydown", event => {

		if (event.key === "ArrowDown") {
			event.preventDefault();

			selectedIndex = Math.min(
				selectedIndex + 1,
				currentResults.length - 1
			);

			updateSelection();
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();

			selectedIndex = Math.max(selectedIndex - 1, 0);

			updateSelection();
		}

		if (event.key === "Enter") {
			event.preventDefault();

			if (currentResults[selectedIndex]) {
				navigateTo(currentResults[selectedIndex]);
			}
		}

	});

	// Trigger button
	trigger.addEventListener("click", openSearch);

	// Click outside modal to close
	overlay.addEventListener("click", event => {
		if (event.target === overlay) {
			closeSearch();
		}
	});

	// Global keyboard shortcuts
	document.addEventListener("keydown", event => {

		const isShortcut = (event.ctrlKey || event.metaKey) &&
			event.key.toLowerCase() === "k";

		if (isShortcut) {
			event.preventDefault();

			if (overlay.classList.contains("open")) {
				closeSearch();
			} else {
				openSearch();
			}
		}

		if (event.key === "Escape" &&
			overlay.classList.contains("open")) {
			closeSearch();
		}

	});

});

