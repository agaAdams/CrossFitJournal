function meineFUNKTION() {
    var result;

    $.ajax({
        url: '...',
        success: function(response) {
            result = response;
            // return response; // <- I tried that one as well
        }
    });

    return result;
}

var result = meineFUNKTION(); // It always ends up being `undefined`.


The better approach is to organize your code properly around callbacks. 
In the example in the question, you can make meineFUNKTION accept a callback and use it as success callback. 
So this

var result = meineFUNKTION();
// Code that depends on 'result'
becomes

meineFUNKTION(function(result) {
    // Code that depends on 'result'
});

getCFMain(getDate()).done(writeWodDesc);

getCFMain(getDate(), function(result) {
	console.log(result);
	var beschreibung = $("<p>").html(result).find(".content");
   	$("#wod_desc").append(beschreibung);
});