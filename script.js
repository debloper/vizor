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
    data = data
  }
  return JSON.stringify(data, null, "\t")
}

// Give output
document.querySelector("button").addEventListener("click", function () {
  document.querySelector("pre").innerHTML = vinci.output(vinci.input())
}, false)
