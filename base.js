var dataset;
var dataset5;
var download_dataset;
var time = 0;
var time_samples = ["April 2015", "July 2015","October 2015","December 2015" ,"February 2016","May 2016", "September 2016", "November 2016", "January 2017","March 2017", "June 2017", "October 2017"];
var country = [];

//scatterPlot variables
var actionArray = {};
var indieArray = {};
var rpgArray = {};
var strategyArray = {};
var currentTag;


//ScatterPlot Files
d3.json("Data/Game Tag Data/GameTagDate.json", function (data) {
    //var json = JSON.parse('data');
    var json = data;
    var keys = Object.keys(json);
   
    for(var i=0;i<keys.length;i++){
        var key = keys[i];
        var key2 = Object.keys(json[key]);
        for (var j=0;j<key2.length;j++)
            time_samples.push(JSON.stringify(json[key][key2]));
    }	
})

function getDownloadData(){
	console.log(time);
	d3.csv("data/download/"+time+".csv", function (data) {
		console.log(data);
	    download_dataset = data;
	})
}

d3.json("Data/Game Tag Data/actionCoordinates.json", function (data) {
    actionArray = data;
})

d3.json("Data/Game Tag Data/indieCoordinates.json", function (data) {
    indieArray = data;  
})

d3.json("Data/Game Tag Data/rpgCoordinates.json", function (data) {
    rpgArray = data;   
})

d3.json("Data/Game Tag Data/strategyCoordinates.json", function (data) {
    strategyArray = data;
})

//Main Functions
function toggleCountry(code)
{
	let index = country.indexOf(code) ;
	if ( index > -1 ) // Se o país estiver selecionado, remove-o da lista
	{
		country.splice(index, 1);
	}
	else
	{
        if ( country.length >= 4)   // se já estiverem selecionados 4 países
            alert("You can have a max of 4 countries selected\nSó podem estar selecionados 4 países");
        else
		  country.push(code);
	}
	updateCountryDisplay();
}

function updateCountryDisplay() // Corre todas as bandeiras, remove a classe que lhes dá cor, volta a dar se tiver selecionado
{
	$(".countryFlag").each(function(){
		$(this).removeClass("activeCountry");
		if( country.indexOf($(this).attr('id')) > -1 )
		{
			$(this).addClass("activeCountry");
		}
	})
	worldmap();
}

function worldmap()
{
	$(document).ready(function(){
		var a = document.getElementById("worldmap");

		var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
		var svgRoot  = svgDoc.documentElement;

		$(".land",svgRoot).each(function(){
			// Must be refactored because this causes extra load and is confuse af
			$(this).removeClass("selected");
			$(this).css("opacity","1");
			if ( $(this).children()[0] != undefined )
			{
				let str = $(this).children()[0].innerHTML;
				if ( str.indexOf(":") > -1 )
					$(this).children()[0].innerHTML=str.substring(0,str.indexOf(":"));
			}
		});

		country.forEach(function(c){
			$("#"+c,svgRoot).addClass("selected");
			data = download_dataset.find(o => o.country === c).value;
			$("#"+c,svgRoot).css("opacity",(data/100)+.5);
			$("#"+c,svgRoot).children()[0].innerHTML += ": "+data+" PB";
		});
	})
}

function highlightCountry(c){
	$(document).ready(function(){
		var a = document.getElementById("worldmap");

		var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
		var svgRoot  = svgDoc.documentElement;

		$("#"+c,svgRoot).css("stroke","#3f3f3f");
		$("#"+c,svgRoot).css("stroke-width","1.5px");
	})	
}

function unlightCountry(c){
	$(document).ready(function(){
		var a = document.getElementById("worldmap");

		var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
		var svgRoot  = svgDoc.documentElement;

		$("#"+c,svgRoot).css("stroke","white");
		$("#"+c,svgRoot).css("stroke-width","0.5");
	})	
}
 
function startup(){

	getDownloadData();
    $( "#currentTime" ).text(time_samples[time]);

	$( function() {
		$( "#slider" ).slider(
			{
				min:0,
				max:9,
				change: function( event, ui )
				{
					time = $( "#slider" ).slider("value");
					//$( "#currentTime" ).text(time_samples[time]);
					$( "#currentTime" ).text(time_samples[time]);
                    changeCircleColor(currentTag);
					getDownloadData();
					updateCountryDisplay();
				}
			}
		);
	});

	$( function() {
		$( "#sortable" ).sortable({
			revert: true
		});
		//$( ".dataBox" ).draggable({ containment: "parent" });
		//$( ".dataBox" ).draggable({ containment: "#sortable", scroll: false });
		//$( "ul, li" ).disableSelection();
  	} );
    
    axisCreator();

  	worldmap();
}

//ScatterPlot - VIS5 Function
function axisCreator(){

    dataset = strategyArray;
    w = $("#vis5").width();
	h = $("#vis5").height();

    var svg = d3.select("#vis5")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
		
    var padding = 30;
    var bar_w = 20;
    var r = 2;

    var hscale = d3.scaleLinear()
                         .domain([14,0])
                         .range([padding,h-padding]);
			 
    var xscale = d3.scaleLinear()
                       .domain([0,9000])
                       .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
                  .scale(hscale);                  

    var xaxis = d3.axisBottom()
                .scale(xscale)
                .ticks(dataset.length/2);
              
    var cscale = d3.scaleLinear()
        .domain([d3.min(11, function(d) { return d[d.length-1];}),
         d3.max(11, function(d) { return d[d.length-1];})])
        .range(["red", "yellow"]);
              
    gY = svg.append("g")
   	.attr("transform","translate(30,0)")  
	.attr("class","y axis")
	.call(yaxis)
    .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("y", 0)
     .attr("dy", ".75em")
     .attr("id","yID")
     .text(function(d) {
        return "Average Price (€)";
      })
      .style("stroke","black")
      .attr("dy", "1em");



    gX = svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
	.call(xaxis)
    .append("text")
     .attr("class", "label")
     .attr("x", w-padding)
     .attr("y", 0)
     .text(function(d) {
        return "# of Games";
      })
      .style("stroke","black")
      .attr("dy", "1em");

}

function dropdown5Select(tag){
    console.log("Time = "+time);
    var name ="";
    switch(tag){
        case 0:  
            name = "Action";
            dataset = actionArray;
            color = "red";
        break;
        case 1:
            name = "Indie";
            dataset = indieArray;
            color = "blue";
        break;
        case 2:
            name = "RPG";
            dataset = rpgArray;
            color = "orange";
        break;
        case 3:
            name = "Strategy";
            dataset = strategyArray;
            color = "green";
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
    currentTag = tag;
    clearDots(tag);    
    scatterPlot(tag);
            
}

function clearDots(tag){
    console.log("Tag = "+tag);
    for(var z=0; z<4;z++){
        if(z!=tag){
            var elements = document.getElementsByClassName(z);
            if(elements!=null)
            for(var i=0; i<elements.length; i++) {
                elements[i].parentElement.remove(elements[i]); //Calls parent and deletes the child!
            }
        }
    }       
}

function scatterPlot (tag) {    

    var svg = d3.select("#vis5")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
    
    var padding = w / 20;
    var bar_w = h / 20;
    var r = 2;

    var hscale = d3.scaleLinear()
                         .domain([14,0])
                         .range([padding,h-padding]);
             
    var xscale = d3.scaleLinear()
                       .domain([0,9000])
                       .range([padding,w-padding]);
    
   svg.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("r",r)
        .attr("fill",color)
        .attr("class", tag)
        .attr("cx",function(d, i) {
            return  xscale(d.cx);
          })
        .attr("cy",function(d) {
               return hscale(d.cy);
            })
        .on("mouseover", function(d){
            // Put tooltip in the right position, change the text and make it visible
            tooltip = document.getElementById("tooltipv5");
            tooltip.setAttribute("x",xscale(d.cx));
            tooltip.setAttribute("y",hscale(d.cy));
            $(document).ready(function(){
                $("#tooltipv5").text("Avg price: "+d.cy+"\nNumber Games = "+d.cx);
            });
            tooltip.setAttribute("visibility","visible");
            //scatterMouseOver(d);
        })
        .on("mouseout", function(d){
            tooltip = document.getElementById("tooltipv5");
            tooltip.setAttribute("visibility","hidden");
        });
    
    changeCircleColor(tag);
       //
}

function changeCircleColor(tag){
    console.log("colour = "+color);
    console.log("Tag = "+tag);
    var elements = document.getElementsByClassName(tag);
    if(elements!=null) //always true Except for an error
        for(var i=0; i<elements.length; i++) {
            if(i==time)
                elements[i].setAttribute("fill","black");
            else
                elements[i].setAttribute("fill",color);
        }
}

function scatterMouseOver(object){
    
    var avgPrice = object.cy;
    var totNumber = object.cx;
    var month = time_samples[object.time];
    console.log("all good: "+object);
    
}

function HideTooltip(evt){
    ttooltip.setAttribute("visibility","hidden");
}


/*
d3.json("Data/Game Tag Data/GameTagCombined.json", function (data) {
  
    var json = data;
    
    var isXAxis = 1;
    var action = {};
    var indie = {};
    var rpg = {};
    var strategy = {};
    for(var i=0;i<json.length;i++){
        //Resets the Object

    
        //var key2 = Object.keys(json);
        for (var j in json[i]){
            switch(j){
                case "Tag":
                    if((json[i])[j] === "Games with tag"){
                        isXAxis= 1;
                    }
                    else
                        isXAxis= 0;
                    break;
                case "Action": 
                    if(isXAxis){
                        var cx =""+ json[i][j];
                        cx = cx.replace('"',''); //"192" -> 192"
                        cx = cx.replace('"',''); // 192" -> 192                        
                        action['cx'] = Number(cx);
                    }
                    else{
                        var cy = ""+ json[i][j];
                        cy = cy.replace('"',''); //"192$" -> 192$"
                        cy = cy.replace('"',''); // 192$" -> 192$
                        cy = cy.replace('$',''); // 192$  -> 192
                        action['cy'] = Number(cy);
                        var tmp = parseInt(i / 2) ;
                        action['time'] = tmp;
                        actionArray[tmp] = action;
                        }
                    break;
                case "Indie": 
                    if(isXAxis){
                        var cx = ""+json[i][j];
                        cx = cx.replace('"',''); //"192" -> 192"
                        cx = cx.replace('"',''); // 192" -> 192
                        indie['cx'] = Number(cx);
                    }
                    else{
                        var cy =""+ json[i][j];
                        cy = cy.replace('"',''); //"192$" -> 192$"
                        cy = cy.replace('"',''); // 192$" -> 192$
                        cy = cy.replace('$',''); // 192$  -> 192
                        indie['cy'] = Number(cy);
                        var tmp = parseInt(i / 2);
                        indieArray[tmp] = indie;
                    }
                    break;
                case "RPG":
                    if(isXAxis){
                        var cx = ""+json[i][j];
                        cx = cx.replace('"',''); //"192" -> 192"
                        cx = cx.replace('"',''); // 192" -> 192
                        rpg['cx'] = Number(cx);
                    }
                    else{
                        var cy = ""+json[i][j];
                        cy = cy.replace('"',''); //"192$" -> 192$"
                        cy = cy.replace('"',''); // 192$" -> 192$
                        cy = cy.replace('$',''); // 192$  -> 192
                        rpg['cy'] = Number(cy);
                        var tmp = parseInt(i / 2);
                        rpgArray[tmp] = rpg;
                    }
                    break;
                    
                case "Strategy":
                    if(isXAxis){
                        var cx = ""+json[i][j];
                        cx = cx.replace('"',''); //"192" -> 192"
                        cx = cx.replace('"',''); // 192" -> 192
                        strategy['cx'] = Number(cx);
                    }
                    else{
                        var cy = ""+json[i][j];
                        cy = cy.replace('"',''); //"192$" -> 192$"
                        cy = cy.replace('"',''); // 192$" -> 192$
                        cy = cy.replace('$',''); // 192$  -> 192
                        strategy['cy'] = Number(cy);
                        var tmp = parseInt(i / 2);
                        strategyArray[tmp] = strategy;
                    }
                    break;
                default:
                    break;
            }
            //
        }
        if(!isXAxis){
            action = {};
            indie = {};
            rpg = {};
            strategy = {};
        }
            
        
    }
    console.log(actionArray);
    //NEste ponto temos 4 arrays organizados por cada tag e por data
    scatterPlot();
    gen_scatterplot();
})
*/
