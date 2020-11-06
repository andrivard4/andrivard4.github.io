// ADD NEW ITEM TO END OF LIST
var node = document.createElement("li")
var textNode = document.createTextNode("cream")
node.appendChild(textNode)
document.querySelector('ul').appendChild(node)

// ADD NEW ITEM START OF LIST
var node2 = document.createElement("li")
var textNode2 = document.createTextNode("kale")
node2.appendChild(textNode2)
document.querySelector('ul').prepend(node2)

// ADD A CLASS OF COOL TO ALL LIST ITEMS
var listNodes = document.querySelector('ul').children
for (var item of listNodes) {
  item.classList.add("cool")
}

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
var node3 = document.createElement("span")
var textNode3 = document.createTextNode(listNodes.length)
node3.appendChild(textNode3)
document.querySelector('h2').appendChild(node3)
