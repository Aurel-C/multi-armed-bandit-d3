var margin = { top: 0, right: 60, bottom: 0, left: 0 },
    width = 700 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

const treemap = d3.tree().size([height, width]);

const treeChart = d3.select("#paths")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
    g = treeChart.append("g")
    treeChart.append("circle").attr("r", 10).attr("transform", "translate(" + [11, 230] + ")").style("fill", "white").attr("stroke", "black").style("stroke-width", 2)
const circle = treeChart.append("circle").attr("r", 10).attr("transform", "translate(" + [11, 230] + ")").style("fill", "white").attr("stroke", "black").style("stroke-width", 2)

function drawTree() {

    //  assigns the data to a hierarchy using parent-child relationships
    let nodes = d3.hierarchy(treeData, d => d.children);

    // maps the node data to the tree layout
    nodes = treemap(nodes);
    nodes.descendants()[0].y = 11
    // adds the links between the nodes
    const link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("id", (d, i) => "link" + i)
        .attr("d", d => {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        })
        .attr("stroke-width", d => Math.log(1 + Math.abs(d.data.tries)))
        .attr("stroke", d => d3.interpolateRdBu((Math.tanh(d.data.value) + 1) / 2));

    // adds each node as a group
    const node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", d => d.children ? "root" : "node")
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

    g.selectAll(".node").append("text")
        .attr("dy", ".35em")
        .attr("x", 15)
        .text(d => d.data.value.toFixed(2));
}

function updateTree() {

    const link = g.selectAll(".link")
        .transition().duration(750)
        .attr("stroke-width", d => 2 * Math.log(1 + Math.abs(d.data.tries)))
        .attr("stroke", d => d3.interpolateRdBu((Math.tanh(d.data.value) + 1) / 2));

    g.selectAll(".node").select("text").text(d => d.data.value.toFixed(2));
    if (path != null) {
        circle.transition()
            .duration(1500)
            .attrTween("transform", translateAlong(g.select("#link" + path).node()))
    }
}

function translateAlong(path) {
    var l = path.getTotalLength();
    return function (d, i, a) {
        return function (t) {
            var p = path.getPointAtLength((1 - t) * l);
            return "translate(" + p.x + "," + p.y + ")";
        };
    };
}