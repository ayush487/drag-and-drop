const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  listArrays.forEach((list, index) => {
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(list))
  })
}

// Filter Arrays to remove empty items
const filterArrays = (array) => {
  const filteredArray = array.filter(item => item !== null)
  return filteredArray
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  // Append
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns()
  }
 
  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  backlogListArray = filterArrays(backlogListArray)
  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1 , progressItem, index)
  })
  progressListArray = filterArrays(progressListArray)
  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  completeListArray = filterArrays(completeListArray)
  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  onHoldListArray = filterArrays(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true
  updateSavedColumns()

}

// Update Item - Delete if necessary, or update Array value
const updateItem = (id, column) => {
  const selectedArray = listArrays[column]
  
  const selectedColumnEl = listColumns[column].children
  if(!dragging) {
    if(!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    }else {
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM()
  }
}

// Add to Column List, Reset Textbox
const addToColumn = (column) => {
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM()
}

// Show Add Item Input Box
const showInputBox = (column) => {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

// Hide item Input Box
const hideInputBox = (column) => {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

// Allow arrays to reflect Drag and Drop Items
const rebuildArrays = () => {
  
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent)
  progressListArray = Array.from(progressList.children).map(i => i.textContent)
  completeListArray = Array.from(completeList.children).map(i => i.textContent)
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent)
  
  updateDOM()
}

// When Item Starts Dragging
const drag = (e) => {
  draggedItem = e.target
  dragging = true
}

// When Ittem Enters Column
const dragEnter = (column) => {
  listColumns.forEach((el, index) => {
    if(column===index) {
      el.classList.add('over')
      currentColumn = index
    }else {
      el.classList.remove('over')
    }
  })
}

// Column Allows for Item to Drop
const allowDrop = (e) => {
  e.preventDefault()
}

const drop = (e) => {
  e.preventDefault()
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  // Add Item to Column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  // Dragging Complete
  dragging = false
  rebuildArrays()
}



// On Load
updateDOM()