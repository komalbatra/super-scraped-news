// Grab the articles as a json

$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    // Display each article as a card
    
    var newCard = $("<div>").addClass("card");
    var newCardContain = $("<div>").addClass("card-body");
    var newCardTitle = $("<h5>").addClass("card-title").text(data[i].title);
    var newCardSummary = $("<p>").addClass("card-text").text(data[i].summary);
    var newCardLink = $("<a href='movieweb.com" + data[i].link + "'>").text('Article Link').addClass('btn btn-danger btn-sm');
    var newCardNote = $("<button type='button' data-toggle='modal' data-target='#exampleModal' data-id='" + data[i]._id + "'>").text('Add a Note').addClass('enterNote btn btn-danger btn-sm');
    var newCardSeeNotes = $("<button type='button' data-toggle='modal' data-target='#see-notes-modal' data-id='" + data[i]._id + "'>").text('Read all Notes').addClass('seeNote btn btn-danger btn-sm');


        
    newCard.append(newCardContain);
    newCard.append(newCardTitle);
    newCard.append(newCardSummary);
    newCard.append(newCardLink);
    newCard.append(newCardNote);
    newCard.append(newCardSeeNotes);
    
    

    $('#articles').append(newCard);
    
  }
});
    
// Whenever someone clicks on notesButton
$(document).on("click", ".enterNote", function() {
  // $(".modal-header").empty();
  // $("#note-title").empty();
  // $("#note-body").empty();
  // $(".modal-footer").empty();

  var thisId = $(this).attr("data-id");
  

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      
      $(".modal-header").append("<h5 class='modal-title'>" + data.title + "</h5>");
      // An input to enter a new title
      $("#note-title").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#note-body").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-footer").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-danger'>Save Note</button>");
      
      
})
})


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
      alert("Note Saved");
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// to Display notes
$(document).on("click", ".seeNote", function() {
  // Grab the id associated with the article from the submit button
   $(".modal-header").empty();
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId

  })
  // With that done, add the note information to the page
  .then(function(data) {
    console.log(data);
    $(".modal-header").append("<h5 class='modal-title'>" + data.title + "</h5>");
    
    for (var i = 0; i <data.note.length; i++) {
    console.log("length of notes" + data.note.length);
      // Display each NOTE
      $(".modal-header").append("<h5>" + data.note[i].title + "<br />" + data.note[i].body+"</p>");

    // var newModalTitle = $("<h5>").text(data.note[i].title);
    // var newModalNote = $("<p>").text(data.note[i].body);
    // var newModalDelete = $("<button type='button' data-toggle='modal' data-target='#exampleModal' data-id='" + data[i]._id + "'>").text('Delete Note').addClass('enterNote btn btn-danger btn-sm');
            
    //  $('#notes-view').append(newModalTitle + newModalNote +newModalDelete);
      }
})
});