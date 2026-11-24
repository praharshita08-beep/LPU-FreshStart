
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

    if (pageId !== "dashboard") {
    globalSearch.value = "";
}

    featureCards.forEach(function(card) {
        card.hidden = false;
    });

    searchMessage.hidden = true;

if (pageId === "dashboard") {
    filterFeatures();
}

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


// =========================================
// MY PROFILE FUNCTIONALITY
// =========================================

const PROFILE_KEY = "freshstart_student_profile";
const PROFILE_PHOTO_KEY = "freshstart_profile_photo";

// Profile Elements

const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

const photoUpload = document.getElementById("photoUpload");
const profileImage = document.getElementById("profileImage");
const defaultAvatar = document.getElementById("defaultAvatar");
const removePhoto = document.getElementById("removePhoto");

const saveProfile = document.getElementById("saveProfile");
const editProfile = document.getElementById("editProfile");
const resetProfile = document.getElementById("resetProfile");

const profileFields = [
    "studentName",
    "registrationNumber",
    "studentProgramme",
    "studentBranch",
    "studentSection",
    "studentNationality",
    "studentAccommodation",
    "studentLanguage"
];

// =========================================
// PROFILE STATUS MESSAGE
// =========================================

function showProfileMessage(message, type) {

    profileMessage.textContent = message;
    profileMessage.className = type;
    profileMessage.hidden = false;

}

// =========================================
// RETRIEVE SAVED PROFILE
// =========================================

function getSavedProfile() {

    try {

        const profile = JSON.parse(
            localStorage.getItem(PROFILE_KEY) || "null"
        );

        return profile && typeof profile === "object"
            ? profile
            : null;

    } catch (error) {

        return null;

    }

}

// =========================================
// UPDATE PROFILE SUMMARY
// =========================================

function updateProfileSummary(profile) {

    profile = profile || {};

    document.getElementById("profileDisplayName")
        .textContent = profile.studentName || "Student Name";

    const course = [
        profile.studentProgramme,
        profile.studentBranch
    ].filter(Boolean).join(" · ");

    document.getElementById("profileDisplayCourse")
        .textContent = course || "New Student · LPU";

    document.getElementById("displayRegistration")
        .textContent =
            profile.registrationNumber || "Not provided";

    document.getElementById("displayProgramme")
        .textContent =
            profile.studentProgramme || "Not provided";

    document.getElementById("displayAccommodation")
        .textContent =
            profile.studentAccommodation || "Not provided";

    document.getElementById("displayLanguage")
        .textContent =
            profile.studentLanguage || "Not provided";

    // Personalized Dashboard

    const firstName = profile.studentName
        ? profile.studentName.trim().split(/\s+/)[0]
        : "";

    document.getElementById("welcomeMessage")
        .textContent = firstName
            ? "Welcome to LPU, " + firstName + "!"
            : "Welcome to LPU!";

}

// =========================================
// ENABLE OR DISABLE PROFILE EDITING
// =========================================

function setProfileEditing(isEditing) {

    profileFields.forEach(function(fieldId) {

        document.getElementById(fieldId)
            .disabled = !isEditing;

    });

    saveProfile.hidden = !isEditing;
    editProfile.hidden = isEditing;

}

// =========================================
// SAVE PROFILE
// =========================================

profileForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const profile = {};

    profileFields.forEach(function(fieldId) {

        profile[fieldId] =
            document.getElementById(fieldId).value.trim();

    });

    // Validate Required Fields

    if (
        !profile.studentName ||
        !profile.studentProgramme ||
        !profile.studentAccommodation ||
        !profile.studentLanguage
    ) {

        showProfileMessage(
            "Please complete all required fields.",
            "error"
        );

        return;

    }

    try {

        localStorage.setItem(
            PROFILE_KEY,
            JSON.stringify(profile)
        );

        updateProfileSummary(profile);

        setProfileEditing(false);

        showProfileMessage(
            "Your profile has been saved successfully!",
            "success"
        );

    } catch (error) {

        showProfileMessage(
            "Unable to save your profile. Please check your browser storage settings.",
            "error"
        );

    }

});

// =========================================
// EDIT PROFILE
// =========================================

editProfile.addEventListener("click", function() {

    setProfileEditing(true);

    showProfileMessage(
        "You can now edit your profile information.",
        "info"
    );

    document.getElementById("studentName").focus();

});

// =========================================
// DISPLAY PROFILE PHOTO
// =========================================

function displayProfilePhoto(photo) {

    const topbarProfile =
        document.querySelector(".profile-button");

    topbarProfile.textContent = "";

    if (photo) {

        profileImage.src = photo;
        profileImage.hidden = false;

        defaultAvatar.hidden = true;
        removePhoto.hidden = false;

        const topbarImage = document.createElement("img");

        topbarImage.src = photo;
        topbarImage.alt = "Profile picture";

        topbarProfile.appendChild(topbarImage);

    } else {

        profileImage.removeAttribute("src");
        profileImage.hidden = true;

        defaultAvatar.hidden = false;
        removePhoto.hidden = true;

        const profileIcon = document.createElement("i");

        profileIcon.className =
            "fa-solid fa-circle-user";

        topbarProfile.appendChild(profileIcon);

    }

}

// =========================================
// UPLOAD PROFILE PHOTO
// =========================================

photoUpload.addEventListener("change", function() {

    const file = photoUpload.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    // Validate File Type

    if (!allowedTypes.includes(file.type)) {

        showProfileMessage(
            "Please select a JPG, PNG or WEBP image.",
            "error"
        );

        photoUpload.value = "";

        return;

    }

    // Validate File Size (Maximum 1 MB)

    if (file.size > 1024 * 1024) {

        showProfileMessage(
            "Your image must be smaller than or equal to 1 MB.",
            "error"
        );

        photoUpload.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function() {

        const photo = reader.result;
        const testImage = new Image();

        testImage.onload = function() {

            try {

                localStorage.setItem(
                    PROFILE_PHOTO_KEY,
                    photo
                );

                displayProfilePhoto(photo);

                showProfileMessage(
                    "Profile picture updated successfully!",
                    "success"
                );

            } catch (error) {

                showProfileMessage(
                    "Unable to save the image. Browser storage may be full.",
                    "error"
                );

            }

        };

        testImage.onerror = function() {

            showProfileMessage(
                "The selected file is not a valid image.",
                "error"
            );

        };

        testImage.src = photo;

    };

    reader.onerror = function() {

        showProfileMessage(
            "Unable to read the selected image.",
            "error"
        );

    };

    reader.readAsDataURL(file);

    photoUpload.value = "";

});

// =========================================
// REMOVE PROFILE PHOTO
// =========================================

removePhoto.addEventListener("click", function() {

    try {

        localStorage.removeItem(PROFILE_PHOTO_KEY);

        displayProfilePhoto(null);

        showProfileMessage(
            "Profile picture removed successfully.",
            "success"
        );

    } catch (error) {

        showProfileMessage(
            "Unable to remove the profile picture.",
            "error"
        );

    }

});

// =========================================
// RESET PROFILE
// =========================================

resetProfile.addEventListener("click", function() {

    const confirmed = confirm(
        "Are you sure you want to reset your profile? " +
        "All saved profile information and your photo will be removed."
    );

    if (!confirmed) {
        return;
    }

    try {

        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem(PROFILE_PHOTO_KEY);

        profileForm.reset();
        photoUpload.value = "";

        updateProfileSummary(null);
        displayProfilePhoto(null);

        setProfileEditing(true);

        showProfileMessage(
            "Your profile has been reset successfully.",
            "success"
        );

    } catch (error) {

        showProfileMessage(
            "Unable to reset your profile.",
            "error"
        );

    }

});

// =========================================
// LOAD PROFILE ON PAGE REFRESH
// =========================================

function loadStudentProfile() {

    const profile = getSavedProfile();

    if (profile) {

        profileFields.forEach(function(fieldId) {

            document.getElementById(fieldId).value =
                profile[fieldId] || "";

        });

        updateProfileSummary(profile);
        setProfileEditing(false);

    } else {

        updateProfileSummary(null);
        setProfileEditing(true);

    }

    try {

        const savedPhoto =
            localStorage.getItem(PROFILE_PHOTO_KEY);

        displayProfilePhoto(savedPhoto);

    } catch (error) {

        displayProfilePhoto(null);

    }

}

// =========================================
// INITIALIZE MY PROFILE
// =========================================

loadStudentProfile();


