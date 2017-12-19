var width = 300,
    height = 300;

var country=[];
var time=0;
var cfg;
var axis;
var total;
var g;
var series;
var allAxis;

var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 200
}


var gamesArray=[];
var RadarChart = {
  draw: function(id, d, options){
    cfg = {
     radius: 5,
     w: 80,
     h: 80,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 90,
     TranslateY: 50,
     ExtraWidthX: 1050,
     ExtraWidthY: 100,
     color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
    };
}
};

function updateRadarChart(){
  //country.forEach(function(c){
   gamesArray=[]; 
   country.forEach(function(c){
    d3.json("Data/Top5Data/"+c+".js", function(error, data) {
        if (error) throw error;
        //console.log(data);
        gamesArray.push(data);
        //console.log("gamesArray", gamesArray);
        //console.log(gamesArray);
        RadarChart.draw("#chart", gamesArray, config);
        drawRadarChart();   
        
        //drawData();
    });

  }); 
};

function drawRadarChart(){
  
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    
    clearRadarChart();
    
    //console.log("Value of d", d);
    
    country.forEach(function(c){
      //console.log("here");
    cfg.maxValue = 100;

    allAxis = (gamesArray[country.indexOf(c)][time].map(function(i, j){return i.area}));
    //console.log("time ", time);
    //console.log(gamesArray[country.indexOf(c)][time])
      
    total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select("#vis1").select("svg").remove();

    g = d3.select("#vis1")
        //.append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
   
    var tooltip;
  
    //Circular segments    Desenha o radar com os riscos bonitos
    //console.log("CFG LEVELS", cfg.levels);
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return country.indexOf(c)*270+(levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total)));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return country.indexOf(c)*270+(levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total)));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }
       series = 0;

    //Vai buscar os eixos
    axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", country.indexOf(c)*270+(cfg.w/2))
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return country.indexOf(c)*270+(cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total)));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    gamesArray.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      series++;
    });
    drawData(c);
  });
};

//console.log(axis);

function drawData(c){

   /* for (var i = 0; i < country.indexOf(c); i++) {
      Things[i]
    }*/
    //clearRadarChart();
    //clearRadarChartId()
    allAxis = (gamesArray[country.indexOf(c)][time].map(function(i, j){return i.area}));
    //console.log("time", time);
    //console.log(axis);
    axis.append("text")
      .attr("class", "legend")
      //.attr("class","poltext"+c)
      .text(function(d){
        //console.log("Value d", d);
        return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return country.indexOf(c)*270+(cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total));})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
    var aux=0;

    //console.log(gamesArray[country.indexOf(c)][time]);

    gamesArray[country.indexOf(c)].forEach(function(y, x){
      if(aux==time){
          dataValues = [];
          //console.log(y);
          g.selectAll(".nodes")
          .data(y, function(j, i){
            //console.log(y);
            //console.log(j);
            dataValues.push([
            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
            ]);
          });

          //console.log("DATA VALUES", dataValues);
          dataValues.push(dataValues[0]);
          //console.log("DATA VALUES", dataValues[time]);
          //console.log("AFTER PUSH DATA VALUES", dataValues);
          g.selectAll(".area")
                 .data([dataValues])
                 .enter()
                 .append("polygon")
                //.attr("id","pol"+c)
                 .attr("class", "polyaux")
                 .style("stroke-width", "2px")
                  //.style("stroke", cfg.color(series))
                 .style("stroke", function(){console.log(countryColor[c]);return countryColor[c]} )
                 .attr("points",function(d) {
                   var str="";
                   for(var pti=0;pti<d.length;pti++){
                     let dx = d[pti][0] + country.indexOf(c)*270;
                     let dy = d[pti][1];
                     str=str+dx+","+dy+" ";
                   }
                   return str;

                  })
                 .style("fill", function(){console.log(countryColor[c]);return countryColor[c]})
                 .style("fill-opacity", cfg.opacityArea)
                 /*.on('mouseover', function (d){
                          z = "polygon."+d3.select(this).attr("class");
                          g.selectAll("polygon")
                           .transition(200)
                           .style("fill-opacity", 0.1); 
                          g.selectAll(z)
                           .transition(200)
                           .style("fill-opacity", .7);
                          })
                 .on('mouseout', function(){
                          g.selectAll("polygon")
                           .transition(200)
                           .style("fill-opacity", cfg.opacityArea);
                 });*/

      series++;
    };
    aux++;

  })
    series=0;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    gamesArray.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      series++;
    });

};
/*
function updateRadarChart(){
  clearRadarChart();
  country.forEach(function(c){
    d3.json(c+".js", function(error, data) {
        if (error) throw error;
        gamesArray= data;
        //console.log("gamesArray", gamesArray);
        RadarChart.draw("#chart", gamesArray, config);
        drawRadarChart();
        //drawData();
    });
  });

}
*/

function clearRadarChart(){

var elements = document.getElementsByClassName("polyaux");
        if(elements!=null)
          for(var i=elements.length-1; i>=0; i--) {
            //console.log(elements);
            elements[i].parentElement.removeChild(elements[i]); //Calls parent and deletes the child!
        }

var elements2 = document.getElementsByClassName("legend");
        if(elements2!=null)
          for(var i=elements2.length-1; i>=0; i--) {
            //console.log(elements);
            elements2[i].parentElement.removeChild(elements2[i]); //Calls parent and deletes the child!
        }

}


/*
var elements = document.getElementById("pol"+c);
        if(elements!=null)
          elements.parentElement.removeChild(elements); //Calls parent and deletes the child!
    

var elements2 = document.getElementsByClassName("poltext"+c);
        if(elements2!=null)
          for(var i=elements2.length-1; i>=0; i--) {
            //console.log(elements);
            elements2[i].parentElement.removeChild(elements2[i]); //Calls parent and deletes the child!
        }

}
*/


/*var svg = d3.select("#vis1")
  .selectAll('svg')
  .append('svg')
  .attr("width", width)
  .attr("height", height);*/