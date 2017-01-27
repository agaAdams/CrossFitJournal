// var roundFieldset = $("#round_fs").clone();

//WOD-Typ-Buttons öffnen generische Eingabemaske
	// $("#wod_type_lbl").text($(this).text());
  // toggleExerciseDeleteButton();
  // toggleRoundDeleteButton();

//Übung auswählen
  //Übungsliste schließen
  // toggleExerciseDeleteButton();

//Übung löschen
// toggleExerciseDeleteButton();
// $(".exercise_fs").last().css('float','none');
//exercises = exercises -1;

//neue Runde hinzufügen
/*$(document).on('click', '#add_round_btn', function() {
  $(this).prev().after($(".round_fs").last().clone());
  $(".round_fs").css("float", "left");
  $(".round_fs").css("width", "200px");
  $(".round_fs").css("margin-left", "5px");
  toggleRoundDeleteButton();
  rounds = rounds + 1;
  // $(".round_fs").last().children().first().text("Round " + rounds);
  $("#total_rounds").val(rounds);
});*/

//Runde löschen
/*$(document).on('click', '#remove_round_btn', function() {
  $(this).parent().remove();
  toggleRoundDeleteButton();
  //rounds = rounds - 1;
});*/

//versteckt den remove_exercise_btn, wenn es nur ein Exercise gibt
/*function toggleExerciseDeleteButton() {
  var n = $(".remove_exercise_btn").length;
  if (n < 2) {
    $(".remove_exercise_btn").eq(0).hide();
  }
  else {
    $(".remove_exercise_btn").eq(0).show();
  }
}*/

//versteckt den remove_round_btn, wenn es nur eine Runde gibt
/*function toggleRoundDeleteButton() {
 var n = $(".remove_round_btn").length;
  if (n < 2) {
    $(".remove_round_btn").eq(0).hide();
  }
  else {
    $(".remove_round_btn").eq(0).show();
  }
}*/
