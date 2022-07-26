localStorage.clear()
//TODO: optimize this file
//TODO: add workable achievements
//TODO: add slime animations
/*
 * START - Runs on load time
 */
const CURRENT_DATE = new Date()
var resetNextDay = new Date()
resetNextDay.setDate(CURRENT_DATE.getDate() + 1)
// check if user saw slime animation transition from zero to greater than 0
var gifTransitionSeen = false

function ResetDay() {
  if (localStorage.getItem("dayReset") != null) {
    document.querySelector(".start-of-day-container").style.visibility = "hidden"
    let dayReset = localStorage.getItem("dayReset")
    // convert localStorage string back to Date object
    dayReset = new Date(dayReset)
    // if today's date is after daily reset set by user, reset daily water input
    // AND update dayReset to next day at same time
    if (CURRENT_DATE > dayReset) {
      document.getElementById("track_water_intake").innerHTML = 0
      dayReset.setDate(dayReset.getDate() + 1)
      localStorage.setItem("dayReset", dayReset)
      localStorage.removeItem("gifAnimation")
    }
  } else {
    document.querySelector(".start-of-day-container").style.visibility = "visible"
  }
  if (localStorage.getItem("user-target") != null) {
    document.querySelector(".body-info").style.display = "flex"
  }
}
ResetDay()

// retrieve user's daily target goal for water intake
var userTargetPicked = localStorage.getItem("user-target")
if (userTargetPicked != null) {
  document.querySelector(".water-rec--user-target").innerHTML = userTargetPicked
  document.querySelector(".settings-icons").style.display = "block"
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

var gifAnimation = document.querySelector(".gif-animation")
if (localStorage.getItem("gifAnimation") != null) {
  gifAnimation.innerHTML = localStorage.getItem("gifAnimation")
}
gifAnimation.style.display = "block"

if (presets.length > 0) {
  presetOptions.style.visibility = "visible"
  OnSelectChange()
}

// current daily intake: 1/5

// open settings menu when clicking on gear icon
var settings = document.querySelector(".settings-icons")
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
function TimePicker(el) {
  // select the correct class from which button is clicked
  // note: need second class to select as argument for querySelector
  var startTime = el.previousElementSibling.previousElementSibling
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
  document.querySelector(".user-target-container").style.display = "block"
}

// update user's water target 
function UserTargetPicker(el) {
  var userTargetInput = el.previousElementSibling.previousElementSibling.value
  localStorage.setItem("user-target", userTargetInput)
  document.querySelector(".water-rec--user-target").innerHTML = userTargetInput
  document.querySelector(".user-target-container").style.display = "none"
  document.querySelector(".body-info").style.display = "flex"
  document.querySelector(".settings-icons").style.display = "block"
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
function WaterUpdate() {
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
  // if slime transition animation has not been seen
  if (localStorage.getItem("slimeAnimationTransition") == null) {
    gifAnimationEl.innerHTML = `<img src="/slime-zero-to-struggle.gif" alt="zero to struggle puddle slime animation transition" />`
    setTimeout(checkAnimationSpeed, 2900)
    localStorage.setItem("slimeAnimationTransition", "seen")
  } else {
    checkAnimationSpeed()
  }

  function checkAnimationSpeed() {
    if (totalWater < (userTarget / 3)) {
      gifAnimationEl.innerHTML = `<img src="/slime-zero_to_thirtythree-part2.gif" alt="low on water puddle slime" />`
    } else {
      gifAnimationEl.innerHTML = `<img src="" />`
    }
    localStorage.setItem("gifAnimation", gifAnimationEl.innerHTML)
    gifAnimationEl.style.display = "block"
  }
}

// check for change in the 'time picker' every minute
setInterval(function () {
  ResetDay()
}, 60000) // 60sec