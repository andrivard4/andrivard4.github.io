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

function clearTable() {
  document.getElementById("results").innerHTML = "";
}

function clearError(id) {
  let element = document.getElementById(id+'_error');
  element.innerHTML = "";
  if(!element.classList.contains("hidden")) {
    element.classList.add("hidden")
  }
}

function handleError(id, message) {
  let element = document.getElementById(id+'_error');
  console.log(id+'_error');
  element.innerHTML = message;
  element.classList.remove("hidden")
}

function validateInput(data, prev) {
  if (Number.isInteger(data)) {
    if(prev != null && prev >= data) {
      return {isValid:false, reason:"This number must be larger then the previous one"}
    }
    else if (data < -50 || data > 50) {
      return {isValid:false, reason:"Input is not within range [-50,50]."}
    }
    return {isValid:true}
  }
  return {valisValidid:false, reason:"Input must be of type integer"}
}

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
