var dataset;
var dataset5;
var download_dataset;
var time = 0;
var time_samples = ["April 2015", "July 2015","October 2015","December 2015" ,"February 2016","May 2016", "September 2016", "November 2016", "January 2017","March 2017", "June 2017", "October 2017"];
var country = [];
var countryColor = {"US":"blue", "RU":"white","CN":"yellow","BR":"olive","DE":"black","FR":"teal","GB":"red","CA":"maroon","PL":"purple","PT":"green"};

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
	console.log(time);
	d3.csv("data/download/"+time+".csv", function (data) {
		console.log(data);
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

        if(download_dataset!=null)
    		country.forEach(function(c){
    			$("#"+c,svgRoot).addClass("selected");
    			data = download_dataset.find(o => o.country === c).value;
    			$("#"+c,svgRoot).css("opacity",(data/100)+.5);
    			$("#"+c,svgRoot).children()[0].innerHTML += ": "+data+" PB";
                // New feature -> color border
                let col = countryColor[c];            
                $("#"+c).css("border","2px solid "+col);
                $("#"+c,svgRoot).css("stroke",col);
                $("#"+c,svgRoot).css("stroke-width","2px");
    		});
        else{
            alert("No data file");//Remove alert and Put all countries without colour, so we know that they have no data.
        }
	})
}

function highlightCountry(c){

    if ( country.indexOf(c) == -1 ) // Se o país não estiver selecionado, autoriza a ação
    {
        $(document).ready(function(){
            var a = document.getElementById("worldmap");

            var svgDoc = a.contentDocument; //get the inner DOM of alpha.svg
            var svgRoot  = svgDoc.documentElement;

            let col = countryColor[c];
            $("#"+c).css("border","2px solid "+col);
            $("#"+c,svgRoot).css("stroke",col);
            $("#"+c,svgRoot).css("stroke-width","2.5px");
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
					updateCountryDisplay();
				}
			}
		);
	});

	$( function() {
		$( "#sortable" ).sortable({
			revert: true
		});
  	} );
    
    startupVi5();
  	worldmap();
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
