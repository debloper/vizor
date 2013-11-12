// The global namespace for the library
var vinci = {}

// Needs to be generalized, supporting currying
vinci.trace = function (payload) {

  var warhead = []

  for (var i in payload) {
    if (typeof payload === "object") {
      warhead.push({
        name: i,
        children: (function () {
          if (typeof payload[i] !== "object")
            return [{ name: payload[i] }]
          return vinci.trace(payload[i])
        })()
      })
    } else {
      warhead.push({ name: payload[i] })
    }
  }
  return warhead
}

// The primitive to process input-data in a certain way
// @TODO: Syntactic sugar to be added, using templates
vinci.draw = function (payload, node, template) {

  // Construct the root-object for the Visualization
  var data = {
    name: "Viz",
    children: vinci.trace(payload)
  }

  // Show the processed data-structure
  document.querySelector("pre").innerHTML = JSON.stringify(data, null, "  ")

  // The creation of visualization goes here-on
  var tree = d3.layout.tree().size([1000,250])
    , svg = d3.select(node).append("svg")
              .attr("width", 640)
              .attr("height", 1024)
              .append("g")
              .attr("transform", "translate(40, 0)")

    , diagonal = d3.svg.diagonal()
                   .projection(function (d) { return [d.y, d.x] })

    , nodes = tree.nodes(data)

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
