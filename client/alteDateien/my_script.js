//die main funktion, die an den document ready state übergeben wird
var main = function () {
//"use strict";

//--------------------------------------------------------
//------------Globale Variablen--------------------------
//--------------------------------------------------------

//--------------------------------------------------------
//Initialisieren von jquery-Elementen beim Start der Seite
//--------------------------------------------------------

//datepicker beim Datumsfeld im WOD-Neueintrags-Formular
$("#entry_date").datepicker( $.datepicker.regional[ "de" ] );

//heutiges Datum in den Datumsbutton setzen
$("#wod_date_btn").html(getDate());

//WOD-Beschreibung von heute in der Box anzeigen
//getCFMain(getDate()).done(writeWodDesc);
getInstagram().done(writeWodInst);

//---------overlays initialisieren-----------
//overlay zur Auswahl des WOD Typs
dialog_type = $( "#modal_wod_type" ).dialog({
      autoOpen: false,
      height: 400,
      width: 600,
      modal: true,
      title: "Choose your WOD-Type"
    });

//overlay zum Eintragen der WOD Daten
dialog_entry = $( "#modal_wod_entry" ).dialog({
      autoOpen: false,
      height: 600,
      width: 600,
      modal: true,
      title: "Enter your WOD data"
    });

//Dropdown mit Typen von Übungen füllen
$.getJSON('scripts/exercises.json', function(data) {
	console.log(data);
        for( index in data.exercises ) {
            $('#exercise_name').append("<option>" + data.exercises[index].name + "</option>");
        }
});
//--------------------------------------------------------
//-------------Ende der Startfunktionen JQuery------------
//--------------------------------------------------------


//--------------------------------------------------------
//-------------------Eventhandler-------------------------
//--------------------------------------------------------

//-------------------Hautpseite---------------------------
//Button mit Datum, linkt zur CF-Hauptseite mit gewähltem Datum
$( "#wod_date_btn" ).button().on( "click", function() {
	});

//Button "Log new Workout" öffnet das Typ Auswahl overlay
$( "#new_entry_btn" ).button().on( "click", function() {
	dialog_type.dialog( "open" );
});

//------------------Overlays-----------------------------
//-----------------WOD-Typen-----------------------------
//Button "Olympic Lifts" öffnet Eingabemaske für Gewichte
$( "#ol_wod_btn" ).button().on( "click", function() {
	dialog_type.dialog( "close");

	//unerwünschte Elemente verstecken
	$("#ladder_s").hide("fast");
	$("#distance_s").hide("fast");
	$("#cal_s").hide("fast");
	$("#reps_s").hide("fast");
	$("#ex_time_s").hide("fast");
	$("#rnd_time_s").hide("fast");
	$("#total_time_s").hide("fast");
	$("#total_reps_s").hide("fast");
	$("#total_rounds_s").hide("fast");

	dialog_entry.dialog( "open" );
});

//Button "Generic" öffnet generische Eingabemaske
$( "#generic_wod_btn" ).button().on( "click", function() {
	dialog_type.dialog( "close");
	dialog_entry.dialog( "open" );
});

//---------------Eingabemaske----------------------------
//Button "+Exercise" erzeugt ein weiteres Exercise div
$( "#add_exercise_btn" ).button().on( "click", function() {
	var $new_exercise = $("#exercise").clone();
	$(this).parent().before($new_exercise);
});

//Button "-Exercise" löscht das Exercise div
$( "#remove_exercise_btn" ).button().on( "click", function() {
	$(this).parent().detach();
});


//Button "Add Round" erzeugt ein weiteres Round div
$( "#add_round_btn" ).button().on( "click", function() {
	var $new_round = $("#round").clone();
	$("#round_end").before($new_round);
});

$( "#save_entry_btn" ).button().on( "click", function() {
	var eintrag = {};
	$('.wod_entry *').filter(':input').not(".button").filter(":visible").each(function(){
		var attribut = this.name;
		eintrag[attribut] = this.value;
	});

	dialog_entry.dialog( "close" );
});

//--------------------------------------------------------
//-----------------Ende Eventhandler----------------------
//--------------------------------------------------------

};//ende der main funktion

//jQuery Funktion, die aufgerufen wird, wenn das Dokument startklar ist
$(document).ready(main);

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------hier fangen die Funktionsdefinitionen an---------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//holt die WOD-Beschreibung von der crossfit mainsite nach Datum
function getCFMain (datum) {
	var CFurl = "https://www.crossfit.com/workout/" + datum;

	return $.ajax({
        url: CFurl,
        type: 'get',
        dataType: 'html'
        });
}

//holt die WOD-Beschreibung von Instagram
function getInstagram () {
	var INurl = "https://www.instagram.com/p/BNs3AcuAQQV";

	return $.ajax({
        url: INurl,
        type: 'get',
        dataType: 'html'
        });
}


//schreibt die WOD-Beschreibung in die Box
function writeWodDesc(data) {
    var beschreibung = $("<p>").html(data).find(".content");
   	$("#wod_desc").append(beschreibung);
}

//schreibt Instagram in die Box
function writeWodInst(data) {
    var beschreibung = $("<p>").html(data).find(".1399735507600081941").text();
    console.log(beschreibung);
   	$("#wod_description").append(beschreibung);
}


//gibt ein formatiertes Datum aus
//ohne Parameter wird das heutige Datum ausgegeben
function getDate (year, month, day) {
	if (!year) {
		var d = new Date();
		}
	else {
		var d = new Date(year, month, day);
		}

	var yearC = d.getFullYear();
	var monthC = d.getMonth()+1;
	var dayC = d.getDate();

	var output = d.getFullYear() + '/' +
		(monthC<10 ? '0' : '') + monthC + '/' +
		(dayC<10 ? '0' : '') + dayC;

	return output;
}
/*testsnippets

*/
