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
  }
  return data
}

// Give output
document.querySelector("button").addEventListener("click", function () {
  var data = vinci.output(vinci.input())

  if (data) {

    var payload = []

    for (var i in data) {
      var tmp = {
        name: i
      }
      delete data[i]
      payload.push(tmp)
    }

    data.name = "Viz"
    data.children = payload

    document.querySelector("pre").innerHTML = JSON.stringify(data, null, "\t")

    var tree = d3.layout.tree().size([300,150])
      , svg = d3.select("#viz").append("svg")
                .attr("width", 640)
                .attr("height", 640)
                .append("g")
                .attr("transform", "translate(40, 0)")

      , diagonal = d3.svg.diagonal()
                    .projection(function(d) { return [d.y, d.x] })

      , nodes = tree.nodes(data)

      , links = tree.links(nodes)

      , link = svg.selectAll("pathlink")
                    .data(links).enter().append("path")
                    .attr("class", "link").attr("d", diagonal)

      , node = svg.selectAll("g.node")
                    .data(nodes).enter().append("g")
                    .attr("transform", function(d) {
                      return "translate(" + d.y + "," + d.x + ")"
                    })

      node.append("circle").attr("r", 3.5)
      node.append("text")
          .attr("dx", function(d) { return d.children ? -8 : 8 })
          .attr("dy", 3)
          .attr("text-anchor", function(d) { return d.children ? "end" : "start" })
          .text(function(d) { return d.name })
  } else {
    document.querySelector("pre").innerHTML = "Input could not be parsed as JSON"
  }
}, false)
