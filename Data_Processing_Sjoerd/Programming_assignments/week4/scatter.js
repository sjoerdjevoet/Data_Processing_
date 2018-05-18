/* Sjoerd Zagema (12195677)
The dataset is obtained of the following website:http://stats.oecd.org/
go to the theme 'regions and cities', go to 'Regional Well-Being', select the top file within this container
Within this page, I used the variables 'Country', 'Employement_Rate', 'Voter_turnout' and 'Self satisfaction'
*/

//obtaining api key
var object = "http://stats.oecd.org/SDMX-JSON/data/RWB/CZE+ISL+IRL+JPN+KOR+MEX+NLD+POL+TUR+USA.EMP_RA+VOTERS_SH+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
.defer(d3.request, object)
.awaitAll(GetData);

// function which has the purpose to obtain information of the DOM
  function GetData(error, response) {
    if (error) throw error;

  //parsing data to JSON
  var display = JSON.parse(response[0].responseText);
  console.log(display);

  //creating lists, to store information for each variable
  list_countries = []
  list_variables_axes = []
  Life_Quality_mark = []
  Employement_Rate = []
  Voter_turnout = []

  // obtaining variables for the axes (total of three)
  variables_axes = display.dataSets[0].observations
  for (var i = 0; i < 10; i++)
  {
    for (var j = 0; j < 3; j++)
    {
    observation = i + ":" + j + ":0:0"
    list_variables_axes.push(variables_axes[observation][0])
    }
  }

  // storing ax variable 'Life_Quality_mark' in own list
  for (var i = 2; i < 30; i+=3){
  Life_Quality_mark.push(list_variables_axes[i])
  }

  // storing ax variable 'Voter_turnout' in own list
  for (var i = 0; i < 30; i+=3){

  Voter_turnout.push(list_variables_axes[i])
  }

  // storing ax variable 'Employement_Rate' in own list
  for (var i = 1; i < 30; i+=3){

  Employement_Rate.push(list_variables_axes[i])
  }

  // obtaining countries of DOM, and storing in a list
  countries = display.structure.dimensions.observation[0].values
  for (i = 0; i <10; i++){

  list_countries.push(countries[i]['name'])
  }

  // creating list (array in array), for all the variables
  dataset=[]

  // pushing all the variables to the list of the dataset
  for (i =0; i < 10; i++){
  dataset.push([list_countries[i],Life_Quality_mark[i],Voter_turnout[i],Employement_Rate[i]])
  }

  // creating list for dict
  dict = []

  // writing the data to a dictenory, called dict
  for(var data = 0; data < dataset.length; data++)
  {
    dict.push({
    "Country" : dataset[data][0],
    "Life_Quality_mark" : dataset[data][1],
    "Voter_turnout"     : dataset[data][2],
    "Employement_Rate" : dataset[data][3],
    })
  }

  // calling the build function which gets the parameter dict
  build (dict);
}

// creating global variables, to obtain in different functions
var margin = {top: 20, right: 20, bottom: 30, left: 40},
w = 960 - margin.left - margin.right,
h = 500 - margin.top - margin.bottom;

  // build function, 'builds' the scatterplot based on the data of the dict
  function build (data){
    dict = data
  console.log(dict);

  // creating body object
  var body = d3.select('body')

  // Creating collors for countries
  var cValue = function(d) { return d.Country;},
  color = d3.scale.category10();

  // setting up x
  var xValue = function(d) { return d.Life_Quality_mark;},
  xScale = d3.scale.linear().range([0, w]),
  xMap = function(d) { return xScale(xValue(d));}


  // setting up y
  var yValue = function(d) { return d.Employement_Rate;},
  yScale = d3.scale.linear().range([h, 0]),
  yMap = function(d) { return yScale(yValue(d));}

  // making sure the dots don't overlap
  xScale.domain([d3.min(dict, xValue)-4, d3.max(dict, xValue)+1]);
  yScale.domain([d3.min(dict, yValue)-6, d3.max(dict, yValue)+1]);

  // creating tooltip variable
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

  // creating SVG
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

  // Y-axis in percentage
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .ticks(6)
  .orient('left')
  .tickFormat(function(d) { return d + "%"; });

  // Creating circles and create event mouseover
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
  .append('text')
  .attr('id', 'yAxisLabel')
  .attr('transform','rotate(-90)')
  .attr('x',0)
  .attr('y',5)
  .attr('dy','.71em')
  .style('text-anchor','end')
  .text('Employement rate')

  // drawing legend
  var legend = svg.selectAll(".legend")
  .data(color.domain())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // creating rectangles for each country with the corresponding color
  legend.append("rect")
      .attr("x", w - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // creating legend text
  legend.append("text")
  .attr("x", w - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d;})
}

  //creating function to change the y-axes.
  function Change_Y_axe() {

  // based on html onchange event (see scatter.html) and obtaining value
  // value is the dynamic y value
  New_y_axes = document.getElementById("Y-axes_select");
  value =  New_y_axes.options[New_y_axes.selectedIndex].value;

  // defining 'new' y-scale
  var yScale = d3.scale.linear()
  .domain([
  d3.min([0,d3.min(dict,function (d) { return d[value] })]),
  d3.max([0,d3.max(dict,function (d) { return d[value] })])
  ])
  .range([h,0])

  // defining 'new' y-axis
  var yAxis = d3.svg.axis()
  .scale(yScale)
  .ticks(10)
  .orient('left')
  .tickFormat(function(d) { return d + "%"; });

  // changing new values
  yAxis.scale(yScale)
  d3.select('#yAxis')
  .transition().duration(1000)
  .call(yAxis)
  d3.select('#yAxisLabel')
  .text(value)

  // changing postion circles depending on new 'values'
  d3.selectAll('circle')
  .transition().duration(1000)
  .delay(function (d,i) { return i*100})
  .attr('cy',function (d) { return yScale(d[value]) })

}
