var time = 0;


//scatterPlot variables
var actionArray = {};
var indieArray = {};
var rpgArray = {};
var strategyArray = {};

var xAxisScale;
var yAxisScale;
var gX;
var gY;
var view;

var circles;
var xAxis;
var yAxis;
var scale;

var dataset;

var svgViewport;
var zoom;
var innerSpace;
var tip;

//checks for loading
var actionCheck;
var indieCheck;
var strategyCheck;
var rpgCheck;
var currentTag;

function scatterplot(dataset){
  
  var svgWidth = 800;
  var svgHeight = 300;

  var r = 7;
  var margin = {top: 30, right: 40, bottom: 50, left: 60};

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  /*

  var svgWidth = 800;
  var svgHeight = 300;
  var margin = {top: 30, right: 40, bottom: 50, left: 60};

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  svgViewport = d3.select("body")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


  // create scale objects
  xAxisScale =d3.scaleLinear()
    .domain([0,9000])
    .range([0,width]);

  yAxisScale = d3.scaleLinear()
    .domain([0,14])
    .range([height,0]);

  // create axis objects
  xAxis = d3.axisBottom(xAxisScale);
  yAxis = d3.axisLeft(yAxisScale);

  // Zoom Function
  zoom = d3.zoom()
    .on("zoom", zoomFunction);

  // Inner Drawing Space
  innerSpace = svgViewport.append("g")
    .attr("class", "inner_space")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);



  //tooltip
  tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
      return "Avg price: " + d.cy + "$<br>" + "Number of Games: " + d.cx;
    });

    */
  // append zoom area
  view = innerSpace.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)


  // append some dummy data
  circles = innerSpace.selectAll("circles")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class",currentTag)
      .attr("id","circles")
      .attr("fill","#5DB0B8")
      .attr("cx", function(d) { return xAxisScale(d.cx); })
      .attr("cy", function(d) { return yAxisScale(d.cy); })
      .attr('r', r)
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .call(tip);
/*
  // Draw Axis
  gX = innerSpace.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  gY = innerSpace.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
*/
changeCircleColor(currentTag);

};

function zoomFunction(){
  // create new scale ojects based on event
  var new_xScale = d3.event.transform.rescaleX(xAxisScale)
  var new_yScale = d3.event.transform.rescaleY(yAxisScale)
  //console.log(d3.event.transform)

  // update axes
  gX.call(xAxis.scale(new_xScale));
  gY.call(yAxis.scale(new_yScale));

  // update circle
  circles.attr("transform", d3.event.transform)
};

function startupVi5(){
  
  d3.json("Data/Game Tag Data/actionCoordinates.json", function (data) {
      actionArray = data;
      loadingVis5(0);
  })
  d3.json("Data/Game Tag Data/indieCoordinates.json", function (data) {
      indieArray = data;
      loadingVis5(1);
  })
  d3.json("Data/Game Tag Data/rpgCoordinates.json", function (data) {
      rpgArray = data;
      loadingVis5(2);
  })
  d3.json("Data/Game Tag Data/strategyCoordinates.json", function (data) {
      strategyArray = data;      
      loadingVis5(3);
  })
  
  //loadingVis5(9);  //force a run in scatterplot()
};

//loading all data! 
function loadingVis5(id){
  switch(id){
    case 0:
      actionCheck = true;
      break;
    case 1:
      indieCheck = true;
      break;
    case 2:
      rpgCheck = true;
      break;
    case 3:
      strategyCheck = true;
      break;
    default:
      break;

  }
   if(actionCheck && indieCheck && rpgCheck && strategyCheck)
      genAxis();//scatterplot(actionArray);
}

function genAxis(){


  var svgWidth = $("#vis5").width();
  var svgHeight = $("#vis5").height();
  var margin = {top: 30, right: 40, bottom: 50, left: 60};

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  svgViewport = d3.select("#vis5")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


  // create scale objects
  xAxisScale = d3.scaleLinear()
    .domain([0,9000])
    .range([0,width]);

  yAxisScale = d3.scaleLinear()
    .domain([0,14])
    .range([height,0]);

  // create axis objects
  xAxis = d3.axisBottom(xAxisScale);
  yAxis = d3.axisLeft(yAxisScale);

  // Zoom Function
  zoom = d3.zoom()
    .on("zoom", zoomFunction);

  // Inner Drawing Space
  innerSpace = svgViewport.append("g")
    .attr("class", "inner_space")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);


  // Draw Axis
  gX = innerSpace.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);/*
      .append("text")
        .attr("class","axisText")
        .attr("x",width)
        .attr("y",0)
        .attr("dy","1em")
        .style("stroke","black")
        .text("Number of Games");*/

  gY = innerSpace.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);/*
      .append("text")
        .attr("class","axisText")
        .attr("transform","rotate (-90)")
        .attr("y",0)
        .attr("dy","0.75em")
        .style("stroke","black")
        .text("Average Price ($)");*/

        //tooltip
  tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
      return "Avg price: " + d.cy + "$<br>" + "Number of Games: " + d.cx;
    });
}


function clearDots(tag){
    for(var z=0; z<4;z++){
      if(z!=tag){
        var elements = document.getElementsByClassName(z);
        if(elements!=null)
          for(var i=elements.length-1; i>=0; i--) {
            console.log(elements);
            elements[i].parentElement.removeChild(elements[i]); //Calls parent and deletes the child!
        }
      }
    }       
}

function changeCircleColor(tag){
    var elements = document.getElementsByClassName(tag);
    if(elements!=null) //always true Except for an error
        for(var i=0; i<elements.length; i++) {
            if(i==time)
                elements[i].setAttribute("fill","black");
            else
                elements[i].setAttribute("fill","#5DB0B8");
        }
}



function dropdown5Select(tag){
  currentTag = tag;
  var name ="";
  switch(tag){
      case 0:  
          name = "Action";
          dataset = actionArray;
      break;
      case 1:
          name = "Indie";
          dataset = indieArray;
      break;
      case 2:
          name = "RPG";
          dataset = rpgArray;
      break;
      case 3:
          name = "Strategy";
          dataset = strategyArray;
      break;
      default:
          alert("Html page changed!!");
      break;
    }
    //Change button Name
    $(document).ready(function(){
        $("#buttonGT").text(name);
    });
    // -- //
    clearDots(currentTag);    
    scatterplot(dataset);
            
}
