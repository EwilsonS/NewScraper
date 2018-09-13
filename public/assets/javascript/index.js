$(document).ready(function () {

  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
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
        "<a class='btn btn-sm p-0 float-right btn-outline-info save'>",
        "Save",
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
      $(["<div class='alert alert-warning test-center'>",
        "<h4>No new articles</h4>",
        "</div>",
        "<div class='card>",
        "<div class='card-header text-center'>",
        "<h4>What would you like to do?</h4>",
        "</div>",
        "<div class card-body text-center>",
        "<h5><a href='/' class='scrape-new'>Fresh Scrape</a></h5>",
        "<h5><a href='/saved'>View Saved</a></h5>",
        "</div>",
        "</div>"
      ].join(""));
    articleContainer.append(emptyAlert)
  }

  function handleArticleSave(){
    var articleToSave = $(this).parents(".card").data();
    articleToSave.saved = true;
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave
    })
    .then(function(data){
      if(data.ok){
        initPage();
      }
    });
  }

  function handleArticleScrape(){
    $.get("/api/fetch")
    .then(function(data){
      initPage();
      bootbox.alert("<h3 class='text-center'>" + data.message + "</h3>")
    })
  }
})