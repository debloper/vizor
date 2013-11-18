// Some primitive methods, to ease up stuffs
var getInput = function () {
  var input = document.querySelector("textarea").value

  try {
    input = JSON.parse(input)
  } catch (e) {
    input = false
  }
  return input
}

// Event listener to handle file drag-n-drop in the input field
document.querySelector("textarea").addEventListener("drop", function (event) {
  event.preventDefault()

  var file = event.dataTransfer.files[0]
    , reader = new FileReader()

  reader.addEventListener("load", function (evt) {
    document.querySelector("textarea").value = evt.target.result
  })

  reader.readAsText(file)
}, false)


// Here's what rigs the action-buttons
// Probe:
document.getElementById("probe").addEventListener("click", function () {

  // First get the input & fetch the DOM
  var data = getInput()
    , ramp = document.querySelector("pre")

  // If the input is valid, probe the data - else give error message
  if (data) {
    ramp.innerHTML = JSON.stringify(vinci.probe(data), null, "  ")
  } else {
    ramp.innerHTML = "Input could not be parsed as JSON"
  }
}, false)

// Trace:
document.getElementById("trace").addEventListener("click", function () {

  // First get the input & fetch the DOM
  var data = getInput()
    , ramp = document.querySelector("pre")

  // If the input is valid, go ahead with transforming - else give error message
  if (data) {
    ramp.innerHTML = JSON.stringify(vinci.trace(data), null, "  ")
  } else {
    ramp.innerHTML = "Input could not be parsed as JSON"
  }
}, false)

// Draw:
document.getElementById("draw").addEventListener("click", function () {

  // First get the input & fetch the DOM
  var data = getInput()
    , ramp = document.querySelector("pre")

  // If the input is valid, generate visualization - else give error message
  if (data) {
    ramp.innerHTML = "Well... it's something!"
    document.getElementById("viz").innerHTML = ""
    vinci.draw(data, "#viz")
  } else {
    ramp.innerHTML = "Input could not be parsed as JSON"
  }
}, false)
