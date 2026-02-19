// Ensure GSAP is loaded (you should include the GSAP library in your HTML)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>

var cursor = document.querySelector("#cursor");
var buttons = document.querySelectorAll("button");
var links = document.querySelectorAll("a");
var pageContent = document.querySelector("#page-content");
var textContainers = document.querySelectorAll(".text-container h1, .text-container p");
document.body.style.willChange = "transform, opacity";
const menuToggle = document.getElementById("menuBtn");
const sidebar = document.getElementById("sideMenu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
  menuBtn.classList.toggle("active");
});


// Detect if the page is a reload
function isPageReloaded() {
    return performance.getEntriesByType("navigation")[0]?.type === "reload";
}

// Loading Screen Logic (First Visit OR Reload)
document.addEventListener("DOMContentLoaded", function () {
    let loadingScreen = document.querySelector(".loading-screen");
    let containers = document.querySelectorAll(".text-refresh-container");
    let currentIndex = 0;
    let totalAnimationTime = 5450; // Adjusted based on new timing

    if (!loadingScreen) return;

    if (!sessionStorage.getItem("firstVisitDone") || isPageReloaded()) {
        loadingScreen.style.display = "flex";
        sessionStorage.setItem("firstVisitDone", "true");

        setTimeout(() => {
            startTypewriter(containers[currentIndex]);
        }, totalAnimationTime - 50);

        setTimeout(() => {
            loadingScreen.style.animation = "slideUp 1s ease forwards";

            setTimeout(() => {
                loadingScreen.style.display = "none";
                fadeIn(containers[currentIndex]);
            }, 2000);
        }, totalAnimationTime);
    } else {
        loadingScreen.style.display = "none";
        fadeIn(containers[currentIndex]);
        startTypewriter(containers[currentIndex]);
    }
});


// Smooth Fade-in Function
function fadeIn(container) {
    gsap.fromTo(container, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: .5, ease: "power3.out" }
    );
}

// Cursor Effect (Follows Mouse)
window.addEventListener("mousemove", function (e) {
    if (cursor) {
        gsap.to(cursor, {
            x: e.clientX - cursor.offsetWidth / 2,  // Adjust for center
            y: e.clientY - cursor.offsetHeight / 2,
            duration: 0.1,
            ease: "elastic.out"
        });
    }
});


// Hover Effect for Menu Items
document.addEventListener("DOMContentLoaded", function () {
    let currentPage = window.location.pathname.split("/").pop(); // Get current file name
    let menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        let link = item.querySelector(".menu-link");
        if (link && link.getAttribute("href") === currentPage) {
            item.classList.add("active"); // Adds the effect to the active page
        }
    });
});

// Hover Effects on Text Containers
textContainers.forEach((text) => {
    text.addEventListener("mouseenter", function () {
        gsap.to(cursor, { scale: 3, duration: 0.3 });  // Enlarge cursor on hover
    });

    text.addEventListener("mouseleave", function () {
        gsap.to(cursor, { scale: 1, duration: 0.3 });  // Reset scale when leaving text
    });
});

// Hover Effects on Logos (with delay)
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const logos = document.querySelectorAll(".logo");
        console.log("Logos found:", logos.length);

        logos.forEach((logo) => {
            logo.addEventListener("mouseenter", function () {
                gsap.to(cursor, { scale: 0.2, duration: 0.3 });
            });

            logo.addEventListener("mouseleave", function () {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }, 100); // Slight delay to ensure elements exist
});

// Hover Effects on Buttons
buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
        gsap.to(cursor, { scale: 0.2, duration: 0.3 });  // Enlarge cursor on button hover
    });

    button.addEventListener("mouseleave", function () {
        gsap.to(cursor, { scale: 1, duration: 0.3 });  // Reset scale when leaving button
    });
});

// Hover Effects on Links
links.forEach((link) => {
    link.addEventListener("mouseenter", function () {
        gsap.to(cursor, { scale: 0.2, duration: 0.3 });  // Enlarge cursor on link hover
    });

    link.addEventListener("mouseleave", function () {
        gsap.to(cursor, { scale: 1, duration: 0.3 });  // Reset scale when leaving link
    });
});

// Smooth Text Refresh on Click
document.addEventListener("DOMContentLoaded", () => {
    let containers = document.querySelectorAll(".text-refresh-container");
    let refreshButtons = document.querySelectorAll(".refresh-btn");
    let currentIndex = 0;

    // Ensure all containers are stacked, only the first one visible
    containers.forEach((container, index) => {
        if (index !== 0) {
            gsap.set(container, { opacity: 0, y: 20, position: "absolute" });
        }
    });

    refreshButtons.forEach(button => {
        button.addEventListener("click", () => {
            let currentContainer = containers[currentIndex];

            // Fade out current section before switching
            fadeOut(currentContainer, () => {
                currentContainer.style.position = "absolute"; // Stack it behind new one
                currentContainer.classList.remove("active");

                // Move to the next section
                currentIndex = (currentIndex + 1) % containers.length;
                let nextContainer = containers[currentIndex];
                nextContainer.classList.add("active");
                nextContainer.style.position = "relative"; // Bring to front

                // Smooth fade-in for new text
                fadeIn(nextContainer);

                // Start typewriter effect immediately for next texts
                startTypewriter(nextContainer);
            });
        });
    });

    // Smooth fade-out function
    function fadeOut(container, callback) {
        gsap.to(container, { 
            opacity: 0, 
            y: -20,  // Moves up slightly
            duration: 0.8, // Smooth exit
            ease: "power3.inOut",
            onComplete: callback 
        });
    }
});



let currentIndex = 0; // 👈 GLOBAL: keep track of which section is active

function bindRefreshButtons() {
    const containers = document.querySelectorAll(".text-refresh-container");
    const refreshButtons = document.querySelectorAll(".refresh-btn");

    refreshButtons.forEach((button) => {
        button.onclick = () => {
            let currentContainer = containers[currentIndex];

            fadeOut(currentContainer, () => {
                currentContainer.classList.remove("active");
                currentContainer.style.position = "absolute";

                // Move to the next
                currentIndex = (currentIndex + 1) % containers.length;
                let nextContainer = containers[currentIndex];
                nextContainer.classList.add("active");
                nextContainer.style.position = "relative";

                fadeIn(nextContainer);
                startTypewriter(nextContainer);
            });
        };
    });
}


function initializeAboutPage() {
    const aboutTitle = document.querySelector(".about-title");
    const video = document.querySelector("video");
    const skillsSection = document.querySelector(".skills-content");

    if (aboutTitle && skillsSection && video) {
        gsap.fromTo(aboutTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
        gsap.fromTo(video, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(skillsSection, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
    }
}

//sidebar functionality
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sideMenu");

  menuBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("open");

    if (!isOpen) {
      sidebar.classList.add("open");
      menuBtn.classList.add("active");
    } else {
      sidebar.classList.remove("open");
      menuBtn.classList.remove("active");
    }
  });
});



