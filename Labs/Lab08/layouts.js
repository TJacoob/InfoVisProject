function treemap(){

  var width = 800,
      height = 600;
      
  var treemapobj = d3.treemap()
      .size([width, height])
      .padding(1);

  var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
      .map(function(c) { c= d3.rgb(c); c.opacity =0.7; return c; }));

  var format = d3.format(",d");

  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  d3.csv("flare.csv", type, function(error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treemapobj(root);

   d3.select("body")
  .selectAll(".node")
  .data(root.leaves())
  .enter().append("div")
    .attr("class", "node")
    .attr("title", function(d) {return d.id + "\n" + format(d.value);})
    .style("left", function(d) {return d.x0 + "px";})
    .style("top", function(d) {return d.y0 + "px";})
    .style("width", function(d) {return d.x1 - d.x0 + "px";})
    .style("height", function(d) {return d.y1 - d.y0 + "px";})
    .style ("background", function(d){ while (d.depth > 1) d= d.parent; return color(d.id);  })
    .text(function(d) { return d.id.substring(d.id.lastIndexOf(".")+1).split(/(?=[A-Z][^A-Z])/g).join("\n");}) 
  .append("div")
    .attr("class", "node-value")
  .text(function(d) {return format(d.value);}); 

    
  });


  

  function type(d) {
    d.value = +d.value;
    return d;
  }
}

function pack(){
    var width = 800,
      height = 600;
      
  var svg = d3.select("svg"),
      width = width
      height = height

  var format = d3.format(",d");

  
  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var pack = d3.pack()
      .size([width - 2, height - 2])
      .padding(3);

  d3.csv("flare.csv", function(error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    pack(root);


    
  });

  
}