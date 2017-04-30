//color code based on article type

//source on how to create scatterplot: http://rajvansia.com/scatterplotbrush-d3-v4.html
//read in kaggle fake news data

//margin so we have white space for labels
var margin = {top: 20, right: 20, bottom: 110, left: 50},
    margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom,
    height2 = 600 - margin2.top - margin2.bottom;
var parseDate = d3.timeParse("%b %Y");
var x = d3.scaleLinear().range([0, width]),
    x2 = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);
var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);


d3.csv("fake.csv", function(error, data){
  var body = d3.select('body')
  //y data contains popularity counts
  var yData = [ { "text" : "likes" },
                     { "text" : "shares" },
                     { "text" : "comments" },
                     { "text" : "participants_count"},
                   ];
  var xData = [ { "text" : "spam_score" },
                     { "text" : "published" },
                   ];
  
  var articleType = [ { "text" : "bias" },
                     { "text" : "conspiracy" },
                     { "text" : "satire" },
                     { "text" : "bs"},
                     { "text" : "hate"},
                     { "text" : "junksci"},
                     { "text" : "state"},
                     { "text" : "All types"},
                   ];
                   
   // Select X-axis Variable
  var span = body.append('span')
    .text('Select X-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','xSelect')
      .on('change',xChange)
    .selectAll('option')
      .data(xData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')

  // Select Y-axis Variable
  var span = body.append('span')
      .text('Select Y-Axis variable: ')
  var yInput = body.append('select')
      .attr('id','ySelect')
      .on('change',yChange)
    .selectAll('option')
      .data(yData)
      .enter()
    .append('option')
      .attr('value', function (d) { return d.text })
      .text(function (d) { return d.text ;})
  body.append('br')
  
    // Variables
  var body = d3.select('body')
  //margins for label space
  var margin = { top: 50, right: 50, bottom: 50, left: 50 }
  var h = 600 - margin.top - margin.bottom
  var w = 800 - margin.left - margin.right
  var formatPercent = d3.format('.2%')
  // Scales
  var colorScale = d3.schemeCategory20;
  var xScale = d3.scaleLinear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d['spam_score'] })]),
      d3.max([0,d3.max(data,function (d) { return d['spam_score'] })])
      ])
    .range([0,w])
  var yScale = d3.scaleLinear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d['likes'] })]),
      d3.max([0,d3.max(data,function (d) { return d['likes'] })])
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10, "s")
    
   // text label for the x axis, source: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("spam_score");
  // Y-axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(20, "s")
    
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("likes"); 
      
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d['spam_score']) })
      .attr('cy',function (d) { return yScale(d['likes']) })
      .attr('r','3')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale[i] })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',6)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',3)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.variable +
                           '\ntitle: ' + (d['title']) +
                           '\npublish date: ' + (d['published']) +
                           '\nspam_score: ' + (d['spam_score']) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w/2)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('spam_score')
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
      .text('likes')

  function yChange() {
    var value = this.value // get the new y value
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
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

  function xChange() {
    var value = this.value // get the new x value
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data,function (d) { return d[value] })]),
        d3.max([0,d3.max(data,function (d) { return d[value] })])
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition().duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition().duration(1000)
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
        .attr('cx',function (d) { return xScale(d[value]) })
  }
  

})