var dataset;
var time = 0;
var time_samples = ["May 2015","June 2015"];
var country = [];

d3.json("oscar_winners.json", function (data) {
    dataset = data;
    
    gen_vis();
})

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
}