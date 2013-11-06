// Housekeeping
var vinci = {}

// Get input
vinci.input = function () {
  return document.querySelector("textarea").value
}

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
