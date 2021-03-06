//die main funktion, die an den document ready state übergeben wird
var main = function () {

//--------------------------------------------------------
//------------Globale Variablen--------------------------
//--------------------------------------------------------
var days = 0;

//------------Globale Objekte--------------------------
//generisches Fieldset für einen Übungseintrag im WOD-Eintrag
var $exerciseFieldset = '<fieldset id="exercise_fs" class="exercise_fs"><legend>E</legend><button id="remove_exercise_btn" class="remove_exercise_btn" type="button">-E</button></fieldset>';
//Vorgaben für generisches Dialogfenster
var dialogPresets = {
  autoOpen: false,
  height: "auto",
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
dialog_entry.dialog({title: "Enter your WOD data", dialogClass: "no-close"});

//overlay zur Übungsauswahl
dialog_exercise = $("#exerciseChoice").dialog(dialogPresets);
dialog_exercise.dialog({title: "Choose an exercise"});

//overlay zur Eingabe einer neuen Übung
dialog_add_exercise = $("#newExerciseEntry").dialog(dialogPresets);
dialog_add_exercise.dialog({title: "Add a new exercise"});

//Bestätigungsdialog zum Verwerfen eines WOD-Eintrags
dialog_confirm = $("#dialog_confirm").dialog(dialogPresets);
dialog_confirm.dialog({
  width: "auto",
  buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Discard: function() {
            $( this ).dialog( "close" );
            //schließt die Eingabemaske
            dialog_entry.dialog("close");
            clearEntryDialog();
          }
        }
});

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
	//öffnet die Dialogmaske und erneuert die Liste der Übungen
  dialog_add_exercise.dialog("open");
  $(".exerciselist").remove();
	getExerciseList($(this).attr("id"));
});

//neu erstelle Übung abspeichern
$(document).on('click', '#save_exercise_btn', function() {
  //Entfernt vorhergehende Nachrichten
  $("#alert").remove();

//erstellt ein Objekt für den Exercise-Eintrag
  var message, name = $("#exerciseName").val(),
    type = $("#exerciseTypeDD").val(),
    newExercise = {name, type};

//prüft, ob es einen Eintrag mit dem Namen bereits gibt
  $.getJSON("/exercises.json", function (exerciseList) {
    //ein Array aus Objekten, die einen solchen Namen bereits haben wird erstellt
    var result = $.grep(exerciseList, function(exercise){
      return exercise.name == name;
    });

//falls es ein solches Objekt nicht gibt, wird es in die DB eingetragen
    if (result.length == 0) {
      $.post("exercises", newExercise, function (result) {});
      message = name + " saved";
      $("#exerciseName").val("");

      //lädt die Übungsliste neu
      $(".exerciselist").remove();
      getExerciseList("create_exercise_btn");

    }
    //falls es das gibt, erscheint nur eine entsprechende Meldung
    else {
      message = name + " already exists";
    }

    $("#exerciseTypeDD").after("<span id='alert'>");
    $("#alert").text(message);
  });
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

//neue Übung zum WOD-Eintrag hinzufügen
$(document).on('click', '#add_exercise_btn', function() {
  //öffnet die Übungsliste und lädt sie neu
  dialog_exercise.dialog("open");
  $(".exerciselist").remove();
  getExerciseList($(this).attr("id"));
  //markiert den auslösenden Button
  $(this).addClass("pressed");
});

//neue Runde zum WOD-Eintrag hinzufügen
$(document).on('click', '#add_round_btn', function() {
  //der letzte Rundeneintrag wird geklont und der Clon hinter diesem eingefügt
  $(".round_fs").last().clone().insertAfter($(".round_fs").last());
  //der Rundenzähler im Fenster wird hochgesetzt
  $("#entry_rounds").val(function(i, oldval) {
    return ++oldval;
  });

  //RundenLöschButtons sichtbar machen
  $(".remove_round_btn").css({"display": "inline"});

});

//Übung für den WOD-Eintrag auswählen
$(document).on("click", ".exerciselist", function() {
  //html-Felder für die Übung
  var $fs = $exerciseFieldset,
  $weightInput = '<input type="number" id="ex_weight" name="ex_weight" value="0" min="0" max="99">kg',
  $repsInput = '<input type="number" id="ex_reps" name="ex_reps" value="0" min="0" max="999">reps',
  $distanceInput = '<input type="number" id="ex_distance" name="ex_distance" value="0" min="0" max="999"><label id="unit_distance" name="unit_distance">m',
  $caloriesInput = '<input type="number" id="ex_cal" name="ex_cal" value="0" min="0" max="999">cal',
  $exerciseTimeInput = '<input type="time" id="ex_time" name="ex_time" step="1" min="00:00:00" max="00:59:59" value="00:00:00">';

  //die Runde finden, in die die Übung eingefügt werden soll
  var $group = $(".pressed").prev();

  //Übungs Fieldset mit titel einfügen
  $($group).children().last().css({"float":"left", "margin-left":"5px"});
  $($group).append($fs);
  $($group).children().last().children().first().text($(this).text());

//je nach Übungstyp felder setzen
  if($(this).hasClass("lift")){
    $($group).children().last().children().last().before($weightInput);
    $($group).children().last().children().last().before($repsInput);
  }
  else if ($(this).hasClass("bodyweight")) {
    $($group).children().last().children().last().before($repsInput);
    $($group).children().last().children().last().before($exerciseTimeInput);
  }
  else if ($(this).hasClass("endurance")) {
    $($group).children().last().children().last().before($distanceInput);
    $($group).children().last().children().last().before($caloriesInput);
    $($group).children().last().children().last().before($exerciseTimeInput);
  }

  //Übungsliste schließen
  dialog_exercise.dialog("close");
  //Markierung vom Button löschen
  $(".add_exercise_btn").removeClass("pressed");
});

//Übung löschen
$(document).on('click', '#remove_exercise_btn', function() {
  $(this).parent().remove();
});

//Runde löschen
$(document).on('click', '#remove_round_btn', function() {
  //das Elternobjekt des Buttons (Runden Fieldset) wird samt Inhalt gelöscht
  $(this).parent().remove();
  //der Rundenzähler im Fenster wird runtergesetzt
  $("#entry_rounds").val(function(i, oldval) {
    return --oldval;
  });
  //falls es nur noch eine Runde gibt, wird der RundeLöschButton versteckt
  if ($(".round_fs").length < 2) {
    $(".remove_round_btn").css({"display": "none"});
  }
});

//Eintragsfenster schließen
$(document).on( "click", "#discard_entry_btn", function() {
  //Bestätigungsdialog wird eingeblendet
  dialog_confirm.dialog("open");
} );


//Daten aus dem Fenster sammeln und in die DB eintragen
$(document).on('click', '#save_entry_btn', function() {
  //Variablen für die Fenstereinträge
  var wod_date = $("#entry_date").val(), //WOD-Datum
  entry_time = timeToNumber($("#entry_time").val()), //WOD-Gesamtzeit
  entry_rounds = $("#entry_rounds").val(), //WOD-Rundenzahl
  entry_comment = $("#entry_comment").val(), //Kommentar
  round_entries = []; //array mit Rundeneinträgen

  //jedes Runden Fieldset wird ausgelesen
  $(".round_fs").each(function (index, round_fs) {
    //jede Runde bekommt eine Nummer
    var round_nr = index + 1,
    exercise_entries = []; //und ein array mit Übungseinträgen

    //jedes Übungs Fieldset wird ausgelesen
    $(round_fs).find($(".exercise_fs")).each(function (index, exercise_fs) {
      //Variablen für die Übungseinträge
      var ex_name = $(this).children('legend:first').text(), //Name
      distance = $(this).find('#ex_distance').val(), //Entfernung
      distance_unit = $(this).find('#unit_distance').text(), //Entfernungseinheit
      weight = $(this).find('#ex_weight').val(), //Gewicht
      ex_reps = $(this).find('#ex_reps').val(), //Wiederholungen
      cal = $(this).find('#ex_cal').val(), //Kalorien
      ex_time = timeToNumber($(this).find('#ex_time').val()); //Übungszeit
      
      //das Übungsobjekt aus allen obigen Einträgen bestehend
      var exerciseEntry = {ex_name, distance, distance_unit, weight, ex_reps, cal, ex_time};
      //das Übungsobjekt wird in das array mit Übungseinträgen hinzugefügt
      exercise_entries.push(exerciseEntry);
    });

    //das Rundenobjekt, bestehend aus der Rundennummer und dem array mit Übungseinträgen dieser Runde
    var roundEntry = {round_nr, exercise_entries};
    //das Rundenobjekt wird in das Array mit Rundeneinträgen hinzugefügt
    round_entries.push(roundEntry);
  });

  //das Eintragsobjekt, bestehend aus allen Fensterdaten
  var newEntry = {wod_date, round_entries, entry_time, entry_rounds, entry_comment};

  //das Eintragsobjekt wird über die post-Rute an den server geschickt
  $.post("entries", newEntry, function (result) {
  });

  //das Fenster wird zurückgesetzt
  clearEntryDialog();

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

// ExerciseListe holen und auflisten
function getExerciseList(sender) {
  //vom server aus der DB die Liste an Übungen holen
  $.getJSON("/exercises.json", function (exerciseList) {
    //die Liste durchgehen
    exerciseList.forEach(function (exercise) {
      //für jedes Element der Liste einen Button erstellen
      var $exerciseEntry = $("<button>").text(exercise.name);
      $($exerciseEntry).addClass("exerciselist button");
      $($exerciseEntry).addClass(exercise.type);

      //je nach sender die Liste ins DOM einfügen
      if (sender == "add_exercise_btn") {
        //zur Liste für den WOD-Eintrag
        $("#exerciseChoice").append($exerciseEntry);
      }
      else if (sender == "create_exercise_btn") {
        //zur Liste für das erstellen neuer Übungen
        $("#exerciseList").append($exerciseEntry);
      }
    });
  });
}

//Liste mit WOD-Einträgen holen und auf der Hauptseite anzeigen
function getEntryList() {
  //vom server aus der DB die Liste an WOD-Einträgen holen
  $.getJSON("/entries.json", function (entryList) {
    //die Liste durchgehen
    entryList.forEach(function (entry) {
      //generisches div für je einen WOD_eintrag erstellen
      var $latestEntryDiv = $("<div class='latestEntry'>");
      //Datum setzen
      $($latestEntryDiv).append('<h4 class="le_date">');
      $($latestEntryDiv).find(".le_date").text(entry.wod_date.slice(0, 10));

      //Eintragstitel, falls der Rundenzähler mehr als eine Runde hat
      $($latestEntryDiv).append('<h3>');
      if (entry.entry_rounds > 1) {
        var lf_roundheader = entry.entry_rounds + " Rounds for Time";
        $($latestEntryDiv).find("h3").text(lf_roundheader);
      }

      //Rundeneinträge
      entry.round_entries.forEach(function (round) {
        //Rundennummern, falls mehr als eine Runde
        if (entry.round_entries.length > 1) {
          $($latestEntryDiv).append('<p class="ls_roundnr">')
          $($latestEntryDiv).find(".ls_roundnr").text('Round', round.round_nr);
        }

        //Übungseinträge
        round.exercise_entries.forEach(function (exercise, index) {
          //der Text des Übungseintrag variiert je nach Übungstyp und eingetragenen Daten
          var lf_exerciseentry;
          //Ausdauerübungen auf Entfernung
          if (exercise.distance) {
            lf_exerciseentry = exercise.distance + exercise.distance_unit + " " + exercise.ex_name;
          }
          //Ausdauerübungen mit Kalorien und ggf. Zeitangaben
          else if (exercise.cal) {
            if (exercise.ex_time) {
              lf_exerciseentry = numberToTime(exercise.ex_time) + " " + exercise.ex_name + ", " + exercise.cal + "cal ";
            }
            else {
              lf_exerciseentry = exercise.cal + "cal " + exercise.ex_name;
            }
          }
          //Übungen mit Gewichten
          else if (exercise.weight) {
            lf_exerciseentry = exercise.ex_reps + " " + exercise.ex_name + " " + exercise.weight + "kg";
          }
          //Übungen mit einer Zeitkomponente
          else if (exercise.ex_time) {
            lf_exerciseentry = numberToTime(exercise.ex_time) + " " + exercise.ex_name;
          }
          //übrige Übungen nach Wiederholungen
          else {
            lf_exerciseentry = exercise.ex_reps + " " + exercise.ex_name;
          }

          //jede Übung erhält eine eigene Eintragszeile
          var lf_exnr = "ex_" + index;
          $('<p>').attr("id", lf_exnr).appendTo($latestEntryDiv);
          var lf_exnrid = "#" + lf_exnr;
          $($latestEntryDiv).find(lf_exnrid).text(lf_exerciseentry);
        });
      });

      //Gesamtzeit des WODS, falls vorhanden
      if (entry.entry_time) {
        var totalTime = numberToTime(entry.entry_time);
        $($latestEntryDiv).append('<h3 class="lf_totaltime">');
        $($latestEntryDiv).find(".lf_totaltime").text('Total Time '+ totalTime);
      }
      //Kommentar zum WOD
      $($latestEntryDiv).append('<p class="lf_comment">');
      $($latestEntryDiv).find(".lf_comment").text(entry.entry_comment);

      //das gefüllte DIV wird in die Liste eingefügt
      $("#latest_entries_b3").append($latestEntryDiv);
    });
  });
}

// Zeit in Zahl umrechnen
function timeToNumber(timeString){
  //falls eine Zahl übergeben wird
  if (timeString) {
    //Sekunden umwandeln
    var sec = timeString.slice(6, 8),
    //Minuten umwandeln
    min = timeString.slice(3, 5),
    time = (min * 60) + Number(sec);
    return time;
    }
  else {
    return 0;
  }
}

function numberToTime(timeNumber){
  var minutes, seconds;
  //falls es eine gerade Minutenzahl gibt
  if (timeNumber % 60 == 0) {
    minutes = (timeNumber / 60) + " min";
    return minutes;
  }
  //ansonsten werden Minuten mit Restsekunden ausgegeben
  else {
    minutes = Math.floor(timeNumber / 60) + " min ";
    seconds = (timeNumber % 60) + " sec";
    return minutes + seconds;
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

//setzt die Eingabemaske für den WOD-Eitnrag zurück
function clearEntryDialog() {
  //leer die Formularfelder
  $("#wod_entry_form").trigger("reset");
  //löscht alle Runden bis auf eine
  while ($(".round_fs").length > 1) {
    $(".round_fs").last().remove();
  }
  //versteckt den Runden löschen Button
  $(".remove_round_btn").css({"display": "none"});
  //löscht alle Boxen für Übungen
  $("#exercises_grp").children().remove();
  //setzt das WOD-Datum auf heute zurück
  setDateInputs();
}