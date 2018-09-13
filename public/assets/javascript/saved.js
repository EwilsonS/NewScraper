$(document).ready(function () {

  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-save", handleNoteDelete);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=true")
      .then(function (data) {
        if (data && data.length) {
          renderArticles(data);
        }
        else {
          renderEmpty();
        }
      });
  }

  function renderArticles(articles) {
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }

    articleContainer.append(articleCards)
  }

  function createCard(article) {
    var card =
      $(["<div class='card mb-2'>",
        "<div class='card-header p-1'>",
        "<h6>",
        "<a href=' " + article.url+ "'>",
        article.headline,
        "<a class='btn btn-sm p-0 float-right btn-outline-danger delete'>",
        "Delete",
        "</a>",
        "</h6>",
        "</div>",
        "<div class='card-body p-1'>",
        "<p class='summary'>",
        "<img class='float-left mr-1' src='"+article.image+ "' width='150px'>",
        article.summary,
        "</p>",
        "</div>",
        "</div>"
      ].join(""));

    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    var emptyAlert =
      $(["<div class='alert alert-dark text-center'>",
        "<h4>No Saved Articles</h4>",
        "<div class='card>",
        "<div class='card-header text-center'>",
        "<h5>What would you like to do?</h5>",
        "</div>",
        "<div class card-body text-center>",
        "<h6><a href='/' class='scrape-new'>Fresh Scrape</a></h6>",
        "<h6><a href='/saved'>View Saved</a></h6>",
        "</div>",
        "</div>",
        "</div>"
      ].join(""));
    articleContainer.append(emptyAlert)
  }

  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        "No notes yet, be the first!",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    }
    else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $([
          "<li class='list-group-item note'>",
          data.notes[i].noteText,
          "<button class = btn btn-sm btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));
        currentNote.children("button").data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
  }

  function handleArticleDelete() {
    var articleToDelete = $(this).parents(".card").data();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    })
      .then(function (data) {
        if (data.ok) {
          initPage();
        }
      });
  }

  function handleArticleNotes() {
    var currentArticle = $(this).parents(".card").data();
    $.get("/api/notes/" + currentArticle._id)
      .then(function (data) {
        var modalText = [
          "<div class='container-fluid text-center'>",
          "<h4>Notes For Article: ",
          currentArticle._id,
          "</h4>",
          "<hr />",
          "<ul class='list-group note-container'>",
          "</ul>",
          "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
          "<buttons class='btn btn-success save'>Save Note</button>",
          "</div>"
        ].join("");

        bootbox.dialog({
          message: modalText,
          closeButton: true
        });
        var noteData = {
          _id: currentArticle._id,
          notes: data || []
        };

        $(".btn.save").data("article", noteData);

        renderNotesList(noteData)
      })
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();

    if (newNote) {
      noteData = {
        _id: $(this).data("article"._id),
        noteText: newNote
      };
      $.post("api/notes", noteData)
        .then(function () {
          bootbox.hideAll();
        })
    }
  }
  function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");

    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    })
      .then(function () {
        bootbox.hideAll()
      });
  }
});