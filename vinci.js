// The global namespace for the library
var vinci = {}

// A general purpose object analyzer
vinci.probe = function (data) {
  var report = {}

  // Get the JSON-size; i.e. how big the input data is:
  report.size = JSON.stringify(data).length

  // Measure the stats of chilren nodes in the object
  report.nodes = {}

  // Get the total number of chilren nodes in the object
  var count = 0
  report.nodes.count = (function recurse (data) {
    count += Object.keys(data).length
    for (var i in data) {
      if (typeof data[i] === "object")
        recurse(data[i])
    }
    return count
  })(data)

  return report
}

// Needs to be generalized, supporting currying
vinci.trace = function (data) {

  var payload = []

  for (var i in data) {
    if (typeof data === "object") {
      payload.push({
        name: i,
        children: (function () {
          if (typeof data[i] !== "object")
            return [{ name: data[i] }]
          return vinci.trace(data[i])
        })()
      })
    } else {
      payload.push({ name: data[i] })
    }
  }
  return payload
}

// The primitive to process input-data in a certain way
// @TODO: Syntactic sugar to be added, using templates
vinci.draw = function (input, node, template) {

  // Construct the root-object for the Visualization
  var root = {
    name: "Viz",
    children: vinci.trace(input)
  }

  // The creation of visualization goes here-on
  var tree = d3.layout.tree().size([1000,250])
    , svg = d3.select(node).append("svg")
              .attr("width", 640)
              .attr("height", 1024)
              .append("g")
              .attr("transform", "translate(40, 0)")

    , diagonal = d3.svg.diagonal()
                   .projection(function (d) { return [d.y, d.x] })

    , nodes = tree.nodes(root)

    , links = tree.links(nodes)

    , link = svg.selectAll("pathlink")
                .data(links).enter().append("path")
                .attr("class", "link").attr("d", diagonal)

    , node = svg.selectAll("g.node")
                .data(nodes).enter().append("g")
                .attr("transform", function (d) {
                  return "translate(" + d.y + "," + d.x + ")"
                })

    node.append("circle").attr("r", 3.5)
    node.append("text")
        .attr("dx", function (d) { return d.children ? -8 : 8 })
        .attr("dy", 3)
        .attr("text-anchor", function (d) {
          return d.children ? "end" : "start"
        })
        .text(function (d) { return d.name })
}
