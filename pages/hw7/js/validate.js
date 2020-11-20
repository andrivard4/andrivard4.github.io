$(function () {
  // Creates a custom rule to compare agains the lower bound
  $.validator.addMethod(
    "greaterThan",
    function (value, element, params) {
      return (
        (isNaN(value) && isNaN($(params).val())) ||
        Number(value) >= Number($(params).val())
      );
    },
    "Input must be equal to or greater then the lower bound."
  );
  // Applies a validator to the form
  $("#input").validate({
    rules: {
      one: {
        required: true,
        number: true,
        range: [-50, 50],
        step: 1,
      },
      two: {
        required: true,
        number: true,
        range: [-50, 50],
        step: 1,
        greaterThan: "input[name='one']",
      },
      three: {
        required: true,
        number: true,
        range: [-50, 50],
        step: 1,
      },
      four: {
        required: true,
        number: true,
        range: [-50, 50],
        step: 1,
        greaterThan: "input[name='three']",
      },
    },
    messages: {
      step: "Please enter an integer.",
    },
    submitHandler: function (form, event) {
      getUserInput(event);
    },
    errorElement: "div",
    errorLabelContainer: ".error",
  });
})

// Due to validators funky ways of adding rules, I decided to tie a check to an event
$("input[name='one']").change(function () {
  const val = $("input[name='two']").val();
  if (isNaN(val) || val == "") return;
  $("#input").data("validator").element("input[name='two']");
});
$("input[name='three']").change(function () {
  const val = $("input[name='four']").val();
  if (isNaN(val) || val == "") return;
  $("#input").data("validator").element("input[name='four']");
});
