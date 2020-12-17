// Andrew Rivard - andrew_rivard@student.uml.edu
// This is where the words go
var line = [
  { valid: true, id: 1 },
  { valid: true, id: 2 },
  { valid: true, special: 1, id: 3 },
  { valid: true, id: 4 },
  { valid: true, id: 5 },
  { valid: true, id: 6 },
  { valid: true, special: 2, id: 7 },
  { valid: true, id: 8 },
  { valid: true, id: 9 },
  { valid: true, id: 10 },
  { valid: true, id: 11 },
];

var started = false;
var score = 0;
var sub = 0;
var bag = [];
var discarded = [];
var words = [];

// Creator Ramon Meza
var pieces = [
  { letter: "A", value: 1, amount: 9 },
  { letter: "B", value: 3, amount: 2 },
  { letter: "C", value: 3, amount: 2 },
  { letter: "D", value: 2, amount: 4 },
  { letter: "E", value: 1, amount: 12 },
  { letter: "F", value: 4, amount: 2 },
  { letter: "G", value: 2, amount: 3 },
  { letter: "H", value: 4, amount: 2 },
  { letter: "I", value: 1, amount: 9 },
  { letter: "J", value: 8, amount: 1 },
  { letter: "K", value: 5, amount: 1 },
  { letter: "L", value: 1, amount: 4 },
  { letter: "M", value: 3, amount: 2 },
  { letter: "N", value: 1, amount: 5 },
  { letter: "O", value: 1, amount: 8 },
  { letter: "P", value: 3, amount: 2 },
  { letter: "Q", value: 10, amount: 1 },
  { letter: "R", value: 1, amount: 6 },
  { letter: "S", value: 1, amount: 4 },
  { letter: "T", value: 1, amount: 6 },
  { letter: "U", value: 1, amount: 4 },
  { letter: "V", value: 4, amount: 2 },
  { letter: "W", value: 4, amount: 2 },
  { letter: "X", value: 8, amount: 1 },
  { letter: "Y", value: 4, amount: 2 },
  { letter: "Z", value: 10, amount: 1 },
];

// Ensures the word is valid
function validateWord(word) {
  return valid.find(function (el) {
    return el == word.toLowerCase();
  });
}

//Populates the bag for proper distrubution of tile selecting
function fillBag() {
  pieces.forEach((item) => {
    for (var i = 0; i < item.amount; i++) {
      bag.push(item.letter);
    }
  });
}

//Handles user submitting a word
function submit() {
  word_data = getWord();
  if (word_data) {
    if (!validateWord(word_data.word)) {
      restore(false, true);
      $("#result").html(
        `<span id='error'> ${word_data.word} is not a word! Try again...</span>`
      );
    } else {
      $("#result").html(word_data.word + " was accepted!");
      updateScore(word_data.value);
      words.push(word_data);
      restore();
    }
  }
}

// Increases score and updates it in DOM
function updateScore(change) {
  score += change;
  $("#score")[0].innerHTML = score;
}

//Updates bag count in DOM
function updateBagCount() {
  $("#tileCount")[0].innerHTML = bag.length;
}

//Gets words and values from line
function getWord() {
  current_word = "";
  current_value = 0;
  double_value = 1;
  for (var tile of line) {
    if (!tile.letter) {
      if (current_word) {
        return { word: current_word, value: current_value * double_value };
      }
    } else {
      current_word += tile.letter;
      current_value += tile.value;
      if (tile.special == 1) current_value += tile.value;
      if (tile.special == 2) double_value++;
    }
  }
  if (current_word) {
    return { word: current_word, value: current_value * double_value };
  }
  return false;
}

// Gets data of tile
function getTileData(id) {
  for (var tile of line) {
    if (tile["id"] == id) {
      return;
    }
  }
  console.log("Tile not found!");
}

// Sets data for tile slot
function setTileData(id, letter, value) {
  for (var tile of line) {
    if (tile["id"] == id) {
      tile.letter = letter;
      if (!value) {
        for (var letter_data of pieces) {
          if (tile.letter == letter_data["letter"])
            tile.value = letter_data["value"];
        }
      } else {
        tile.value = value;
      }
      return;
    }
  }
  console.log("Tile not found!");
}

// Gets info about a letter
function getLetterData(letter) {
  for (var data of pieces) if (data.letter == letter) return data;
  return false;
}

// Removes data from tile slot
function removeTileData(id) {
  for (var tile of line) {
    if (tile["id"] == id) {
      delete tile.letter;
      delete tile.data;
    }
  }
}

// Checks if theres a tile next to a tile being placed
function isNext(id) {
  if (line[id - 1]) if (line[id - 1].letter) return true;

  if (line[id + 1]) if (line[id + 1].letter) return true;

  return false;
}

// Implements dragability
function draggable() {
  $(".tile").draggable({
    snap: ".tile-space",
    snapMode: "inner",
    // Will revert if function is true
    revert: function (event, ui) {
      var draggable = $(this).data("ui-draggable");
      /* Pull out only the snap targets that are "snapping": */
      var snappedTo = $.map(draggable.snapElements, function (element) {
        return element.snapping ? element.item : null;
      })[0];
      for (var element of draggable.snapElements) {
        if (element.snapping) {
          if (snappedTo.id == "trash") return false;
          if (started && !isNext(element.item.getAttribute("data-id") - 1)) {
            element.snapping = false;
            return true;
          }
          if (element.item.children.length != 0) {
            element.snapping = false;
            return true;
          }
          started = true;
          return false;
        }
      }
      return true;
    },
    // Checks to see if we want to allow the tile to be moved
    start: function (event, ui) {
      event.target.style.zIndex = "100";
      if (event.target.parentElement.getAttribute("data-stay")) {
        return false;
      }
    },
    // Moves the tile's HTML to the correct container and handles discarding
    stop: function (event, ui) {
      /* Get the possible snap targets: */
      var snapped = $(this).data("ui-draggable").snapElements;

      /* Pull out only the snap targets that are "snapping": */
      var snappedTo = $.map(snapped, function (element) {
        return element.snapping ? element.item : null;
      })[0];

      var element = event.target;
      if (snappedTo) {
        if (snappedTo.id == "trash") {
          letterData = getLetterData(event.target.getAttribute("data-letter"));
          discarded.push(event.target.getAttribute("data-letter"));
          updateScore(-1 * letterData.value);
          $(event.target).remove();
          populate_tray(1);
          started = false;
        } else {
          removeTileData(event.target.parentNode.getAttribute("data-id"));
          event.target.parentElement.innerHTML = "";
          snappedTo.appendChild(element);
          setTileData(
            element.parentNode.getAttribute("data-id"),
            element.getAttribute("data-letter")
          );
        }
        element.style.position = "";
      }
      event.target.style.zIndex = "auto";
    },
  });
}

// Main program
$(function () {
  // Initializes various dialogs
  $("#dialog-restart").dialog({
    autoOpen: false,
    draggable: false,
    modal: true,
    open: function (event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
    },
    buttons: [
      {
        text: "Yes",
        closeOnEscape: false,
        click: function () {
          restart();
          $(this).dialog("close");
        },
      },
      {
        text: "Continue",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });
  $("#dialog").dialog({
    autoOpen: false,
    draggable: false,
    modal: true,
    open: function (event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
    },
    buttons: [
      {
        text: "End Game",
        closeOnEscape: false,
        click: function () {
          showResults();
          $(this).dialog("close");
        },
      },
      {
        text: "Continue",
        click: function () {
          sub = 0;
          $(this).dialog("close");
        },
      },
    ],
  });
  $("#dialog-end").dialog({
    autoOpen: false,
    draggable: false,
    closeOnEscape: false,
    open: function (event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
    },
    width: $(window).width() * 0.8,
    maxWidth: 600,
    minWidth: 300,
    modal: true,
    buttons: [
      {
        text: "New Game?",
        click: function () {
          restart();
          $(this).dialog("close");
        },
      },
    ],
  });
  $("#dialog-rules").dialog({
    autoOpen: false,
    draggable: false,
    closeOnEscape: false,
    open: function (event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
    },
    width: $(window).width() * 0.6,
    maxWidth: 500,
    minWidth: 300,
    modal: true,
    buttons: [
      {
        text: "Got it!",
        click: function () {
          $(this).dialog("close");
        },
      },
    ],
  });
  fillBag();
  generate_board(line);
  generate_tray();
});

// Renders board
function generate_board(data) {
  var board_nodes = [];
  for (var x = 0; x < data.length; x++) {
    if (data[x].valid)
      slot_node = generate_slot(data[x].id, data[x].special, true);
    else slot_node = generate_slot(null, data[x].special);
    board_nodes.push(slot_node);
  }
  $(".board").append(board_nodes);
}

// Renders the tray for 7 tiles
function generate_tray() {
  var ids = ["one", "two", "tree", "four", "five", "six", "seven"];
  ids.forEach((id, ids) => {
    $(".tray").append(generate_slot(id, false));
  });
  populate_tray();
}

// Fills the empty slots in the tray
function populate_tray(max = false, letters = []) {
  var ids = ["one", "two", "tree", "four", "five", "six", "seven"];
  for (var i = 0, j = 0; i < ids.length && (!max || j < max); i++) {
    if ($(".tray [data-id=" + ids[i] + "]").children().length == 0) {
      if (letters.length)
        $(".tray [data-id=" + ids[i] + "]").append(generateTile(letters.pop()));
      else {
        tile = getRandomTile();
        if (tile) $(".tray [data-id=" + ids[i] + "]").append(tile);
      }
      j++;
    }
  }
  draggable();
}

// Pulls a tile from the bag
function getRandomTile() {
  if (bag.length == 0) return false;
  var index = getRandomInt(0, bag.length);
  var tile = generateTile(bag[index]);
  bag.splice(index, 1);
  updateBagCount();
  return tile;
}

// Creates a tile node
function generateTile(letter) {
  return `<div class="tile" data-letter="${letter}">
      <img src="resources/tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}">
  </div>`;
}

// Gets a random int within the range
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// Returns a game slot node
function generate_slot(id, special, board = false) {
  if (id == null) return `<div class="tile-space-blank"></div>`;
  return `<div class="tile-space-wrapper${
    special == 1 ? " double-letter" : ""
  }${special == 2 ? " double-word" : ""}">
    <div data-id="${id}" ${board ? 'data-stay="true"' : ""} class="tile-space">
    </div>
  </div>`;
}

// Restores the tray
// reset says if we want to fully reset the tray or just fill the missing spots
// replace will remove letters from the board and place them back in the tray
function restore(reset = false, replace = false) {
  if (!reset) {
    if (replace) {
      letters = [];

      line.forEach((item) => {
        if (item.letter) letters.push(item.letter);
      });

      populate_tray(false, letters);
    } else populate_tray();
    draggable();
  } else {
    $(".tray").empty();
    generate_tray();
  }
  $(".board").empty();
  generate_board(line);
  started = false;
  line = [
    { valid: true, id: 1 },
    { valid: true, id: 2 },
    { valid: true, special: 1, id: 3 },
    { valid: true, id: 4 },
    { valid: true, id: 5 },
    { valid: true, id: 6 },
    { valid: true, special: 2, id: 7 },
    { valid: true, id: 8 },
    { valid: true, id: 9 },
    { valid: true, id: 10 },
    { valid: true, id: 11 },
  ];
}

// Generates a new game
function restart() {
  score = 0;
  bag = [];
  fillBag();
  $("#result").html("");
  restore(true);
  $("#score")[0].innerHTML = score;
  discarded = [];
  words = [];
}

function end() {
  if (!bag.length == 0) {
    for (var tile of bag) {
      sub += getLetterData(tile).value;
    }
    $("#points")[0].innerHTML = sub;
    $("#dialog").dialog("open");
    return;
  }

  showResults();
}

// Show the results of the game
function generateResultWords(words) {
  return_nodes = [];
  for (var word of words) {
    if (!word) continue;
    word_result = [];
    for (var letter of word.word) {
      word_result.push(
        `<img src="resources/tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}" class="result-tile">`
      );
    }
    word_result.push("<br>");
    return_nodes.push(word_result);
  }
  console.log(return_nodes);
  return return_nodes;
}

// Makes small images to look cool on the results page
function generateResultTiles(tiles) {
  var return_nodes = [];
  for (var letter of tiles) {
    return_nodes.push(
      `<img src="resources/tiles/Scrabble_Tile_${letter}.jpg" alt="${letter}" class="result-tile">`
    );
  }
  return return_nodes;
}

// Displays the results
function showResults() {
  $(".final-score")[0].innerHTML = score - sub;
  $(".words").empty();
  generateResultWords(words).forEach((item) => {
    $(".words").append(item);
  });
  $(".discarded").empty();
  $(".discarded").append(generateResultTiles(discarded));
  $(".left").empty();
  $(".left").append(generateResultTiles(bag));
  $("#dialog-end").dialog("open");
  sub = 0;
}
