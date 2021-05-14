// ADD NEW ITEM TO END OF LIST
$("ul").append("<li id='five'>cream</li>")

// ADD NEW ITEM START OF LIST
$("ul").prepend("<li id='zero'>kale</li>")

// ADD A CLASS OF COOL TO ALL LIST ITEMS
$("ul li").each( function() {
  $(this).addClass("cool")
})

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
$("h2").append("<span>" + $("ul li").length + "</span>")
