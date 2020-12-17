// This is where the words go
var line = [
  {valid: true, id: 1},
  {valid: true, id: 2},
  {valid: true, special: 1, id: 3},
  {valid: true, id: 4},
  {valid: true, id: 5},
  {valid: true, id: 6},
  {valid: true, special: 2, id: 7},
  {valid: true, id: 8},
  {valid: true, id: 9},
  {valid: true, id: 10},
  {valid: true, id: 11}
]

var started = false;
var score = 0;


// Creator Ramon Meza
var pieces = [
	{"letter":"A", "value":1, "amount":9},
	{"letter":"B", "value":3, "amount":2},
	{"letter":"C", "value":3, "amount":2},
	{"letter":"D", "value":2, "amount":4},
	{"letter":"E", "value":1, "amount":12},
	{"letter":"F", "value":4, "amount":2},
	{"letter":"G", "value":2, "amount":3},
	{"letter":"H", "value":4, "amount":2},
	{"letter":"I", "value":1, "amount":9},
	{"letter":"J", "value":8, "amount":1},
	{"letter":"K", "value":5, "amount":1},
	{"letter":"L", "value":1, "amount":4},
	{"letter":"M", "value":3, "amount":2},
	{"letter":"N", "value":1, "amount":5},
	{"letter":"O", "value":1, "amount":8},
	{"letter":"P", "value":3, "amount":2},
	{"letter":"Q", "value":10, "amount":1},
	{"letter":"R", "value":1, "amount":6},
	{"letter":"S", "value":1, "amount":4},
	{"letter":"T", "value":1, "amount":6},
	{"letter":"U", "value":1, "amount":4},
	{"letter":"V", "value":4, "amount":2},
	{"letter":"W", "value":4, "amount":2},
	{"letter":"X", "value":8, "amount":1},
	{"letter":"Y", "value":4, "amount":2},
	{"letter":"Z", "value":10, "amount":1}
]

var bag = []

var start_tray

function fillBag() {
  pieces.forEach((item) => {
    for (var i = 0; i < item.amount; i++) {
      bag.push(item.letter)
    }
  });
}

function submit() {
  word_data = getWord()
  if (word_data)
    score += word_data.value
  $('#score')[0].innerHTML = score
  console.log(word_data, score);
  restore();
}

//Gets words and values from line
function getWord() {
  current_word = ''
  current_value = 0
  double_value = 1
  for (var tile of line) {
    if (!tile.letter) {
      if (current_word) {
        return {word: current_word, value: current_value*double_value}
      }
    } else {
      current_word += tile.letter
      current_value += tile.value
      if (tile.special == 1) current_value += tile.value
      if (tile.special == 2) double_value++
    }
  }
  return false
}

// Gets data of tile
function getTileData(id) {
  for (var tile of line) {
    if (tile['id'] == id) {
      return;
    }
  }
  console.log("Tile not found!");
}

// Sets data for tile slot
function setTileData(id, letter, value) {
  for (var tile of line) {
    if (tile['id'] == id) {
      tile.letter = letter
      if (!value) {
        for (var letter_data of pieces) {
          if (tile.letter == letter_data['letter'])
            tile.value = letter_data['value']
        }
      } else {
        tile.value = value
      }
      return;
    }
  }
  console.log("Tile not found!");
}

// Removes data from tile slot
function removeTileData(id) {
  for (var tile of line) {
    if (tile['id'] == id) {
      delete tile.letter
      delete tile.data
    }
  }
}

function isNext(id) {
  if (line[id-1])
    if (line[id-1].letter)
      return true

  if (line[id+1])
    if (line[id+1].letter)
      return true

  return false
}

function draggable() {
  $( ".tile" ).draggable({
    snap: '.tile-space', snapMode: 'inner',
    revert: function(event, ui) {
      var draggable = $(this).data('ui-draggable')
      for (var element of draggable.snapElements) {
        if (element.snapping) {
          if (started && !isNext(element.item.getAttribute('data-id')-1)) {
            element.snapping = false
            return true
          }
          if (element.item.children.length != 0) {
            element.snapping = false
            return true
          }
          started = true
          return false
        }
      }
      return true;
    },
    start: function (event, ui) {
      event.target.style.zIndex = '100'
      if (event.target.parentElement.getAttribute('data-stay')) {
        return false
      }
    },
    stop: function (event, ui) {

      /* Get the possible snap targets: */
      var snapped = $(this).data('ui-draggable').snapElements;

      /* Pull out only the snap targets that are "snapping": */
      var snappedTo = $.map(snapped, function(element) {
          return element.snapping ? element.item : null;
      })[0];


      var element = event.target;
      if (snappedTo) {
        removeTileData(event.target.parentNode.getAttribute('data-id'))
        event.target.parentElement.innerHTML = ''
        snappedTo.appendChild(element)
        setTileData(element.parentNode.getAttribute('data-id'), element.getAttribute('data-letter'))
      }
      event.target.style.zIndex = 'auto'
    }
  });
}


$( function() {
  fillBag();
    generate_board(line);
    generate_tray();
    draggable();
  }
);

// Renders board
function generate_board(data) {
  var board_nodes = []
  for (var x = 0; x < data.length; x++) {
    if (data[x].valid)
      slot_node = generate_slot(data[x].id, data[x].special, true)
    else
      slot_node = generate_slot(null, data[x].special)
    board_nodes.push(slot_node)
  }
  $(".board").append(board_nodes)
}

// Renders the tray for 7 tiles
function generate_tray() {
  var ids = ['one', 'two', 'tree', 'four', 'five', 'six', 'seven']
  ids.forEach((id, ids) => {
    $(".tray").append(generate_slot(id, false))
  });
  populate_tray()
}

// Fills the empty slots in the tray
function populate_tray() {
  var ids = ['one', 'two', 'tree', 'four', 'five', 'six', 'seven']
  ids.forEach((id, ids) => {
    if ($(".tray [data-id="+id + "]").children().length == 0) {
      $(".tray [data-id="+id + "]").append(getRandomTile())
    }
  });
  start_tray = $(".tray").clone()
}

function getRandomTile() {
  var index = getRandomInt(0, bag.length)
  var tile = `<div class="tile" data-letter="${bag[index]}">
      <img src="resources/tiles/Scrabble_Tile_${bag[index]}.jpg" alt="${bag[index]}">
  </div>`
  bag.splice(index, 1)
  return tile
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


// Returns a game slot node
function generate_slot(id, special, board=false) {
  if (id == null)
    return `<div class="tile-space-blank"></div>`
  return `<div class="tile-space-wrapper${special == 1 ? " double-letter": ""}${special == 2 ? " double-word": ""}">
    <div data-id="${id}" ${board ? 'data-stay="true"' : ''} class="tile-space">
    </div>
  </div>`
}


function restore(reset=false) {
  line = [
    {valid: true, id: 1},
    {valid: true, id: 2},
    {valid: true, special: 1, id: 3},
    {valid: true, id: 4},
    {valid: true, id: 5},
    {valid: true, id: 6},
    {valid: true, special: 2, id: 7},
    {valid: true, id: 8},
    {valid: true, id: 9},
    {valid: true, id: 10},
    {valid: true, id: 11}
  ]
  if (reset)
    $('.tray').replaceWith(start_tray)
  else
    populate_tray()
  $('.board').empty()
  draggable()
  generate_board(line)
  started = false
}

function restart() {
  score = 0
  restore(true)
  $('#score')[0].innerHTML = score
  bag = []
  fillBag()
}
