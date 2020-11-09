// Read input from the user and handle rendering
function getUserInput(e) {
  document.getElementById("no-table").style.display = "block";
  e.preventDefault();
  clearTable();
  var data = [];
  const formData = new FormData(e.target)
  formData.forEach((item, i) => {
    data.push(Number(item))
  });
  renderTable(createTableData(data));
}

// Empty the table
function clearTable() {
  $("#results").innerHTML = "";
  $("h5").hide();
}

// Generates a table given 4 inputs as a 2D array
function createTableData(data) {
  var hstart = data[0];
  var hend = data[1];
  var vstart = data[2];
  var vend = data[3];
  var numcol = hend-hstart + 2;
  var numrow = vend-vstart + 2;
  var table=[];
  for(var i=0; i<numcol; i++) {
    table.push([])
    for(var j=0; j<numrow; j++) {
      table[i].push(0);
    }
  }
  table[0][0] = ""
  for(var i=1; i<numcol; i++)
    table[i][0] = hstart+i-1;
  for(var i=1; i<numrow; i++)
    table[0][i] = vstart+i-1;
  for(var i=1; i<numcol; i++)
    for(var j=1; j<numrow; j++)
      table[i][j] = table[0][j] * table[i][0];

  return {data: table, height:numcol, width:numrow};
}

// Creates a table to display on the HTML page given a 2D array
function renderTable(data) {
  var table_data = data.data;
  var height = data.height;
  var width = data.width;
  var table = document.getElementById("results");
  document.getElementById("no-table").style.display = "none";
  table.innerHTML = "";
  for(var i=0; i<height; i++) {
    let row = document.createElement("tr");
    for(var j=0; j< width; j++) {
      let col;
      if(i==0 || j==0)
         col = document.createElement("th");
      else
        col= document.createElement("td");
      col.appendChild(document.createTextNode(table_data[i][j]));
      row.appendChild(col);
    }
    table.appendChild(row);
  }
  var current_date = new Date();
  $("#date").text(current_date.toLocaleTimeString())
  $("h5").show();
}

//Make the line look cool
async function animate_line() {
  var index = 50, direction = false;
  var line = document.getElementById("line");
  while(true) {
    var color = "linear-gradient(90deg, rgba(255,190,0,1) 0%, rgba(255,113,0,1) "+index+"%, rgba(255,190,0,1) 100%)"
    line.style.background = color;
    if(index <= 10 || index >= 90) {
      direction = !direction;
    }
    if(direction) {
      index--;
    } else {
      index++;
    }
    await sleep(20)
  }
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

window.addEventListener("DOMContentLoaded", animate_line);
