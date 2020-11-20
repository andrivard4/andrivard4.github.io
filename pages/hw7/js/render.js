/* Andrew Rivard - andrew_rivard@uml.edu */

var tab_values = {};
// Read input from the user and handle rendering
function getUserInput(e) {
  e.preventDefault();
  var data = [];
  const formData = new FormData(e.target);
  formData.forEach((item, i) => {
    data.push(Number(item));
  });
  tab_values[current_tab] = data;
  renderTable(createTableData(data));
}

// Generates a table given 4 inputs as a 2D array
function createTableData(data) {
  var hstart = data[0];
  var hend = data[1];
  var vstart = data[2];
  var vend = data[3];
  var numcol = hend - hstart + 2;
  var numrow = vend - vstart + 2;
  var table = [];
  for (var i = 0; i < numcol; i++) {
    table.push([]);
    for (var j = 0; j < numrow; j++) {
      table[i].push(0);
    }
  }
  table[0][0] = "";
  for (var i = 1; i < numcol; i++) table[i][0] = hstart + i - 1;
  for (var i = 1; i < numrow; i++) table[0][i] = vstart + i - 1;
  for (var i = 1; i < numcol; i++)
    for (var j = 1; j < numrow; j++) table[i][j] = table[0][j] * table[i][0];

  return { data: table, height: numcol, width: numrow };
}

// Creates a table to display on the HTML on the current tab given a 2D array
function renderTable(data) {
  var table_data = data.data;
  var height = data.height;
  var width = data.width;
  var table = document.getElementById("results-" + current_tab);
  $(".no-table#tab-" + current_tab).hide();
  table.innerHTML = "";
  $("h5").hide();
  for (var i = 0; i < height; i++) {
    let row = document.createElement("tr");
    for (var j = 0; j < width; j++) {
      let col;
      if (i == 0 || j == 0) col = document.createElement("th");
      else col = document.createElement("td");
      col.appendChild(document.createTextNode(table_data[i][j]));
      row.appendChild(col);
    }
    table.appendChild(row);
  }
  var current_date = new Date();
  $(".date#tab-" + current_tab).text(current_date.toLocaleTimeString());
  $("h5").show();
}
