// localStorage.clear();
var current = new Date()
var currentTime = current.getHours() + ":" + current.getMinutes()
// variable for user to pick when their day resets
var dayReset;
if (localStorage.getItem("dayReset") != null) {
  dayReset = localStorage.getItem("dayReset")
}
var presets = document.getElementById("presets")
var presetOptions = document.querySelector(".preset-options")
if (localStorage.getItem("dailyIntake") === null) {
  localStorage.setItem("dailyIntake", "0")
}
document.getElementById("track_water_intake").innerHTML = localStorage.getItem("dailyIntake")
for (var i = 0; i < localStorage.length; i++) {
  if ((localStorage.key(i) !== "dailyIntake") && (localStorage.key(i) !== "dayReset")) {
    var option = document.createElement("option")
    option.innerHTML = `
      <option value="${localStorage.getItem(localStorage.key(i))}">
        ${localStorage.key(i)}: ${localStorage.getItem(localStorage.key(i))}
      </option>
    `
    presets.appendChild(option)
  }
}

if (presets.length > 0) {
  presetOptions.style.visibility = "visible"
  OnSelectChange()
}

// current daily intake: 4.2/5

// open settings menu when clicking on gear icon
var settings = document.querySelector(".settings-icons")
settings.addEventListener("click", function () {
  document.getElementById("settings").style.display = "block"
})
// close settings menu on outside click
document.addEventListener("mouseup", function(e) {
  var container = document.getElementById("settings");
  if (!container.contains(e.target)) {
      container.style.display = "none";
  }
});
// close menu when clicking on x icon
var settingsCloseIcon = document.querySelector(".fa-xmark")
settingsCloseIcon.addEventListener("click", function () {
  document.getElementById("settings").style.display = "none"
})

// play audio when certain condition are met
function PlayAudio() {
  document.getElementById("test-audio").play()
}

// change which recommendation for water is displayed based on picked biological gender
function WaterRecommendationMen() {
  document.querySelector(".body-info").style.display = "flex"
  document.querySelector(".water-recommendation-women").style.display = "none"
  document.querySelector(".water-recommendation-men").style.display = "block"
  document.querySelector(".gender-container").style.display = "none"
}
function WaterRecommendationWomen() {
  document.querySelector(".body-info").style.display = "flex"
  document.querySelector(".water-recommendation-men").style.display = "none"
  document.querySelector(".water-recommendation-women").style.display = "block"
  document.querySelector(".gender-container").style.display = "none"
}

// set daily reset based on time input value
function TimePicker(e) {
  // select the correct class from which button is clicked
  // note: need second class to select as argument for querySelector
  var elTargetClass = e.target.className
  elTargetClass = elTargetClass.split(" ")[1]
  elTargetClass = document.querySelector("." + elTargetClass)
  var startTime = elTargetClass.previousElementSibling.previousElementSibling
  // check if input is empty or not
  if (startTime.value === "") {
    throw new Error("Expected input to be filled out")
  }
  dayReset = startTime.value
  localStorage.setItem("dayReset", dayReset)
  document.querySelector(".start-of-day-container").style.visibility = "hidden"
  document.querySelector(".gender-container").style.visibility = "visible"
}

// update water input value based on selected preset
function OnSelectChange() {
  let selectedValue = presets.options[presets.selectedIndex].value
  selectedValue = selectedValue.substring(selectedValue.indexOf(" ") + 1, selectedValue.length)
  document.getElementById("input_water_intake").value = selectedValue
}

// add preset to the list and localStorage
function AddPreset() {
  if (presetOptions.classList.contains("hidden")) {
    presetOptions.style.visibility = "visible"
  }
  var presetName = document.getElementById("preset-name")
  var presetSize = document.getElementById("preset-size")
  if (presetName.value === "" || presetSize.value === "") {
    alert("Please fill out both inputs")
    throw new Error("You need to fill out both inputs")
  }
    var option = document.createElement("option")
    option.innerHTML = `
      <option value="${presetName.value}">
        ${presetName.value}: ${presetSize.value}
      </option
    `
    localStorage.setItem(presetName.value, presetSize.value)
    presets.appendChild(option)
    presetName.value = ""
    presetSize.value = ""

}

// update current water total based on user's input
function UpdateWater() {
  var waterInput = (parseInt(document.getElementById("input_water_intake").value))
  if (waterInput <= 0 || isNaN(waterInput)) {
    alert("Number needs to be greater than zero")
    throw new Error("Invalid number. Expected greater than zero");
  } else {
    PlayAudio()
    var trackWater = document.getElementById("track_water_intake")
    var totalWaterInput = (parseInt(trackWater.innerHTML))
    var total = waterInput + totalWaterInput
    trackWater.innerHTML = total
    localStorage.setItem("dailyIntake", total)
  }
}

// check for change in time every minute
(function Loop() {
  setTimeout(function () {
    // if the set time is the same as the current time, reset current daily water output
    if (dayReset == currentTime) {
      document.getElementById("track_water_intake").innerHTML = 0
    }
    Loop()
  }, 60000); // 60sec
}());