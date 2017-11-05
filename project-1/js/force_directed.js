function forceGraph(){
 
 document.getElementById('chart').innerHTML='';

 //change button text as soon as graph is changed 
 if(document.getElementById("forceButton").value=="Back to Histogram"){
  document.getElementById("forceButton").value="Show Force Directed Graph"
  changeColumn();
   document.getElementById("forcedirected").innerHTML='';
   document.getElementById("hoverarea").style.display="flex";
   document.getElementById("menu").disabled = false;
   document.getElementById("forceArea").style.visibility="collapse"; 
    
 }
 else{
      document.getElementById('forceButton').value="Back to Histogram";
      drawGraph(50);
      document.getElementById("menu").disabled = true;
      document.getElementById("hoverarea").style.display="none";
      document.getElementById("forceArea").style.visibility= "visible";
    }
 }
 function changeLength(){
  console.log("function called");
  var len = parseInt(document.getElementById("len").value);
  console.log(len);
  document.getElementById("len").value="";
  drawGraph(len);
 }

 function drawGraph(len){


   var graph = {
      nodes:[
        {"id": "A", "group": 1},
        {"id": "B", "group": 2},
        {"id": "C", "group": 3},
        {"id": "D", "group": 4},
        {"id": "E", "group": 5},
        {"id": "F", "group": 6},
        {"id": "G", "group": 7},
        {"id": "H", "group": 7}
      ],
      links:[
        {"source": "A", "target": "B", "value": 30},
        {"source": "B", "target": "C", "value": 30},
        {"source": "C", "target": "D", "value": 30},
        {"source": "D", "target": "E", "value": 30},
        {"source": "E", "target": "F", "value": 30},
        {"source": "F", "target": "G", "value": 30},
        {"source": "G", "target": "H", "value": 30},
        {"source": "H", "target": "A", "value": 30},
        {"source": "A", "target": "D", "value": 30},
        {"source": "C", "target": "F", "value": 30},
        {"source": "B", "target": "G", "value": 30},
        {"source": "E", "target": "F", "value": 30},
      ]
    };

    var width = 1080;
    var height = 800;

    var svg = d3.select('#forcedirected')
              .append("div")
              .attr("id", "forceInside")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style('display','block');
                //.style('margin','auto')
                //.attr("style", "outline: #00FF00 dotted thick");
              
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
        .attr("r", 15)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

      node.append("title")
      .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links)
        //.start();//.charge([-len]) 
        //.linkDistance(len)  

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
           
}
  


