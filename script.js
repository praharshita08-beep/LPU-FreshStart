
// =========================================
// LPU FRESHSTART
// Main JavaScript File
// =========================================

// Page Elements

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const pageTitle = document.getElementById("pageTitle");
const globalSearch = document.getElementById("globalSearch");
const notificationButton = document.getElementById("notificationButton");

const pageSections = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");
const featureCards = document.querySelectorAll(".feature-card");

// =========================================
// PAGE TITLES
// =========================================

const pageTitles = {
    dashboard: "Dashboard",
    profile: "My Profile",
    classroom: "Find My Classroom",
    map: "University Map",
    explore: "Explore Campus",
    ums: "UMS Help",
    onboarding: "First 15 Days",
    support: "Student Support",
    international: "International Students Help Desk",
    rules: "Hostel & University Rules",
    timetable: "First 15 Days Timetable",
    banking: "Banking Assistance",
    food: "Food & Dining"
};

// =========================================
// PAGE NAVIGATION
// =========================================

function showPage(pageId) {

    if (!Object.prototype.hasOwnProperty.call(pageTitles, pageId)) {
        pageId = "dashboard";
    }

    pageSections.forEach(function(section) {
        section.hidden = section.id !== pageId;
    });

    navLinks.forEach(function(link) {

        link.classList.remove("active");
        link.removeAttribute("aria-current");

        if (link.getAttribute("href") === "#" + pageId) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

    });

    pageTitle.textContent = pageTitles[pageId];

    document.title =
        "LPU FreshStart | " + pageTitles[pageId];

    globalSearch.value = "";

    featureCards.forEach(function(card) {
        card.hidden = false;
    });

    searchMessage.hidden = true;

    window.scrollTo(0, 0);

    closeMobileSidebar();
}

// Handle URL Navigation

function handleNavigation() {

    const pageId =
        window.location.hash.substring(1) || "dashboard";

    showPage(pageId);

}

window.addEventListener("hashchange", handleNavigation);

// Handle repeated clicks on the current page

document.querySelectorAll('a[href^="#"]').forEach(function(link) {

    link.addEventListener("click", function(event) {

        if (link.getAttribute("href") === window.location.hash) {
            event.preventDefault();
            handleNavigation();
        }

    });

});

// =========================================
// SIDEBAR FUNCTIONALITY
// =========================================

function updateMenuState() {

    const isOpen = window.innerWidth <= 900
        ? sidebar.classList.contains("open")
        : !document.body.classList.contains("sidebar-collapsed");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    sidebar.inert = !isOpen;
}

menuToggle.addEventListener("click", function() {

    if (window.innerWidth <= 900) {

        sidebar.classList.toggle("open");

    } else {

        document.body.classList.toggle("sidebar-collapsed");

    }

    updateMenuState();

});

// Close Mobile Sidebar

function closeMobileSidebar() {

    sidebar.classList.remove("open");
    updateMenuState();

}

// Close Sidebar When Clicking Outside

document.addEventListener("click", function(event) {

    if (
        window.innerWidth <= 900 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {

        closeMobileSidebar();

    }

});

// Close Sidebar Using Escape Key

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        if (sidebar.classList.contains("open")) {
            closeMobileSidebar();
            menuToggle.focus();
        }

    }

});

// Handle Screen Resizing

window.addEventListener("resize", function() {

    if (window.innerWidth <= 900) {

        document.body.classList.remove("sidebar-collapsed");

    } else {

        sidebar.classList.remove("open");

    }

    updateMenuState();

});

// =========================================
// GLOBAL SEARCH
// =========================================

const searchMessage = document.createElement("p");

searchMessage.textContent = "No matching features found.";
searchMessage.style.padding = "20px";
searchMessage.style.color = "#64748b";
searchMessage.setAttribute("role", "status");
searchMessage.hidden = true;

document.getElementById("featureGrid").after(searchMessage);

function filterFeatures() {

    const searchValue =
        globalSearch.value.toLowerCase().trim();

    let matchCount = 0;

    featureCards.forEach(function(card) {

        const cardText = card.textContent.toLowerCase();

        const matches = cardText.includes(searchValue);

        card.hidden = !matches;

        if (matches) {
            matchCount++;
        }

    });

    searchMessage.hidden = matchCount !== 0;

}

globalSearch.addEventListener("input", function() {

    const searchValue = globalSearch.value;

    if (document.getElementById("dashboard").hidden) {

        window.location.hash = "dashboard";

        showPage("dashboard");

        globalSearch.value = searchValue;

    }

    filterFeatures();

});

// Search using Enter

globalSearch.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        const visibleCards = Array.from(featureCards).filter(
            function(card) {
                return !card.hidden;
            }
        );

        if (visibleCards.length === 1) {

            window.location.hash =
                visibleCards[0].getAttribute("href");

        } else {

            document.getElementById("featureGrid").scrollIntoView({
                block: "center"
            });

        }

    }

});

// =========================================
// NOTIFICATIONS
// =========================================

notificationButton.addEventListener("click", function() {

    alert(
        "LPU FreshStart Notifications\n\n" +
        "No new notifications."
    );

});

// =========================================
// ONBOARDING PROGRESS
// =========================================

const ONBOARDING_KEY = "freshstart_completed_days";

function getCompletedDays() {

    try {

        const savedDays = JSON.parse(
            localStorage.getItem(ONBOARDING_KEY) || "[]"
        );

        if (!Array.isArray(savedDays)) {
            return [];
        }

        return Array.from(new Set(savedDays)).filter(
            function(day) {
                return Number.isInteger(day) &&
                       day >= 1 &&
                       day <= 15;
            }
        );

    } catch (error) {

        return [];

    }

}

function updateProgress() {

    const completedDays = getCompletedDays();

    const completed = completedDays.length;

    const percentage = Math.round(
        (completed / 15) * 100
    );

    document.getElementById("progressPercentage")
        .textContent = percentage + "%";

    document.getElementById("progressFill")
        .style.width = percentage + "%";

    document.getElementById("progressText")
        .textContent = completed + " of 15 days completed";

    document.getElementById("progressTrack")
        .setAttribute("aria-valuenow", percentage);

}

// =========================================
// INITIALIZE WEBSITE
// =========================================

handleNavigation();
updateMenuState();
updateProgress();


