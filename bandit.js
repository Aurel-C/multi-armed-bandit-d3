function randn_bm() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function normal(m = 0) {
    return randn_bm() + m;
}

function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}

const startingv = 5;

let treeData = {
    "value": 0,
    "children": Array.from({ length: 10 }, () => ({ "value": startingv, "mean": 0, "tries": 1,"active":false }))
};

treeData.children.forEach(path => {
    path.mean = randn_bm();
});

means();

let record = [];
let idx = 0;
let path = null;

const nodes = drawTree();
draw();

function bandit() {
    let e = 0.1;
    maxi = [0];
    less = [];
    maxv = treeData.children[0].value;
    for (let i = 1; i < treeData.children.length; i++) {
        if (treeData.children[i].value > maxv) {
            less = less.concat(maxi);
            maxi = [i];
            maxv = treeData.children[i].value;
        } else if (treeData.children[i].value === maxv) {
            maxi.push(i);
        } else {
            less.push(i)
        }
    }

    if (Math.random() > e || maxi.length === 10) {
        path = maxi[Math.floor(Math.random() * maxi.length)];
        var ismax = 1;
    } else {
        path = less[Math.floor(Math.random() * less.length)];
        var ismax = -1;
    }
    treeData.children[path].value += (normal(treeData.children[path].mean) - treeData.children[path].value) / treeData.children[path].tries;
    record.push({ "index": idx, "value": treeData.children[path].value, "max": ismax });
    treeData.children[path].tries++;
    idx++;
    return path
}

function draw() {
    updateTree()
    drawScatter();

}

function step() {
    bandit();
    draw();
}

function n_steps(n) {
    for (let i = 0; i < n; i++) {
        bandit();
    }
    draw();
}

function reset() {
    treeData.children.forEach(path => {
        path.value = startingv;
        path.mean = randn_bm();
        path.tries = 1;
    });
    means()
    record = [];
    idx = 0;
    path = null;
    draw();
}

function means() {
    m = "<table style=' margin-left: auto;margin-right: auto;'>";
    treeData.children.forEach(path => {
        m += "<tr><td style='background:" + d3.interpolateRdBu((Math.tanh(path.mean) + 1) / 2) + "'>" + path.mean.toFixed(2) + "</td></tr>";
    })
    m += "</table>"
    document.getElementById("means").innerHTML = m;
}