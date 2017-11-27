var dataset;
var dataset5;
var time = 0;
var time_samples = [];
var country = [];

//scatterPlot variables
var actionArray = {};
var indieArray = {};
var rpgArray = {};
var strategyArray = {};
var vis5h;
var vis5w; 


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


function scatterPlot2 (tag) {
    
    
    var svg = d3.select("#vis5")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
		
    
    var padding = w / 20;
    var bar_w = h / 20;
    var r = 2;

    var hscale = d3.scaleLinear()
                         .domain([16,0])
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
            });
            
       //.on("mouseover", function(d){
       //   console.log(d);});
}


function toggleCountry(code)
{
	let index = country.indexOf(code) ;
	if ( index > -1 ) // Se o país estiver selecionado, remove-o da lista
	{
		country.splice(index, 1);
	}
	else
	{
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
}
 
function startup(){

	$( function() {
		$( "#slider" ).slider(
			{
				min:0,
				max:10,
				change: function( event, ui )
				{
					time = $( "#slider" ).slider("value");
					//$( "#currentTime" ).text(time_samples[time]);
					$( "#currentTime" ).text(time);
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
}

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
    var r = 3;

    var hscale = d3.scaleLinear()
                         .domain([16,0])
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
	.call(yaxis);


    gX = svg.append("g")
   	.attr("transform","translate(0," + (h-padding) + ")")
	.call(xaxis);
}

function dropdown5Select(tag){
    
    switch(tag){
        case 0:    
            dataset = actionArray;
            color = "red";
        break;
        case 1:
            dataset = indieArray;
            color = "blue";
        break;
        case 2:
            dataset = rpgArray;
            color = "orange";
        break;
        case 3:
            dataset = strategyArray;
            color = "green";
        break;
        default:
            alert("peres");
        break;
    }
    
    clearDots(tag);    
    scatterPlot2(tag);
            
}

function clearDots(tag){
    console.log(tag)
    for(var z=0; z<4;z++){
        if(z!=tag){
            var elements = document.getElementsByClassName(z);
            if(elements!=null)
            for(var i=0; i<elements.length; i++) {
                elements[i].setAttribute('fill','none');
            }
        }
    }    
    
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
    scatterPlot2();
    gen_scatterplot();
})
*/