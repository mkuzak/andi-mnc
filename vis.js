$(document).ready(function () {
    var width = 960,
        size = 30,
        padding = 5;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2])
        .domain([-3, 3]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2])
        .domain([-3, 3]);

    var dim = d3.scale.linear()
        .range([0, size - padding])
        .domain([0, 6]);

    var scale = d3.scale.linear()
        .range([0, size - padding])
        .domain([0, 10]);

    var q = d3_queue.queue(2)
        .defer(d3.csv, "ellipseparams.csv")
        .defer(d3.json, "ellipsepoints.json")
        .await(function (error, ellipses, points) {
            if (error) throw error;
            facets(ellipses, points);
        });

    function facets(ellipses, points) {
        ellipses.forEach(function (d) {
            d.test1 = String(d.test1);
            d.test2 = String(d.test2);
            d.cx = +d.cx;
            d.cy = +d.cy;
            d.rx = +d.rx;
            d.ry = +d.ry;
            d.angle = +d.angle;
        })

        var tests1 = ellipses.map(function (e) {
            var test1 = e.test1;
            return test1;
        });

        tests1 = _.union(tests1);


        var tests2 = ellipses.map(function (e) {
            var test2 = e.test2;
            return test2;
        });

        tests2 = _.union(tests2);

        tests = _.union(tests1.concat(tests2));
        n = tests.length;

        var svg = d3.select("body").append("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");


        var cell = svg.selectAll(".cell")
            .data(cross(tests1, tests2))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function (d) { return "translate(" + d.j * size + "," + d.i * size + ")"; })
            .each(plot);

        cell.filter(function (d) { return d.test1 === d.test2; }).append("text")
            .attr("x", padding)
            .attr("y", size / 2 + padding)
            .attr("text-anchor", "left")
            .attr("font-size", "8px")
            .text(function (d) { return d.test1; });

        function plot(p) {
            var cell = d3.select(this);
            var cellTests = ellipses.filter(function (e) {
                return (e.test1 === p.test1 && e.test2 === p.test2);
            });

            var cellPoints = points.filter(function (e) {
                return (e.test1 === p.test1 && e.test2 === p.test2);
            });

            cell.selectAll("path")
                .data(cellPoints)
                .enter().append("path")
                .attr("transform", function (d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")"
                })
                .attr("d", d3.svg.symbol().type("circle"))
                .style("fill", "orange")
                .style("opacity", 0.6);



            cell.selectAll("ellipse")
                .data(cellTests)
                .enter().append("ellipse")
                .attr("rx", function (d) { return dim(d.rx); })
                .attr("ry", function (d) { return dim(d.ry); })
                .attr("transform", function (d) {
                    var angle = -(90 - d.angle)
                    return "translate(" + x(d.cx) + "," + y(d.cy) + ") rotate(" + angle + ")"
                })
                .style("fill", "green")
                .style("opacity", 0.3);


        };
    };


    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({ test1: a[i], i: i, test2: b[j], j: j });
        return c;
    }


    // return "translate(" + x(d.cx) + "," + y(d.cy) + ") rotate(45)" 

    // ellipses.forEach(function(e) {

    //     var xTrans = x(e.test1) + smallX(e.cx);
    //     var yTrans = y(e.test2) + smallY(e.cy);
    //     var ellipse = svg.append("ellipse")
    //         .attr("rx", smallX(e.rx))
    //         .attr("ry", smallY(e.ry))
    //         .attr("transform",
    //               "translate(" + xTrans + ", " + yTrans + ") rotate(45)")
    //         .style("fill", "green");
    // })



    // d3.csv("ellipseparams.csv", function(data) {
    //     var svg = d3.select("body")
    //                     .append("svg")
    //                     .attr("width", width)
    //                     .attr("height", height);
    //     var ellipse = svg.append("ellipse")
    //                     .attr("rx", 55)
    //                     .attr("ry", 80)
    //                     .attr("transform", "translate(250, 250) rotate(45)")
    //                     .style("fill", "purple");
    // });
});


