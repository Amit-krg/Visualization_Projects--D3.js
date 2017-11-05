
function plotLoadings(file)
{
	
	
	document.getElementById('chart').innerHTML='';
  	document.getElementById('matrix').innerHTML='';
    document.getElementById("screechart").innerHTML="";
    document.getElementById("loadings").innerHTML="";

    var f;
	if(file=="strat")
		f="Stratified";
	else if(file=="random")
		f="Random";		

	var comment="Sum of Squared loading for : "+f+",  Data-samples ";
	var para= document.createElement('p');
	para.textContent=comment;
	document.getElementById('loadings').appendChild(para);


	var width=960,height=500;
	
    margin = {top: 20, right: 20, bottom: 30, left: 60};
    //width = width - margin.left - margin.right,
    //height = height- margin.top - margin.bottom;
    var color = d3.scale.category10();
    var chart = d3.select("#loadings").append("svg")
    			.attr("width",width+margin.right+margin.left)
    			.attr("height",height + margin.top + margin.bottom);

	var x = d3.scale.ordinal().rangeRoundBands([0, width-margin.right], .1);
    y = d3.scale.linear().rangeRound([height, 0]);

    var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(7).tickSize(0).tickPadding(8);
	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(10);

var g = chart.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("static/loadings_"+file+".csv", function(error,data) {
	data.forEach(function(d){
		 d.s_loadings = +d.s_loadings;
		});
 
 
 console.log(data);
  x.domain(data.map(function(d) { return d.attributes; }));
  y.domain([0, d3.max(data, function(d) { return d.s_loadings; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      //.call(d3.axisBottom(x));


  g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)
    

      chart.append("text")
        .attr("transform", "rotate(-90)")
          .attr("y", -98)
          .attr("x", -140)
          .attr("dy", "7em")
          .style("text-anchor", "middle")
          .attr("id", "yLabel")
          .text("Sum of Squared value");

       chart.append("text")
          //.attr("transform", "rotate(-20)")
          .attr("y", height+margin.top+margin.bottom-20)
          .attr("x", width-margin.left)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .attr("id", "xLabel")
          .text("Components");    

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.attributes); })
      .attr("y", function(d) { return y(d.s_loadings); })
      .attr("width", 100)
      .attr("height", function(d) { return height-y(d.s_loadings); })
      .style("fill","#87CEEB")
      .on('mouseover',function(d,i){
		 				d3.select(this)
		 				//.style('opacity',.5)
		 				.style("fill","#FFD204");
		 				
		 			})
	   .on('mouseout',function(d,i){
		 				d3.select(this)
		 				.style('opacity',1)
	   					.style("fill","#87CEEB"); })
});
}