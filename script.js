// Create an Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			// When the box enters the viewport, add the 'in-view' class
			entry.target.classList.add('in-view');
			observer.unobserve(entry.target); // Optionally stop observing after animation
		}
	});
}, {
		threshold: 0.2 // Trigger when 20% of the element is visible
	});

// Select all .box elements
const boxes = document.querySelectorAll('.onscroll');

// Observe each box element
boxes.forEach(box => {
	observer.observe(box);
});


function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

function dark() {
	var element = document.body;
	element.classList.toggle("dark-mode");
	element.classList.toggle("light-mode");
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}
