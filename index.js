// localStorage.clear()
//TODO: optimze everything
//TODO: add workable achievements
/*
 * START - Runs on load time
 */
const CURRENT_DATE = new Date()
var resetNextDay = new Date()
resetNextDay.setDate(CURRENT_DATE.getDate() + 1)

function ResetDay() {
  if (localStorage.getItem("dayReset") != null) {
    document.querySelector(".start-of-day-container").style.visibility = "hidden"
    document.querySelector(".gender-container").style.visibility = "visible"
    let dayReset = localStorage.getItem("dayReset")
    // convert localStorage string back to Date object
    dayReset = new Date(dayReset)
    // if today's date is after daily reset set by user, reset daily water input
    // AND update dayReset to next day at same time
    if (CURRENT_DATE > dayReset) {
      document.getElementById("track_water_intake").innerHTML = 0
      dayReset.setDate(dayReset.getDate() + 1)
      localStorage.setItem("dayReset", dayReset)
    }
  } else {
    document.querySelector(".start-of-day-container").style.visibility = "visible"
  }
  if (localStorage.getItem("genderPickedBool") == "true") {
    document.querySelector(".gender-container").style.display = "none"
    document.querySelector(".body-info").style.display = "flex"
  }
}
ResetDay()

// if user picked a gender, display the correct content
var genderPicked = localStorage.getItem("genderPicked")
if (genderPicked != null) {
  if (genderPicked == "women") {
    document.querySelector(".water-recommendation-women").style.display = "block"
  } else {
    document.querySelector(".water-recommendation-men").style.display = "block"
  }
}

// retrieve user's daily target goal for water intake
var userTargetPicked = localStorage.getItem("user-target")
if (userTargetPicked != null) {
  document.querySelector(".water-rec--user-target").innerHTML = userTargetPicked
  // document.querySelector(".settings-container").style.display = "block"
}

var presets = document.getElementById("presets")
var presetOptions = document.querySelector(".preset-options")
if (localStorage.getItem("dailyIntake") === null) {
  localStorage.setItem("dailyIntake", "0")
}
document.getElementById("track_water_intake").innerHTML = localStorage.getItem("dailyIntake")
for (var i = 0; i < localStorage.length; i++) {
  if (localStorage.key(i).includes("preset")) {
    let option = document.createElement("option")
    let presetKeyName = localStorage.key(i).substring(localStorage.key(i).indexOf(":") + 1, localStorage.key(i).length)
    option.innerHTML = `
      <option value="${localStorage.getItem(localStorage.key(i))}">
        ${presetKeyName}: ${localStorage.getItem(localStorage.key(i))}
      </option>
    `
    presets.appendChild(option)
  }
}

if (presets.length > 0) {
  presetOptions.style.visibility = "visible"
  OnSelectChange()
}

// current daily intake: 1.8/5

// open settings menu when clicking on gear icon
var settings = document.querySelector(".settings-container")
settings.addEventListener("click", function () {
  document.getElementById("settings").style.display = "block"
})
// close settings menu on outside click
document.addEventListener("mouseup", function(e) {
  var container = document.getElementById("settings")
  if (!container.contains(e.target)) {
      container.style.display = "none"
  }
})
// close menu when clicking on x icon
var settingsCloseIcon = document.querySelector(".fa-xmark")
settingsCloseIcon.addEventListener("click", function () {
  document.getElementById("settings").style.display = "none"
})
/*
 * END - Runs on load time
 */

// play audio when certain condition are met
function PlayAudio() {
  document.getElementById("test-audio").play()
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
  // split hours and minutes to set the correct time for the date
  var startTimeArr = startTime.value.split(":")
  resetNextDay.setHours(startTimeArr[0])
  resetNextDay.setMinutes(startTimeArr[1])
  resetNextDay.setSeconds(0)
  localStorage.setItem("dayReset", resetNextDay)

  document.querySelector(".start-of-day-container").style.visibility = "hidden"
  document.querySelector(".gender-container").style.visibility = "visible"
}

// change which recommendation for water is displayed based on picked biological gender
function WaterRecommendationMen() {
  WaterRecHelper()
  localStorage.setItem("genderPicked", "men")
  document.querySelector(".water-recommendation-women").style.display = "none"
  document.querySelector(".water-recommendation-men").style.display = "block"
}
function WaterRecommendationWomen() {
  WaterRecHelper()
  localStorage.setItem("genderPicked", "women")
  document.querySelector(".water-recommendation-men").style.display = "none"
  document.querySelector(".water-recommendation-women").style.display = "block"
}
function WaterRecHelper() {
  localStorage.setItem("genderPickedBool", true)
  document.querySelector(".gender-container").style.visibility = "hidden"
  document.querySelector(".user-target-container").style.display = "block"
}

// update user's water target 
function UserTargetPicker() {
  var userTargetInput = document.getElementById("user-target")
  localStorage.setItem("user-target", userTargetInput.value)
  document.querySelector(".water-rec--user-target").innerHTML = userTargetInput.value
  document.querySelector(".user-target-container").style.display = "none"
  document.querySelector(".gender-container").style.display = "none"
  document.querySelector(".body-info").style.display = "flex"
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
    localStorage.setItem("preset:" + presetName.value, presetSize.value)
    presets.appendChild(option)
    presetName.value = ""
    presetSize.value = ""
}

// update current water total based on user's input
function UpdateWater() {
  var waterInput = (parseInt(document.getElementById("input_water_intake").value))
  if (waterInput <= 0 || isNaN(waterInput)) {
    alert("Number needs to be greater than zero")
    throw new Error("Invalid number. Expected greater than zero")
  } else {
    // PlayAudio()
    var trackWater = document.getElementById("track_water_intake")
    var totalWaterInput = (parseInt(trackWater.innerHTML))
    var total = waterInput + totalWaterInput
    trackWater.innerHTML = total
    localStorage.setItem("dailyIntake", total)
    PlayGifAnimation(total)
  }
}

// play correct gif animation based on user water input 
function PlayGifAnimation(totalWater) {
  var userTarget = parseInt(document.querySelector(".water-rec--user-target").innerHTML)
  var gifAnimationEl = document.querySelector(".gif-animation")
  if (totalWater == 0) {
    gifAnimationEl.innerHTML = `<img src="/slime-zero.gif" alt="zero water intake = evil sun + dead slime" />`
  } else if (totalWater < (userTarget / 3)) {
    gifAnimationEl.innerHTML = `<img src="/slime-zero_to_thirtythree-part2.gif" alt="low on water puddle slime" />`
  } else {
    gifAnimationEl.innerHTML = `<img src="" />`
  }
}

// check for change in the 'time picker' every minute
setInterval(function () {
  ResetDay()
}, 60000) // 60sec