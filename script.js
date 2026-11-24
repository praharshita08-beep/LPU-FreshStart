
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


// =========================================
// FIND MY CLASSROOM FUNCTIONALITY
// =========================================

const CLASSROOM_HISTORY_KEY =
    "freshstart_classroom_history";

// =========================================
// DEMONSTRATION CLASSROOM DATABASE
// =========================================

// These are fictional classroom locations.
// Replace with verified LPU data later.

const classroomDatabase = [

    {
        id: "A-201",
        block: "A",
        room: "201",
        building: "Example Academic Block A",
        floor: "Second Floor",
        type: "Lecture Hall",
        landmarks: "Main staircase and reception area",
        directions: [
            "Locate Example Academic Block A.",
            "Enter through the main entrance.",
            "Proceed to the second floor.",
            "Follow the classroom signs to Room 201."
        ]
    },

    {
        id: "A-202",
        block: "A",
        room: "202",
        building: "Example Academic Block A",
        floor: "Second Floor",
        type: "Lecture Hall",
        landmarks: "Room 201 and corridor notice board",
        directions: [
            "Locate Example Academic Block A.",
            "Proceed to the second floor.",
            "Follow the classroom signs to Room 202."
        ]
    },

    {
        id: "B-105",
        block: "B",
        room: "105",
        building: "Example Academic Block B",
        floor: "First Floor",
        type: "Tutorial Room",
        landmarks: "First-floor notice board",
        directions: [
            "Locate Example Academic Block B.",
            "Proceed to the first floor.",
            "Follow the classroom signs to Room 105."
        ]
    },

    {
        id: "B-203",
        block: "B",
        room: "203",
        building: "Example Academic Block B",
        floor: "Second Floor",
        type: "Lecture Hall",
        landmarks: "Second-floor staircase",
        directions: [
            "Locate Example Academic Block B.",
            "Proceed to the second floor.",
            "Follow the classroom signs to Room 203."
        ]
    },

    {
        id: "C-301",
        block: "C",
        room: "301",
        building: "Example Academic Block C",
        floor: "Third Floor",
        type: "Computer Laboratory",
        landmarks: "Laboratory notice board",
        directions: [
            "Locate Example Academic Block C.",
            "Proceed to the third floor.",
            "Follow the laboratory signs to Room 301."
        ]
    },

    {
        id: "C-302",
        block: "C",
        room: "302",
        building: "Example Academic Block C",
        floor: "Third Floor",
        type: "Computer Laboratory",
        landmarks: "Room 301",
        directions: [
            "Locate Example Academic Block C.",
            "Proceed to the third floor.",
            "Follow the laboratory signs to Room 302."
        ]
    }

];

// =========================================
// CLASSROOM ELEMENTS
// =========================================

const classroomSearchForm =
    document.getElementById("classroomSearchForm");

const classroomSearchInput =
    document.getElementById("classroomSearchInput");

const roomSearchTab =
    document.getElementById("roomSearchTab");

const blockSearchTab =
    document.getElementById("blockSearchTab");

const classroomSuggestions =
    document.getElementById("classroomSuggestions");

const classroomResults =
    document.getElementById("classroomResults");

const classroomResultsSection =
    document.getElementById("classroomResultsSection");

const classroomSearchMessage =
    document.getElementById("classroomSearchMessage");

const classroomDirectionsPanel =
    document.getElementById("classroomDirectionsPanel");

const classroomHistoryList =
    document.getElementById("classroomHistoryList");

const classroomHistoryEmpty =
    document.getElementById("classroomHistoryEmpty");

const clearClassroomHistory =
    document.getElementById("clearClassroomHistory");

let classroomSearchMode = "room";

// =========================================
// SWITCH SEARCH MODE
// =========================================

function setClassroomSearchMode(mode) {

    classroomSearchMode = mode;

    roomSearchTab.classList.toggle(
        "active", mode === "room"
    );

    blockSearchTab.classList.toggle(
        "active", mode === "block"
    );

    roomSearchTab.setAttribute(
        "aria-pressed", mode === "room"
    );

    blockSearchTab.setAttribute(
        "aria-pressed", mode === "block"
    );

    classroomSearchInput.value = "";

    classroomSuggestions.hidden = true;
    classroomResultsSection.hidden = true;
    classroomSearchMessage.hidden = true;
    classroomDirectionsPanel.hidden = true;

    if (mode === "room") {

        classroomSearchInput.placeholder =
            "Enter classroom number";

        document.getElementById(
            "classroomSearchButtonText"
        ).textContent = "Find Classroom";

        document.getElementById(
            "classroomSearchHint"
        ).textContent =
            "Try searching for Room 201 or Room 105.";

    } else {

        classroomSearchInput.placeholder =
            "Enter academic block number";

        document.getElementById(
            "classroomSearchButtonText"
        ).textContent = "Find Block";

        document.getElementById(
            "classroomSearchHint"
        ).textContent =
            "Try searching for Block A, B or C.";

    }

}

roomSearchTab.addEventListener("click", function() {

    setClassroomSearchMode("room");

    classroomSearchInput.focus();

});

blockSearchTab.addEventListener("click", function() {

    setClassroomSearchMode("block");

    classroomSearchInput.focus();

});

// =========================================
// NORMALIZE SEARCH INPUT
// =========================================

function normalizeClassroomSearch(value) {

    return value.toLowerCase()
        .replace(/room|block/g, "")
        .replace(/[^a-z0-9]/g, "");

}

// =========================================
// FIND MATCHING CLASSROOMS
// =========================================

function findMatchingClassrooms(query, mode) {

    const searchValue =
        normalizeClassroomSearch(query);

    if (!searchValue) {
        return [];
    }

    return classroomDatabase.filter(function(room) {

        if (mode === "block") {

            return normalizeClassroomSearch(
                room.block
            ).includes(searchValue);

        }

        return normalizeClassroomSearch(
            room.room
        ).includes(searchValue) ||

        normalizeClassroomSearch(
            room.id
        ).includes(searchValue);

    });

}

// =========================================
// SEARCH STATUS MESSAGE
// =========================================

function showClassroomMessage(message, isError) {

    classroomSearchMessage.textContent = message;

    classroomSearchMessage.classList.toggle(
        "error", isError
    );

    classroomSearchMessage.hidden = false;

}

// =========================================
// LIVE SEARCH SUGGESTIONS
// =========================================

function updateClassroomSuggestions() {

    const query = classroomSearchInput.value.trim();

    classroomSuggestions.textContent = "";

    if (!query) {

        classroomSuggestions.hidden = true;
        return;

    }

    const matches = findMatchingClassrooms(
        query,
        classroomSearchMode
    );

    let suggestions = [];

    if (classroomSearchMode === "block") {

        const blocks = Array.from(
            new Set(matches.map(function(room) {
                return room.block;
            }))
        );

        suggestions = blocks.map(function(block) {

            return {
                label: "Block " + block,
                value: block
            };

        });

    } else {

        suggestions = matches.map(function(room) {

            return {
                label: "Block " + room.block +
                    " - Room " + room.room,
                value: room.id
            };

        });

    }

    if (suggestions.length === 0) {

        classroomSuggestions.hidden = true;
        return;

    }

    suggestions.slice(0, 6).forEach(function(item) {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "classroom-suggestion";

        const icon = document.createElement("i");

        icon.className =
            "fa-solid fa-location-dot";

        button.appendChild(icon);

        const label = document.createElement("span");

        label.textContent = item.label;

        button.appendChild(label);

        button.addEventListener("click", function() {

            classroomSearchInput.value = item.value;

            classroomSuggestions.hidden = true;

            performClassroomSearch();

        });

        classroomSuggestions.appendChild(button);

    });

    classroomSuggestions.hidden = false;

}

classroomSearchInput.addEventListener(
    "input",
    updateClassroomSuggestions
);

document.addEventListener("click", function(event) {

    if (!classroomSearchForm.contains(event.target)) {

        classroomSuggestions.hidden = true;

    }

});

classroomSearchForm.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            classroomSuggestions.hidden = true;

        }

    }
);

// =========================================
// DISPLAY CLASSROOM RESULTS
// =========================================

function displayClassroomResults(matches) {

    classroomResults.textContent = "";

    document.getElementById(
        "classroomResultCount"
    ).textContent = matches.length +
        (matches.length === 1
            ? " classroom found"
            : " classrooms found");

    matches.forEach(function(room) {

        const card = document.createElement("article");

        card.className = "classroom-result-card";

        // All values below come from the fixed
        // demonstration database, not user input.

        card.innerHTML = `

            <div class="classroom-result-heading">

                <div class="classroom-result-icon">
                    <i class="fa-solid fa-building"></i>
                </div>

                <div>
                    <h3>Room ${room.room}</h3>
                    <p>${room.building}</p>
                </div>

            </div>

            <div class="classroom-details-grid">

                <div class="classroom-detail">

                    <i class="fa-solid fa-building"></i>

                    <div>
                        <small>Block</small>
                        <p>Block ${room.block}</p>
                    </div>

                </div>

                <div class="classroom-detail">

                    <i class="fa-solid fa-layer-group"></i>

                    <div>
                        <small>Floor</small>
                        <p>${room.floor}</p>
                    </div>

                </div>

                <div class="classroom-detail">

                    <i class="fa-solid fa-door-open"></i>

                    <div>
                        <small>Room Number</small>
                        <p>${room.room}</p>
                    </div>

                </div>

                <div class="classroom-detail">

                    <i class="fa-solid fa-book-open"></i>

                    <div>
                        <small>Room Type</small>
                        <p>${room.type}</p>
                    </div>

                </div>

            </div>

            <div class="classroom-landmarks">

                <h4>
                    <i class="fa-solid fa-location-dot"></i>
                    Nearby Landmarks
                </h4>

                <p>${room.landmarks}</p>

            </div>

            <div class="classroom-result-actions">

                <button type="button"
                    class="classroom-directions-button">

                    <i class="fa-solid fa-route"></i>
                    Get Directions

                </button>

                <a href="#map"
                    class="classroom-map-button">

                    <i class="fa-solid fa-map"></i>
                    View on Map

                </a>

            </div>

        `;

        card.querySelector(
            ".classroom-directions-button"
        ).addEventListener("click", function() {

            showClassroomDirections(room);

        });

        classroomResults.appendChild(card);

    });

    classroomResultsSection.hidden = false;

}

// =========================================
// PERFORM CLASSROOM SEARCH
// =========================================

function performClassroomSearch() {

    const query = classroomSearchInput.value.trim();

    classroomSuggestions.hidden = true;
    classroomDirectionsPanel.hidden = true;
    classroomSearchMessage.hidden = true;
    classroomResultsSection.hidden = true;

    if (!normalizeClassroomSearch(query)) {

        showClassroomMessage(
            "Please enter a classroom or block number.",
            true
        );

        return;

    }

    const matches = findMatchingClassrooms(
        query,
        classroomSearchMode
    );

    if (matches.length === 0) {

        showClassroomMessage(
            "No matching classrooms found in the " +
            "demonstration database. Try another search " +
            "or confirm your classroom through UMS.",
            true
        );

        return;

    }

    displayClassroomResults(matches);

    saveClassroomHistory(
        query,
        classroomSearchMode
    );

}

classroomSearchForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        performClassroomSearch();

    }
);

// =========================================
// CLASSROOM DIRECTIONS
// =========================================

function showClassroomDirections(room) {

    document.getElementById(
        "classroomDirectionTitle"
    ).textContent =
        "Block " + room.block +
        " - Room " + room.room;

    const steps = document.getElementById(
        "classroomDirectionSteps"
    );

    steps.textContent = "";

    room.directions.forEach(function(direction) {

        const item = document.createElement("li");

        item.textContent = direction;

        steps.appendChild(item);

    });

    classroomDirectionsPanel.hidden = false;

    classroomDirectionsPanel.scrollIntoView({
        block: "start"
    });

}

document.getElementById(
    "closeClassroomDirections"
).addEventListener("click", function() {

    classroomDirectionsPanel.hidden = true;

});

// =========================================
// RETRIEVE RECENT SEARCHES
// =========================================

function getClassroomHistory() {

    try {

        const history = JSON.parse(
            localStorage.getItem(
                CLASSROOM_HISTORY_KEY
            ) || "[]"
        );

        if (!Array.isArray(history)) {
            return [];
        }

        return history.filter(function(item) {

            return item &&
                typeof item.query === "string" &&
                (item.mode === "room" ||
                 item.mode === "block");

        }).slice(0, 5);

    } catch (error) {

        return [];

    }

}

// =========================================
// SAVE RECENT SEARCHES
// =========================================

function saveClassroomHistory(query, mode) {

    let history = getClassroomHistory();

    history = history.filter(function(item) {

        return !(
            normalizeClassroomSearch(item.query) ===
            normalizeClassroomSearch(query) &&
            item.mode === mode
        );

    });

    history.unshift({
        query: query,
        mode: mode
    });

    history = history.slice(0, 5);

    try {

        localStorage.setItem(
            CLASSROOM_HISTORY_KEY,
            JSON.stringify(history)
        );

        displayClassroomHistory();

    } catch (error) {

        showClassroomMessage(
            "Results found, but search history could not be saved.",
            false
        );

    }

}

// =========================================
// DISPLAY RECENT SEARCHES
// =========================================

function displayClassroomHistory() {

    const history = getClassroomHistory();

    classroomHistoryList.textContent = "";

    classroomHistoryEmpty.hidden =
        history.length > 0;

    clearClassroomHistory.hidden =
        history.length === 0;

    history.forEach(function(item) {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "classroom-history-item";

        const clockIcon = document.createElement("i");

        clockIcon.className =
            "fa-solid fa-clock-rotate-left";

        const label = document.createElement("span");

        label.textContent =
            (item.mode === "room"
                ? "Room search: "
                : "Block search: ") +
            item.query;

        const arrow = document.createElement("i");

        arrow.className =
            "fa-solid fa-chevron-right";

        button.appendChild(clockIcon);
        button.appendChild(label);
        button.appendChild(arrow);

        button.addEventListener("click", function() {

            setClassroomSearchMode(item.mode);

            classroomSearchInput.value = item.query;

            performClassroomSearch();

        });

        classroomHistoryList.appendChild(button);

    });

}

// =========================================
// CLEAR RECENT SEARCHES
// =========================================

clearClassroomHistory.addEventListener(
    "click",
    function() {

        try {

            localStorage.removeItem(
                CLASSROOM_HISTORY_KEY
            );

            displayClassroomHistory();

        } catch (error) {

            showClassroomMessage(
                "Unable to clear recent searches.",
                true
            );

        }

    }
);

// =========================================
// INITIALIZE FIND MY CLASSROOM
// =========================================

setClassroomSearchMode("room");

displayClassroomHistory();


// =========================================
// UNIVERSITY MAP FUNCTIONALITY
// =========================================

// LPU campus reference coordinates

const lpuCampusCenter = [
    31.25492,
    75.70462
];

const lpuDefaultZoom = 16;

let lpuCampusMap = null;
let lpuMapTiles = null;

// =========================================
// INITIALIZE CAMPUS MAP
// =========================================

function initializeCampusMap() {

    if (lpuCampusMap !== null) {

        lpuCampusMap.invalidateSize();

        return;

    }

    if (typeof L === "undefined") {

        showCampusMapMessage(
            "Map library could not be loaded. " +
            "Please check your internet connection.",
            true
        );

        return;

    }

    lpuCampusMap = L.map("campusMap", {

        center: lpuCampusCenter,
        zoom: lpuDefaultZoom,
        minZoom: 14,
        maxZoom: 19,
        zoomControl: true

    });

    // Load actual OpenStreetMap geography

    lpuMapTiles = L.tileLayer(

        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                'OpenStreetMap</a> contributors'
        }

    ).addTo(lpuCampusMap);

    lpuMapTiles.on("tileerror", function() {

        showCampusMapMessage(
            "Some map tiles could not be loaded. " +
            "Please check your internet connection.",
            true
        );

    });

    // University reference marker

    L.marker(lpuCampusCenter)

        .addTo(lpuCampusMap)

        .bindPopup(
            "<h3>Lovely Professional University</h3>" +
            "<p>Phagwara, Punjab, India</p>" +
            "<p>Campus reference location</p>"
        );

    lpuCampusMap.invalidateSize();

}

// =========================================
// MAP STATUS MESSAGE
// =========================================

function showCampusMapMessage(message, isError) {

    const mapMessage = document.getElementById(
        "campusMapMessage"
    );

    mapMessage.textContent = message;

    mapMessage.classList.toggle(
        "error",
        isError
    );

    mapMessage.hidden = false;

}

// =========================================
// RESET CAMPUS MAP
// =========================================

document.getElementById(
    "resetCampusMap"
).addEventListener("click", function() {

    if (lpuCampusMap !== null) {

        lpuCampusMap.setView(
            lpuCampusCenter,
            lpuDefaultZoom
        );

        lpuCampusMap.closePopup();

        document.getElementById(
            "campusMapMessage"
        ).hidden = true;

    }

});

// =========================================
// LOAD MAP WHEN UNIVERSITY MAP IS OPENED
// =========================================

function checkCampusMapVisibility() {

    const mapSection = document.getElementById("map");

    if (!mapSection.hidden) {

        requestAnimationFrame(function() {

            initializeCampusMap();

        });

    }

}

window.addEventListener(
    "hashchange",
    checkCampusMapVisibility
);

document.querySelectorAll(
    'a[href="#map"]'
).forEach(function(link) {

    link.addEventListener("click", function() {

        requestAnimationFrame(
            checkCampusMapVisibility
        );

    });

});

// Adjust map size when sidebar is toggled

document.getElementById(
    "menuToggle"
).addEventListener("click", function() {

    setTimeout(function() {

        if (
            lpuCampusMap !== null &&
            !document.getElementById("map").hidden
        ) {

            lpuCampusMap.invalidateSize();

        }

    }, 350);

});

// Initialize map when page is refreshed

checkCampusMapVisibility();
