// Based on https://bl.ocks.org/mbostock/3019563
var margin = {top: 10, right: 45, bottom: 275, left:80},
width = 700 - margin.right - margin.left,
height = 500 - margin.top - margin.bottom;

// creating tip variable which is used to obtain the price
// based on http://blockbuilder.org/Caged/6476579
var tip = d3.tip()
.attr('class', 'd3-tip')
.offset([-10, 0])
.html(function(d) {
return "<strong>Price:</strong> <span style='color: WHITE'>" + d.price + "</span><br />";
})

// setting (flexibel) margins for svg element
var svg = d3.select("body")
.append("svg")
.attr ({
"width": width + margin.right + margin.left,
"height": height + margin.top + margin.bottom
})

.append("g")
.attr("transform","translate(" + margin.left + "," + margin.right + ")");

// using ordinal.scale for string data in this case "streetname"
var Xas_Schaal = d3.scale.ordinal()
.rangeRoundBands([0,width], 0.2, 0.2);

// using linear.scale for numeric data in this case "price"
var Yas_Schaal = d3.scale.linear()
.range([height, 0]);

// creating x as and y as
var xAS = d3.svg.axis()
.scale(Xas_Schaal)
.orient("bottom");

// using ticks to adjust the y-as based on the number of ticks
var yAS = d3.svg.axis()
.scale(Yas_Schaal)
.orient("left").ticks(5);

// loading json file, obtain streetname and price from file.
// the + operator makes sure that a possible string is transformed to an actual number
svg.call(tip);
d3.json("Sacramento_sales_2008.json", function(error, data) {

data.forEach(function(d) {
d.street = d.street;
d.price = +d.price;
});

/* The SACRAMENTO file has over 900 transactions,
the 10 highest sales prices are obtained for the bar chart
These array with the top 10 is passed to the variable TopData
+ operator to convert possible string to number*/
var TopData = data.sort(function(a, b) {
return d3.descending(+a.price, +b.price);
}).slice(0, 10);

// Giving domains of the x and y scales
Xas_Schaal.domain(data.map(function(d) { return d.street; }).slice(0, 10) );
Yas_Schaal.domain([0, d3.max(TopData, function(d) { return d.price; } ) ]);

//creating animations (tooltip and delay of display chart) based on TopData
svg.selectAll('.bar')
.data(TopData)
.enter()
.append('rect')
.attr("class", "bar")
.attr("height", 0)
.attr("y", height)
.on('mouseover', tip.show)
.on('mouseout', tip.hide)
.transition().duration(3000)
.delay( function(d,i) { return i * 200; })

//creating the bar based on TopData
.attr({
"x": function(d) { return Xas_Schaal(d.street); },
"y": function(d) { return Yas_Schaal(d.price); },
"width": Xas_Schaal.rangeBand(),
"height": function(d) { return  height - Yas_Schaal(d.price); }
})

// Naming the x-as at a given postion
svg.append("text")
.attr("x", 575 )
.attr("y", 220 )
.attr("id", "deepshadow")
.text("Street");

// Naming the y-as at a given postion
svg.append("text")
.attr("x", -80 )
.attr("y", -10 )
.attr("id", "deepshadow")
.text("Price (USD)");

// Creating the xAS and positioning the line
// based on http://blockbuilder.org/Caged/6476579
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAS)
.selectAll("text")
.attr("dx", "-.8em")
.attr("dy", ".25em")
.attr("transform", "rotate(-60)" )
.style("text-anchor", "end")
.attr("font-size", "6px")

// Draw yAS and postion the label
svg.append("g")
.attr("class", "y axis")
.call(yAS)
.selectAll("text")
.attr("dx", "-.8em")
.attr("dy", ".25em")
.style("text-anchor", "end")
.attr("font-size", "6px")
});
