var margin = { top: 20, right: 90, bottom: 30, left: 90 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const treemap = d3.tree().size([height, width]);

const treeChart = d3.select("#paths")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom),
    g = treeChart.append("g")

function drawTree() {
    treeChart.selectAll(".node").remove();
    treeChart.selectAll("path").remove();

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
        .attr("stroke-width", d => Math.log(1 + Math.abs(d.data.tries)))
        .attr("stroke", d => d3.interpolateRdBu((Math.tanh(d.data.value) + 1) / 2));

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