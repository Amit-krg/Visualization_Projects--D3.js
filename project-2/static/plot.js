
//redraw will load the data random/strat for PCA/MDS based on the options selected
function redraw(file,typed)
{

  fileName=file;
 type=typed;

document.getElementById('chart').innerHTML='';
document.getElementById('matrix').innerHTML='';
document.getElementById("screechart").innerHTML="";
document.getElementById("loadings").innerHTML="";

var f,t;
if(file=="pca")
    f="PCA Component";
else if(file=="correlation")
    f="MDS-Correlation";
else if(file=="euclidean")
    f="MDS-Euclideam";  
if(type=="strat")
    t="Stratified";
else
    t="Random";        

var comment="Plot-Type : "+f+",  Data-type : "+t;
var para= document.createElement('p');
para.textContent=comment;
document.getElementById('chart').appendChild(para);


var arr=[];
 d3.csv("static/"+file+".csv",function(data){
    var i=0;
    data.forEach(function(d){
    //console.log(d);
    arr.push([]); 
    arr[i].push(new Array(2));
    if(type=="random")
    {
      arr[i][0]=parseFloat(d.a1);
      arr[i][1]=parseFloat(d.a2);
    } 
    else
    {
      arr[i][0]=parseFloat(d.r1);
      arr[i][1]=parseFloat(d.r2);
    }
    i++;
  });


var xMax=0, xMin=0;
var yMax=0,yMin=0;
console.log(arr.length);

 for(var i=0;i<arr.length;i++)
 {
  //onsole.log(arr[i][1]);
    if(arr[i][0]>xMax) xMax=arr[i][0];

    else if(arr[i][0]<xMin) xMin=arr[i][0];
 }

 console.log("xMax:"+xMax+"xMin:"+xMin);
for(var i=0;i<arr.length;i++)
 {
    if(arr[i][1]>yMax) yMax=arr[i][1];

    else if(arr[i][1]<yMin) yMin=arr[i][1];
 }  
 // console.log(arr);   
 console.log("yMax:"+yMax+"yMin"+yMin); 
 
  var margin = {top: 70, right: 15, bottom: 60, left: 60}
    , width = 960 - margin.left - margin.right
    , height = 480 - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
            .domain([xMin, xMax])
            .range([ 0, width ]);
  
  var y = d3.scale.linear()
          .domain([yMin,yMax])
          .range([ height, 0 ]);

  var chart = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'chart');
  //.transition();

    var main = chart.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'main');   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');
  //xAxis arr 
    main.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'main axis date')
  .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');
  chart.append("text")
        .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -130)
          .attr("dy", "5em")
          .style("text-anchor", "middle")
          .attr("id", "yLabel")
          .text("Component-A");
  chart.append("text")
          //.attr("transform", "rotate(-20)")
          .attr("y", height+margin.top+margin.bottom-20)
          .attr("x", width/2+margin.left)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .attr("id", "xLabel")
          .text("Component-B");        
  //y-axis arr
    main.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'main axis date')
  .call(yAxis);

    var g = main.append("svg:g"); 
    var count=0;
    g.selectAll("scatter-dots")
      .data(arr)
      .enter().append("svg:circle")
     .attr("cx", function (d,i) { 
            //console.log(d[i]);
            return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 4)
          .attr("color",'#0CCCC')
        

      });
}