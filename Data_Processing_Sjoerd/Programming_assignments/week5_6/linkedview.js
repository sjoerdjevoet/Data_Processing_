/* Sjoerd Zagema (12195677)
Linked Views
*/

// initialising global variables
var Flexibel_Data_Variable
var jaarjson
var jaar
jaar = 2017
jaarjson = "2017.json"

// wait for data to be ready and create the map
  d3.queue()
  .defer(d3.json, "2016.json")
  .defer(d3.json, "2017.json")
  .await( function (error) {
    if (error){throw error;} else {MakeMap(jaarjson);}
})

  // cleaning and hiding bar elements and description bar elements
  document.getElementById('barcol').innerHTML = "";
  document.getElementById('textbar').style.display = 'none';


  //If different year is selected, change values
  $("#selectBox").change(function(){
  value =    $('#selectBox :selected').val();
  if (value == jaarjson ){jaar = 2017}
  if (value != jaarjson) {jaar =2016}

  // cleaning and hiding elements
  d3.select("svg").remove();
  d3.selectAll('#BarChart').remove();
  document.getElementById('bar_title').innerHTML = "";
  document.getElementById('textbar').style.display = 'none';

  // Make map based on new year 'value'
  MakeMap(value);
  });

  // make map based on input data
  function MakeMap(jsonjaren)
  {
      var jaarjson = jsonjaren
      d3.select("#map_title")
      .html("Quality of Life Index "+ jaar);

      // making sure variables are casted to numbers and not strings
      d3.json(jaarjson, function (error, data) {

      data.forEach(function(d) {
      d.Quality_of_Life_Index = +d.Quality_of_Life_Index;
      d.Safety_Index = +d.Safety_Index;
      d.Health_Care_Index = +d.Health_Care_Index;
      d.Cost_of_Living_Index = +d.Cost_of_Living_Index;
      });

      Flexibel_Data_Variable = data;

      // map Quality_of_Life_Index
      var Quality_of_Life_Index = data.map(function(d){ return d.Quality_of_Life_Index; });

      // look for maxium and minimum value of Quality_of_Life_Index
      var minValue = Math.min.apply(null, Quality_of_Life_Index),
      maxValue = Math.max.apply(null, Quality_of_Life_Index);


      // fill dataset in appropriate format
      var dataset = {};

      // giving fillkeys based on Quality_of_Life_Index for color
      data.forEach(function(item){
      var itemvalue = item.ID,
      value = item.Quality_of_Life_Index;
        if (value <= 126){ dataset[itemvalue] = { Quality_of_Life_Index: value, fillKey: 'LOW' };
        }
          else if (value >=126 && value <= 160) {
          dataset[itemvalue] = { Quality_of_Life_Index: value, fillKey: 'AVERAGE' };

          }

            else if (value > 160) {
            dataset[itemvalue] = { Quality_of_Life_Index: value, fillKey: 'HIGH' };

            }
          });


      // render map
        var map = new Datamap({
        element: document.getElementById('map'),
        fills: {
        HIGH: 'green',
        LOW: 'red',
        AVERAGE: 'yellow',
        UNKNOWN: '#707070',
        defaultFill: '#707070'
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography)
            {


            d3.selectAll('#BarChart').remove();

            var selectedcountry = geography.properties.name;
            MakeBar(Flexibel_Data_Variable,selectedcountry)
            var el = document.getElementById('BarChart')
            scrollToElement(el, undefined, undefined, undefined)


            });
        },

        data: dataset,
          geographyConfig: {
          borderColor: '#DEDEDE',
          highlightBorderWidth: 2,

          // don't change color on mouse hover
          highlightFillColor: function(geo) {
          return geo['fillKey'] || '#707070';
          },

          // only change border
          highlightBorderColor: '#B7B7B7',

          // show desired information in tooltip
              popupTemplate: function(geo, data) {

              // don't show tooltip if country don't present in dataset
              if (!data) { return ['<div class="hoverinfo">',
              '<strong>', 'no data', '</strong>','</div>'].join(''); }
              // tooltip
              return ['<div class="hoverinfo">',
              '<strong>', geo.properties.name, '</strong>',
              '<br>Quality of Life Index: <strong>', data.Quality_of_Life_Index, '</strong>',
              '</div>'].join('');
              }
          }
        })

      });
}

    // obtained from https://github.com/oblador/angular-scroll/blob/master/README.md
      function scrollToElement(element, duration = 400, delay = 0, easing = 'easeOutExpo', endCallback = () => {})
    {
      var offsetTop = window.pageYOffset || document.documentElement.scrollTop
      d3.transition()
      .each("end", endCallback)
      .delay(delay)
      .duration(duration)
      .ease(easing)
      .tween("scroll", (offset => () => {
      var i = d3.interpolateNumber(offsetTop, offset);
      return t => scrollTo(0, i(t))
      })(offsetTop + element.getBoundingClientRect().top));
    }


// make bar chart
    function MakeBar(data, selectedcountry)
{
      document.getElementById('textbar').style.display = '';
      var selectedcountry = selectedcountry
      var data = data
      var array_data_for_country

      // check if country has data
      for (i = 0; i<data.length; i++)
      {

          // country has data, create bar chart
        if (selectedcountry == data[i].Country)
          {


          d3.select("#bar_title")
          .html("Variables QLI: " + selectedcountry )

          // create array of variables
          array_data_for_country = []
          array_data_for_country.push(data[i].Cost_of_Living_Index);
          array_data_for_country.push(data[i].Safety_Index);
          array_data_for_country.push(data[i].Health_Care_Index);


          // writing the data to a Variable_Array, called Variable_Array

          var Variable_Array = ({
          "Cost_of_Living_Index" : array_data_for_country[0],
          "Safety_Index" : array_data_for_country[1],
          "Health_Care_Index"     : array_data_for_country[2]
          })


          // Based on https://bl.ocks.org/mbostock/3019563
          var margin = {top: 10, right: 45, bottom: 275, left:80},
          width = 700 - margin.right - margin.left,
          height = 500 - margin.top - margin.bottom;

          var barWidth = width / d3.keys(Variable_Array).length;


          // creating tooltip
          var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d, i) {
          return Variable_Array[d];
          });

          var svg = d3.select("#barcol")
          //
          .append("svg")
          .attr ( "id",'BarChart')
          .attr ({
          "width": width + margin.right + margin.left,
          "height": height + margin.top + margin.bottom
          })

          .append("g")
          .attr("transform","translate(" + margin.left + "," + margin.right + ")");

          // using ordinal.scale for string data
          var Xas_Schaal = d3.scale.ordinal()
          .rangeRoundBands([0,width], 0.2, 0.2);

          // using linear.scale for numeric data
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

          svg.call(tip);

          // placing x variables and determine max y variable
          Xas_Schaal.domain(["Cost of living index", "Safety index","Health care index"]);
          Yas_Schaal.domain([0, d3.max(d3.values(Variable_Array))]);

          // create bar
          svg.selectAll('.bar ').data(d3.keys(Variable_Array))
          .enter()
          .append('rect')
          .attr("class", "bar")
          .attr("width", barWidth - 4)
          .attr("height", 0)
          .attr("x", function(d, i) {
          return i * barWidth;
          })
          .attr("y", function(d) {
          return height;
          })

          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
          .transition().duration(3000)
          .delay( function(d,i) { return i * 200; })

          .attr("y", function(d, i) {
          return Yas_Schaal(d3.values(Variable_Array)[i]);
          })

          .attr("height", function(d, i) {
          return height - Yas_Schaal(d3.values(Variable_Array)[i]);
          });


          // Naming the y-as at a given postion
          svg.append("text")
          .attr("x", -110 )
          .attr("y", -55 )
          .attr("id", "y_as_text")
          .attr("transform", "rotate(-90)" )
          .text("Index");

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
          .attr("id", "x_axis")

          // Draw yAS and postion the label
          svg.append("g")
          .attr("class", "y axis")
          .call(yAS)
          .selectAll("text")
          .attr("dx", "-.8em")
          .attr("dy", ".25em")
          .style("text-anchor", "end")

        }

      }

      // if there is no data, give smooth alert and clean and hide elements
      if (array_data_for_country == null) {function JSalert()
    {

      document.getElementById('bar_title').innerHTML = "";
      document.getElementById('barcol').innerHTML = "";
      document.getElementById('textbar').style.display = 'none';

      swal ( "Ouch" ,  "There is no data for this country" ,  "error" ) }
      JSalert()

    }

}
