var dataset;
var download_dataset;
var time = 0;
var time_samples = ["May 2015","June 2015"];
var country = [];

d3.json("oscar_winners.json", function (data) {
    dataset = data;
    
    gen_vis();
})

function getDownloadData(){
	d3.csv("data/download/"+time+".csv", function (data) {
		console.log(data);
	    download_dataset = data;
	})
}

function gen_vis()
{
	var w = $("#vis1").width();
	var h = $("#vis1").height();

	var svg = d3.select("#vis1")
		.append("svg")
		.attr("width",w)
		.attr("height",h)
		.attr("overflow","hidden");

	svg.selectAll("rect")	
		.data(dataset)	
		.enter()
		.append("rect")	
		.attr("width",10)
		.attr("height",function(d){	return d.rating*10;	})	
		.attr("fill","purple")						
		.attr("x",function(d, i){ return i*11; })
		.attr("y",function(d) {	return h-(d.rating*10); });
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
			if ( $(this).children()[0] != undefined )
			{
				let str = $(this).children()[0].innerHTML;
				if ( str.indexOf(":") > -1 )
					$(this).children()[0].innerHTML=str.substring(0,str.indexOf(":"));
			}
		});

		country.forEach(function(c){
			{
				$("#"+c,svgRoot).addClass("selected");
				data = download_dataset.find(o => o.country === c).value;
				$("#"+c,svgRoot).children()[0].innerHTML += ": "+data+" PB";
			}	
		});
	})
}
 
function startup(){

	getDownloadData();

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

  	worldmap();
}


function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}