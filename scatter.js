var margin = { top: 20, right: 90, bottom: 30, left: 25 },
    width = 920 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
   
    
    var scatter = d3.select("#scatter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
    
    scatter.append("circle").attr("cx",720).attr("cy",400).attr("r", 6).attr("fill", d3.interpolateRdBu(1)).attr("fill-opacity",0.5)
    scatter.append("circle").attr("cx",720).attr("cy",430).attr("r", 6).attr("fill", d3.interpolateRdBu(-1)).attr("fill-opacity",0.5)
    scatter.append("text").attr("x", 740).attr("y", 405).text("Exploitation").style("font-size", "15px").attr("alignment-baseline","middle")
    scatter.append("text").attr("x", 740).attr("y", 435).text("Exploration").style("font-size", "15px").attr("alignment-baseline","middle")    
// Add X axis
var x = d3.scaleLinear().range([0, width]);
var xAxis = d3.axisBottom().scale(x);
scatter.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis")

// Add Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
scatter.append("g")
    .attr("class", "myYaxis")

let lasti = 0;

function drawScatter() {
    // Create the X axis:
    x.domain([0, d3.max(record, function (d) { return d.index })]);
    scatter.selectAll(".myXaxis")
        .transition()
        .duration(750)
        .call(xAxis);

    // create the Y axis
    y.domain([d3.min(record, function (d) { return d.value }), d3.max(record, function (d) { return d.value })]);
    scatter.selectAll(".myYaxis")
        .transition()
        .duration(750)
        .call(yAxis);
    
    scatter.selectAll(".dot")
        .transition()
        .duration(750)
        .attr("cx", function (d) { return x(d.index); })
        .attr("cy", function (d) { return y(d.value); })
        .attr("r", 5)

    scatter.selectAll(".dot").data(record).exit().remove();

    // Create a update selection: bind to the new data
    let d = scatter.selectAll(".dot")
        .data(record)

    d.exit().remove();

    d.enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.index); })
        .attr("cy", function (d) { return y(d.value); })
        .transition()
        .delay((d, i, n) => 750 * (1 + (i - lasti) / n.length))
        .attr("r", 5)
        .attr("class", "dot")
        .attr("fill", (d) => d3.interpolateRdBu(d.max))
        .attr("fill-opacity", 0.3)

    if (record.length > 0) {
        lasti = record[record.length - 1].index;
    }

}