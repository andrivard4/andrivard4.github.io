var tab_index = 1
var tab_count = 0;
var current_tab = 1
$( function() {
  $( "#tabs" ).tabs({
    activate: function(event, ui) {
      current_tab = Number(ui.newTab[0].getAttribute('aria-controls').substring(5))
      if (tab_values[current_tab]) update_inputs(tab_values[current_tab])
    }
  });
  addTab(true)
  $('#add-tab').click(addTab);
  $('#delete-tab').click(deleteTab);
} );

function generateNodes() {
  var tab_template = `
  <li>
    <a href="#tabs-${tab_index}">Table ${tab_index}</a>
  </li>`
  var body_template = `
  <div id="tabs-${tab_index}">
    <div class="no-table" id="tab-${tab_index}">
      <img src="img/sad.svg" />
      <h2>No table yet...</h2>
      <p>
        Please insert proper data in the above form. If there is an error in the
        input address that then submit again.
      </p>
    </div>
    <!-- Table to render -->
    <div class="table-wrapper">
      <table id="results-${tab_index}"></table>
    </div>
    <h5>Table last updated <span class="date" id="tab-${tab_index}"></span></h5>
  </div>
  `
  return {tab: tab_template, body: body_template}
}

function addTab() {
  var elements = generateNodes();
  $(elements.tab).appendTo('#tabs ul')
  $(elements.body).appendTo('#tabs')
  $( "#tabs" ).tabs("refresh");
  $( "#tabs" ).tabs({ active: tab_count });
  tab_index++
  tab_count++
  if (tab_count == 1) {
    $('input[type="submit"]').prop('disabled', false)
    $('#delete-tab').prop('disabled', false)
  }
}

function deleteTab() {
  $( '#tabs-'+current_tab ).remove();
   // Refresh the tabs widget
   var hrefStr = "a[href='" + '#tabs-'+current_tab + "']"
  $( hrefStr ).closest("li").remove()
  tab_count--;
  $( "#tabs" ).tabs({ active: tab_count });
  $('#tabs').tabs( "refresh" );
  if (tab_count == 0) {
    $('input[type="submit"]').prop('disabled', true)
    $('#delete-tab').prop('disabled', true)
  }
}
