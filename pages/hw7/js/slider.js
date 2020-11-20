/* Andrew Rivard - andrew_rivard@uml.edu */

// Initializes ranged sliders for the x and y values
$(function () {
  $("#xSlider").slider({
    range: true,
    min: -50,
    max: 50,
    step: 1,
    values: [-30, 40],
    slide: xChange,
  });
});
$(function () {
  $("#ySlider").slider({
    range: true,
    min: -50,
    max: 50,
    step: 1,
    values: [-10, 20],
    slide: yChange,
  });
});

// On change, update the input field numbers and validate them
function xChange(event, ui) {
  $(".range input")[ui.handleIndex].value = ui.value;
  $("input[name='one']").valid();
  $("input[name='two']").valid();
}
function yChange(event, ui) {
  $(".range input")[2 + ui.handleIndex].value = ui.value;
  $("input[name='three']").valid();
  $("input[name='four']").valid();
}

// When the input changes, if its valid, reflect that on the slider
function inputChange(target) {
  if (target.name == "one" || target.name == "two") {
    if (!$("input[name='one']").valid() || !$("input[name='two']").valid())
      return;
    var one = Number($("input[name='one']").val());
    var two = Number($("input[name='two']").val());
    $("#xSlider").slider("values", [one, two]);
  } else {
    if (!$("input[name='three']").valid() || !$("input[name='four']").valid())
      return;
    var three = Number($("input[name='three']").val());
    var four = Number($("input[name='four']").val());
    $("#ySlider").slider("values", [three, four]);
  }
}

//Given an array of 4 values, update those values then validate
//It is true that all the values in the array will be valid already given the method of adding them
function update_inputs(data) {
  $("#xSlider").slider("values", data.slice(0, 2));
  $("#ySlider").slider("values", data.slice(2, 4));
  $("input[name='one']").val(data[0]);
  $("input[name='two']").val(data[1]);
  $("input[name='three']").val(data[2]);
  $("input[name='four']").val(data[3]);
  $("input[name='one']").valid();
  $("input[name='two']").valid();
  $("input[name='three']").valid();
  $("input[name='four']").valid();
}
