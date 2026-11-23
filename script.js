

/* LPU FreshStart - Interactive Prototype */

// 1. Screen Navigation

const screens = document.querySelectorAll(".screen");
const navigationButtons = document.querySelectorAll("[data-screen]");

function showScreen(screenId) {
  const selectedScreen = document.getElementById(screenId);

  if (!selectedScreen || !selectedScreen.classList.contains("screen")) {
    return;
  }

  screens.forEach(function(screen) {
    screen.classList.remove("active");
  });

  selectedScreen.classList.add("active");
  window.scrollTo(0, 0);
}

navigationButtons.forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.preventDefault();
    showScreen(button.getAttribute("data-screen"));
  });
});

// 2. Classroom Finder

const classroomForm = document.getElementById("classroom-form");
const classroomResult = document.getElementById("classroom-result");

classroomForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const code = document.getElementById("room-code")
    .value.trim().toUpperCase();

  classroomResult.hidden = false;

  if (code === "34-201") {
    classroomResult.innerHTML =
      "<h3>Classroom Found!</h3>" +
      "<p><strong>Block:</strong> 34</p>" +
      "<p><strong>Floor:</strong> 2</p>" +
      "<p><strong>Room:</strong> 201</p>" +
      "<p class='small-note'>Sample classroom data for demonstration.</p>";
  } else {
    classroomResult.innerHTML =
      "<h3>Room Not Found</h3>" +
      "<p>Check the classroom code and try again.</p>" +
      "<p class='small-note'>Try the sample code 34-201.</p>";
  }
});

// 3. Campus Navigation

const campusPlace = document.getElementById("campus-place");
const campusResult = document.getElementById("campus-result");
const mapLocations = document.querySelectorAll(".map-location");

campusPlace.addEventListener("change", function() {
  const selectedPlace = campusPlace.value;

  mapLocations.forEach(function(location) {
    location.classList.remove("highlight");

    if (location.getAttribute("data-place") === selectedPlace) {
      location.classList.add("highlight");
    }
  });

  const placeNames = {
    library: "Library",
    academic: "Academic Blocks",
    food: "Food Court",
    support: "Student Help Desk"
  };

  if (selectedPlace) {
    campusResult.textContent =
      placeNames[selectedPlace] +
      " is highlighted on the illustrative campus map.";
  } else {
    campusResult.textContent =
      "Select a location to highlight it on the practice map.";
  }
});

// 4. UMS Help and Tutorials

const umsTopic = document.getElementById("ums-topic");
const umsGuide = document.getElementById("ums-guide");

umsTopic.addEventListener("change", function() {
  if (umsTopic.value === "timetable") {
    umsGuide.hidden = false;
    umsGuide.innerHTML =
      "<h3>How to View Your Class Timetable</h3>" +
      "<ol>" +
      "<li>Open the university UMS portal.</li>" +
      "<li>Sign in to your student account.</li>" +
      "<li>Look for the Academics section and select Class Timetable.</li>" +
      "</ol>" +
      "<p class='small-note'>Illustrative steps; actual UMS menus may differ.</p>";
  } else if (umsTopic.value === "login") {
    umsGuide.hidden = false;
    umsGuide.innerHTML =
      "<h3>How to Access UMS</h3>" +
      "<ol>" +
      "<li>Open the official university UMS portal.</li>" +
      "<li>Enter your university-provided login details.</li>" +
      "<li>Follow the portal instructions to sign in.</li>" +
      "</ol>" +
      "<p class='small-note'>Do not share your password with anyone.</p>";
  } else {
    umsGuide.hidden = true;
    umsGuide.innerHTML = "";
  }
});

// 5. First 15 Days Checklist

const taskChecks = document.querySelectorAll(".task-check");
const progressCount = document.getElementById("progress-count");
const progressBar = document.getElementById("progress-bar");

function updateProgress() {
  let completed = 0;

  taskChecks.forEach(function(task) {
    if (task.checked) {
      completed++;
    }
  });

  const total = taskChecks.length;
  const percentage = (completed / total) * 100;

  progressCount.textContent =
    completed + " of " + total + " completed";

  progressBar.style.width = percentage + "%";
}

taskChecks.forEach(function(task) {
  task.addEventListener("change", updateProgress);
});

updateProgress();

// 6. Student Support

const supportTopic = document.getElementById("support-topic");
const supportResult = document.getElementById("support-result");

supportTopic.addEventListener("change", function() {
  const supportInformation = {
    academic: {
      title: "Academic Procedures",
      message: "Contact your department office for academic guidance."
    },
    ums: {
      title: "UMS Access",
      message: "Contact the university help desk for UMS-related assistance."
    },
    places: {
      title: "Finding Places",
      message: "Ask a senior mentor or orientation help desk for guidance."
    }
  };

  const selected = supportInformation[supportTopic.value];

  if (selected) {
    supportResult.hidden = false;
    supportResult.innerHTML =
      "<h3>" + selected.title + "</h3>" +
      "<p>" + selected.message + "</p>";
  } else {
    supportResult.hidden = true;
    supportResult.innerHTML = "";
  }
});

// 7. Student Profile and Preferences

const profileForm = document.getElementById("profile-form");
const profileMessage = document.getElementById("profile-message");

profileForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const department = document.getElementById("department").value;
  const language = document.getElementById("language").value;

  if (department && language) {
  profileMessage.textContent = "Preferences saved successfully!";
  showScreen("welcome");
}
});
