//using outside data

//room for axes. add margins. move container over.
var margin = {top:20, right:20, bottom:30, left: 40},
        width = 960-margin.left-margin.right,
        height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
                
//orient chart vertically. scaling y values.
var y = d3.scaleLinear()
        .range([height, 0]);

//scaling our x values, 
var x = d3.scaleBand()
        .rangeRound([0, width], .1)
        .paddingInner(0.1);

//build our axes
var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(10, "%");


d3.tsv("letters.tsv", function(error, data){
    x.domain(data.map(function(d){return d.letter;}));
    y.domain([0, d3.max(data, function(d){return d.frequency;})]);
    //this adds axes using append()
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    //add in bars for each letter
    svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d){return x(d.letter);})
            .attr("width", x.bandwidth())
            .attr("y", function(d){return y(d.frequency);})
            .attr("height", function(d){return height - y(d.frequency)});
    
    //brush reference: https://bl.ocks.org/mbostock/4349545
    //no handles...just a region
var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("start brush end", brushmoved);
    
var gBrush = svg.append("g")
        .attr("class", "brush")
        .call(brush);


gBrush.call(brush.move, [0.3, 0.5].map(x));
    
/*var circle = svg.append("g")
    .attr("class", "circle")
  .selectAll("circle")
  .data(data)
  .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + x(d) + "," + y() + ")"; })
    .attr("r", 3.5);*/

var handle = gBrush.selectAll(".handle--custom")
  .data([{type: "w"}, {type: "e"}])
  .enter().append("path")
    .attr("class", "handle--custom")
    .attr("fill", "#666")
    .attr("fill-opacity", 0.8)
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("cursor", "ew-resize")
    /*.attr("d", d3.arc()
        .innerRadius(0)
        .outerRadius(height / 10)
        .startAngle(0)
        .endAngle(function(d, i) { return i ? Math.PI : -Math.PI; }));*/

function brushmoved() {
  var s = d3.event.selection;
  if (s === null) {
  } else {
      //how to use brush selection:
      // http://stackoverflow.com/questions/38492633/what-is-the-correct-argument-for-d3-brushselection
      console.log(d3.brushSelection(d3.select(".brush").node()));
      var brushSelect = d3.brushSelection(d3.select(".brush").node()); 
      //use filter to get data - how do we do this?
      var selectedData = data.filter(function(d){
          if(brushSelect[0] >= x(d.letter) && brushSelect[1] <= x(d.letter)){
              return d.letter;
          }
      });
      console.log(selectedData);
  }
}
});


//add a title
svg.append("text")
        .attr("x", (width/2))
        .attr("y", 0 + (margin.top/2))
        .attr("text-anchor", "middle")
        .text("Relative Frequency of Letters in the English Alphabet");



