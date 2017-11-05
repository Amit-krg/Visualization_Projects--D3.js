
function adjustBin(){
	var svg=d3.selectAll('#hoverarea').on("mousedown",function(){
		var div= d3.select(this)
				.classed('active',true);
		var xpos=d3.mouse(div.node())[0];
		var xPos = d3.mouse(div.node())[0]
	var w = d3.select(window)
		      .on("mousemove", mousemove)
		      .on("mouseup", function(){
		      	div.classed("active", false);
	    		w.on("mousemove", null).on("mouseup", null);
		      });

	  function mousemove() {
	  	if(d3.mouse(div.node())[0] + 20 < xPos && bin < 15){
	  		bin += 1;
	  		refresh(arr1,bin);
	  		xPos = d3.mouse(div.node())[0];
	  	}
	    else if(d3.mouse(div.node())[0] - 20 > xPos && bin > 3){
	  		bin -= 1;
	  		refresh(arr1,bin);
	  		
	  		xPos = d3.mouse(div.node())[0];
	  	}

	  }	

});
		
}

 function createHistogram(bardata,bin){	
	//console.log("called"+bardata[0]);
	 var h=800 ,w=1080 ,  baroffset=10,barwidth= (w-300-((bin-1)*baroffset))/bin;
	
	 var yscale=d3.scaleLinear()
	 			.domain([0,d3.max(bardata)])
	 			.range([0,h-200])
	 				
	 var colors=d3.scaleLinear()
				.domain([0,bardata.length*0.33,bardata.length*0.66,bardata.length]) 	
				.range(['#FFB832','#C61C6F','#268BD2','#85992C'])		
	 //d3.csv('',function(data))
	 //function(d,i) getting data from the arrary and index along with it
	 var tooltip=d3.select('body').append('div')
	 				.style('position','absolute')
	 				.style('padding','0 10px')
	 				.style('background','white')
	 				.style('opacity',0)
	 				
	 				
	 var svg=d3.select("#chart")
	 			.append("svg")
		 		.attr("height",h)
		 		.attr("width",w)
		 		//.style('display','block')
		 		.style('margin','auto');
		 		//.attr("class","bar")
		 		//.style('background','#C9D7D6')
		var myChart = 
					svg.selectAll('rect').data(bardata)   //select all rectange element then append bar data to them and them append this rectange to the svg
		 		.enter().append('rect')
		 			.style('fill',function(d,i){return colors(i);})
		 			.attr('width',barwidth)
		 			.attr('x',function(d,i){
		 				return i*(barwidth+baroffset);
		 				console.log("value ="+i*(barwidth+baroffset));
		 			})
		 			.attr('height',0)		 			
		 			.attr('y',h)
		 			.on('mouseover',function(d,i){
		 				d3.select(this)
		 				.attr("y",d3.select(this).attr('y')-30)
		 				.attr("height",parseInt(d3.select(this).attr('height'))+40)
		 				.attr("x",(i*barwidth)+ (i-1)*baroffset+baroffset/2)
		 				.attr('width',barwidth+baroffset)
		 				.style('opacity',.8)
		 				.transition();
		 				 d3.selectAll("text")
            			.select(function(d, ind) { return ind === i ? this : null; })
            			.attr("y",function(d)
		 				{
		 					return h-yscale(d)-42 ;
		 				})
            			.style("opacity",1);
		 				
		 			})
		 			.on('mouseout',function(d,i){
		 				d3.select(this)
		 				.attr('width',barwidth)
		 				.attr('height',function(d,i){
		 					return yscale(d);
		 					})
		 				.attr('y',function(d,i){
		 					return (h- yscale(d));
		 				})
		 				.attr('x',i*(barwidth+baroffset))
		 				.style('opacity',1)

		 				 d3.selectAll("text")
            			.select(function(d, ind) { return ind === i ? this : null; })
            			.attr("y",function(d)
		 				{
		 					return h-yscale(d)-42 ;
		 				})
            			.style("opacity",0);

		 			})
		 			.on('click',function(){
		 				document.getElementById("chart").innerHTML="";
		 				createPiechart(bardata,bin);
		 				fig=1;
		 			});
	myChart.transition()
		.attr('height',function(d,i){
		 		return yscale(d);
		 			})		 			
		 .attr('y',function(d,i){
		 		return (h- yscale(d));
		 			})
		 .delay(function(d,i){
		 	return i*30;
		 })
		 .duration(1000);
		 //.easeElastic(0) 		
		 svg.selectAll("text")
		 				.data(bardata)
		 				.enter().append("text")
		 				.text(function(d){
		 					return d;
		 				})
		 				.attr("x",function(d,i){
		 					return i*(barwidth+baroffset)+barwidth/4; 
		 				})
		 				.attr("y",function(d)
		 				{
		 					return h-yscale(d)-42 ;
		 				})
		 				.style('opacity',0)
		 				.attr("font-family", "sans-serif")
   						.attr("font-size", "20px")
   						.attr("font-weight","bold");
   			 			

}	 	 

function createPiechart(bardata,bin)
{
        var width =1080,height = 800,radius = 200,arclen;
        var sum=0;
        for(var i=bardata.length; i--;){
        	sum+=bardata[i];
        }
        console.log("sum ="+sum);
        arclen=360/sum;
        //var color = d3.scaleOrdinal()
        			//.range(['#C61C6F','#268BD2','#85992C'])//(d3.schemeCategory20b);
        var color = d3.scaleOrdinal(d3.schemeCategory20c);			
        var svg = d3.select('#chart')
		          .append('svg')
		          .attr('width', width)
		          .attr('height', height)
		          .style('display','block')
			 	  //.style('margin','auto')
		          .append('g')
		          .attr('transform', 'translate(' + (width / 2) +
		            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
        var marc =d3.arc()
        	.innerRadius(0)
        	.outerRadius(radius+20);
        var pie = d3.pie()
          .value(function(d) { return d; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(bardata))
          .enter()
          .append('path')
          //.style('')
          .attr('d', arc)
          .attr('fill', function(d,i) {
            return color(i);
          })
          .on("mouseover",function(d){
          	d3.select(this)
          		.attr("stroke","black")
          		.transition()//.delay(200)
          		.attr("d",marc)
          		.attr("stroke-width",2);
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
          .on("mouseout",function(d){
          	d3.select(this)
          	.attr("d",arc)
          	.transition().delay(20)
          	.attr("stroke","none")
          	svg.selectAll("text")
                      .style("opacity",0);
          })
          .on('click',function(){
          	document.getElementById("chart").innerHTML="";
          	createHistogram(bardata,bin);
          	fig=0;

          });

   
 }