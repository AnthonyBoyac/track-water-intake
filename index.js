// if (localStorage.getItem("dailyIntake") === null) {
//   localStorage.setItem("dailyIntake", "0")
// } else {
//   document.getElementById("track_water_intake").innerHTML = localStorage.getItem("dailyIntake")
// }

function playAudio() {
  console.log(document.getElementById("test-audio"))
  document.getElementById("test-audio").play()
}

function updateWater() {
  var waterInput = (parseInt(document.getElementById("input_water_intake").value))
  if (waterInput <= 0 || isNaN(waterInput)) {
    alert("Number needs to be greater than zero")
    throw new Error("Invalid number. Expected greater than zero");
  } else {
    playAudio()
    var trackWater = document.getElementById("track_water_intake")
    var totalWaterInput = (parseInt(trackWater.innerHTML))
    var total = waterInput + totalWaterInput
    trackWater.innerHTML = total
    localStorage.setItem("dailyIntake", total)
  }
}
