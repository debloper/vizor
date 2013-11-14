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

// Here's what rigs the big-red-button - well, not red - but you get the point.
document.querySelector("button").addEventListener("click", function () {

  // First get the input & read it
  var data = (function () {
    var input = document.querySelector("textarea").value

    try {
      input = JSON.parse(input)
    } catch (e) {
      input = false
    }
    return input
  })()

  // If the input is valid, generate visualization - else give error message
  if (data) {
    // Log the data & stats on the notice-board
    var display = document.querySelector("pre")
    display.innerHTML = JSON.stringify(vinci.probe(data))
    display.innerHTML += "\n\n" + JSON.stringify(vinci.trace(data), null, "  ")

    vinci.draw(data, "#viz")
  } else {
    document.querySelector("pre").innerHTML = "Input could not be parsed as JSON"
  }
}, false)
