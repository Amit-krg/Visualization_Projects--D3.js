function pieChartUtil(array){
  var sum = 0;
  for (var i=array.length; i--;) {
    sum+=array[i];
  }
  console.log(sum)
  return 360/sum;
}

function createPieChart(histData){
  var w=960,h=500;
  var radius = (w-200)/2;
  var mulRatio = pieChartUtil(histData);
  /*var color =d3.scale.category20();*/
  var color=d3.scaleOrdinal()
    .range(['#FFB832','#C61C6F','#268BD2','#85992C'])
  var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append('g')
            .attr('transform', 'translate(' + 1.3*radius + ',' + 1.3*radius + ')');;

  var pie = d3.layout.pie()
            .value(function(d) {return mulRatio * d;});
  var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(0);

  var arc2 = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(radius + 20);

  var pieC = svg.selectAll("path")
            .data(pie(histData))
            .enter()
            .append("path")
            .attr('d', arc)   
            .attr('fill', function(d,i){
              return color(i);
            })
            .on("mouseover", function(d,i) {
              d3.select(this)
                .attr("stroke", "black")
                .attr("d", arc2)
                .attr("stroke-width", 2);
              
              svg.append("text")
              .attr("transform", function() {
                   return "translate(" + arc.centroid(d) + ")";
              })
              .style("text-anchor", "middle")
              .style("font-size", 15)
              .attr("class", "label")
              .style("opacity",100)
              .text(d.value);

            })
            .on("mouseout", function(d,i) {
              d3.select(this)
              .attr("d",arc)
              .attr("stroke", "none");
              svg.selectAll("text")
                      .style("opacity",0);
              //d.outerRadius = radius;
              
            })
            .on("click",function(){
                document.getElementById("chart").innerHTML = '';
                createHistogram(histData);
                currFigure = 0;
            })
            ;
}