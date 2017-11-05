function plotScree(file)
{
	 fileName="un";
 	document.getElementById('chart').innerHTML='';
  	document.getElementById('matrix').innerHTML='';
  	document.getElementById("screechart").innerHTML="";
  	document.getElementById("loadings").innerHTML="";

var f;
if(file=="strat")
	f="Stratified";
else if(file=="random")
	f="Random";		
var comment="Scree Plot for: "+f+" Data";
var para= document.createElement('p');
para.textContent=comment;
document.getElementById('chart').appendChild(para);


	var margin = {top: 30, right: 30, bottom: 50, left: 20},
		width = 760 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(10);

	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(5);

	// Define the line
	var valueline = d3.svg.line()
		.x(function(d,i) { return x(i+1); })
		.y(function(d) { return y(d.K); });
		//.interpolate("basis"); smoothening
		
	// Adds the svg canvas
	var svg = d3.select("#screechart")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		   // .attr("id", "scatter")
		   .style("margin-left", "2em")
		.append("g")
			.attr("transform", 
				  "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.csv("static/scree_"+file+".csv", function(error, data) {
		data.forEach(function(d) {
			d.K = +d.Eigen_val;
	  
		});
			   
	   x.domain([0, data.length]);
	   y.domain([0,d3.max(data, function(d) { return d.K; }) ]);

		// Add the valueline path.
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("d", valueline)
			.attr('stroke','green')
			.attr("fill", "none"); 	
		// Add the X Axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// Add the Y Axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		//put labels
		  svg.append("text")
		  .attr("transform", "rotate(-90)")
			.attr("y", -60)
			.attr("x", -130)
			.attr("dy", "5em")
			.style("text-anchor", "middle")
			.attr("id", "yLabel")
			.text("Eigen value(Scaled)");
		  

		  svg.append("text")
			//.attr("transform", "rotate(-20)")
			.attr("y", 350)
			.attr("x", 350)
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.attr("id", "xLabel")
			.text("Components");

	});
}