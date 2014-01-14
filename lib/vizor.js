// The global namespace for the library
var vizor = {}

// A general purpose object analyzer
vizor.probe = function (data) {
  var report = {}

  // Get the JSON-size; i.e. how big the input data is:
  report.size = JSON.stringify(data).length

  // Measure the stats of chilren nodes in the object
  report.nodes = {}

  // Declare the counters with higher-scoping
  var count = 0
    , level = 0

  // Set the per-level hierarchy-data primitive
  report.nodes.level = []

  // This is impressive - recursion, without namespace pollution
  report.nodes.total = (function recurse (data, level) {

    // Get the number of children that the object has
    var keys = Object.keys(data).length

    // Update the count - i.e. the _total_ number of nodes
    count += keys

    // IF level information is there - update the cousin-counter
    // The control is to first start from the else block - if ever
    if (report.nodes.level[level])
      report.nodes.level[level]["has"] += parseInt(keys, 10)
    else {
      // If the level didn't exist, initiate it & push the value
      report.nodes.level[level] = {
        "has": parseInt(keys, 10)
      }
    }

    // Finally, update the level-counter - for the next level
    level++

    // Analyze whether the input further has children-object
    for (var i in data) {

      // If it does, then recurse; for next level, per sibling
      if (typeof data[i] === "object" && data[i] !== null)
        recurse(data[i], level)
    }

    // Finally, return the sum of nodes present in the object
    return count
  })(data, level)

  // Reuse the temp-variable to store reference to levels
  level = report.nodes.level

  // Post-process the levels' data for average children count
  for (var i in level) {

    var self = level[i]
      , child = level[parseInt(i, 10)+1]

    // If next level exists, then give average children per parent
    if (child)
      level[i]["par"] = Math.round(child.has / self.has)
  }

  return report
}

// Needs to be generalized, supporting currying
vizor.trace = function (data) {

  var payload = []

  for (var i in data) {
    if (typeof data === "object") {
      payload.push({
        name: i,
        kinder: (function () {
          if (typeof data[i] !== "object")
            return [{ name: data[i] }]
          return vizor.trace(data[i])
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
vizor.draw = function (input, node, aTemplate) {

  // Construct the root-object for the Visualization
  var root = {
    name: "Viz",
    children: vizor.trace(input)
  }

  // Call the mentioned template to render the visualization
  vizor.template[aTemplate](root, node)
}

// Initializing extensible templates' container
vizor.template = {}
