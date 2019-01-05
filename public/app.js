// Grab the articles as a json

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    var newRow = $('<tr>');
    // newRow.attr('data-id=' + data[i]._id);
    var cell1 = $('<td>').text(data[i].title);
    var cell2 = $("<a href='www.movieweb.com" + data[i].link + "' >").text('link to article');
    var cell3 = $("<p data-id='" + data[i]._id + "'>").text('Notes').addClass('notesButton btn btn-danger btn-sm');
    
    
    newRow.append(cell1);
    newRow.append(cell2);
    newRow.append(cell3);
    
    

    $('#articles').append(newRow);
    
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".notesButton", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
 
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      
      // The title of the article
      $("#notes").append("<h6>" + data.title + "</h6>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' >Save Note</button>");

      // If there's a note in the article
      for (var j = 0; j < data.length; j++) {
      
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title[j]);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body[j]);
      
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});