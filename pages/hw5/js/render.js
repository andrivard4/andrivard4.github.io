// Read input from the user and handle rendering
function getUserInput(e) {
  document.getElementById("no-table").style.display = "block";
  var error = false;
  e.preventDefault();
  clearTable();
  var all_data = ["one", "two", "three", "four"];
  const formData = new FormData(e.target);
  for (var i = 0; i < all_data.length; i++) {
    const data = Number(formData.get(all_data[i]));
    var prev = null;
    if(i%2)
      prev = all_data[i-1]
    const valid = validateInput(data, prev);
    if (valid.isValid) {
      clearError(all_data[i])
      all_data[i] = data;
    }
    else {
      handleError(all_data[i], valid.reason)
      all_data[i] = NaN;
      error = true;
    }
  }
  if(!error) {
    renderTable(createTableData(all_data));
  }
}

// Empty the table
function clearTable() {
  document.getElementById("results").innerHTML = "";
}

// Empty any error messages
function clearError(id) {
  let element = document.getElementById(id+'_error');
  element.innerHTML = "";
  if(!element.classList.contains("hidden")) {
    element.classList.add("hidden")
  }
}

// Set an error message
function handleError(id, message) {
  let element = document.getElementById(id+'_error');
  console.log(id+'_error');
  element.innerHTML = message;
  element.classList.remove("hidden")
}

// Make sure input is a valid Number
// Return in form of an object
// isValud: bool if input is valid
// reason: message explainging why not valid
function validateInput(data, prev) {
  if (Number.isInteger(data)) {
    if(prev != null && prev > data) {
      return {isValid:false, reason:"This number must be larger then the previous one"}
    }
    else if (data < -50 || data > 50) {
      return {isValid:false, reason:"Input is not within range [-50,50]."}
    }
    return {isValid:true}
  }
  return {valisValidid:false, reason:"Input must be of type integer"}
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
