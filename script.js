// Housekeeping
var vinci = {}

// Get input
vinci.input = function () {
  return document.querySelector("textarea").value
}

document.querySelector("textarea").addEventListener("drop", function (event) {
  event.preventDefault()

  var file = event.dataTransfer.files[0]
    , reader = new FileReader()

  reader.addEventListener("load", function (evt) {
    document.querySelector("textarea").value = evt.target.result
  })

  reader.readAsText(file)
}, false)


// Process data
vinci.output = function (data) {
  try {
    data = JSON.parse(data)
  } catch (e) {
    data = false
    return data
  }
  return JSON.stringify(data, null, "\t")
}

// Give output
document.querySelector("button").addEventListener("click", function () {
  var data = vinci.output(vinci.input())
  if (data) {
    document.querySelector("pre").innerHTML = data
  } else {
    document.querySelector("pre").innerHTML = "Input could not be parsed as JSON"
  }
}, false)
