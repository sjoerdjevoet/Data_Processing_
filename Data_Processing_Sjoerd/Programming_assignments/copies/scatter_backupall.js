var object = "http://stats.oecd.org/SDMX-JSON/data/RWB/CZE+ISL+IRL+JPN+KOR+MEX+NLD+POL+TUR+USA.EMP_RA+VOTERS_SH+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, object)
  .awaitAll(GetData);

function GetData(error, response) {
  if (error) throw error;


var display = JSON.parse(response[0].responseText);
  console.log(display);

  list_countries = []
  list_variables_axes = []
  Life_Quality_mark = [] // 5.8
  Employement_Rate = []
  Voter_turnout = []

  variables_axes = display.dataSets[0].observations
  for (var i = 0; i < 10; i++){
    for (var j = 0; j < 3; j++){
      observation = i + ":" + j + ":0:0"
  list_variables_axes.push(variables_axes[observation][0])

    }
  }
for (var i = 2; i < 30; i+=3){

 Life_Quality_mark.push(list_variables_axes[i]) // life quality
}

 console.log(Life_Quality_mark);

for (var i = 0; i < 30; i+=3){

 Voter_turnout.push(list_variables_axes[i]) // voter turnout
}

 console.log(Voter_turnout);

 for (var i = 1; i < 30; i+=3){

  Employement_Rate.push(list_variables_axes[i]) // empotement rate
 }

  console.log(Employement_Rate);
  //console.log(Life_Quality_mark)
  //console.log(list_variables_axes);

countries = display.structure.dimensions.observation[0].values
for (i = 0; i <10; i++){

  list_countries.push(countries[i]['name'])
}


//console.log(list_countries);
//list_SelfRate_rate=[7.5,5.8,7.2,7.5,7.1,7.7,5.3,6.3,6.7,6.6]
//list_Employement_rate=[78.1,59.9,69.6,74.2,61.4,74.7,49.6,55.5,76.3,55.1]

//console.log(list_SelfRate_rate);

dataset=[]

for (i =0; i < 10; i++){
dataset.push([list_countries[i],Life_Quality_mark[i],Voter_turnout[i],Employement_Rate[i]])
}
console.log(dataset);

dict = []

for(var data = 0; data < dataset.length; data++){
  dict.push({
    "Country" : dataset[data][0],
    "Life_Quality_mark" : dataset[data][1],
    "Voter_turnout"     : dataset[data][2],
    "Employement_Rate" : dataset[data][3],

  })


}
build (dict); // programma stopt, dus moet andere functie de functie aanroepen
}

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    w = 960 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;


function build (data)
{ dict = data
  console.log(dict);
  // Variables
  var body = d3.select('body')

  // Scales
  var cValue = function(d) { return d.Country;},
      color = d3.scale.category10();


  /*var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(dict,function (d) { return d["Life_Quality_mark"] })]),
      d3.max([0,d3.max(dict,function (d) { return d["Life_Quality_mark"] })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(dict,function (d) { return d["Employement_Rate"] })]),
      d3.max([0,d3.max(dict,function (d) { return d["Employement_Rate"] })])
      ])
    .range([h,0])*/
    // setup x
  var xValue = function(d) { return d.Life_Quality_mark;}, // data -> value
      xScale = d3.scale.linear().range([0, w]), // value -> display
      xMap = function(d) { return xScale(xValue(d));} // data -> display


  // setup y
  var yValue = function(d) { return d.Employement_Rate;}, // data -> value
      yScale = d3.scale.linear().range([h, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));} // data -> display


    xScale.domain([d3.min(dict, xValue)-4, d3.max(dict, xValue)+1]);
    yScale.domain([d3.min(dict, yValue)-6, d3.max(dict, yValue)+1]);


    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<span style='color: WHITE'>" + d.Country +
                         '<br>Employement rate : ' + (d['Employement_Rate'] + "%") +
                         '<br>Voter turnout : ' + (d['Voter_turnout']+ "%") +
                         '<br>Grade own life : ' + (d['Life_Quality_mark']) +
                          "</span><br />";
    })
  // SVG
  /*.append('title') // Tooltip
    .text(function (d) { return d.Country +
                         '\nReturn: ' + (d['Employement_Rate']) +
                         '\nStd. Dev.: ' + (d['Life_Quality_mark']) })*/
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

      svg.call(tip);

  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(10)
    .orient('bottom')

  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(6)
    .orient('left')
    .tickFormat(function(d) { return d + "%"; });
  // Circles
  var circles = svg.selectAll('circle')
      .data(dict)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d["Life_Quality_mark"] ) })
      .attr('cy',function (d) { return yScale(d['Employement_Rate']) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .style("fill", function(d) { return color(cValue(d));})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    /*.append('title') // Tooltip
      .text(function (d) { return d.Country +
                           '\nReturn: ' + (d['Employement_Rate']) +
                           '\nStd. Dev.: ' + (d['Life_Quality_mark']) })*/
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Grade own life (1-10)')
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Employement rate')

      // draw legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", w - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        // draw legend text
        legend.append("text")
            .attr("x", w - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d;})
 }

  function yChange() {
   e = document.getElementById("ySelect");
value =  e.options[e.selectedIndex].value; // get the new y value

var yScale = d3.scale.linear()
  .domain([
    d3.min([0,d3.min(dict,function (d) { return d[value] })]),
    d3.max([0,d3.max(dict,function (d) { return d[value] })])
    ])
  .range([h,0])

  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(dict,function (d) { return d[value] })]),
      d3.max([0,d3.max(dict,function (d) { return d[value] })])
      ])

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(6)
      .orient('bottom')
    // Y-axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(10)
      .orient('left')
      .tickFormat(function(d) { return d + "%"; });

    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('cy',function (d) { return yScale(d[value]) })

  }
