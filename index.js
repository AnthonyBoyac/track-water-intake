//TODO: optimize this file
/*
 * START - Runs on load time
 */
const CURRENT_DATE = new Date()
var resetNextDay = new Date()
resetNextDay.setDate(CURRENT_DATE.getDate() + 1)
// check if user saw slime animation transition from zero to greater than 0
var gifTransitionSeen = false

var achievement_targetGoal = "achievement_targetGoal"
if (localStorage.getItem(achievement_targetGoal) == null) {
  localStorage.setItem(achievement_targetGoal, "0")
}

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
      localStorage.setItem("dailyTargetReached", "false")
    }
  } else {
    document.querySelector(".start-of-day-container").style.visibility = "visible"
  }
  if (localStorage.getItem("user-target") != null) {
    document.querySelector(".body-info").style.display = "flex"
  }
}
ResetDay()

var achievementLockedColor = "#858585"
var achievementUnlockedColor = "#ddd410"
// if user has unlocked any achievement, display them as unlocked
function CheckUnlockedAchievements() {
  // 'target goal' achievement
  document.querySelectorAll(".achieve-target-goal").forEach((entry) => {
    let updateEl = entry.children[0]
    if (entry.getAttribute("goalReached") <= localStorage.getItem(achievement_targetGoal)) {
      updateEl.style.color = achievementUnlockedColor
    } else {
      updateEl.style.color = achievementLockedColor
    }
  })
  // 'slime animation' achievement
  let slimeEl = document.querySelector(".all-slime-animation").children[0]
  let counter = 0
  for (let i = 1; i <= 4; i++) {
    let el = "slimeAnimation" + i
    if (localStorage.getItem(el) == "seen") {
      counter++
    }
  }
  if (counter == 4) {
    slimeEl.style.color = achievementUnlockedColor
  } else {
    slimeEl.style.color = achievementLockedColor
  }
}
CheckUnlockedAchievements()

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

// current daily intake: 1.5/5

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

var audioSlider = document.getElementById("audio-slider")
var victoryAudio = document.getElementById("test-audio")
// change audio volume based on slider input
audioSlider.addEventListener("input", function () {
  victoryAudio.volume = (audioSlider.value / 100)
})

// play audio when certain condition are met
// TODO: randomize which audio is played when drinking
function PlayAudio() {
  victoryAudio.play()
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
  let waterInput = (parseInt(document.getElementById("input_water_intake").value))
  if (waterInput <= 0 || isNaN(waterInput)) {
    alert("Number needs to be greater than zero")
    throw new Error("Invalid number. Expected greater than zero")
  } else {
    PlayAudio()
    var trackWater = document.getElementById("track_water_intake")
    var totalWaterInput = (parseInt(trackWater.innerHTML))
    var total = waterInput + totalWaterInput
    trackWater.innerHTML = total
    localStorage.setItem("dailyIntake", total)
    sessionStorage.setItem("lastIntake", waterInput)
    document.getElementById("undo_water").removeAttribute("disabled")
    PlayGifAnimation(total)
  }
}

// undo last water update, then disable button until next update
function WaterUndo() {
  let waterInput = parseInt(sessionStorage.getItem("lastIntake"))
  let totalWaterIntake = document.getElementById("track_water_intake")
  let remainingWater = parseInt(totalWaterIntake.innerHTML) - waterInput
  totalWaterIntake.innerHTML = remainingWater
  localStorage.setItem("dailyIntake", remainingWater)
  sessionStorage.removeItem("lastIntake")
  document.getElementById("undo_water").setAttribute("disabled", true)
  PlayGifAnimation(remainingWater)
}

// play correct gif animation based on user water input 
function PlayGifAnimation(totalWater) {
  var userTarget = parseInt(document.querySelector(".water-rec--user-target").innerHTML)
  var gifAnimationEl = document.querySelector(".gif-animation")
  // if slime transition animation has not been seen
  if (localStorage.getItem("slimeAnimationTransition") == null) {
    gifAnimationEl.innerHTML = `<img src="/animations/slime-zero-to-struggle.gif" alt="zero to struggle puddle slime animation transition" />`
    setTimeout(UpdateAnimations, 2900)
    localStorage.setItem("slimeAnimationTransition", "seen")
  } else {
    UpdateAnimations()
  }
  // 
  function UpdateAnimations() {
    // change slime animation based on the percentage between ...
    // ... 'today water intake' and 'target goal' as seen below
    if (totalWater < (userTarget / 3)) { // 1%-33%
      gifAnimationEl.innerHTML = `<img src="/animations/slime-zero_to_thirtythree-part2.gif" alt="low on water puddle slime; 1% to 33%" />`
      // check if animation has been seen before (achivement purposes)
      if (localStorage.getItem("slimeAnimation1") == null) {
        localStorage.setItem("slimeAnimation1", "seen")
      }
    } else if ((totalWater >= 1) && (totalWater < (userTarget * (2/3)))) { // 33%-66%
      gifAnimationEl.innerHTML = `<img src="/animations/slime-thirtythree-sixtysix.gif" alt="happy but struggling a bit; 33% to 66% full" />`
      if (localStorage.getItem("slimeAnimation2") == null) {
        localStorage.setItem("slimeAnimation2", "seen")
      }
    } else if ((totalWater >= (userTarget * (2/3))) && (totalWater < userTarget)) { // 66%-99%
      gifAnimationEl.innerHTML = `<img src="/animations/slime-sixtysix-ninetynine.gif" alt="hydrated but is an idiot; 66% to 99% full" />`
      if (localStorage.getItem("slimeAnimation3") == null) {
        localStorage.setItem("slimeAnimation3", "seen")
      }
    } else { // 100%
      gifAnimationEl.innerHTML = `<img src="/animations/slime-hundred.gif" alt="happy to be whole again; 100% full" />`
      if (localStorage.getItem("slimeAnimation4") == null) {
        localStorage.setItem("slimeAnimation4", "seen")
      }
      // update 'target goal' achievement (limit once per day)
      if (localStorage.getItem("dailyTargetReached") != "true") {
        localStorage.setItem("dailyTargetReached", "true")
        localStorage.setItem(achievement_targetGoal, parseInt(localStorage.getItem(achievement_targetGoal) + 1))
      }
    }
    localStorage.setItem("gifAnimation", gifAnimationEl.innerHTML)
    gifAnimationEl.style.display = "block"
    CheckUnlockedAchievements()
  }
}


// check for change in the 'time picker' every minute
setInterval(function () {
  ResetDay()
}, 60000) // 60sec