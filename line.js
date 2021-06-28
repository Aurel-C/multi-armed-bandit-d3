var margin = { top: 20, right: 90, bottom: 30, left: 90 },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var lineChart = d3.select("#record")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear().range([0, width]);
var xAxis = d3.axisBottom().scale(x);
lineChart.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "myXaxis")

// Add Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
lineChart.append("g")
  .attr("class", "myYaxis")

function drawPlot() {
  // Create the X axis:
  x.domain([0, d3.max(record, function (d) { return d.index })]);
  lineChart.selectAll(".myXaxis")
    .transition()
    .duration(750)
    .call(xAxis);

  // create the Y axis
  y.domain([d3.min(record, function (d) { return d.value }), d3.max(record, function (d) { return d.value })]);
  lineChart.selectAll(".myYaxis")
    .transition()
    .duration(750)
    .call(yAxis);

  lineChart.selectAll(".lineTest")
    .transition()
    .duration(750)
    .attr("d", d3.line()
      .x(function (d) { return x(d.index); })
      .y(function (d) { return y(d.value); }))


  // Create a update selection: bind to the new data
  var u = lineChart.selectAll(".lineTest")
    .data([record], function (d) { return d.index });

  u
    .enter()
    .append("path")
    .attr("class", "lineTest")
    .merge(u)
    .transition()
    .delay(750)
    .attr("d", d3.line()
      .x(function (d) { return x(d.index); })
      .y(function (d) { return y(d.value); }))
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)


}

