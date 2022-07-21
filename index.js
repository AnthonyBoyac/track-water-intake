// localStorage.clear();

var presets = document.getElementById("presets")
var presetOptions = document.querySelector(".preset-options")
if (localStorage.getItem("dailyIntake") === null) {
  localStorage.setItem("dailyIntake", "0")
}
document.getElementById("track_water_intake").innerHTML = localStorage.getItem("dailyIntake")
for (var i = 0; i < localStorage.length; i++) {
  if (localStorage.key(i) !== "dailyIntake") {
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

// current daily intake: 3.5/5

// play audio when certain condition are met
function PlayAudio() {
  document.getElementById("test-audio").play()
}

// change content based on biological gender
function WaterRecommendationMen() {
  document.querySelector(".body-info").style.display = "flex"
  document.querySelector(".water-recommendation-women").style.display = "none"
  document.querySelector(".water-recommendation-men").style.display = "block"
}
function WaterRecommendationWomen() {
  document.querySelector(".body-info").style.display = "flex"
  document.querySelector(".water-recommendation-men").style.display = "none"
  document.querySelector(".water-recommendation-women").style.display = "block"
}

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
  } else {
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
