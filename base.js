var dataset;
var dataset5;
var download_dataset;
var time = 0;
var time_samples = ["April 2015", "July 2015","October 2015","December 2015" ,"February 2016","May 2016", "September 2016", "November 2016", "January 2017","March 2017", "June 2017", "October 2017"];
var country = [];
var countryColor = {"US":"", "RU":"","CN":"","BR":"","DE":"","FR":"","GB":"","CA":"","PL":"","PT":""};
var countryName = {"US":"United States Of America", "RU":"Russia","CN":"China","BR":"Brazil","DE":"Germany","FR":"França","GB":"United Kingdom","CA":"Canada","PL":"Poland","PT":"Portugal"};
var colors= ["#9E1457","#FF422E","#2EFF2E","#FFFF41"];
//var colors= ["#006915","#6A4FCE","#DD3C12","#E15403"];

//scatterPlot variables
var actionArray = {};
var indieArray = {};
var rpgArray = {};
var strategyArray = {};
var currentTag;
var colorv5 ;

//zoom variables
var xaxis;
var yaxis;
var xscale;
var hscale;
var view;
var svg;
var svg2;
var margin = { top: 20, right: 20, bottom: 30, left: 30 };
var brush;
var scatter;

//ScatterPlot Files

function getDownloadData(){
	d3.csv("data/download/"+time+".csv", function (data) {
	    download_dataset = data;
	})
}



//Main Functions
function toggleCountry(code)
{
	let index = country.indexOf(code) ;
	if ( index > -1 ) // Se o país estiver selecionado, remove-o da lista
	{
		country.splice(index, 1);
        unassignColor(code);
        $("#"+code).parent().parent().css("background-color","#1c1c1c");
        //console.log($("#"+code));
        $("#"+code).css("box-shadow","2px 2px 2px 0px rgba(28,28,28,0)");
	}
	else
	{
        if ( country.length >= 4)   // se já estiverem selecionados 4 países
            alert("You can have a max of 4 countries selected\nSó podem estar selecionados 4 países");
        else
        {
		    country.push(code);
            assignColor(code);
            $("#"+code).parent().parent().css("background-color",countryColor[code]);
            $("#"+code).css("box-shadow","2px 2px 2px 0px rgba(28,28,28,1)");
        }

	}
	updateCountryDisplay();
    updateGameList();
    updateRadarChart();
    //vis2Axis();
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

        if(download_dataset!=null)
    		country.forEach(function(c){
    			$("#"+c,svgRoot).addClass("selected");
    			data = download_dataset.find(o => o.country === c).value;
    			$("#"+c,svgRoot).css("opacity",(data/50)+.5);
    			$("#"+c,svgRoot).children()[0].innerHTML += ": "+data+" PB";
                // New feature -> color border
                let col = countryColor[c];
                //$("#"+c).css("border","2px solid "+col);
                //$("#"+c).css("box-shadow","2px 2px 2px 0px rgba(28,28,28,1)");
                $("#"+c,svgRoot).css("stroke",col);
                $("#"+c,svgRoot).css("stroke-width","2px");
    		});
        else{
            console.log("No data file");//Remove alert and Put all countries without colour, so we know that they have no data.
        }
	})
}

function highlightCountry(c){

    if ( country.indexOf(c) == -1 ) // Se o país não estiver selecionado, troca o fundo
    {
        $(document).ready(function(){
            var a = document.getElementById("worldmap");

            var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
            var svgRoot  = svgDoc.documentElement;

            let col = countryColor[c];
            //$("#"+c).css("border","2px solid "+col);
            //$("#"+c).parent().parent().css("background-color","#1c1c1c");
            //$("#"+c).css("box-shadow","2px 2px 2px 0px rgba(28,28,28,0)");
            //$("#"+c,svgRoot).css("stroke",col);
            //$("#"+c,svgRoot).css("stroke-width","3px");
            $("#"+c,svgRoot).css("fill","#212121");
        })  
    }
    else // Se o país estiver selecionado, aumenta as borders
    {
        $(document).ready(function(){
            var a = document.getElementById("worldmap");

            var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
            var svgRoot  = svgDoc.documentElement;

            $("#"+c,svgRoot).css("stroke-width","4px");
        })  
    }
	
}

function unlightCountry(c){

    if ( country.indexOf(c) == -1 ) // Se o país não estiver selecionado, autoriza a ação
    {
        $(document).ready(function(){
    		var a = document.getElementById("worldmap");

    		var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
    		var svgRoot  = svgDoc.documentElement;

            $("#"+c).css("border","0px solid white");
    		$("#"+c,svgRoot).css("stroke","white");
    		$("#"+c,svgRoot).css("stroke-width","0.5");
            $("#"+c,svgRoot).css("fill","#686868");
    	})
    }
    else // Se o país estiver selecionado, aumenta as borders
    {
        $(document).ready(function(){
            var a = document.getElementById("worldmap");

            var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
            var svgRoot  = svgDoc.documentElement;

            let col = countryColor[c];
            $("#"+c,svgRoot).css("stroke",col);
            $("#"+c,svgRoot).css("stroke-width","3px");
        })  
    }
}

function startup(){

	getDownloadData();
    $( "#currentTime" ).text(time_samples[time]);

	$( function() {
		$( "#slider" ).slider(
			{
				min:0,
				max:11,
				change: function( event, ui )
				{
					time = $( "#slider" ).slider("value");
					//$( "#currentTime" ).text(time_samples[time]);
					$( "#currentTime" ).text(time_samples[time]);
                    changeCircleColor(currentTag);
					getDownloadData();
                    updateRadarChart();
					updateCountryDisplay();
                    updateGameList();
				}
			}
		);
	});

	$( function() {
		$( "#sortable" ).sortable({
			revert: true
		});
  	} );
    
    updateRadarChart();
    startupVi5();
  	worldmap();

    drawBarchart();

    vis2Axis();

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

var activeGames = [];
var games = [];
var countryData = [];
var gameBeat = [];
var barData = [];

d3.csv("data/howlong/games.csv", function (data) {
    gameBeat = data ;
});

$(document).on('click', '.dropdown-menu.dropdown-menu-form', function(e) {
  e.stopPropagation();
});

function updateGameList(){
    countryData = [];
    if (country.length == 0 )
        listGames();
    country.forEach(function(c){
        d3.csv("data/country/"+c+"/"+time+".csv", function (data) {
            countryData.push(data) ;
            listGames();
            updateBarData();
            drawBarchart();
            vis2Axis();
        });
    });
}

function listGames(){

    $("#gamesList").empty();
    games = [];
    countryData.forEach(function(d){
        d.forEach(function(g){
            if (games.indexOf(g.Game) == -1 )
                games.push(g.Game);
        })
    });

    activeGames.forEach(function(g){
        if ( games.indexOf(g) == -1)
            //console.log(g+" não tá na lista");
            games.unshift(g);
    });
    
    games.forEach(function(g){
        $("#gamesList").append('<li class="px-3"><label class="checkbox px-1 m-0"><input class="mr-1" name="gameRadio" id="'+g+'" type="checkbox">'+g+'</label></li>');
    });


    $("input[name=gameRadio]").click(function(){
        if ( activeGames.indexOf(this.id) != -1)
            activeGames.splice(activeGames.indexOf(this.id), 1);
        else
            if ( activeGames.length >= 4)   // se já estiverem selecionados 4 países
            {
                //console.log(this.id);
                $('[id="'+this.id+'"]').prop('checked', false);
                alert("You can have a max of 4 games selected\nSó podem estar selecionados 4 jogos em simultaneo");
            }
            else
                activeGames.push(this.id);
        updateBarData();
        drawBarchart();
    });

    activeGames.forEach(function(g){
        if ( games.indexOf(g) != -1 )
            $('[id="'+g+'"]').prop('checked', true);
        else
            console.log(g+" is not in this list")
    });

    //console.log(countryData);
}


function resetGames(){
    //console.log("here");
    activeGames = [];
    listGames();
    updateBarData();
    drawBarchart();
}

function updateBarData(){

    //console.log(countryData);

    barData = [];
    activeGames.forEach(function(g){
        var ag = {"game":g,"howlong":gameBeat.find(o => o.game === g).hours};
        country.forEach(function(c){
            var gc = countryData[country.indexOf(c)].find(o => o.Game === g);
            if (gc == undefined)
                ag[c] = "0";    
            else
                ag[c] = gc["Hours (2 weeks)"];
            //console.log(ag);
        })
        barData.push(ag);
    });
    
    //console.log(barData);

}

function drawBarchart() {

    clearBarchart();
    // Draw Barchart itself

    // Axis

    w = $("#vis3").width();
    h = $("#vis3").height();

    var svg = d3.select("#vis3")
                .append("svg")
                .attr("width",w)
                .attr("height",h)

    var padding = 30;
    var bar_w = 20;
    var r = 2;

    var height = h - padding;    
    var width = w + padding;

    // Increase to prevent bar going beyond limit
    var hscale = d3.scaleLinear()
        .domain([95,0])
        .range([padding,h-padding]);
    
    var xscale = d3.scaleLinear()
        .domain([0,0])
        .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
        .scale(hscale);                  

    var xaxis = d3.axisBottom()
        .scale(xscale);
        //.ticks(dataset.length/2);
      
    /*        
    var cscale = d3.scaleLinear()
        .domain([d3.min(11, function(d) { return d[d.length-1];}),
            d3.max(11, function(d) { return d[d.length-1];})])
        .range(["red", "yellow"]);
    */
              
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
            return "Hours";
        })
        .style("fill","black")
        .attr("dy", "1em");

    gX = svg.append("g")
        .attr("transform","translate(0," + (h-padding) + ")")
        .call(xaxis)

    // Data
    var divs = svg.selectAll('rect').data(barData).enter();

    divs.append("g")
        .append("rect")
            .attr("class","bar")
            .attr("width",20)
            .attr("height",function(d){
                return d.howlong *2;
            })  
            .attr("fill","#5DB0B8")
            .attr("x",function(d, i)  {
                return (i*(63+((country.length+1)*21)))+42 + padding;
            })
            .attr("y",function(d) { return height-(d.howlong*2); })
        .append("title")
            .text(function(d, i) 
            {
                return "How long to beat: " +d.howlong + " hours";
            });
        
        

    divs.append("text")
        .attr("x",function(d, i)  {
            return (i*(63+((country.length+1)*21)))+42 + padding;
        })
        .attr("y",function(d) { return height + padding/1.5 ; })
        .attr("class","legenda")
        .text(function(d) { return d.game; });

    country.forEach(function(c){
        divs.append("rect")
                .attr("class","bar")
                .attr("width",20)
                .attr("height",function(d){
                    var h = d[c];
                    return (h.substring(0,h.indexOf(":"))*2);
                })  
                .attr("fill",countryColor[c])
                .attr("x",function(d, i) { 
                    return (i*(63+((country.length+1)*21)))+(21 *(country.indexOf(c)+1))+42 + padding;
                })
                .attr("y",function(d) {
                    var h = d[c];
                    return height-(h.substring(0,h.indexOf(":"))*2);
                })
            .append("title")
                .text(function(d) 
                {
                    var h = d[c];
                    return countryName[c] + ": " + (h.substring(0,h.indexOf(":"))) + " hours";
                });
    });
}

function clearBarchart()
{
    $( "#vis3" ).empty();
}

// Color System

function assignColor(country)
{
    let c = colors.pop();
    countryColor[country]=c;
}

function unassignColor(country)
{
    let c = countryColor[country];
    colors.push(c);
    countryColor[country]="";
}

// Vis 2

function vis2Axis()
{

    console.log("vis2Axis");
    //clearBarchart();
    $( "#vis2" ).empty();
    // Draw Barchart itself

    // Axis
    w = $("#vis2").width();
    h = $("#vis2").height();

    var svg = d3.select("#vis2")
                .append("svg")
                .attr("width",w)
                .attr("height",h)

    var padding = 30;
    var bar_w = 20;
    var r = 2;

    var height = h - padding;    
    var width = w + padding;

    var hscale = d3.scaleLinear()
        .domain([95,0])
        .range([padding,h-padding]);
    
    var xscale = d3.scaleLinear()
        .domain([0,0])
        .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
        .scale(hscale);                  

    var xaxis = d3.axisBottom()
        .scale(xscale);
        //.ticks(dataset.length/2);
      
    /*        
    var cscale = d3.scaleLinear()
        .domain([d3.min(11, function(d) { return d[d.length-1];}),
            d3.max(11, function(d) { return d[d.length-1];})])
        .range(["red", "yellow"]);
    */
              
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
            return "Hours";
        })
        .style("fill","black")
        .attr("dy", "1em");

    gX = svg.append("g")
        .attr("transform","translate(0," + (h-padding) + ")")
        .call(xaxis)


    // Data
    //console.log(countryData);
    var vis3Data = [];
    //object format: {"pt","countr strike","50"}

    for (var e = 0; e < countryData.length; e++) {
        c = countryData[e];
        
        let selected = country[e];
        vis3Data.push({"country":selected,"game":"-","hours":"0"});
        for (var i = 0; i < 5; i++)
        {
            let g = {};
            //console.log(c[i]);
            g["country"]=selected;
            g["game"]=c[i]["Game"];
            let h = c[i]["Hours (2 weeks)"].substring(0,c[i]["Hours (2 weeks)"].indexOf(":"));
            g["hours"]= h ;
            vis3Data.push(g);
        }
    };

    console.log(vis3Data);
    var divs = svg.selectAll('rect').data(vis3Data).enter();    

    divs.append("g")
        .append("rect")
            .attr("class","bar")
            .attr("width",20)
            .attr("height",function(d){
                return d.hours * 2;
            })  
            .attr("fill", function(d){ return countryColor[d.country] })
            .attr("x",function(d, i)  {
                return i*21 + padding;
            })
            .attr("y",function(d){
                return height - (d.hours*2);
            })
        .append("title")
            .text(function(d, i) 
            {
                return d.game + " : "+ d.hours + " hours";
            });
        
    divs.append("text")
        .attr("x",function(d, i)  {
            if ( d.game == "-")
                return (i*21) +21 + padding;
        })
        .attr("y",function(d) {
            if ( d.game == "-")
                return height + padding/1.5 ;
        })
        .attr("class","legenda")
        .text(function(d) {
            if ( d.game == "-")
                return countryName[d.country];
        });


}