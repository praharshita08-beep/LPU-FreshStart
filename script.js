
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
