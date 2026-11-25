
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


let lpuCampusImageBounds = null;

function initializeCampusMap() {

    if (lpuCampusMap !== null) {

        lpuCampusMap.invalidateSize();

        return;

    }

    if (typeof L === "undefined") {

        showCampusMapMessage(
            "Map library could not be loaded.",
            true
        );

        return;

    }

    lpuCampusMap = L.map("campusMap", {

        crs: L.CRS.Simple,

        center: [0, 0],

        zoom: -2,

        minZoom: -5,

        maxZoom: 3,

        zoomSnap: 0.25,

        zoomControl: true,

        maxBoundsViscosity: 1

    });

    const campusImage = new Image();

    campusImage.onload = function() {

        lpuCampusImageBounds = [

            [0, 0],

            [
                campusImage.naturalHeight,
                campusImage.naturalWidth
            ]

        ];

        L.imageOverlay(

            "lpu-campus-map.png",

            lpuCampusImageBounds,

            {
                alt: "LPU Campus Site Plan"
            }

        ).addTo(lpuCampusMap);

        lpuCampusMap.setMaxBounds(
            lpuCampusImageBounds
        );

        lpuCampusMap.invalidateSize();

        lpuCampusMap.fitBounds(
            lpuCampusImageBounds
        );
        lpuCampusMap.zoomIn(1);

    };

    campusImage.onerror = function() {

        showCampusMapMessage(
            "Campus map image could not be loaded.",
            true
        );

    };

    campusImage.src = "lpu-campus-map.png";

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

        if (lpuCampusImageBounds) {

    lpuCampusMap.fitBounds(
        lpuCampusImageBounds
    );

    lpuCampusMap.zoomIn(1);

}

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


// =========================================
// LPU CAMPUS LOCATION DATABASE
// =========================================


const campusLocations = [

    {
        id: "girls-hostel-1",
        name: "Girls Hostel 1",
        block: "09",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [367, 930],
        description: "Girls Hostel 1, as listed on the campus site plan.",
        keywords: "girls hostel 1 gh1 accommodation block 09"
    },

    {
        id: "girls-hostel-2",
        name: "Girls Hostel 2",
        block: "10",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [419, 895],
        description: "Girls Hostel 2, as listed on the campus site plan.",
        keywords: "girls hostel 2 gh2 accommodation block 10"
    },

    {
        id: "girls-hostel-3",
        name: "Girls Hostel 3",
        block: "11",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [404, 852],
        description: "Girls Hostel 3, as listed on the campus site plan.",
        keywords: "girls hostel 3 gh3 accommodation block 11"
    },

    {
        id: "girls-hostel-4",
        name: "Girls Hostel 4",
        block: "12",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [347, 903],
        description: "Girls Hostel 4, as listed on the campus site plan.",
        keywords: "girls hostel 4 gh4 accommodation block 12"
    },

    {
        id: "girls-hostel-5",
        name: "Girls Hostel 5",
        block: "21A",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [516, 574],
        description: "Girls Hostel 5, as listed on the campus site plan.",
        keywords: "girls hostel 5 gh5 accommodation block 21a"
    },

    {
        id: "girls-hostel-6",
        name: "Girls Hostel 6",
        block: "21B",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [551, 555],
        description: "Girls Hostel 6, as listed on the campus site plan.",
        keywords: "girls hostel 6 gh6 accommodation block 21b"
    },

    {
        id: "boys-hostel-1",
        name: "Boys Hostel 1",
        block: "45",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [495, 387],
        description: "Boys Hostel 1, as listed on the campus site plan.",
        keywords: "boys hostel 1 bh1 accommodation block 45"
    },

    {
        id: "boys-hostel-2",
        name: "Boys Hostel 2",
        block: "48",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [397, 297],
        description: "Boys Hostel 2, as listed on the campus site plan.",
        keywords: "boys hostel 2 bh2 accommodation block 48"
    },

    {
        id: "boys-hostel-3",
        name: "Boys Hostel 3",
        block: "49",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [439, 276],
        description: "Boys Hostel 3, as listed on the campus site plan.",
        keywords: "boys hostel 3 bh3 accommodation block 49"
    },

    {
        id: "boys-hostel-3a",
        name: "Boys Hostel 3A",
        block: "50",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [474, 249],
        description: "Boys Hostel 3A, as listed on the campus site plan.",
        keywords: "boys hostel 3a bh3a accommodation block 50"
    },

    {
        id: "boys-hostel-4a",
        name: "Boys Hostel 4",
        block: "51A",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [413, 208],
        description: "Boys Hostel 4, Block 51A.",
        keywords: "boys hostel 4 bh4 accommodation block 51a"
    },

    {
        id: "boys-hostel-4b",
        name: "Boys Hostel 4",
        block: "51B",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [463, 173],
        description: "Boys Hostel 4, Block 51B.",
        keywords: "boys hostel 4 bh4 accommodation block 51b"
    },

    {
        id: "boys-hostel-5",
        name: "Boys Hostel 5",
        block: "53",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [190, 309],
        description: "Boys Hostel 5, as listed on the campus site plan.",
        keywords: "boys hostel 5 bh5 accommodation block 53"
    },

    {
        id: "boys-hostel-6",
        name: "Boys Hostel 6",
        block: "54",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [163, 260],
        description: "Boys Hostel 6, as listed on the campus site plan.",
        keywords: "boys hostel 6 bh6 accommodation block 54"
    },

    {
        id: "boys-hostel-7",
        name: "Boys Hostel 7",
        block: "47",
        category: "hostel",
        categoryName: "Hostel",
        icon: "fa-bed",
        coordinates: null,
        imagePosition: [559, 205],
        description: "Boys Hostel 7, as listed on the campus site plan.",
        keywords: "boys hostel 7 bh7 accommodation block 47"
    },


    {
        id: "central-library",
        name: "Central Library",
        block: "37",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-book",
        coordinates: null,
        imagePosition: [300, 515],
        description: "Central Library, Block 37.",
        keywords: "library books study block 37"
    },

    {
        id: "cse-block-33",
        name: "School of Computer Science and Engineering",
        block: "33",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-graduation-cap",
        coordinates: null,
        imagePosition: [235, 550],
        description: "Academic Block 33, as listed in the campus site plan.",
        keywords: "cse computer science engineering block 33"
    },

    {
        id: "cse-block-34",
        name: "School of Computer Science and Engineering",
        block: "34",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-laptop-code",
        coordinates: null,
        imagePosition: [223, 525],
        description: "Academic Block 34, as listed in the campus site plan.",
        keywords: "cse computer science engineering block 34"
    },

    {
        id: "uni-auditorium",
        name: "Shanti Devi Mittal Auditorium",
        block: "35",
        category: "academic",
        categoryName: "Auditorium",
        icon: "fa-masks-theater",
        coordinates: null,
        imagePosition: [287, 544],
        description: "University auditorium located in Block 35.",
        keywords: "auditorium events block 35"
    },

    {
        id: "uni-hospital",
        name: "Uni Hospital",
        block: "08C",
        category: "medical",
        categoryName: "Healthcare",
        icon: "fa-hospital",
        coordinates: null,
        imagePosition: [297, 950],
        description: "University hospital listed in Block 08C.",
        keywords: "hospital medical doctor health block 8c 08c"
    },

    {
        id: "student-welfare",
        name: "Division of Student Affairs",
        block: "13",
        category: "support",
        categoryName: "Student Support",
        icon: "fa-headset",
        coordinates: null,
        imagePosition: [275, 816],
        description: "Student affairs and assistance facility.",
        keywords: "dsa student affairs support help block 13"
    },

    {
        id: "school-of-business",
        name: "School of Business",
        block: "14",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-briefcase",
        coordinates: null,
        imagePosition: [272, 748],
        description: "School of Business, Block 14.",
        keywords: "business management commerce block 14"
    },

    {
        id: "campus-cafe",
        name: "Campus Cafe",
        block: "02B",
        category: "food",
        categoryName: "Food and Dining",
        icon: "fa-mug-hot",
        coordinates: null,
        imagePosition: [274, 1105],
        description: "Campus Cafe, as shown on the site plan.",
        keywords: "cafe cafeteria food block 2b 02b"
    },

    {
        id: "cricket-ground",
        name: "Cricket Ground",
        block: "52",
        category: "sports",
        categoryName: "Sports",
        icon: "fa-trophy",
        coordinates: null,
        imagePosition: [323, 163],
        description: "Cricket ground and playground area.",
        keywords: "cricket sports playground block 52"
    },

    {
        id: "school-of-law",
        name: "School of Law",
        block: "20",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-scale-balanced",
        coordinates: null,
        imagePosition: [556, 653],
        description: "School of Law, Block 20.",
        keywords: "law academic block 20"
    },

    {
        id: "admission-office",
        name: "Division of Admissions",
        block: "31",
        category: "support",
        categoryName: "Student Support",
        icon: "fa-address-card",
        coordinates: null,
        imagePosition: [252, 595],
        description: "Division of Admissions, Block 31.",
        keywords: "admission registration office block 31"
    },

    {
        id: "school-of-agriculture",
        name: "School of Agriculture",
        block: "25",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-seedling",
        coordinates: null,
        imagePosition: [412, 544],
        description: "School of Agriculture, Block 25.",
        keywords: "agriculture academic block 25"
    }

];

// =========================================
// CAMPUS LOCATION ELEMENTS
// =========================================

const campusMapSearchForm =
    document.getElementById("campusMapSearchForm");

const campusMapSearch =
    document.getElementById("campusMapSearch");

const campusMapSuggestions =
    document.getElementById("campusMapSuggestions");

const popularCampusLocations =
    document.getElementById("popularCampusLocations");

const selectedCampusLocation =
    document.getElementById("selectedCampusLocation");

const campusDirectionsButton =
    document.getElementById("campusDirectionsButton");

const campusMarkers = {};

let campusActiveCategory = "all";

let activeCampusLocation = null;

// =========================================
// GOOGLE MAPS LOCATION LINK
// =========================================

function getCampusLocationURL(location) {

    const destination = location.coordinates
        ? location.coordinates.join(",")
        : location.name +
          ", Lovely Professional University, Phagwara";

    return "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(destination);

}

// =========================================
// CREATE CAMPUS MAP MARKERS
// =========================================

function displayCampusMarkers() {

    if (!lpuCampusMap) {
        return;
    }

    Object.keys(campusMarkers).forEach(function(id) {

        lpuCampusMap.removeLayer(campusMarkers[id]);

        delete campusMarkers[id];

    });

    campusLocations.forEach(function(location) {

        if (!location.coordinates) {
            return;
        }

        if (
            campusActiveCategory !== "all" &&
            location.category !== campusActiveCategory
        ) {
            return;
        }

        const markerIcon = L.divIcon({

            className: "campus-custom-marker",

            html:
                '<div class="campus-marker-icon">' +
                '<i class="fa-solid ' +
                location.icon +
                '"></i></div>',

            iconSize: [36, 36],

            iconAnchor: [18, 18],

            popupAnchor: [0, -18]

        });

        const marker = L.marker(
            location.coordinates,
            {
                icon: markerIcon,
                title: location.name
            }
        ).addTo(lpuCampusMap);

        marker.bindPopup(
            "<h3>" + location.name + "</h3>" +
            "<p>" + location.categoryName + "</p>" +
            "<p>Public map reference location</p>"
        );

        marker.on("click", function() {

            selectCampusLocation(location, false);

        });

        campusMarkers[location.id] = marker;

    });

}

// =========================================
// SELECT CAMPUS LOCATION
// =========================================

function selectCampusLocation(location, moveMap) {

    activeCampusLocation = location;

    document.getElementById(
        "selectedLocationName"
    ).textContent = location.name;

    document.getElementById(
        "selectedLocationCategory"
    ).textContent = location.categoryName;

    document.getElementById(
        "selectedLocationDescription"
    ).textContent = location.description +
        (location.coordinates
            ? " Map position is based on public mapping data."
            : " Exact campus coordinates are awaiting verification.");

    const directionsLink = document.getElementById(
        "selectedLocationDirections"
    );

    directionsLink.href =
        getCampusLocationURL(location);

    directionsLink.innerHTML =
        '<i class="fa-solid fa-map"></i> ' +
        "Find on Google Maps";

    selectedCampusLocation.hidden = false;

    campusDirectionsButton.disabled =
        !location.coordinates;

    campusMapSuggestions.hidden = true;

    if (location.coordinates && lpuCampusMap) {

        if (moveMap) {

            if (!campusMarkers[location.id]) {

                setCampusCategory("all");

            }

            lpuCampusMap.setView(
                location.coordinates,
                18
            );

        }

        if (campusMarkers[location.id]) {

            campusMarkers[location.id].openPopup();

        }

        document.getElementById(
            "campusMapMessage"
        ).hidden = true;

    } else {

        showCampusMapMessage(
            "This facility is listed, but its exact " +
            "map position has not yet been verified. " +
            "Use the Google Maps search link.",
            false
        );

    }

    if (moveMap) {

        selectedCampusLocation.scrollIntoView({
            block: "nearest"
        });

    }

}

// =========================================
// DISPLAY POPULAR CAMPUS LOCATIONS
// =========================================

function displayPopularCampusLocations() {

    popularCampusLocations.textContent = "";

    const locations = campusLocations.filter(
        function(location) {

            return campusActiveCategory === "all" ||
                location.category === campusActiveCategory;

        }
    );

    if (locations.length === 0) {

        const message = document.createElement("p");

        message.textContent =
            "Locations in this category will be added " +
            "after verification.";

        popularCampusLocations.appendChild(message);

        return;

    }

    locations.forEach(function(location) {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "popular-location-item";

        button.innerHTML = `

            <div class="popular-location-icon">

                <i class="fa-solid ${location.icon}"></i>

            </div>

            <div class="popular-location-text">

                <h3>${location.name}</h3>

                <p>Block ${location.block} | ${location.categoryName}</p>

                <p>
                   ${location.imagePosition
    ? "Shown on campus site plan"
    : "Location verification pending"}
                </p>

            </div>

            <i class="fa-solid fa-chevron-right"></i>

        `;

        button.addEventListener("click", function() {

            selectCampusLocation(location, true);

        });

        popularCampusLocations.appendChild(button);

    });

}

// =========================================
// CAMPUS CATEGORY FILTERS
// =========================================

function setCampusCategory(category) {

    campusActiveCategory = category;

    document.querySelectorAll(
        ".map-filter"
    ).forEach(function(button) {

        const isActive =
            button.dataset.category === category;

        button.classList.toggle(
            "active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            isActive
        );

    });

    displayCampusMarkers();

    displayPopularCampusLocations();

}

document.querySelectorAll(
    ".map-filter"
).forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCampusLocation.hidden = true;

        activeCampusLocation = null;

        campusDirectionsButton.disabled = true;

        campusMapSuggestions.hidden = true;

        document.getElementById(
            "campusMapMessage"
        ).hidden = true;

        setCampusCategory(
            button.dataset.category
        );

    });

});

// =========================================
// FIND MATCHING CAMPUS LOCATIONS
// =========================================


function findCampusLocations(query) {

    const search = query.trim().toLowerCase();

    if (search === "") {
        return [];
    }

    const blockSearch = search
        .replace(/^block\s*/, "")
        .replace(/\s/g, "")
        .replace(/^0+/, "");

    const exactBlockMatches = campusLocations.filter(
        function(location) {

            const block = location.block
                .toLowerCase()
                .replace(/^0+/, "");

            return block === blockSearch;

        }
    );

    if (exactBlockMatches.length > 0) {
        return exactBlockMatches;
    }

    return campusLocations.filter(function(location) {

        const searchableText = (

            location.name + " " +
            location.block + " " +
            location.categoryName + " " +
            location.keywords

        ).toLowerCase();

        return searchableText.includes(search);

    });

}


// =========================================
// DISPLAY LIVE SEARCH SUGGESTIONS
// =========================================

function displayCampusSearchSuggestions() {

    const matches = findCampusLocations(
        campusMapSearch.value
    );

    campusMapSuggestions.textContent = "";

    if (matches.length === 0) {

        campusMapSuggestions.hidden = true;

        return;

    }

    matches.forEach(function(location) {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "map-suggestion";

        const icon = document.createElement("i");

        icon.className =
            "fa-solid " + location.icon;

        const label = document.createElement("span");

        label.textContent = location.name;

        button.appendChild(icon);

        button.appendChild(label);

        button.addEventListener("click", function() {

            campusMapSearch.value = location.name;

            selectCampusLocation(location, true);

        });

        campusMapSuggestions.appendChild(button);

    });

    campusMapSuggestions.hidden = false;

}

campusMapSearch.addEventListener(
    "input",
    displayCampusSearchSuggestions
);

// =========================================
// CAMPUS SEARCH FORM
// =========================================

campusMapSearchForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const matches = findCampusLocations(
            campusMapSearch.value
        );

        if (matches.length === 0) {

            showCampusMapMessage(
                "No matching campus locations found. " +
                "Try another location name.",
                true
            );

            campusMapSuggestions.hidden = true;

            return;

        }

        if (matches.length === 1) {

            selectCampusLocation(matches[0], true);

        } else {

            displayCampusSearchSuggestions();

            showCampusMapMessage(
                "Select your destination from the suggestions.",
                false
            );

        }

    }
);

// =========================================
// CLOSE SEARCH SUGGESTIONS
// =========================================

document.addEventListener("click", function(event) {

    if (
        !campusMapSearchForm.contains(event.target) &&
        !campusMapSuggestions.contains(event.target)
    ) {

        campusMapSuggestions.hidden = true;

    }

});

campusMapSearch.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            campusMapSuggestions.hidden = true;

        }

    }
);

// =========================================
// CLOSE SELECTED LOCATION DETAILS
// =========================================

document.getElementById(
    "closeCampusLocation"
).addEventListener("click", function() {

    selectedCampusLocation.hidden = true;

    activeCampusLocation = null;

    campusDirectionsButton.disabled = true;

    if (lpuCampusMap) {

        lpuCampusMap.closePopup();

    }

});

// =========================================
// RESET LOCATION FILTERS
// =========================================

document.getElementById(
    "resetCampusMap"
).addEventListener("click", function() {

    campusMapSearch.value = "";

    campusMapSuggestions.hidden = true;

    selectedCampusLocation.hidden = true;

    activeCampusLocation = null;

    campusDirectionsButton.disabled = true;

    document.getElementById(
        "campusMapMessage"
    ).hidden = true;

    setCampusCategory("all");

});

// =========================================
// LOAD MARKERS WHEN MAP PAGE IS OPENED
// =========================================

function loadCampusLocationMarkers() {

    if (!document.getElementById("map").hidden) {

        requestAnimationFrame(function() {

            initializeCampusMap();

            displayCampusMarkers();

        });

    }

}

window.addEventListener(
    "hashchange",
    loadCampusLocationMarkers
);

// =========================================
// INITIALIZE CAMPUS LOCATION DIRECTORY
// =========================================

displayPopularCampusLocations();

loadCampusLocationMarkers();


// =========================================
// CAMPUS GPS AND NAVIGATION ASSISTANCE
// =========================================

const findMyLocationButton =
    document.getElementById("findMyLocation");

const lostAssistancePanel =
    document.getElementById("lostAssistancePanel");

let campusUserMarker = null;

let campusAccuracyCircle = null;

// =========================================
// REMOVE CURRENT LOCATION MARKERS
// =========================================

function clearCampusUserLocation() {

    if (campusUserMarker && lpuCampusMap) {

        lpuCampusMap.removeLayer(campusUserMarker);

        campusUserMarker = null;

    }

    if (campusAccuracyCircle && lpuCampusMap) {

        lpuCampusMap.removeLayer(campusAccuracyCircle);

        campusAccuracyCircle = null;

    }

}

// =========================================
// FIND STUDENT'S CURRENT LOCATION
// =========================================

function findCampusUserLocation() {

    if (!navigator.geolocation) {

        showCampusMapMessage(
            "Your browser does not support location access.",
            true
        );

        return;

    }

    initializeCampusMap();

    if (!lpuCampusMap) {
        return;
    }

    findMyLocationButton.disabled = true;

    findMyLocationButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> ' +
        "Finding Location...";

    showCampusMapMessage(
        "Requesting your current location...",
        false
    );

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                position.coords.accuracy;

            const currentLocation = [
                latitude,
                longitude
            ];

            clearCampusUserLocation();

            // Blue marker for current location

            campusUserMarker = L.circleMarker(
                currentLocation,
                {
                    radius: 9,
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#2563eb",
                    fillOpacity: 1
                }
            ).addTo(lpuCampusMap);

            campusUserMarker.bindPopup(
                "<h3>You Are Here</h3>" +
                "<p>Your estimated current location.</p>" +
                "<p>Accuracy: approximately " +
                Math.round(accuracy) +
                " metres</p>"
            );

            // GPS accuracy area

            campusAccuracyCircle = L.circle(
                currentLocation,
                {
                    radius: accuracy,
                    color: "#2563eb",
                    weight: 1,
                    fillColor: "#2563eb",
                    fillOpacity: 0.12
                }
            ).addTo(lpuCampusMap);

            // Check distance from campus reference

            const distanceFromCampus =
                lpuCampusMap.distance(
                    currentLocation,
                    lpuCampusCenter
                );

            if (distanceFromCampus > 2000) {

                lpuCampusMap.setView(
                    lpuCampusCenter,
                    lpuDefaultZoom
                );

                showCampusMapMessage(
                    "Your current location is more than " +
                    "2 km from the campus reference point. " +
                    "The map will remain centred on LPU.",
                    false
                );

            } else {

                lpuCampusMap.setView(
                    currentLocation,
                    18
                );

                campusUserMarker.openPopup();

                showCampusMapMessage(
                    "Your estimated location has been found.",
                    false
                );

            }

            restoreLocationButton();

        },

        function(error) {

            let message =
                "Unable to determine your location.";

            if (error.code === 1) {

                message =
                    "Location permission was denied. " +
                    "You can still search campus locations.";

            } else if (error.code === 2) {

                message =
                    "Your current location is unavailable.";

            } else if (error.code === 3) {

                message =
                    "Location request timed out. " +
                    "Please try again.";

            }

            showCampusMapMessage(message, true);

            restoreLocationButton();

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

}

// =========================================
// RESTORE LOCATION BUTTON
// =========================================

function restoreLocationButton() {

    findMyLocationButton.disabled = false;

    findMyLocationButton.innerHTML =
        '<i class="fa-solid fa-location-crosshairs"></i> ' +
        "My Location";

}

findMyLocationButton.addEventListener(
    "click",
    findCampusUserLocation
);

// =========================================
// GOOGLE MAPS WALKING DIRECTIONS
// =========================================

function getCampusWalkingDirections(location) {

    const destination = location.coordinates
        ? location.coordinates.join(",")
        : location.name +
          ", Lovely Professional University, Phagwara";

    return "https://www.google.com/maps/dir/?api=1" +
        "&destination=" +
        encodeURIComponent(destination) +
        "&travelmode=walking";

}

// =========================================
// GET DIRECTIONS BUTTON
// =========================================

campusDirectionsButton.addEventListener(
    "click",
    function() {

        if (!activeCampusLocation) {

            showCampusMapMessage(
                "Please select a campus destination first.",
                true
            );

            return;

        }

        if (!activeCampusLocation.coordinates) {

            showCampusMapMessage(
                "Exact coordinates are not verified. " +
                "Please use the location search link.",
                true
            );

            return;

        }

        window.open(
            getCampusWalkingDirections(
                activeCampusLocation
            ),
            "_blank",
            "noopener,noreferrer"
        );

    }
);

// =========================================
// I'M LOST ASSISTANCE
// =========================================

document.getElementById(
    "lostAssistanceButton"
).addEventListener("click", function() {

    lostAssistancePanel.hidden = false;

    lostAssistancePanel.scrollIntoView({
        block: "nearest"
    });

});

document.getElementById(
    "closeLostAssistance"
).addEventListener("click", function() {

    lostAssistancePanel.hidden = true;

});

document.getElementById(
    "lostFindLocation"
).addEventListener("click", function() {

    document.getElementById(
        "campusMap"
    ).scrollIntoView({
        block: "center"
    });

    findCampusUserLocation();

});

// =========================================
// RESET GPS AND LOST ASSISTANCE
// =========================================

document.getElementById(
    "resetCampusMap"
).addEventListener("click", function() {

    clearCampusUserLocation();

    lostAssistancePanel.hidden = true;

});


// =========================================
// CAMPUS IMAGE MAP COMPATIBILITY
// =========================================

displayCampusMarkers = function() {
    // Image-based markers will be added next.
};

selectCampusLocation = function() {
    showCampusMapMessage(
        "Campus location markers are being updated.",
        false
    );
};



document.getElementById("findMyLocation")
    .disabled = true;

document.getElementById("lostFindLocation")
    .disabled = true;

document.getElementById("campusDirectionsButton")
    .disabled = true;


// =========================================
// INTERACTIVE CAMPUS IMAGE MARKERS
// =========================================

function getCampusImagePosition(location) {

    if (!lpuCampusImageBounds || !location.imagePosition) {
        return null;
    }

    const imageHeight = lpuCampusImageBounds[1][0];
    const imageWidth = lpuCampusImageBounds[1][1];

    const x = location.imagePosition[0];
    const y = location.imagePosition[1];

    return [

        imageHeight - (y / 1506) * imageHeight,

        (x / 991) * imageWidth

    ];

}

// DISPLAY BUILDING MARKERS

displayCampusMarkers = function() {

    if (!lpuCampusMap || !lpuCampusImageBounds) {
        return;
    }

    Object.keys(campusMarkers).forEach(function(id) {

        lpuCampusMap.removeLayer(campusMarkers[id]);

        delete campusMarkers[id];

    });

    campusLocations.forEach(function(location) {

        if (
            campusActiveCategory !== "all" &&
            location.category !== campusActiveCategory
        ) {
            return;
        }

        const position = getCampusImagePosition(location);

        if (!position) {
            return;
        }

        const marker = L.circleMarker(position, {

            radius: 8,

            color: "#ffffff",

            weight: 2,

            fillColor: "#e97826",

            fillOpacity: 1

        }).addTo(lpuCampusMap);

        marker.bindTooltip(

            "Block " + location.block +
            " - " + location.name

        );

        marker.bindPopup(

            "<h3>" + location.name + "</h3>" +

            "<p>Block " + location.block + "</p>" +

            "<p>" + location.categoryName + "</p>"

        );

        marker.on("click", function() {

            selectCampusLocation(location, false);

        });

        campusMarkers[location.id] = marker;

    });

};

// SELECT AND HIGHLIGHT A BUILDING

selectCampusLocation = function(location, moveMap) {

    activeCampusLocation = location;

    document.getElementById(
        "selectedLocationName"
    ).textContent = location.name;

    document.getElementById(
        "selectedLocationCategory"
    ).textContent =
        "Block " + location.block +
        " | " + location.categoryName;

    document.getElementById(
        "selectedLocationDescription"
    ).textContent = location.description;

    selectedCampusLocation.hidden = false;

    campusMapSuggestions.hidden = true;

    campusDirectionsButton.disabled = true;

    const directionsLink = document.getElementById(
        "selectedLocationDirections"
    );

    directionsLink.hidden = true;

    const position = getCampusImagePosition(location);

    if (!position) {

        showCampusMapMessage(
            "Please wait for the campus map to load.",
            false
        );

        return;

    }

    if (moveMap) {

        setCampusCategory("all");

        lpuCampusMap.setView(

            position,

            Math.max(lpuCampusMap.getZoom(), 0.5)

        );

    }

    if (campusMarkers[location.id]) {

        campusMarkers[location.id].openPopup();

    }

    showCampusMapMessage(

        location.name +
        " - Block " + location.block +
        " located on the campus site plan.",

        false

    );

    if (moveMap) {

        document.getElementById("campusMap")
            .scrollIntoView({

                block: "center"

            });

    }

};

// LOAD MARKERS AFTER IMAGE IS READY

function loadCampusImageMarkers() {

    if (document.getElementById("map").hidden) {
        return;
    }

    if (lpuCampusMap && lpuCampusImageBounds) {

        displayCampusMarkers();

    } else {

        setTimeout(loadCampusImageMarkers, 300);

    }

}

window.addEventListener(
    "hashchange",
    loadCampusImageMarkers
);

loadCampusImageMarkers();


// DISPLAY EXPLORE CAMPUS FACILITIES


// EXPLORE CAMPUS FACILITIES DATABASE

const exploreFacilities = campusLocations.map(function(location) {

    let category = location.category;

    if (location.id === "central-library") {
        category = "library";
    }

    if (location.id === "uni-auditorium") {
        category = "events";
    }

    return {

        id: location.id,
        name: location.name,
        category: category,
        categoryName: location.categoryName,
        icon: location.icon,
        description: location.description,
        location: "Block " + location.block,
        hours: "Confirm with the university",
        image: "",
        mapId: location.id,
        keywords: location.keywords,
        amenities: []

    };

});


function displayExploreFacilities(facilities) {

    const grid = document.getElementById(
        "exploreFacilitiesGrid"
    );

    const emptyState = document.getElementById(
        "exploreEmptyState"
    );

    grid.innerHTML = "";

    document.getElementById(
        "exploreResultCount"
    ).textContent = facilities.length + " facilities";

    emptyState.hidden = facilities.length !== 0;

    facilities.forEach(function(facility) {

        const card = document.createElement("article");

        card.className = "explore-facility-card";

        card.innerHTML = `

            <div class="explore-card-image-wrapper">

                <div class="explore-image-placeholder">
                    <i class="fa-solid ${facility.icon}"></i>
                </div>

                <button type="button"
                    class="explore-card-favourite"
                    data-id="${facility.id}"
                    aria-label="Add ${facility.name} to favourites">

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>

            <div class="explore-card-content">

                <span class="explore-card-category">
                    ${facility.categoryName}
                </span>

                <h3>${facility.name}</h3>

                <p class="explore-card-description">
                    ${facility.description}
                </p>

                <p class="explore-card-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${facility.location}

                </p>

                <button type="button"
                    class="explore-card-button"
                    data-id="${facility.id}">

                    View Details

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>

        `;

        grid.appendChild(card);

    });

}

displayExploreFacilities(exploreFacilities);


// EXPLORE CAMPUS SEARCH AND FILTERS

let exploreActiveCategory = "all";

const exploreSearchInput = document.getElementById(
    "exploreSearchInput"
);

const exploreSearchForm = document.getElementById(
    "exploreSearchForm"
);

const exploreFilterButtons = document.querySelectorAll(
    ".explore-filter"
);

// FILTER CAMPUS FACILITIES

function filterExploreFacilities() {

    const query = exploreSearchInput.value
        .trim()
        .toLowerCase();

    const filteredFacilities = exploreFacilities.filter(
        function(facility) {

            const matchesCategory =

                exploreActiveCategory === "all" ||

                facility.category === exploreActiveCategory;

            const searchableText = (

                facility.name + " " +

                facility.description + " " +

                facility.location + " " +

                facility.categoryName + " " +

                facility.keywords

            ).toLowerCase();

            const matchesSearch =
                searchableText.includes(query);

            return matchesCategory && matchesSearch;

        }
    );

    displayExploreFacilities(filteredFacilities);

}

// SEARCH INPUT

exploreSearchInput.addEventListener(
    "input",
    filterExploreFacilities
);

exploreSearchForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        filterExploreFacilities();

    }
);

// CATEGORY FILTER BUTTONS

exploreFilterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        exploreActiveCategory = button.dataset.category;

        exploreFilterButtons.forEach(function(item) {

            item.classList.remove("active");

            item.setAttribute("aria-pressed", "false");

        });

        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");

        filterExploreFacilities();

    });

});

// RESET FILTERS

document.getElementById("resetExploreFilters")
    .addEventListener("click", function() {

        exploreSearchInput.value = "";

        exploreActiveCategory = "all";

        exploreFilterButtons.forEach(function(button) {

            const isActive =
                button.dataset.category === "all";

            button.classList.toggle("active", isActive);

            button.setAttribute("aria-pressed", isActive);

        });

        filterExploreFacilities();

    });

// START EXPLORING BUTTON

document.getElementById("startExploring")
    .addEventListener("click", function(event) {

        event.preventDefault();

        document.getElementById("campusFacilities")
            .scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

    });


// EXPLORE CAMPUS FACILITY DETAILS

let activeExploreFacility = null;

function showExploreFacilityDetails(facility) {

    activeExploreFacility = facility;

    document.getElementById(
        "exploreDetailName"
    ).textContent = facility.name;

    document.getElementById(
        "exploreDetailCategory"
    ).textContent = facility.categoryName;

    document.getElementById(
        "exploreDetailDescription"
    ).textContent = facility.description;

    document.getElementById(
        "exploreDetailLocation"
    ).textContent = facility.location;

    document.getElementById(
        "exploreDetailHours"
    ).textContent = facility.hours;

    document.getElementById(
        "exploreDetailImage"
    ).hidden = true;

    const amenitiesList = document.getElementById(
        "exploreDetailAmenities"
    );

    amenitiesList.innerHTML = "";

    const item = document.createElement("li");

    item.textContent =
        "Contact the university for facility information.";

    amenitiesList.appendChild(item);

    const detailsPanel = document.getElementById(
        "exploreFacilityDetails"
    );

    detailsPanel.hidden = false;

    detailsPanel.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

// VIEW DETAILS BUTTON

document.getElementById("exploreFacilitiesGrid")
    .addEventListener("click", function(event) {

        const button = event.target.closest(
            ".explore-card-button"
        );

        if (!button) {
            return;
        }

        const facility = exploreFacilities.find(
            function(item) {

                return item.id === button.dataset.id;

            }
        );

        if (facility) {

            showExploreFacilityDetails(facility);

        }

    });

// CLOSE FACILITY DETAILS

document.getElementById("closeExploreDetails")
    .addEventListener("click", function() {

        document.getElementById(
            "exploreFacilityDetails"
        ).hidden = true;

        activeExploreFacility = null;

    });

// VIEW FACILITY ON UNIVERSITY MAP

document.getElementById("exploreViewOnMap")
    .addEventListener("click", function(event) {

        event.preventDefault();

        if (!activeExploreFacility) {
            return;
        }

        const location = campusLocations.find(
            function(item) {

                return item.id ===
                    activeExploreFacility.mapId;

            }
        );

        if (!location) {
            return;
        }

        window.location.hash = "map";

        function highlightFacility(attempt) {

            if (window.location.hash !== "#map") {
                return;
            }

            if (
                !document.getElementById("map").hidden &&
                lpuCampusMap &&
                lpuCampusImageBounds
            ) {

                selectCampusLocation(location, true);

            } else if (attempt < 30) {

                setTimeout(function() {

                    highlightFacility(attempt + 1);

                }, 200);

            } else {

                showCampusMapMessage(
                    "Map could not load. Please try again.",
                    true
                );

            }

        }

        highlightFacility(0);

    });


// EXPLORE CAMPUS FAVOURITES AND PROGRESS

const EXPLORE_FAVOURITES_KEY =
    "freshstart_explore_favourites";

const EXPLORE_VISITED_KEY =
    "freshstart_explore_visited";

function getExploreSavedItems(key) {

    try {

        const items = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        return Array.isArray(items) ? items : [];

    } catch (error) {

        return [];

    }

}

let exploreFavourites = getExploreSavedItems(
    EXPLORE_FAVOURITES_KEY
);

let exploreVisited = getExploreSavedItems(
    EXPLORE_VISITED_KEY
);

let exploreActiveView = "all";

// UPDATE EXPLORATION PROGRESS

function updateExploreProgress() {

    const total = exploreFacilities.length;

    const visited = exploreFacilities.filter(
        function(facility) {

            return exploreVisited.includes(facility.id);

        }
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((visited / total) * 100);

    document.getElementById(
        "exploreProgressText"
    ).textContent =
        visited + " of " + total + " facilities explored";

    document.getElementById(
        "exploreProgressPercentage"
    ).textContent = percentage + "%";

    document.getElementById(
        "exploreProgressFill"
    ).style.width = percentage + "%";

    document.getElementById(
        "exploreProgressTrack"
    ).setAttribute("aria-valuenow", percentage);

    document.getElementById(
        "exploreFavouriteCount"
    ).textContent = exploreFavourites.length;

    document.getElementById(
        "exploreVisitedCount"
    ).textContent = visited;

}

// UPDATE FAVOURITE AND VISITED BUTTONS

function updateExploreButtons() {

    document.querySelectorAll(
        ".explore-card-favourite"
    ).forEach(function(button) {

        const saved = exploreFavourites.includes(
            button.dataset.id
        );

        button.classList.toggle("active", saved);

        button.setAttribute("aria-pressed", saved);

        button.innerHTML = saved
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';

    });

    if (activeExploreFacility) {

        const id = activeExploreFacility.id;

        document.getElementById(
            "exploreFavouriteButton"
        ).textContent = exploreFavourites.includes(id)
            ? "Remove from Favourites"
            : "Add to Favourites";

        document.getElementById(
            "exploreVisitedButton"
        ).textContent = exploreVisited.includes(id)
            ? "Mark as Unexplored"
            : "Mark as Explored";

    }

}

// UPDATE FACILITY DISPLAY

const originalExploreDisplay = displayExploreFacilities;

displayExploreFacilities = function(facilities) {

    let results = facilities;

    if (exploreActiveView === "favourites") {

        results = facilities.filter(function(facility) {

            return exploreFavourites.includes(facility.id);

        });

    }

    if (exploreActiveView === "explored") {

        results = facilities.filter(function(facility) {

            return exploreVisited.includes(facility.id);

        });

    }

    originalExploreDisplay(results);

    updateExploreButtons();

};

// SAVE OR REMOVE FAVOURITE

function toggleExploreFavourite(id) {

    if (exploreFavourites.includes(id)) {

        exploreFavourites = exploreFavourites.filter(
            function(item) {

                return item !== id;

            }
        );

    } else {

        exploreFavourites.push(id);

    }

    localStorage.setItem(
        EXPLORE_FAVOURITES_KEY,
        JSON.stringify(exploreFavourites)
    );

    updateExploreProgress();

    filterExploreFacilities();

}

// FAVOURITE BUTTON ON FACILITY CARDS

document.getElementById("exploreFacilitiesGrid")
    .addEventListener("click", function(event) {

        const button = event.target.closest(
            ".explore-card-favourite"
        );

        if (button) {

            toggleExploreFavourite(button.dataset.id);

        }

    });

// FAVOURITE BUTTON IN DETAILS PANEL

document.getElementById("exploreFavouriteButton")
    .addEventListener("click", function() {

        if (activeExploreFacility) {

            toggleExploreFavourite(
                activeExploreFacility.id
            );

        }

    });

// MARK FACILITY AS EXPLORED

document.getElementById("exploreVisitedButton")
    .addEventListener("click", function() {

        if (!activeExploreFacility) {
            return;
        }

        const id = activeExploreFacility.id;

        if (exploreVisited.includes(id)) {

            exploreVisited = exploreVisited.filter(
                function(item) {

                    return item !== id;

                }
            );

        } else {

            exploreVisited.push(id);

        }

        localStorage.setItem(
            EXPLORE_VISITED_KEY,
            JSON.stringify(exploreVisited)
        );

        updateExploreProgress();

        filterExploreFacilities();

    });

// ALL, FAVOURITES AND EXPLORED TABS

document.querySelectorAll(".explore-view-tab")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            exploreActiveView = button.dataset.view;

            document.querySelectorAll(".explore-view-tab")
                .forEach(function(tab) {

                    tab.classList.remove("active");

                    tab.setAttribute(
                        "aria-pressed", "false"
                    );

                });

            button.classList.add("active");

            button.setAttribute("aria-pressed", "true");

            filterExploreFacilities();

        });

    });

// UPDATE BUTTONS WHEN DETAILS ARE OPENED

const originalExploreDetails = showExploreFacilityDetails;

showExploreFacilityDetails = function(facility) {

    originalExploreDetails(facility);

    updateExploreButtons();

};

// RESET EXPLORE VIEW

document.getElementById("resetExploreFilters")
    .addEventListener("click", function() {

        exploreActiveView = "all";

        document.querySelectorAll(".explore-view-tab")
            .forEach(function(tab) {

                const active = tab.dataset.view === "all";

                tab.classList.toggle("active", active);

                tab.setAttribute("aria-pressed", active);

            });

        filterExploreFacilities();

    });

// INITIALIZE EXPLORE CAMPUS

updateExploreProgress();

filterExploreFacilities();


// =========================================
// UMS HELP SECTION
// =========================================

const umsTopics = [

    {
        id: "attendance",
        title: "Attendance",
        icon: "fa-clipboard-check",
        description: "Learn how to check your academic attendance.",
        keywords: "attendance percentage absent present classes",
        steps: [
            "Log in to the official UMS portal.",
            "Locate the academic attendance section.",
            "Select the relevant subject or semester, if required.",
            "Review your attendance records.",
            "Contact your faculty if you notice an incorrect entry."
        ],
        tip: "Check your attendance regularly and follow the university's current attendance requirements."
    },

    {
        id: "timetable",
        title: "Class Timetable",
        icon: "fa-calendar-days",
        description: "Find your class schedule and classroom information.",
        keywords: "schedule timetable classroom lecture room",
        steps: [
            "Log in to UMS.",
            "Locate your academic timetable.",
            "Check the date, subject and class timings.",
            "Note the classroom and block number.",
            "Check for any changes before attending classes."
        ],
        tip: "Use Find My Classroom in LPU FreshStart for additional classroom assistance."
    },

    {
        id: "assignments",
        title: "Assignments",
        icon: "fa-book-open",
        description: "Find academic assignments and submission information.",
        keywords: "assignment homework submission coursework ca",
        steps: [
            "Log in to the university's academic platform.",
            "Locate your course and assignment information.",
            "Read the instructions and submission deadline.",
            "Prepare your assignment in the required format.",
            "Submit through the platform specified by your faculty.",
            "Check whether your submission was successful."
        ],
        tip: "Keep a copy of your submitted assignment."
    },

    {
        id: "announcements",
        title: "Announcements",
        icon: "fa-bullhorn",
        description: "Stay informed about important university updates.",
        keywords: "notice announcements news events updates",
        steps: [
            "Log in to UMS.",
            "Look for university announcements and notices.",
            "Read relevant academic and administrative updates.",
            "Note important dates and deadlines.",
            "Follow the instructions provided by the university."
        ],
        tip: "Check official announcements regularly."
    },

    {
        id: "results",
        title: "Examination and Results",
        icon: "fa-graduation-cap",
        description: "Access examination information and academic results.",
        keywords: "exam marks grades result cgpa examination",
        steps: [
            "Log in to UMS.",
            "Locate examination or result-related services.",
            "Check the relevant semester or examination.",
            "Review available examination schedules or results.",
            "Contact the examination department for discrepancies."
        ],
        tip: "Always refer to official examination notices for confirmed dates."
    },

    {
        id: "fees",
        title: "Fee Details",
        icon: "fa-wallet",
        description: "Understand how to check university fee information.",
        keywords: "fees payment receipt dues scholarship finance",
        steps: [
            "Log in to the official UMS portal.",
            "Locate fee or financial information.",
            "Review outstanding dues and payment deadlines.",
            "Follow the university's official payment instructions.",
            "Keep your payment acknowledgement or receipt."
        ],
        tip: "Never make university payments through unverified links or personal accounts."
    },

    {
        id: "requests",
        title: "Leave and Requests",
        icon: "fa-file-lines",
        description: "Understand how to submit university-related requests.",
        keywords: "leave request application permission grievance",
        steps: [
            "Log in to UMS.",
            "Locate the appropriate request or support service.",
            "Choose the relevant request category.",
            "Provide the required information.",
            "Submit through the official process.",
            "Check the status of your request."
        ],
        tip: "Submitting a request does not automatically mean it has been approved."
    },

    {
        id: "login",
        title: "Login Assistance",
        icon: "fa-key",
        description: "Get help with common login and password issues.",
        keywords: "login password forgot account registration otp",
        steps: [
            "Open the official UMS portal.",
            "Check your university-issued login credentials.",
            "Ensure that your internet connection is working.",
            "Use the official password recovery option, if available.",
            "Contact university technical support if the issue continues."
        ],
        tip: "Never share your password or OTP with anyone."
    },

    {
        id: "technical",
        title: "Technical Support",
        icon: "fa-headset",
        description: "Troubleshoot common problems while accessing UMS.",
        keywords: "technical error loading website support problem",
        steps: [
            "Check your internet connection.",
            "Refresh the UMS page.",
            "Try another supported browser.",
            "Note the error message if the problem continues.",
            "Contact official university technical support."
        ],
        tip: "Hide personal information before sharing screenshots of technical errors."
    }

];

// DISPLAY UMS HELP TOPICS

function displayUmsTopics(topics) {

    const grid = document.getElementById("umsTopicsGrid");

    grid.innerHTML = "";

    document.getElementById(
        "umsSearchMessage"
    ).hidden = topics.length !== 0;

    topics.forEach(function(topic) {

        const card = document.createElement("button");

        card.type = "button";

        card.className = "ums-topic-card";

        card.innerHTML = `

            <span class="ums-topic-icon">
                <i class="fa-solid ${topic.icon}"></i>
            </span>

            <h3>${topic.title}</h3>

            <p>${topic.description}</p>

        `;

        card.addEventListener("click", function() {

            showUmsTopicDetails(topic);

        });

        grid.appendChild(card);

    });

}

// DISPLAY SELECTED TOPIC DETAILS

function showUmsTopicDetails(topic) {

    document.getElementById(
        "umsDetailTitle"
    ).textContent = topic.title;

    document.getElementById(
        "umsDetailDescription"
    ).textContent = topic.description;

    document.getElementById(
        "umsDetailTip"
    ).textContent = topic.tip;

    const stepsList = document.getElementById(
        "umsDetailSteps"
    );

    stepsList.innerHTML = "";

    topic.steps.forEach(function(step) {

        const item = document.createElement("li");

        item.textContent = step;

        stepsList.appendChild(item);

    });

    const details = document.getElementById(
        "umsTopicDetails"
    );

    details.hidden = false;

    details.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// CLOSE TOPIC DETAILS

document.getElementById("closeUmsDetails")
    .addEventListener("click", function() {

        document.getElementById(
            "umsTopicDetails"
        ).hidden = true;

    });

// SEARCH UMS HELP TOPICS

function searchUmsTopics() {

    const query = document.getElementById(
        "umsSearchInput"
    ).value.trim().toLowerCase();

    const results = umsTopics.filter(function(topic) {

        const searchableText = (

            topic.title + " " +
            topic.description + " " +
            topic.keywords

        ).toLowerCase();

        return searchableText.includes(query);

    });

    document.getElementById(
        "umsTopicDetails"
    ).hidden = true;

    displayUmsTopics(results);

}

document.getElementById("umsSearchInput")
    .addEventListener("input", searchUmsTopics);

document.getElementById("umsSearchForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        searchUmsTopics();

    });

// INITIALIZE UMS HELP

displayUmsTopics(umsTopics);


// =========================================
// FIRST 15 DAYS ONBOARDING DATABASE
// =========================================

const onboardingDays = [

    {
        day: 1,
        title: "Arrival and Registration",
        icon: "fa-id-card",
        description: "Begin your university journey by completing the essential arrival formalities.",
        tasks: [
            "Locate the university reporting centre.",
            "Complete the required arrival formalities.",
            "Confirm your admission and registration details.",
            "Save important university support contacts."
        ],
        link: "#support",
        linkText: "Student Support"
    },

    {
        day: 2,
        title: "Document Verification and Student ID",
        icon: "fa-file-circle-check",
        description: "Organize your documents and complete identification formalities.",
        tasks: [
            "Prepare the required academic documents.",
            "Complete document verification as instructed.",
            "Check the status of your student ID card.",
            "Complete your FreshStart student profile."
        ],
        link: "#profile",
        linkText: "My Profile"
    },

    {
        day: 3,
        title: "Accommodation and Essential Facilities",
        icon: "fa-bed",
        description: "Become familiar with your accommodation and everyday facilities.",
        tasks: [
            "Complete accommodation formalities if applicable.",
            "Locate nearby essential facilities.",
            "Understand accommodation rules and procedures.",
            "Identify the appropriate accommodation support contact."
        ],
        link: "#rules",
        linkText: "Hostel and University Rules"
    },

    {
        day: 4,
        title: "Campus Exploration",
        icon: "fa-map-location-dot",
        description: "Become familiar with important locations across the university.",
        tasks: [
            "Locate your academic block.",
            "Locate the Central Library.",
            "Explore important campus facilities.",
            "Identify student support offices."
        ],
        link: "#explore",
        linkText: "Explore Campus"
    },

    {
        day: 5,
        title: "UMS and Digital Services",
        icon: "fa-laptop",
        description: "Learn to access the university's essential digital services.",
        tasks: [
            "Access the official UMS portal.",
            "Understand how to check attendance.",
            "Locate academic announcements and timetable information.",
            "Review account security and login assistance."
        ],
        link: "#ums",
        linkText: "UMS Help"
    },

    {
        day: 6,
        title: "Department and Faculty Introduction",
        icon: "fa-chalkboard-user",
        description: "Get familiar with your academic department and faculty members.",
        tasks: [
            "Identify your academic department.",
            "Attend the scheduled departmental introduction.",
            "Identify your assigned mentor or academic advisor.",
            "Understand the basic structure of your programme."
        ],
        link: "#map",
        linkText: "University Map"
    },

    {
        day: 7,
        title: "Classroom and Timetable Familiarization",
        icon: "fa-calendar-days",
        description: "Prepare for regular classes by understanding your schedule and classroom locations.",
        tasks: [
            "Check your official academic timetable.",
            "Identify your assigned classrooms.",
            "Become familiar with your academic building.",
            "Review upcoming orientation activities."
        ],
        link: "#classroom",
        linkText: "Find My Classroom"
    },

    {
        day: 8,
        title: "Library and Learning Resources",
        icon: "fa-book-open",
        description: "Discover the academic resources available to support your studies.",
        tasks: [
            "Locate or visit the Central Library.",
            "Understand library access procedures.",
            "Learn about available digital learning resources.",
            "Identify useful study spaces."
        ],
        link: "#explore",
        linkText: "Explore Campus"
    },

    {
        day: 9,
        title: "Banking and Financial Services",
        icon: "fa-building-columns",
        description: "Become familiar with banking facilities and safe financial practices.",
        tasks: [
            "Locate nearby authorized banks and ATMs.",
            "Review available student banking assistance.",
            "Understand official university payment procedures.",
            "Learn how to recognize and report financial scams."
        ],
        link: "#banking",
        linkText: "Banking Assistance"
    },

    {
        day: 10,
        title: "Food and Dining Facilities",
        icon: "fa-utensils",
        description: "Discover convenient and suitable dining options around campus.",
        tasks: [
            "Locate nearby dining facilities.",
            "Check applicable mess timings and procedures.",
            "Identify suitable food options for your dietary needs.",
            "Learn where to report food-related concerns."
        ],
        link: "#food",
        linkText: "Food and Dining"
    },

    {
        day: 11,
        title: "University Rules and Safety",
        icon: "fa-shield-halved",
        description: "Understand important university policies and safety procedures.",
        tasks: [
            "Review university conduct guidelines.",
            "Understand applicable entry and exit procedures.",
            "Read the university's anti-ragging guidelines.",
            "Identify emergency and security support channels."
        ],
        link: "#rules",
        linkText: "Hostel and University Rules"
    },

    {
        day: 12,
        title: "Clubs and Extracurricular Activities",
        icon: "fa-people-group",
        description: "Discover opportunities to participate in university life beyond academics.",
        tasks: [
            "Explore available student clubs.",
            "Identify extracurricular activities of interest.",
            "Learn about sports and cultural facilities.",
            "Check upcoming student activities and events."
        ],
        link: "#explore",
        linkText: "Explore Campus"
    },

    {
        day: 13,
        title: "Student Support and Wellness",
        icon: "fa-hand-holding-heart",
        description: "Learn about the support services available throughout your university journey.",
        tasks: [
            "Identify academic and administrative support services.",
            "Locate campus healthcare facilities.",
            "Learn about counselling and wellness support.",
            "Review international student assistance resources."
        ],
        link: "#support",
        linkText: "Student Support"
    },

    {
        day: 14,
        title: "Academic Preparation",
        icon: "fa-graduation-cap",
        description: "Organize your academic responsibilities before continuing regular classes.",
        tasks: [
            "Review your course subjects and requirements.",
            "Organize your learning materials.",
            "Check upcoming assignments and deadlines.",
            "Prepare a manageable personal study schedule."
        ],
        link: "#ums",
        linkText: "UMS Help"
    },

    {
        day: 15,
        title: "Final Onboarding Review",
        icon: "fa-flag-checkered",
        description: "Review your onboarding journey and identify any remaining concerns.",
        tasks: [
            "Review your completed onboarding activities.",
            "Identify any remaining formalities.",
            "Seek assistance for unresolved concerns.",
            "Review your upcoming academic schedule."
        ],
        link: "#timetable",
        linkText: "View Timetable"
    }

];



// =========================================
// ONBOARDING CHECKLIST FUNCTIONALITY
// =========================================

const ONBOARDING_TASKS_KEY =
    "freshstart_onboarding_tasks";

let onboardingActiveFilter = "all";

// LOAD SAVED TASKS

function getSavedOnboardingTasks() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(
                ONBOARDING_TASKS_KEY
            ) || "[]"
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {

        return [];

    }

}

let completedOnboardingTasks =
    getSavedOnboardingTasks();

// CALCULATE DAILY TASK COMPLETION

function getDayCompletedTasks(day) {

    return day.tasks.filter(function(task, index) {

        return completedOnboardingTasks.includes(
            day.day + "-" + index
        );

    }).length;

}

function isOnboardingDayCompleted(day) {

    return getDayCompletedTasks(day) === day.tasks.length;

}

// DISPLAY DAILY CHECKLIST CARDS

function displayOnboardingDays() {

    const list = document.getElementById(
        "onboardingDaysList"
    );

    const openDays = Array.from(
        list.querySelectorAll("details[open]")
    ).map(function(card) {

        return card.dataset.day;

    });

    list.innerHTML = "";

    const filteredDays = onboardingDays.filter(
        function(day) {

            if (onboardingActiveFilter === "completed") {

                return isOnboardingDayCompleted(day);

            }

            if (onboardingActiveFilter === "pending") {

                return !isOnboardingDayCompleted(day);

            }

            return true;

        }
    );

    document.getElementById(
        "onboardingEmptyState"
    ).hidden = filteredDays.length !== 0;

    document.getElementById(
        "onboardingEmptyTitle"
    ).textContent =
        onboardingActiveFilter === "completed"
        ? "No completed days yet"
        : "No pending days";

    document.getElementById(
        "onboardingEmptyDescription"
    ).textContent =
        onboardingActiveFilter === "completed"
        ? "Complete all tasks for a day to see it here."
        : "Select All Days to review your checklist.";

    filteredDays.forEach(function(day) {

        const completed = getDayCompletedTasks(day);

        const isCompleted =
            isOnboardingDayCompleted(day);

        const percentage = Math.round(
            completed / day.tasks.length * 100
        );

        const card = document.createElement("details");

        card.className = "onboarding-day-card";

        card.dataset.day = day.day;

        card.open = openDays.includes(
            String(day.day)
        );

        if (isCompleted) {

            card.classList.add("completed");

        }

        let tasksHTML = "";

        day.tasks.forEach(function(task, index) {

            const taskId = day.day + "-" + index;

            const checked =
                completedOnboardingTasks.includes(taskId);

            tasksHTML += `

                <label class="onboarding-task">

                    <input type="checkbox"
                        class="onboarding-task-checkbox"
                        data-task-id="${taskId}"
                        ${checked ? "checked" : ""}>

                    <span>${task}</span>

                </label>

            `;

        });

        card.innerHTML = `

            <summary class="onboarding-day-header">

                <div class="onboarding-day-icon">

                    <i class="fa-solid ${
                        isCompleted
                        ? "fa-circle-check"
                        : day.icon
                    }"></i>

                </div>

                <div class="onboarding-day-info">

                    <span class="onboarding-day-number">
                        DAY ${day.day}
                    </span>

                    <h3>${day.title}</h3>

                </div>

                <span class="onboarding-day-status">

                    ${isCompleted
                        ? "Completed"
                        : completed + "/" + day.tasks.length}

                </span>

                <i class="fa-solid fa-chevron-down
                    onboarding-chevron"></i>

            </summary>

            <div class="onboarding-day-content">

                <p class="onboarding-day-description">

                    ${day.description}

                </p>

                <div class="onboarding-task-list">

                    ${tasksHTML}

                </div>

                <div class="onboarding-day-progress-track"
                    role="progressbar"
                    aria-label="Day ${day.day} progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="${percentage}">

                    <div class="onboarding-day-progress-fill"
                        style="width: ${percentage}%">

                    </div>

                </div>

                <p class="onboarding-day-progress-text">

                    ${completed} of ${day.tasks.length}
                    tasks completed

                </p>

                <a href="${day.link}"
                    class="onboarding-related-link">

                    ${day.linkText}

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

        `;

        list.appendChild(card);

    });

}

// UPDATE OVERALL ONBOARDING PROGRESS

function updateOnboardingProgress() {

    const completedDays = onboardingDays.filter(
        function(day) {

            return isOnboardingDayCompleted(day);

        }
    );

    const totalDays = onboardingDays.length;

    const completedCount = completedDays.length;

    const percentage = Math.round(
        completedCount / totalDays * 100
    );

    let totalTasks = 0;

    let completedTasks = 0;

    onboardingDays.forEach(function(day) {

        totalTasks += day.tasks.length;

        completedTasks += getDayCompletedTasks(day);

    });

    document.getElementById(
        "onboardingPercentage"
    ).textContent = percentage + "%";

    document.getElementById(
        "onboardingProgressFill"
    ).style.width = percentage + "%";

    document.getElementById(
        "onboardingProgressTrack"
    ).setAttribute("aria-valuenow", percentage);

    document.getElementById(
        "onboardingProgressText"
    ).textContent =
        completedCount + " of " + totalDays +
        " days completed";

    document.getElementById(
        "onboardingCompletedDays"
    ).textContent = completedCount;

    document.getElementById(
        "onboardingRemainingDays"
    ).textContent = totalDays - completedCount;

    document.getElementById(
        "onboardingTaskCount"
    ).textContent =
        completedTasks + " / " + totalTasks;

    document.getElementById(
        "onboardingCompletionBanner"
    ).hidden = completedCount !== totalDays;

    // CONNECT WITH DASHBOARD PROGRESS

    const completedDayNumbers = completedDays.map(
        function(day) {

            return day.day;

        }
    );

    localStorage.setItem(
        ONBOARDING_KEY,
        JSON.stringify(completedDayNumbers)
    );

    updateProgress();

}

// SAVE TASK COMPLETION

document.getElementById("onboardingDaysList")
    .addEventListener("change", function(event) {

        if (!event.target.matches(
            ".onboarding-task-checkbox"
        )) {

            return;

        }

        const taskId = event.target.dataset.taskId;

        if (event.target.checked) {

            if (!completedOnboardingTasks.includes(taskId)) {

                completedOnboardingTasks.push(taskId);

            }

        } else {

            completedOnboardingTasks =
                completedOnboardingTasks.filter(
                    function(item) {

                        return item !== taskId;

                    }
                );

        }

        localStorage.setItem(
            ONBOARDING_TASKS_KEY,
            JSON.stringify(completedOnboardingTasks)
        );

        updateOnboardingProgress();

        displayOnboardingDays();

    });

// FILTER DAILY CHECKLIST

function setOnboardingFilter(filter) {

    onboardingActiveFilter = filter;

    document.querySelectorAll(".onboarding-filter")
        .forEach(function(button) {

            const active =
                button.dataset.filter === filter;

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-pressed", active
            );

        });

    displayOnboardingDays();

}

document.querySelectorAll(".onboarding-filter")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            setOnboardingFilter(
                button.dataset.filter
            );

        });

    });

// VIEW ALL DAYS

document.getElementById("showAllOnboardingDays")
    .addEventListener("click", function() {

        setOnboardingFilter("all");

    });

// RESET ONBOARDING PROGRESS

document.getElementById("resetOnboardingProgress")
    .addEventListener("click", function() {

        const confirmed = confirm(

            "Are you sure you want to reset your " +
            "entire onboarding checklist progress?"

        );

        if (!confirmed) {

            return;

        }

        completedOnboardingTasks = [];

        localStorage.removeItem(
            ONBOARDING_TASKS_KEY
        );

        updateOnboardingProgress();

        setOnboardingFilter("all");

    });

// INITIALIZE ONBOARDING SECTION

displayOnboardingDays();

updateOnboardingProgress();


// =========================================
// STUDENT SUPPORT SERVICES DATABASE
// =========================================

const supportServices = [

    {
        id: "academic-support",
        title: "Academic Support",
        category: "academic",
        categoryName: "Academic",
        icon: "fa-graduation-cap",

        description: "Get assistance with academic concerns, classes, subjects and faculty guidance.",

        keywords: "faculty teacher mentor classes subjects attendance marks exams academic",

        issues: [
            "Difficulty understanding course subjects",
            "Attendance and academic concerns",
            "Classroom and timetable confusion",
            "Faculty and mentor guidance",
            "Academic performance concerns"
        ],

        steps: [
            "Identify your academic concern.",
            "Approach your faculty member or academic mentor.",
            "Explain your concern clearly.",
            "Contact your academic department if further assistance is required.",
            "Follow the official academic support procedure."
        ],

        department: "Academic Department or Assigned Mentor",
        location: "Your respective academic block",
        contact: "Check faculty and mentor details through UMS.",
        hours: "Confirm with your academic department.",

        tip: "Seek academic assistance early instead of waiting until examinations.",

        link: "#ums",
        linkText: "UMS Help"
    },

    {
        id: "technical-support",
        title: "Technical Support",
        category: "technical",
        categoryName: "Technical",
        icon: "fa-laptop-code",

        description: "Find assistance with UMS, university accounts, internet connectivity and technical problems.",

        keywords: "ums password login wifi internet account laptop software technical error",

        issues: [
            "UMS login problems",
            "Forgotten passwords",
            "University Wi-Fi connectivity",
            "University account access",
            "Technical errors in digital services"
        ],

        steps: [
            "Identify the technical problem.",
            "Check your internet connection.",
            "Review the troubleshooting guidance in UMS Help.",
            "Contact the official university technical support service.",
            "Provide relevant error information without sharing passwords."
        ],

        department: "University IT Support",
        location: "Confirm through official university sources.",
        contact: "Check the official UMS help channels.",
        hours: "Confirm with the technical support department.",

        tip: "Never share your password, OTP or account recovery codes.",

        link: "#ums",
        linkText: "UMS Help"
    },

    {
        id: "hostel-support",
        title: "Hostel Support",
        category: "campus",
        categoryName: "Campus Life",
        icon: "fa-bed",

        description: "Get guidance regarding accommodation, hostel facilities and maintenance concerns.",

        keywords: "hostel room roommate warden accommodation maintenance electricity water laundry",

        issues: [
            "Hostel room allocation concerns",
            "Water and electricity problems",
            "Room maintenance",
            "Hostel facilities and cleanliness",
            "Roommate-related concerns"
        ],

        steps: [
            "Identify the accommodation-related concern.",
            "Contact your hostel warden or designated staff member.",
            "Explain the issue and provide relevant room details privately.",
            "Use the official maintenance or complaint procedure.",
            "Follow up through the appropriate residential support channel."
        ],

        department: "Hostel Administration or Residential Services",
        location: "Your respective hostel office",
        contact: "Check the official hostel noticeboard or UMS.",
        hours: "Confirm with your hostel administration.",

        tip: "Keep your hostel warden's verified contact information accessible.",

        link: "#rules",
        linkText: "Hostel and University Rules"
    },

    {
        id: "medical-assistance",
        title: "Medical Assistance",
        category: "health",
        categoryName: "Health and Wellness",
        icon: "fa-hospital",

        description: "Find guidance for accessing healthcare and medical assistance on campus.",

        keywords: "doctor hospital medicine health illness injury medical emergency healthcare",

        issues: [
            "General health concerns",
            "Illness or injury",
            "Medical consultations",
            "Accessing campus healthcare facilities",
            "Understanding medical assistance procedures"
        ],

        steps: [
            "For a medical emergency, call 112 immediately.",
            "Inform a trusted adult or nearby university staff member.",
            "For non-emergency concerns, contact the campus healthcare service.",
            "Consult a qualified healthcare professional.",
            "Follow the medical professional's advice."
        ],

        department: "Campus Healthcare Services",
        location: "University healthcare facility; confirm its current location.",
        contact: "Check official university healthcare contacts. Emergency: 112.",
        hours: "Confirm directly with the healthcare facility.",

        tip: "Do not delay urgent medical assistance or rely on this portal for diagnosis.",

        link: "#map",
        linkText: "University Map"
    },

    {
        id: "counselling-support",
        title: "Counselling and Wellness",
        category: "health",
        categoryName: "Health and Wellness",
        icon: "fa-hand-holding-heart",

        description: "Find support for emotional wellbeing and adjustment to university life.",

        keywords: "stress anxiety homesickness loneliness counselling wellness adjustment emotional",

        issues: [
            "Homesickness",
            "Academic stress",
            "Difficulty adjusting to university life",
            "Feeling overwhelmed",
            "Personal and emotional concerns"
        ],

        steps: [
            "Speak with a trusted adult, family member or faculty mentor.",
            "Contact the university's counselling or wellness service.",
            "Ask about available appointments and confidentiality.",
            "Discuss your concerns with a qualified professional.",
            "Continue seeking support whenever needed."
        ],

        department: "University Counselling and Wellness Services",
        location: "Confirm through official student support channels.",
        contact: "Request verified counselling contact details from the university.",
        hours: "Confirm appointment availability with the service.",

        tip: "You do not need to wait until a concern becomes serious before seeking support.",

        link: "#onboarding",
        linkText: "First 15 Days"
    },

    {
        id: "anti-ragging-support",
        title: "Anti-Ragging Support",
        category: "safety",
        categoryName: "Safety",
        icon: "fa-shield-halved",

        description: "Understand how to seek assistance and report ragging, bullying or harassment.",

        keywords: "ragging bullying harassment discrimination abuse threat safety complaint",

        issues: [
            "Ragging incidents",
            "Bullying and intimidation",
            "Harassment",
            "Threatening behaviour",
            "Concerns about student safety"
        ],

        steps: [
            "Move to a safe place if possible.",
            "Call 112 if you are in immediate danger.",
            "Inform a trusted adult, university staff member or campus security.",
            "Contact the official university anti-ragging service.",
            "Follow the official reporting procedure with appropriate support."
        ],

        department: "University Anti-Ragging Committee",
        location: "Confirm through official university channels.",
        contact: "Check the university's official anti-ragging contact information.",
        hours: "Confirm with the official service.",

        tip: "You do not have to confront the person responsible. Prioritize your safety and seek assistance.",

        link: "#rules",
        linkText: "University Rules"
    },

    {
        id: "lost-and-found",
        title: "Lost and Found",
        category: "campus",
        categoryName: "Campus Life",
        icon: "fa-magnifying-glass",

        description: "Get guidance when personal belongings or university identification items are misplaced.",

        keywords: "lost found missing wallet phone bag id card keys belongings",

        issues: [
            "Lost student ID card",
            "Misplaced mobile phone",
            "Lost wallet or bag",
            "Missing personal belongings",
            "Found items belonging to another student"
        ],

        steps: [
            "Recall where the item was last seen.",
            "Check nearby staffed reception areas.",
            "Inform campus security or the appropriate university office.",
            "Provide a description of the missing item.",
            "Follow the official recovery or replacement procedure."
        ],

        department: "Campus Security or Designated Lost and Found Service",
        location: "Confirm the appropriate reporting location.",
        contact: "Check official campus security contact details.",
        hours: "Confirm with the relevant university service.",

        tip: "If a bank card is missing, contact your bank promptly through its official channels.",

        link: "#map",
        linkText: "University Map"
    },

    {
        id: "administrative-support",
        title: "Administrative Support",
        category: "administrative",
        categoryName: "Administrative",
        icon: "fa-file-lines",

        description: "Find assistance with university documents, registration and administrative formalities.",

        keywords: "documents registration admission certificate verification fees records identity card",

        issues: [
            "Document verification",
            "Student registration concerns",
            "Student ID card assistance",
            "Incorrect university records",
            "Certificates and administrative requests"
        ],

        steps: [
            "Identify the administrative requirement.",
            "Check relevant university announcements and UMS.",
            "Prepare the required documents.",
            "Approach the appropriate administrative department.",
            "Follow the official request procedure."
        ],

        department: "Relevant University Administrative Office",
        location: "Confirm the office location through university sources.",
        contact: "Check official university contact details or UMS.",
        hours: "Confirm official office timings.",

        tip: "Submit sensitive documents only through authorized university channels.",

        link: "#onboarding",
        linkText: "First 15 Days"
    },

    {
        id: "campus-security",
        title: "Campus Security",
        category: "safety",
        categoryName: "Safety",
        icon: "fa-user-shield",

        description: "Find assistance with campus safety, security concerns and emergency situations.",

        keywords: "security emergency danger unsafe theft gate safety suspicious",

        issues: [
            "Campus safety concerns",
            "Theft or missing property",
            "Unsafe situations",
            "Security-related assistance",
            "Campus entry and exit concerns"
        ],

        steps: [
            "Move to a safe and staffed location if possible.",
            "Call 112 if there is immediate danger.",
            "Approach nearby university security personnel.",
            "Inform a trusted adult or university staff member.",
            "Follow the official security reporting procedure."
        ],

        department: "University Security and Safety Services",
        location: "Nearest staffed campus security point",
        contact: "Check official campus security contacts. Emergency: 112.",
        hours: "Confirm campus security service availability.",

        tip: "Prioritize your personal safety rather than investigating a dangerous situation yourself.",

        link: "#map",
        linkText: "University Map"
    },

    {
        id: "international-support",
        title: "International Student Support",
        category: "international",
        categoryName: "International",
        icon: "fa-earth-asia",

        description: "Find guidance for international students adjusting to university life in India.",

        keywords: "international foreign language translator visa passport culture frro sim currency",

        issues: [
            "Language and communication difficulties",
            "Cultural adjustment",
            "International student documentation",
            "Visa and registration guidance",
            "Understanding local facilities and services"
        ],

        steps: [
            "Identify the type of assistance required.",
            "Contact the university's international student support service.",
            "Request guidance about the relevant official procedure.",
            "Prepare documents only when requested through authorized channels.",
            "Use the International Help Desk for general onboarding guidance."
        ],

        department: "University International Affairs or International Student Services",
        location: "Confirm through official university sources.",
        contact: "Check official international student support contacts.",
        hours: "Confirm with the relevant department.",

        tip: "Use official government and university sources for visa and immigration requirements.",

        link: "#international",
        linkText: "International Help Desk"
    }

];


// =========================================
// STUDENT SUPPORT FUNCTIONALITY
// =========================================

const supportServicesGrid = document.getElementById(
    "supportServicesGrid"
);

const supportSearchInput = document.getElementById(
    "supportSearchInput"
);

const supportSearchForm = document.getElementById(
    "supportSearchForm"
);

const supportServiceDetails = document.getElementById(
    "supportServiceDetails"
);

let supportActiveCategory = "all";

// DISPLAY SUPPORT SERVICE CARDS

function displaySupportServices(services) {

    supportServicesGrid.innerHTML = "";

    document.getElementById(
        "supportResultCount"
    ).textContent = services.length +
        (services.length === 1 ? " service" : " services");

    document.getElementById(
        "supportEmptyState"
    ).hidden = services.length !== 0;

    services.forEach(function(service) {

        const card = document.createElement("article");

        card.className = "support-service-card";

        card.innerHTML = `

            <div class="support-service-icon">

                <i class="fa-solid ${service.icon}"></i>

            </div>

            <h3>${service.title}</h3>

            <p>${service.description}</p>

            <button type="button"
                class="support-service-button"
                data-id="${service.id}">

                Get Assistance

                <i class="fa-solid fa-arrow-right"></i>

            </button>

        `;

        supportServicesGrid.appendChild(card);

    });

}

// SEARCH AND FILTER SUPPORT SERVICES

function filterSupportServices() {

    const query = supportSearchInput.value
        .trim()
        .toLowerCase();

    const filteredServices = supportServices.filter(
        function(service) {

            const matchesCategory =
                supportActiveCategory === "all" ||
                service.category === supportActiveCategory;

            const searchableText = [

                service.title,
                service.description,
                service.categoryName,
                service.keywords,
                service.department,
                service.issues.join(" ")

            ].join(" ").toLowerCase();

            const matchesSearch =
                searchableText.includes(query);

            return matchesCategory && matchesSearch;

        }
    );

    supportServiceDetails.hidden = true;

    displaySupportServices(filteredServices);

}

// SEARCH INPUT

supportSearchInput.addEventListener(
    "input",
    filterSupportServices
);

// SEARCH FORM

supportSearchForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        filterSupportServices();

    }
);

// CATEGORY FILTER BUTTONS

function setSupportCategory(category) {

    supportActiveCategory = category;

    document.querySelectorAll(".support-filter")
        .forEach(function(button) {

            const active =
                button.dataset.category === category;

            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-pressed", active
            );

        });

    filterSupportServices();

}

document.querySelectorAll(".support-filter")
    .forEach(function(button) {

        button.addEventListener("click", function() {

            setSupportCategory(
                button.dataset.category
            );

        });

    });

// RESET SEARCH AND FILTERS

document.getElementById("resetSupportFilters")
    .addEventListener("click", function() {

        supportSearchInput.value = "";

        setSupportCategory("all");

    });

// DISPLAY SUPPORT SERVICE DETAILS

function showSupportServiceDetails(service) {

    document.getElementById(
        "supportDetailCategory"
    ).textContent = service.categoryName;

    document.getElementById(
        "supportDetailTitle"
    ).textContent = service.title;

    document.getElementById(
        "supportDetailDescription"
    ).textContent = service.description;

    // DISPLAY COMMON ISSUES

    const issuesList = document.getElementById(
        "supportDetailIssues"
    );

    issuesList.innerHTML = "";

    service.issues.forEach(function(issue) {

        const item = document.createElement("li");

        item.textContent = issue;

        issuesList.appendChild(item);

    });

    // DISPLAY ASSISTANCE STEPS

    const stepsList = document.getElementById(
        "supportDetailSteps"
    );

    stepsList.innerHTML = "";

    service.steps.forEach(function(step) {

        const item = document.createElement("li");

        item.textContent = step;

        stepsList.appendChild(item);

    });

    // DISPLAY CONTACT INFORMATION

    document.getElementById(
        "supportDetailDepartment"
    ).textContent = service.department;

    document.getElementById(
        "supportDetailLocation"
    ).textContent = service.location;

    document.getElementById(
        "supportDetailContact"
    ).textContent = service.contact;

    document.getElementById(
        "supportDetailHours"
    ).textContent = service.hours;

    // DISPLAY IMPORTANT GUIDANCE

    document.getElementById(
        "supportDetailTip"
    ).textContent = service.tip;

    // UPDATE RELATED SECTION LINK

    document.getElementById(
        "supportRelatedLink"
    ).setAttribute("href", service.link);

    document.getElementById(
        "supportRelatedLinkText"
    ).textContent = service.linkText;

    // SHOW DETAILS PANEL

    supportServiceDetails.hidden = false;

    supportServiceDetails.scrollIntoView({

        block: "start"

    });

}

// GET ASSISTANCE BUTTONS

supportServicesGrid.addEventListener(
    "click",
    function(event) {

        const button = event.target.closest(
            ".support-service-button"
        );

        if (!button) {

            return;

        }

        const service = supportServices.find(
            function(item) {

                return item.id === button.dataset.id;

            }
        );

        if (service) {

            showSupportServiceDetails(service);

        }

    }
);

// CLOSE SUPPORT DETAILS

document.getElementById("closeSupportDetails")
    .addEventListener("click", function() {

        supportServiceDetails.hidden = true;

    });

// INITIALIZE STUDENT SUPPORT

displaySupportServices(supportServices);


// =========================================
// INTERNATIONAL MULTILINGUAL PHRASE DATABASE
// =========================================

const internationalPhrases = [

    // GREETINGS

    {
        id: 1,
        category: "greetings",
        en: "Hello",
        hi: "नमस्ते",
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
        hiPronunciation: "Namaste",
        paPronunciation: "Sat Sri Akaal"
    },

    {
        id: 2,
        category: "greetings",
        en: "Thank you",
        hi: "धन्यवाद",
        pa: "ਧੰਨਵਾਦ",
        hiPronunciation: "Dhanyavaad",
        paPronunciation: "Dhanvaad"
    },

    {
        id: 3,
        category: "greetings",
        en: "How are you?",
        hi: "आप कैसे हैं?",
        pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
        hiPronunciation: "Aap kaise hain?",
        paPronunciation: "Tusi kiven ho?"
    },

    {
        id: 4,
        category: "greetings",
        en: "Sorry",
        hi: "माफ़ कीजिए",
        pa: "ਮਾਫ਼ ਕਰਨਾ",
        hiPronunciation: "Maaf kijiye",
        paPronunciation: "Maaf karna"
    },

    {
        id: 5,
        category: "greetings",
        en: "I do not understand",
        hi: "मुझे समझ नहीं आया",
        pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ",
        hiPronunciation: "Mujhe samajh nahi aaya",
        paPronunciation: "Mainu samajh nahi aayi"
    },

    // DIRECTIONS

    {
        id: 6,
        category: "directions",
        en: "Where is the library?",
        hi: "पुस्तकालय कहाँ है?",
        pa: "ਲਾਇਬ੍ਰੇਰੀ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Pustakalaya kahaan hai?",
        paPronunciation: "Library kithe hai?"
    },

    {
        id: 7,
        category: "directions",
        en: "Where is my classroom?",
        hi: "मेरी कक्षा कहाँ है?",
        pa: "ਮੇਰੀ ਕਲਾਸ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Meri kaksha kahaan hai?",
        paPronunciation: "Meri class kithe hai?"
    },

    {
        id: 8,
        category: "directions",
        en: "Where is the hostel?",
        hi: "छात्रावास कहाँ है?",
        pa: "ਹੋਸਟਲ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Chhatraavaas kahaan hai?",
        paPronunciation: "Hostel kithe hai?"
    },

    {
        id: 9,
        category: "directions",
        en: "Where is the main gate?",
        hi: "मुख्य द्वार कहाँ है?",
        pa: "ਮੁੱਖ ਗੇਟ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Mukhya dvaar kahaan hai?",
        paPronunciation: "Mukh gate kithe hai?"
    },

    {
        id: 10,
        category: "directions",
        en: "Where is the washroom?",
        hi: "शौचालय कहाँ है?",
        pa: "ਵਾਸ਼ਰੂਮ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Shauchalaya kahaan hai?",
        paPronunciation: "Washroom kithe hai?"
    },

    // ACADEMIC

    {
        id: 11,
        category: "academic",
        en: "When does the class start?",
        hi: "कक्षा कब शुरू होती है?",
        pa: "ਕਲਾਸ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?",
        hiPronunciation: "Kaksha kab shuru hoti hai?",
        paPronunciation: "Class kadon shuru hundi hai?"
    },

    {
        id: 12,
        category: "academic",
        en: "Where is the department office?",
        hi: "विभाग का कार्यालय कहाँ है?",
        pa: "ਵਿਭਾਗ ਦਾ ਦਫ਼ਤਰ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Vibhaag ka karyalaya kahaan hai?",
        paPronunciation: "Vibhaag da daftar kithe hai?"
    },

    {
        id: 13,
        category: "academic",
        en: "Please explain again",
        hi: "कृपया फिर से समझाइए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਸਮਝਾਓ",
        hiPronunciation: "Kripaya phir se samjhaiye",
        paPronunciation: "Kirpa karke dubara samjhao"
    },

    {
        id: 14,
        category: "academic",
        en: "Can you speak English?",
        hi: "क्या आप अंग्रेज़ी बोल सकते हैं?",
        pa: "ਕੀ ਤੁਸੀਂ ਅੰਗਰੇਜ਼ੀ ਬੋਲ ਸਕਦੇ ਹੋ?",
        hiPronunciation: "Kya aap Angrezi bol sakte hain?",
        paPronunciation: "Ki tusi Angrezi bol sakde ho?"
    },

    {
        id: 15,
        category: "academic",
        en: "I need help with my timetable",
        hi: "मुझे अपनी समय-सारणी समझने में मदद चाहिए",
        pa: "ਮੈਨੂੰ ਆਪਣਾ ਟਾਈਮਟੇਬਲ ਸਮਝਣ ਲਈ ਮਦਦ ਚਾਹੀਦੀ ਹੈ",
        hiPronunciation: "Mujhe apni samay-saarani samajhne mein madad chahiye",
        paPronunciation: "Mainu apna timetable samajhan layi madad chahidi hai"
    },

    // FOOD

    {
        id: 16,
        category: "food",
        en: "I need drinking water",
        hi: "मुझे पीने का पानी चाहिए",
        pa: "ਮੈਨੂੰ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ",
        hiPronunciation: "Mujhe peene ka paani chahiye",
        paPronunciation: "Mainu peen wala paani chahida hai"
    },

    {
        id: 17,
        category: "food",
        en: "Is this vegetarian?",
        hi: "क्या यह शाकाहारी है?",
        pa: "ਕੀ ਇਹ ਸ਼ਾਕਾਹਾਰੀ ਹੈ?",
        hiPronunciation: "Kya yeh shakahari hai?",
        paPronunciation: "Ki eh shakahari hai?"
    },

    {
        id: 18,
        category: "food",
        en: "Please make it less spicy",
        hi: "कृपया कम मिर्च डालिए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਘੱਟ ਮਿਰਚ ਪਾਓ",
        hiPronunciation: "Kripaya kam mirch daaliye",
        paPronunciation: "Kirpa karke ghatt mirch pao"
    },

    {
        id: 19,
        category: "food",
        en: "I have a food allergy",
        hi: "मुझे खाने की कुछ चीज़ों से एलर्जी है",
        pa: "ਮੈਨੂੰ ਖਾਣ ਦੀਆਂ ਕੁਝ ਚੀਜ਼ਾਂ ਤੋਂ ਐਲਰਜੀ ਹੈ",
        hiPronunciation: "Mujhe khaane ki kuch cheezon se allergy hai",
        paPronunciation: "Mainu khaan diyan kujh cheezan ton allergy hai"
    },

    {
        id: 20,
        category: "food",
        en: "Where is the canteen?",
        hi: "कैंटीन कहाँ है?",
        pa: "ਕੰਟੀਨ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Canteen kahaan hai?",
        paPronunciation: "Canteen kithe hai?"
    },

    // SHOPPING

    {
        id: 21,
        category: "shopping",
        en: "How much does this cost?",
        hi: "इसकी कीमत कितनी है?",
        pa: "ਇਸ ਦੀ ਕੀਮਤ ਕਿੰਨੀ ਹੈ?",
        hiPronunciation: "Iski keemat kitni hai?",
        paPronunciation: "Is di keemat kinni hai?"
    },

    {
        id: 22,
        category: "shopping",
        en: "Can I pay by card?",
        hi: "क्या मैं कार्ड से भुगतान कर सकता हूँ?",
        pa: "ਕੀ ਮੈਂ ਕਾਰਡ ਨਾਲ ਭੁਗਤਾਨ ਕਰ ਸਕਦਾ ਹਾਂ?",
        hiPronunciation: "Kya main card se bhugtaan kar sakta hoon?",
        paPronunciation: "Ki main card naal bhugtaan kar sakda haan?"
    },

    {
        id: 23,
        category: "shopping",
        en: "Please give me a receipt",
        hi: "कृपया मुझे रसीद दीजिए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਰਸੀਦ ਦਿਓ",
        hiPronunciation: "Kripaya mujhe raseed dijiye",
        paPronunciation: "Kirpa karke mainu raseed deo"
    },

    {
        id: 24,
        category: "shopping",
        en: "Where is the nearest ATM?",
        hi: "सबसे नज़दीकी एटीएम कहाँ है?",
        pa: "ਸਭ ਤੋਂ ਨੇੜੇ ਏਟੀਐਮ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Sabse nazdeeki ATM kahaan hai?",
        paPronunciation: "Sabh ton nere ATM kithe hai?"
    },

    {
        id: 25,
        category: "shopping",
        en: "I do not need this",
        hi: "मुझे इसकी ज़रूरत नहीं है",
        pa: "ਮੈਨੂੰ ਇਸ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ",
        hiPronunciation: "Mujhe iski zaroorat nahi hai",
        paPronunciation: "Mainu is di lor nahi hai"
    },

    // TRANSPORT

    {
        id: 26,
        category: "transport",
        en: "Where is the bus stop?",
        hi: "बस स्टॉप कहाँ है?",
        pa: "ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Bus stop kahaan hai?",
        paPronunciation: "Bus stop kithe hai?"
    },

    {
        id: 27,
        category: "transport",
        en: "How far is it?",
        hi: "यह कितनी दूर है?",
        pa: "ਇਹ ਕਿੰਨੀ ਦੂਰ ਹੈ?",
        hiPronunciation: "Yeh kitni door hai?",
        paPronunciation: "Eh kinni door hai?"
    },

    {
        id: 28,
        category: "transport",
        en: "What is the fare?",
        hi: "किराया कितना है?",
        pa: "ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?",
        hiPronunciation: "Kiraaya kitna hai?",
        paPronunciation: "Kiraaya kinna hai?"
    },

    {
        id: 29,
        category: "transport",
        en: "Please stop here",
        hi: "कृपया यहाँ रोकिए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਰੋਕੋ",
        hiPronunciation: "Kripaya yahaan rokiye",
        paPronunciation: "Kirpa karke ithe roko"
    },

    {
        id: 30,
        category: "transport",
        en: "Where is the railway station?",
        hi: "रेलवे स्टेशन कहाँ है?",
        pa: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?",
        hiPronunciation: "Railway station kahaan hai?",
        paPronunciation: "Railway station kithe hai?"
    },

    // EMERGENCY

    {
        id: 31,
        category: "emergency",
        en: "Please help me",
        hi: "कृपया मेरी मदद करें",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ",
        hiPronunciation: "Kripaya meri madad karein",
        paPronunciation: "Kirpa karke meri madad karo"
    },

    {
        id: 32,
        category: "emergency",
        en: "I am lost",
        hi: "मुझे रास्ता नहीं मिल रहा है",
        pa: "ਮੈਨੂੰ ਰਸਤਾ ਨਹੀਂ ਲੱਭ ਰਿਹਾ",
        hiPronunciation: "Mujhe raasta nahi mil raha hai",
        paPronunciation: "Mainu rasta nahi labh reha"
    },

    {
        id: 33,
        category: "emergency",
        en: "I need a doctor",
        hi: "मुझे डॉक्टर की ज़रूरत है",
        pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਦੀ ਲੋੜ ਹੈ",
        hiPronunciation: "Mujhe doctor ki zaroorat hai",
        paPronunciation: "Mainu doctor di lor hai"
    },

    {
        id: 34,
        category: "emergency",
        en: "Please call campus security",
        hi: "कृपया कैंपस सुरक्षा कर्मियों को बुलाइए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਕੈਂਪਸ ਸੁਰੱਖਿਆ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਬੁਲਾਓ",
        hiPronunciation: "Kripaya campus suraksha karmiyon ko bulaiye",
        paPronunciation: "Kirpa karke campus surakhya karamchariyan nu bulao"
    },

    {
        id: 35,
        category: "emergency",
        en: "Please call an ambulance",
        hi: "कृपया एम्बुलेंस बुलाइए",
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ",
        hiPronunciation: "Kripaya ambulance bulaiye",
        paPronunciation: "Kirpa karke ambulance bulao"
    }

];


// =========================================
// INTERNATIONAL TRANSLATOR FUNCTIONALITY
// =========================================

const internationalTranslatorForm =
    document.getElementById("internationalTranslatorForm");

const translationSource =
    document.getElementById("translationSource");

const translationTarget =
    document.getElementById("translationTarget");

const translationInput =
    document.getElementById("translationInput");

const translationOutput =
    document.getElementById("translationOutput");

const translationResultPanel =
    document.getElementById("translationResultPanel");

const internationalLanguageNames = {
    en: "English",
    hi: "Hindi",
    pa: "Punjabi"
};

const internationalSpeechLanguages = {
    en: "en-IN",
    hi: "hi-IN",
    pa: "pa-IN"
};

let currentInternationalTranslation = "";
let currentInternationalLanguage = "";


// NORMALIZE TEXT FOR MATCHING

function normalizeInternationalText(text) {

    return text
        .normalize("NFC")
        .toLowerCase()
        .trim()
        .replace(/[?!.,।]/g, "")
        .replace(/\s+/g, " ");

}


// DISPLAY MESSAGES

function showInternationalMessage(id, message, type) {

    const element = document.getElementById(id);

    element.textContent = message;

    element.classList.remove("error", "success");

    if (type) {
        element.classList.add(type);
    }

    element.hidden = false;

}


// CHARACTER COUNTER

function updateTranslationCharacterCount() {

    document.getElementById(
        "translationCharacterCount"
    ).textContent =
        translationInput.value.length + " / 500 characters";

}


// RESET TRANSLATION RESULT

function resetInternationalTranslationResult() {

    currentInternationalTranslation = "";
    currentInternationalLanguage = "";

    translationResultPanel.hidden = true;

    translationOutput.textContent = "";

    document.getElementById(
        "translationPronunciation"
    ).textContent = "";

    document.getElementById(
        "translationMessage"
    ).hidden = true;

}


// INPUT EVENT

translationInput.addEventListener("input", function () {

    updateTranslationCharacterCount();

    resetInternationalTranslationResult();

});


// LANGUAGE CHANGE EVENTS

translationSource.addEventListener(
    "change",
    resetInternationalTranslationResult
);

translationTarget.addEventListener(
    "change",
    resetInternationalTranslationResult
);


// TRANSLATION FUNCTION

function performInternationalTranslation() {

    const source = translationSource.value;

    const target = translationTarget.value;

    const input = translationInput.value.trim();

    resetInternationalTranslationResult();

    if (input === "") {

        showInternationalMessage(
            "translationMessage",
            "Please enter a word or phrase.",
            "error"
        );

        return;

    }

    if (source === target) {

        showInternationalMessage(
            "translationMessage",
            "Please select two different languages.",
            "error"
        );

        return;

    }

    const normalizedInput =
        normalizeInternationalText(input);

    const matchingPhrase = internationalPhrases.find(
        function (phrase) {

            const originalText =
                normalizeInternationalText(phrase[source]);

            const pronunciation =
                phrase[source + "Pronunciation"] || "";

            return originalText === normalizedInput ||

                (
                    pronunciation !== "" &&
                    normalizeInternationalText(pronunciation)
                        === normalizedInput
                );

        }
    );

    if (!matchingPhrase) {

        showInternationalMessage(
            "translationMessage",
            "This phrase is not available in our built-in database. Please use Google Translate for a more detailed translation.",
            "error"
        );

        return;

    }

    currentInternationalTranslation =
        matchingPhrase[target];

    currentInternationalLanguage = target;

    translationOutput.textContent =
        currentInternationalTranslation;

    translationOutput.lang = target;

    const pronunciation =
        matchingPhrase[target + "Pronunciation"];

    document.getElementById(
        "translationPronunciation"
    ).textContent = pronunciation
        ? "Pronunciation: " + pronunciation
        : "";

    translationResultPanel.hidden = false;

}


// TRANSLATOR FORM

internationalTranslatorForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        performInternationalTranslation();

    }
);


// SWAP LANGUAGES

document.getElementById(
    "swapTranslationLanguages"
).addEventListener("click", function () {

    const previousSource = translationSource.value;

    translationSource.value = translationTarget.value;

    translationTarget.value = previousSource;

    if (currentInternationalTranslation !== "") {

        translationInput.value =
            currentInternationalTranslation;

    }

    updateTranslationCharacterCount();

    resetInternationalTranslationResult();

});


// CLEAR TRANSLATOR

document.getElementById(
    "clearTranslation"
).addEventListener("click", function () {

    translationInput.value = "";

    resetInternationalTranslationResult();

    updateTranslationCharacterCount();

    translationInput.focus();

});


// =========================================
// PRONUNCIATION FUNCTIONALITY
// =========================================

function speakInternationalText(text, language, messageId) {

    if (
        !("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)
    ) {

        showInternationalMessage(
            messageId,
            "Pronunciation is not supported by your browser.",
            "error"
        );

        return;

    }

    const voices = window.speechSynthesis.getVoices();

    const languageVoice = voices.find(function (voice) {

        return voice.lang.toLowerCase().split("-")[0]
            === language;

    });

    if (!languageVoice) {

        showInternationalMessage(
            messageId,
            "A voice for " +
            internationalLanguageNames[language] +
            " is not currently available. Please use the written pronunciation guide.",
            "error"
        );

        return;

    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = internationalSpeechLanguages[language];

    speech.voice = languageVoice;

    speech.rate = 0.85;

    speech.pitch = 1;

    speech.onerror = function (event) {

        if (
            event.error === "canceled" ||
            event.error === "interrupted"
        ) {
            return;
        }

        showInternationalMessage(
            messageId,
            "Pronunciation could not be played.",
            "error"
        );

    };

    window.speechSynthesis.speak(speech);

}


// LOAD AVAILABLE BROWSER VOICES

if ("speechSynthesis" in window) {

    window.speechSynthesis.getVoices();

    window.speechSynthesis.addEventListener(
        "voiceschanged",
        function () {
            window.speechSynthesis.getVoices();
        }
    );

}


// LISTEN TO TRANSLATION

document.getElementById(
    "speakTranslation"
).addEventListener("click", function () {

    if (currentInternationalTranslation !== "") {

        speakInternationalText(
            currentInternationalTranslation,
            currentInternationalLanguage,
            "translationMessage"
        );

    }

});


// =========================================
// COPY FUNCTIONALITY
// =========================================

async function copyInternationalText(text, messageId) {

    try {

        if (!navigator.clipboard) {

            throw new Error("Clipboard unavailable");

        }

        await navigator.clipboard.writeText(text);

        showInternationalMessage(
            messageId,
            "Text copied successfully.",
            "success"
        );

    } catch (error) {

        showInternationalMessage(
            messageId,
            "Automatic copying is unavailable. Please select and copy the text manually.",
            "error"
        );

    }

}


// COPY TRANSLATION

document.getElementById(
    "copyTranslation"
).addEventListener("click", function () {

    if (currentInternationalTranslation !== "") {

        copyInternationalText(
            currentInternationalTranslation,
            "translationMessage"
        );

    }

});


// =========================================
// COMMON PHRASES FUNCTIONALITY
// =========================================

const internationalPhrasesGrid =
    document.getElementById("internationalPhrasesGrid");

const internationalPhraseSearch =
    document.getElementById("internationalPhraseSearch");

let internationalActiveCategory = "all";


// GENERATE PHRASE CARDS

function displayInternationalPhrases(phrases) {

    internationalPhrasesGrid.innerHTML = "";

    document.getElementById(
        "internationalPhraseCount"
    ).textContent = phrases.length +
        (phrases.length === 1 ? " phrase" : " phrases");

    document.getElementById(
        "internationalPhraseEmpty"
    ).hidden = phrases.length !== 0;

    phrases.forEach(function (phrase) {

        const card = document.createElement("article");

        card.className = "international-phrase-card";

        card.innerHTML = `

            <h3 lang="en">${phrase.en}</h3>

            <div class="international-phrase-language">

                <strong>Hindi</strong>

                <div class="international-phrase-text"
                    lang="hi">

                    ${phrase.hi}

                </div>

                <div class="international-phrase-pronunciation">

                    ${phrase.hiPronunciation}

                </div>

                <div class="international-phrase-actions">

                    <button type="button"
                        class="international-phrase-button"
                        data-id="${phrase.id}"
                        data-language="hi"
                        data-action="listen">

                        <i class="fa-solid fa-volume-high"></i>

                        Listen

                    </button>

                    <button type="button"
                        class="international-phrase-button"
                        data-id="${phrase.id}"
                        data-language="hi"
                        data-action="copy">

                        <i class="fa-solid fa-copy"></i>

                        Copy

                    </button>

                </div>

            </div>

            <div class="international-phrase-language">

                <strong>Punjabi</strong>

                <div class="international-phrase-text"
                    lang="pa">

                    ${phrase.pa}

                </div>

                <div class="international-phrase-pronunciation">

                    ${phrase.paPronunciation}

                </div>

                <div class="international-phrase-actions">

                    <button type="button"
                        class="international-phrase-button"
                        data-id="${phrase.id}"
                        data-language="pa"
                        data-action="listen">

                        <i class="fa-solid fa-volume-high"></i>

                        Listen

                    </button>

                    <button type="button"
                        class="international-phrase-button"
                        data-id="${phrase.id}"
                        data-language="pa"
                        data-action="copy">

                        <i class="fa-solid fa-copy"></i>

                        Copy

                    </button>

                </div>

            </div>

            <div class="international-phrase-actions">

                <button type="button"
                    class="international-phrase-button"
                    data-id="${phrase.id}"
                    data-language="en"
                    data-action="listen">

                    <i class="fa-solid fa-volume-high"></i>

                    Listen in English

                </button>

                <button type="button"
                    class="international-phrase-button"
                    data-id="${phrase.id}"
                    data-language="en"
                    data-action="copy">

                    <i class="fa-solid fa-copy"></i>

                    Copy English

                </button>

                <button type="button"
                    class="international-phrase-button"
                    data-id="${phrase.id}"
                    data-action="translate">

                    <i class="fa-solid fa-language"></i>

                    Use in Translator

                </button>

            </div>

        `;

        internationalPhrasesGrid.appendChild(card);

    });

}


// SEARCH AND FILTER PHRASES

function filterInternationalPhrases() {

    const query = normalizeInternationalText(
        internationalPhraseSearch.value
    );

    const filteredPhrases = internationalPhrases.filter(
        function (phrase) {

            const matchesCategory =
                internationalActiveCategory === "all" ||

                phrase.category === internationalActiveCategory;

            const searchableText = normalizeInternationalText(

                phrase.en + " " +
                phrase.hi + " " +
                phrase.pa + " " +
                phrase.hiPronunciation + " " +
                phrase.paPronunciation + " " +
                phrase.category

            );

            const matchesSearch =
                searchableText.includes(query);

            return matchesCategory && matchesSearch;

        }
    );

    document.getElementById(
        "internationalPhraseMessage"
    ).hidden = true;

    displayInternationalPhrases(filteredPhrases);

}


// LIVE PHRASE SEARCH

internationalPhraseSearch.addEventListener(
    "input",
    filterInternationalPhrases
);


// CATEGORY FILTERS

function setInternationalPhraseCategory(category) {

    internationalActiveCategory = category;

    document.querySelectorAll(
        ".international-phrase-filter"
    ).forEach(function (button) {

        const isActive =
            button.dataset.category === category;

        button.classList.toggle("active", isActive);

        button.setAttribute("aria-pressed", isActive);

    });

    filterInternationalPhrases();

}


document.querySelectorAll(
    ".international-phrase-filter"
).forEach(function (button) {

    button.addEventListener("click", function () {

        setInternationalPhraseCategory(
            button.dataset.category
        );

    });

});


// RESET SEARCH AND FILTERS

document.getElementById(
    "resetInternationalPhrases"
).addEventListener("click", function () {

    internationalPhraseSearch.value = "";

    setInternationalPhraseCategory("all");

});


// PHRASE CARD BUTTONS

internationalPhrasesGrid.addEventListener(
    "click",
    function (event) {

        const button = event.target.closest(
            ".international-phrase-button"
        );

        if (!button) {
            return;
        }

        const phrase = internationalPhrases.find(
            function (item) {

                return item.id === Number(button.dataset.id);

            }
        );

        if (!phrase) {
            return;
        }

        const action = button.dataset.action;

        const language = button.dataset.language;

        if (action === "listen") {

            speakInternationalText(
                phrase[language],
                language,
                "internationalPhraseMessage"
            );

        }

        if (action === "copy") {

            copyInternationalText(
                phrase[language],
                "internationalPhraseMessage"
            );

        }

        if (action === "translate") {

            translationSource.value = "en";

            if (translationTarget.value === "en") {

                translationTarget.value = "hi";

            }

            translationInput.value = phrase.en;

            updateTranslationCharacterCount();

            performInternationalTranslation();

            document.querySelector(
                ".international-translator"
            ).scrollIntoView({

                behavior: "auto",
                block: "start"

            });

        }

    }
);


// INITIALIZE INTERNATIONAL PHRASES

updateTranslationCharacterCount();

displayInternationalPhrases(internationalPhrases);


// =========================================
// INTERNATIONAL STUDENT RESOURCES
// =========================================

const internationalResources = [

    // CULTURAL GUIDANCE

    {
        id: "culture",

        title: "Cultural Guidance",

        icon: "fa-people-group",

        description:
            "Understand Indian customs, everyday etiquette and cultural diversity.",

        points: [
            "India is home to many languages, religions and cultural traditions.",
            "Namaste and Sat Sri Akaal are common greetings.",
            "Respect different cultural and religious practices.",
            "Some religious places require visitors to remove their shoes.",
            "Food preferences and traditions may differ between communities."
        ],

        steps: [
            "Learn basic Hindi and Punjabi greetings.",
            "Participate in university cultural activities.",
            "Interact respectfully with students from different backgrounds.",
            "Ask a trusted mentor if you are unfamiliar with a local custom."
        ],

        tip:
            "You do not need to change your cultural identity to feel included. Respectful communication helps build friendships.",

        links: [
            {
                text: "Explore Campus",
                url: "#explore"
            },
            {
                text: "Student Support",
                url: "#support"
            }
        ]
    },

    // VISA AND DOCUMENTATION

    {
        id: "visa",

        title: "Visa & Documentation",

        icon: "fa-passport",

        description:
            "Find guidance for student visas, registration and essential documents.",

        points: [
            "Keep your passport and visa valid.",
            "Maintain copies of your admission documents.",
            "Keep university registration and accommodation records accessible.",
            "FRRO registration requirements depend on your visa conditions.",
            "Immigration requirements may change."
        ],

        steps: [
            "Review the conditions mentioned on your student visa.",
            "Contact the university's international student support office.",
            "Check applicable registration requirements and deadlines.",
            "Use official government portals for immigration services.",
            "Keep copies of official acknowledgements."
        ],

        tip:
            "Never share passport details, visa documents or identification numbers with unauthorized individuals.",

        links: [
            {
                text: "Official e-FRRO Portal",
                url: "https://indianfrro.gov.in/eservices/"
            },
            {
                text: "Indian Visa Portal",
                url: "https://indianvisaonline.gov.in/"
            },
            {
                text: "Official LPU Website",
                url: "https://www.lpu.in/"
            }
        ]
    },

    // CURRENCY AND PAYMENTS

    {
        id: "currency",

        title: "Currency & Payments",

        icon: "fa-wallet",

        description:
            "Understand Indian currency, payment methods and financial safety.",

        points: [
            "The official currency of India is the Indian Rupee (INR).",
            "The Indian Rupee is represented by the symbol ₹.",
            "Cash, cards and UPI are commonly used payment methods.",
            "Banking eligibility and documentation requirements may vary.",
            "Exchange rates and transaction charges may change."
        ],

        steps: [
            "Familiarize yourself with Indian currency denominations.",
            "Use authorized banks or currency exchange providers.",
            "Confirm transaction charges before making payments.",
            "Ask your bank about account eligibility and payment options.",
            "Keep track of your everyday expenses."
        ],

        tip:
            "Never share your banking password, OTP, card PIN or UPI PIN with anyone.",

        links: [
            {
                text: "Banking Assistance",
                url: "#banking"
            },
            {
                text: "Reserve Bank of India",
                url: "https://www.rbi.org.in/"
            }
        ]
    },

    // SIM AND INTERNET

    {
        id: "connectivity",

        title: "SIM & Internet",

        icon: "fa-mobile-screen-button",

        description:
            "Understand mobile connectivity, internet access and campus Wi-Fi assistance.",

        points: [
            "Mobile network coverage may vary by location.",
            "SIM registration requires applicable identity verification.",
            "International students may have additional documentation requirements.",
            "Age eligibility and provider requirements must be confirmed.",
            "University Wi-Fi access may require student credentials."
        ],

        steps: [
            "Ask university support about campus internet access.",
            "Contact an authorized mobile network provider.",
            "Confirm identification and eligibility requirements.",
            "Seek guardian or university assistance when necessary.",
            "Contact technical support if campus Wi-Fi does not work."
        ],

        tip:
            "Avoid accessing sensitive accounts through unknown public Wi-Fi networks.",

        links: [
            {
                text: "Student Support",
                url: "#support"
            },
            {
                text: "UMS Help",
                url: "#ums"
            }
        ]
    },

    // CAMPUS FACILITIES

    {
        id: "facilities",

        title: "Essential Campus Facilities",

        icon: "fa-map-location-dot",

        description:
            "Discover important facilities needed during your first days at university.",

        points: [
            "Academic blocks and classrooms",
            "Hostels and residential services",
            "Library and learning facilities",
            "Medical and healthcare facilities",
            "Food outlets and shopping facilities",
            "Student support and administrative offices"
        ],

        steps: [
            "Explore the University Map.",
            "Identify your academic block and accommodation.",
            "Locate nearby medical and student support facilities.",
            "Explore essential food and shopping facilities.",
            "Confirm locations with university staff when necessary."
        ],

        tip:
            "Save important campus locations and ask university staff for assistance if you are unfamiliar with an area.",

        links: [
            {
                text: "University Map",
                url: "#map"
            },
            {
                text: "Explore Campus",
                url: "#explore"
            },
            {
                text: "Find My Classroom",
                url: "#classroom"
            },
            {
                text: "Food & Dining",
                url: "#food"
            }
        ]
    },

    // ADJUSTMENT AND WELLNESS

    {
        id: "wellness",

        title: "Adjustment & Wellness",

        icon: "fa-hand-holding-heart",

        description:
            "Find support for homesickness, cultural adjustment and student well-being.",

        points: [
            "Adjusting to a new environment can take time.",
            "Maintaining regular contact with family may help.",
            "Building friendships can improve your sense of belonging.",
            "Regular meals, sufficient sleep and recreation support well-being.",
            "Professional counselling can provide additional support."
        ],

        steps: [
            "Create a comfortable daily routine.",
            "Stay connected with family and trusted friends.",
            "Participate in suitable university activities.",
            "Talk to a trusted mentor or staff member about concerns.",
            "Seek professional support when difficulties persist."
        ],

        tip:
            "You do not have to manage every difficulty alone. Asking for assistance is a normal part of adjusting to university life.",

        links: [
            {
                text: "Student Support",
                url: "#support"
            },
            {
                text: "First 15 Days",
                url: "#onboarding"
            },
            {
                text: "Explore Campus",
                url: "#explore"
            }
        ]
    },

    // INTERNATIONAL STUDENT ASSISTANCE

    {
        id: "assistance",

        title: "International Student Assistance",

        icon: "fa-headset",

        description:
            "Find the appropriate university support for international student concerns.",

        points: [
            "Admission and registration assistance",
            "Visa and documentation guidance",
            "Academic and administrative concerns",
            "Accommodation and campus adjustment",
            "Language and communication assistance"
        ],

        steps: [
            "Identify the type of assistance you require.",
            "Contact the relevant university support department.",
            "Explain your concern clearly.",
            "Keep necessary documents available when requested through official channels.",
            "Follow up through authorized university communication channels."
        ],

        tip:
            "Confirm the current international student office location, contact details and working hours through official university sources.",

        links: [
            {
                text: "Official LPU Website",
                url: "https://www.lpu.in/"
            },
            {
                text: "Student Support",
                url: "#support"
            },
            {
                text: "UMS Help",
                url: "#ums"
            }
        ]
    }

];


// =========================================
// DISPLAY INTERNATIONAL RESOURCE CARDS
// =========================================

const internationalResourcesGrid =
    document.getElementById("internationalResourcesGrid");

const internationalResourceDetails =
    document.getElementById("internationalResourceDetails");


function displayInternationalResources() {

    internationalResourcesGrid.innerHTML = "";

    internationalResources.forEach(function (resource) {

        const card = document.createElement("article");

        card.className = "international-resource-card";

        card.innerHTML = `

            <div class="international-resource-icon">

                <i class="fa-solid ${resource.icon}"></i>

            </div>

            <h3>${resource.title}</h3>

            <p>${resource.description}</p>

            <button type="button"
                class="international-resource-button"
                data-resource="${resource.id}">

                Explore

                <i class="fa-solid fa-arrow-right"></i>

            </button>

        `;

        internationalResourcesGrid.appendChild(card);

    });

}


// =========================================
// DISPLAY RESOURCE DETAILS
// =========================================

function showInternationalResourceDetails(resource) {

    document.getElementById(
        "internationalResourceTitle"
    ).textContent = resource.title;

    document.getElementById(
        "internationalResourceDescription"
    ).textContent = resource.description;

    document.getElementById(
        "internationalResourceTip"
    ).textContent = resource.tip;


    // RESOURCE INFORMATION

    const pointsList = document.getElementById(
        "internationalResourcePoints"
    );

    pointsList.innerHTML = "";

    resource.points.forEach(function (point) {

        const listItem = document.createElement("li");

        listItem.textContent = point;

        pointsList.appendChild(listItem);

    });


    // RESOURCE GUIDANCE

    const stepsList = document.getElementById(
        "internationalResourceSteps"
    );

    stepsList.innerHTML = "";

    resource.steps.forEach(function (step) {

        const listItem = document.createElement("li");

        listItem.textContent = step;

        stepsList.appendChild(listItem);

    });


    // RESOURCE LINKS

    const linksContainer = document.getElementById(
        "internationalResourceLinks"
    );

    linksContainer.innerHTML = "";

    resource.links.forEach(function (resourceLink) {

        const link = document.createElement("a");

        link.href = resourceLink.url;

        link.className = "primary-button";

        link.textContent = resourceLink.text;

        if (resourceLink.url.startsWith("https://")) {

            link.target = "_blank";

            link.rel = "noopener noreferrer";

        }

        const icon = document.createElement("i");

        icon.className =
            resourceLink.url.startsWith("https://")
                ? "fa-solid fa-arrow-up-right-from-square"
                : "fa-solid fa-arrow-right";

        icon.setAttribute("aria-hidden", "true");

        link.appendChild(icon);

        linksContainer.appendChild(link);

    });


    // SHOW DETAILS PANEL

    internationalResourceDetails.hidden = false;

    internationalResourceDetails.scrollIntoView({

        behavior: "auto",

        block: "start"

    });

}


// RESOURCE CARD CLICK EVENT

internationalResourcesGrid.addEventListener(
    "click",
    function (event) {

        const button = event.target.closest(
            ".international-resource-button"
        );

        if (!button) {
            return;
        }

        const resource = internationalResources.find(
            function (item) {

                return item.id === button.dataset.resource;

            }
        );

        if (resource) {

            showInternationalResourceDetails(resource);

        }

    }
);


// CLOSE RESOURCE DETAILS

document.getElementById(
    "closeInternationalResource"
).addEventListener("click", function () {

    internationalResourceDetails.hidden = true;

});


// INITIALIZE INTERNATIONAL STUDENT RESOURCES

displayInternationalResources();
