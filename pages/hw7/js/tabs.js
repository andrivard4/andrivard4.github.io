/* Andrew Rivard - andrew_rivard@uml.edu */

// Index of tabs added
var tab_index = 1;
// Index of last added tab
var tab_count = 0;
// describes the current tab selected
var current_tab = 1;
//
var delete_tabs = [];

$(function () {
  //Generates a tab widget
  $("#tabs").tabs({
    // on tab change, update the inputs and change current_tab
    activate: function (event, ui) {
      current_tab = Number(
        ui.newTab[0].getAttribute("aria-controls").substring(5)
      );
      if (tab_values[current_tab]) update_inputs(tab_values[current_tab]);
    },
  });
  //Add the intital tab
  addTab(true);
  $("#add-tab").click(addTab);
  $("#delete-tab").click(deleteTab);
});

function handleDelete(event) {
  const numb = event.target.id.substring(6);
  if (event.target.checked) {
    delete_tabs.push(numb);
    if (delete_tabs.length == 1) $("#delete-tab").prop("disabled", false);
  } else {
    const index = delete_tabs.indexOf(numb);
    if (index > -1) delete_tabs.splice(index, 1);
    if (delete_tabs.length == 0) $("#delete-tab").prop("disabled", true);
  }
}

// Generates the base template for a tab
function generateNodes() {
  var tab_template = `
  <li>
    <a href="#tabs-${tab_index}">Table ${tab_index}</a>
    <input type='checkbox' id="check-${tab_index}" onchange='handleDelete(event)'/>
  </li>`;
  var body_template = `
  <div id="tabs-${tab_index}">
    <div class="no-table" id="tab-${tab_index}">
      <img src="img/sad.svg" />
      <h2>No table yet...</h2>
      <p>
        Please insert proper data in the above form or adjust the sliders. If there is an error in the input address that error.
      </p>
    </div>
    <!-- Table to render -->
    <div class="table-wrapper">
      <table id="results-${tab_index}"></table>
    </div>
    <h5>Table last updated <span class="date" id="tab-${tab_index}"></span></h5>
  </div>
  `;
  return { tab: tab_template, body: body_template };
}

// Inserts a tab with out a table, set it to active
function addTab() {
  var elements = generateNodes();
  $(elements.tab).appendTo("#tabs ul");
  $(elements.body).appendTo("#tabs");
  $("#tabs").tabs("refresh");
  $("#tabs").tabs({ active: tab_count });
  tab_index++;
  tab_count++;
  if (tab_count == 1) {
    $("#input :input").prop("disabled", false);
    if (delete_tabs.length == 0) $("#delete-tab").prop("disabled", true);
    $("#xSlider").slider({ disabled: false });
    $("#ySlider").slider({ disabled: false });
  }
}

//Removes active tab, sets active tab to last added tab
function deleteTab() {
  delete_tabs.forEach((item, i) => {
    $("#tabs-" + item).remove();
    var hrefStr = "a[href='" + "#tabs-" + item + "']";
    $(hrefStr).closest("li").remove();
    tab_count--;
  });
  if (tab_count == 0) {
    $("#xSlider").slider({ disabled: true });
    $("#ySlider").slider({ disabled: true });
    $("#input :input").prop("disabled", true);
    $("#add-tab").prop("disabled", false);
  }
  $("#tabs").tabs("refresh");
  $("#tabs").tabs({ active: current_tab });
  console.log("Remove", current_tab, tab_count);
  delete_tabs = [];
  $("#delete-tab").prop("disabled", true);
}
