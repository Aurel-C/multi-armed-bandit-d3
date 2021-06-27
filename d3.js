// set the dimensions and margins of the diagram
const margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// declares a tree layout and assigns the size
const treemap = d3.tree().size([height, width]);

const svg = d3.select("#paths")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom),
  g = svg.append("g")

var svg2 = d3.select("#record")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// adds the circle to the node
/*node.append("circle")
  .attr("r", d => d.data.value)*/

draw();

function draw() {

  drawTree();
  drawRecord();

}

function drawTree() {
  svg.selectAll(".node").remove();
  svg.selectAll("path").remove();

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData, d => d.children);

  // maps the node data to the tree layout
  nodes = treemap(nodes);
  // adds the links between the nodes
  const link = g.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d => {
      return "M" + d.y + "," + d.x
        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
        + " " + d.parent.y + "," + d.parent.x;
    })
    .attr("stroke-width", d => Math.log(1+Math.abs(d.data.tries)))
    .attr("stroke", d => d3.interpolateRdBu((Math.tanh(d.data.value)+1)/2) );

  // adds each node as a group
  const node = g.selectAll(".node")
    .data(nodes.descendants())
    .enter().append("g")
    .attr("class", d => d.children ? "root" : "node")
    .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  node.append("text")
    .attr("dy", ".35em")
    .attr("x", 10)
    .text(d => d.data.value.toFixed(2));

  g.selectAll(".root").remove("text");
}

function drawRecord() {
  svg2.selectAll("path").remove();
  svg2.selectAll("g").remove();
  var x = d3.scaleLinear()
    .domain(d3.extent(record, function (d) { return d.index; }))
    .range([0, width]);
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([d3.min(record, function (d) { return d.value; }), d3.max(record, function (d) { return d.value; })])
    .range([height, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y));

  // Add the line
  svg2.append("path")
    .datum(record)
    .transition()
    .duration(500)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.index) })
      .y(function (d) { return y(d.value) })
    )
}