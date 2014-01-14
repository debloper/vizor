vizor.template.tree = function (root, node) {

  // The creation of visualization goes here-on
  var tree = d3.layout.tree().size([500,250])
    , svg = d3.select(node).append("svg")
              .attr("width", 640)
              .attr("height", 512)
              .append("g")
              .attr("transform", "translate(40, 0)")

    , diagonal = d3.svg.diagonal()
                   .projection(function (d) {
                    return [d.y, d.x]
                  })

    , nodes = tree.nodes(root)
    , links = tree.links(nodes)

    , link = svg.selectAll("pathlink")
                .data(links)

    , node = svg.selectAll("g.node")
                .data(nodes)

  var nodeEnter = node.enter().append("g")
                      .on("click", function (d) {
                        if (d.kinder) {
                          d.children = d.kinder
                          d.kinder = null
                        } else {
                          d.kinder = d.children
                          d.children = null
                        }
                        vizor.template.tree(d, "#viz")
                      })

  nodeEnter.append("circle")
          .attr("r", 4.5)
          .style("fill", "transparent")
          .style("stroke", function(d) {
            return d.kinder ? "#900" : "#333"
          })

  nodeEnter.append("text")
          .attr("dx", function (d) {
            return d.children ? -12 : 12
          })
          .attr("dy", 5)
          .attr("text-anchor", function (d) {
            return d.children ? "end" : "start"
          })
          .text(function (d) { return d.name })

  node.transition().attr("transform", function (d) {
    return "translate(" + d.y + "," + d.x + ")"
  })
  node.exit().transition().remove();

  link.enter().insert("path", "g").attr("class", "link")
  link.transition().attr("d", diagonal)
  link.exit().transition().remove()
}
