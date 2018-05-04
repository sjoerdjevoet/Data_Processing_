var object = "http://stats.oecd.org/SDMX-JSON/data/RWB/CZE+ISL+IRL+JPN+KOR+MEX+NLD+POL+TUR+USA.EMP_RA+VOTERS_SH+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, object)
  .awaitAll(doFunction);



function doFunction(error, response) {
  if (error) throw error;


var display = JSON.parse(response[0].responseText);
  console.log(display);

  list_countries = []
  list_variables_axes = []
  Life_Quality_mark = [] // 5.8
  Unemployement_Rate = []
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

  Unemployement_Rate.push(list_variables_axes[i]) // empotement rate
 }

  console.log(Unemployement_Rate);
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
dataset.push([list_countries[i],Life_Quality_mark[i],Voter_turnout[i],Unemployement_Rate[i]])
}
console.log(dataset);

dict = []

for(var data = 0; data < dataset.length; data++){
  dict.push({
    "Country" : dataset[data][0],
    "Life_Quality_mark" : dataset[data][1],
    "Voter_turnout"     : dataset[data][2],
    "Unemployement_Rate" : dataset[data][3],

  })
}

console.log(dict);

// CSV section
  var body = d3.select('body')
  var selectData = [ { "text" : "Voter_turnout" },
                     { "text" : "Unemployement_Rate" },
                   ]



  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(selectData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')

  // Variables
  var body = d3.select('body')
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var h = 500 - margin.top - margin.bottom
  var w = 500 - margin.left - margin.right

  // Scales
  var colorScale = d3.scale.category10()
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(dict,function (d) { return d['Unemployement_Rate'] })]),
      d3.max([0,d3.max(dict,function (d) { return d['Unemployement_Rate'] })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(dict,function (d) { return d['Unemployement_Rate'] })]),
      d3.max([0,d3.max(dict,function (d) { return d['Unemployement_Rate'] })])
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(5)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5)
    .orient('left')
  // Circles
  var circles = svg.selectAll('circle')
      .data(dict)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d['Unemployement_Rate']) })
      .attr('cy',function (d) { return yScale(d['Unemployement_Rate']) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.Country +
                           '\nReturn: ' + (d['Unemployement_Rate']) +
                           '\nStd. Dev.: ' + (d['Life_Quality_mark']) })
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
      .text('Annualized Return')
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
      .text('Annualized Return')

  function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(dict,function (d) { return d[value] })]),
        d3.max([0,d3.max(dict,function (d) { return d[value] })])
        ])
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



}







function test (){//alert('Sjoerd');
var e = document.getElementById("ySelect");
e.options[e.selectedIndex].value;

// alert(e.options[e.selectedIndex].value);

}
