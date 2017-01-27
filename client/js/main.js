//die main funktion, die an den document ready state übergeben wird
var main = function () {

//--------------------------------------------------------
//------------Globale Variablen--------------------------
//--------------------------------------------------------
var days = 0;

//------------Globale Objekte--------------------------
var $exerciseFieldset = '<fieldset id="exercise_fs" class="exercise_fs"><legend>E</legend><button id="remove_exercise_btn" class="remove_exercise_btn" class="button" type="button">-E</button></fieldset>'
var dialogPresets = {
  autoOpen: false,
  height: 850,
  width: 680,
  modal: true,
  position: { my: "center", at: "top" },
};

//--------------------------------------------------------
//Initialisieren von jquery-Elementen beim Start der Seite
//--------------------------------------------------------
//heutiges Datum in den Datumsbutton setzen
//WOD-Beschreibung von heute in der Box anzeigen
changeWODDate(days);

getEntryList();

setDateInputs();

//---------overlays initialisieren-----------
//overlay zur Auswahl des WOD Typs
dialog_type = $( "#modal_wod_type" ).dialog(dialogPresets);
dialog_type.dialog({title: "Choose your WOD-Type"});

//overlay zum Eintragen der WOD Daten
dialog_entry = $( "#modal_wod_entry" ).dialog(dialogPresets);
dialog_entry.dialog({title: "Enter your WOD data"});

//overlay zur Übungsauswahl
dialog_exercise = $("#exerciseChoice").dialog(dialogPresets);
dialog_exercise.dialog({title: "Choose an exercise"});

dialog_add_exercise = $("#newExerciseEntry").dialog(dialogPresets);
dialog_add_exercise.dialog({title: "Add a new exercise"});

//--------------------------------------------------------
//-------------Ende der Startfunktionen JQuery------------
//--------------------------------------------------------


//--------------------------------------------------------
//-------------------Eventhandler-------------------------
//--------------------------------------------------------

//-------------------Hautpseite---------------------------
//Button Datum zurück mit WOD-Beschreibung
$( "#wod_date_back_btn" ).button().on( "click", function() {
  days = days - 1;
  changeWODDate(days);
});

//Button Datum vor mit WOD-Beschreibung
$( "#wod_date_forv_btn" ).button().on( "click", function() {
  days = days + 1;
  if (days > 0) {
   days = 0;
 }
 changeWODDate(days);
});

//Button Datum mit WOD-Beschreibung
$( "#wod_date_btn" ).button().on( "click", function() {
  days = 0;
  changeWODDate(days);
});

//Button "Log new Workout" öffnet das Typ Auswahl overlay
$( "#new_entry_btn" ).button().on( "click", function() {
	dialog_type.dialog( "open" );
});

//Button "create new exercise"
$(document).on('click', '#create_exercise_btn', function() {
	dialog_add_exercise.dialog("open");
  // $(".exerciselist").remove();
	// getExerciseList();
});

$(document).on('click', '#save_exercise_btn', function() {
var name = $("#exerciseName").val(),
  type = $("#exerciseTypeDD").val(),
  newExercise = {name, type};

	$.post("exercises", newExercise, function (result) {
  });
  // $(".exerciselist").remove();
  // getExerciseList();
});

//------------------Overlays-----------------------------
//-----------------WOD-Typen-----------------------------
//WOD-Typ-Buttons öffnen generische Eingabemaske
$( ".wod_type_button" ).button().on( "click", function() {
	dialog_type.dialog( "close");
	dialog_entry.dialog( "open" );
});

//-----------------WOD-Eintrag---------------------------
//Entfernungseinheit kann von m auf km geändert werden
$("#dist_einheit").button().on( "click", function() {
  if ($("#dist_einheit").text() == "m") {
    $("#dist_einheit").text("km");
  }
  else {
    $("#dist_einheit").text("m");
  }
});

//neue Übung hinzufügen
$(document).on('click', '#add_exercise_btn', function() {
  $(".exerciselist").remove();
  dialog_exercise.dialog("open");
  getExerciseList();
});

//Übung auswählen
$(document).on("click", ".exerciselist", function() {
  var $fs = $exerciseFieldset,
  $weightInput = '<input type="number" id="ex_weight" name="ex_weight" value="0" min="0" max="99">kg',
  $repsInput = '<input type="number" id="ex_reps" name="ex_reps" value="0" min="0" max="999">reps',
  $distanceInput = '<input type="number" id="ex_distance" name="ex_distance" value="0" min="0" max="999"><label id="unit_distance" name="unit_distance">m',
  $caloriesInput = '<input type="number" id="ex_cal" name="ex_cal" value="0" min="0" max="999">cal',
  $exerciseTimeInput = '<input type="time" id="ex_time" name="ex_time" step="1" min="00:00:00" max="00:59:59" value="00:00:00">';

  //Fieldset exercise mit titel einfügen
  $("#exercises_grp").children().last().css({"float":"left", "margin-left":"5px"});
  $("#exercises_grp").append($fs);
  $("#exercises_grp").children().last().children().first().text($(this).text());

//je nach Übungstyp felder setzen
  if($(this).hasClass("lift")){
    $("#exercises_grp").children().last().children().last().before($weightInput);
    $("#exercises_grp").children().last().children().last().before($repsInput);
  }
  else if ($(this).hasClass("bodyweight")) {
    $("#exercises_grp").children().last().children().last().before($repsInput);
    $("#exercises_grp").children().last().children().last().before($exerciseTimeInput);
  }
  else if ($(this).hasClass("endurance")) {
    $("#exercises_grp").children().last().children().last().before($distanceInput);
    $("#exercises_grp").children().last().children().last().before($caloriesInput);
    $("#exercises_grp").children().last().children().last().before($exerciseTimeInput);
  }

  //Übungsliste schließen
  dialog_exercise.dialog("close");

});

//Übung löschen
$(document).on('click', '#remove_exercise_btn', function() {
  $(this).parent().remove();
});

//Daten aus dem Fenster sammeln
$(document).on('click', '#save_entry_btn', function() {

  var wod_date = $("#entry_date").val(),
  entry_time = timeToNumber($("#entry_time").val()),
  entry_rounds = $("#entry_rounds").val(),
  entry_comment = $("#entry_comment").val(),
  exercise_entries = [];

  $(".exercise_fs").each(function (index, exercise_fs) {
    
    var ex_name = $(this).children('legend:first').text(),
    distance = $(this).find('#ex_distance').val(),
    distance_unit = $(this).find('#unit_distance').text(),
    weight = $(this).find('#ex_weight').val(),
    ex_reps = $(this).find('#ex_reps').val(),
    cal = $(this).find('#ex_cal').val(),
    ex_time = timeToNumber($(this).find('#ex_time').val());
    var exerciseEntry = {ex_name, distance, distance_unit, weight, ex_reps, cal, ex_time};

    exercise_entries.push(exerciseEntry);

  });

  var newEntry = {wod_date, exercise_entries, entry_time, entry_rounds, entry_comment};

  $.post("entries", newEntry, function (result) {
  });
  // $(".exerciselist").remove();
  // getExerciseList();

  //setzt die Eingabemaske zurück
  //leer die Formularfelder
  $("#wod_entry_form").trigger("reset");
  //löscht alle Boxen für Übungen
  $("#exercises_grp").children().remove();
  //setzt das WOD-Datum auf heute zurück
  setDateInputs();

  //schließt die Eingabemaske
  dialog_entry.dialog("close");
});

};//ende der main funktion


//jQuery Funktion, die aufgerufen wird, wenn das Dokument startklar ist
$(document).ready(main);

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//--------hier fangen die Funktionsdefinitionen an-----------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//gibt ein formatiertes Datum aus
//Format ist iso oder landestypisch nach locale
function getDate (locale, nrDays) {
	var d = new Date();
  d.setDate(d.getDate() + nrDays);

  if (locale == "iso") {
    return d.toISOString().slice(0, 10);
  }
  else {
   return d.toLocaleDateString(locale);
 }
}

//holt die WOD-Beschreibung von der crossfit mainsite nach Datum
function getCFMain (wodDate) {
	var CFurl = "https://www.crossfit.com/workout/" + wodDate;

	return $.ajax({
    url: CFurl,
    type: 'get',
    dataType: 'html'
  });
}

//schreibt die WOD-Beschreibung in die Box
function writeWodDesc(data) {
  var beschreibung = $("<p>").html(data).find(".content");
  $(beschreibung).replaceAll(".content");
}

//setzt Datum im Datumsfeld der Mainsite und aktualisiert die WOD-Beschreibung
function changeWODDate(nrDays) {
    //heutiges Datum in den Datumsbutton setzen
    $("#wod_date_btn").html(getDate("de", nrDays));
    //WOD-Beschreibung von heute in der Box anzeigen
    getCFMain(getDate("ja", nrDays)).done(writeWodDesc);
}

// ExerciseListe holen
function getExerciseList() {
  $.getJSON("/exercises.json", function (exerciseList) {
    exerciseList.forEach(function (exercise) {
      var $exerciseEntry = $("<button>").text(exercise.name);
      $($exerciseEntry).addClass("exerciselist button");
      $($exerciseEntry).addClass(exercise.type);
      $("#exerciseChoice").append($exerciseEntry);
      // $("#exerciseList").append($exerciseEntry);
    });
  });
}

// EntryListe holen
function getEntryList() {
  $.getJSON("/entries.json", function (entryList) {
    entryList.forEach(function (entry) {
      $("#latest_entries_b3").append($("<p>"), entry.entry_comment);
    });
  });
}

// Zeit in Zahl umrechnen
function timeToNumber(timeString){
  if (timeString) {
    var sec = timeString.slice(6, 8),
    min = timeString.slice(3, 5),
    time = (min * 60) + Number(sec);
    return time;
    }
  else {
    return 0;
  }
}

//datepicker beim Datumsfeld im WOD-Neueintrags-Formular
//entweder als html5-Element oder jquery-ui-datepicker
//datum auf heute setzen
function setDateInputs() {
  if (Modernizr.inputtypes.date) {
    $("#entry_date").attr("type", "date");
    $("#entry_date").val(getDate("iso", 0));
  }
  else {
    $.datepicker.setDefaults(
      $.extend(
        {'dateFormat':'dd.mm.yy'},
        $.datepicker.regional['de']
        )
      );
    $("#entry_date").attr("type", "text");
    $("#entry_date").datepicker();
    $("#entry_date").val(getDate("de", 0));
  }
}