function bindButtonListener(id, fn){
  clickedArea = document.getElementById(id);
  clickedArea.addEventListener("click", (e) => { fn(clickedArea, e);}, false);
}

function bindFormattingListener(name, fn){
  node = document.querySelector(`#editor-toolbar > .fa-${name}`);
  node.addEventListener("click", (e) => { fn(name, e);}, false);
}


// clear selection
function clearSelection(){
  // https://stackoverflow.com/questions/6562727/is-there-a-function-to-deselect-all-text-using-javascript
  document.getSelection().collapseToEnd()
}

// get current block element. ignore inline elements like <span> or <a> used for formatting of text and get the surrounding semantic block instead. (not the structural block, which would be the <div> that holds the content)
function getCurrentBlock(node){
  // if input is a selection, then convert from a text node to a "real" HTML tag by getting the node where the selection started
  if(node instanceof Selection){
    node = node.anchorNode.parentElement;
  }
  
  // within the selection, there's a Text object, which holds the content of the "real" HTML tag. But I need to get the proper tag.
  if(node instanceof Text){
    node = node.parentElement;
  }
  
  // now the node must be a "real" HTML tag
  if(node.tagName == "SPAN" || node.tagName == "A"){
    return node.parentNode;
  }else{
    return node;
  }
}




console.log("init page");


bindButtonListener("editorjs", function(clickedArea, e){
  console.log("area clicked:", clickedArea, e);
  
  // 
  // enable editing
  // 
  
  clickedArea.setAttribute("contenteditable", true);
  activeArea = clickedArea; // global variable
  
  // 
  // manage toolbar
  // 
  
  // make toolbar visible
  toolbar_node = document.getElementById("editor-toolbar");
  toolbar_node.classList = ['visible'];
    
  // do things with the toolbar
  toolbar_width = 
        window
        .getComputedStyle(toolbar_node)
        .getPropertyValue('width')
        .match(/\d+/);
  
  body = document.getElementsByTagName("body")[0];
  
  rem = window
        .getComputedStyle(body)
        .getPropertyValue('font-size')
        .match(/\d+/);
  
  currentBlock = getCurrentBlock(e.target);
  
  // move the toolbar
  toolbar_node.setAttribute(
    "style", 
    `left: ${currentBlock.offsetLeft + currentBlock.offsetWidth/2 - toolbar_width/2}px; top: calc(${currentBlock.offsetTop}px - ${1.8*rem}px)`
  );
  
  
  
});



// TODO: currently applying styles with css only. may want to look into ways to make this more accessible / add more semantic tags.



// TODO: if the current formatting overlaps an existing region with the same formatting, need to merge the tags
  // (oh wait - it is possible that the core code can already do this, but I've forced the selection to only operate within the same tag, as to not break the formatting of the page. as such, I don't think there's any way to implement this right now... need to fix that)

// TODO: may also be situations where you need to split a tag - think of adding bold to the center of a region that is already italicized.

// TODO: prevent creation of zero-width spans (spans with no characters inside them)

function applyFormatting(name){
  activeArea; // global variable
  
  console.log(name);
  
  // process the text
  // (click event returns text node)
  
  selection = window.getSelection()
  console.log(activeArea);
  console.log(selection);
  
  // for now, can't deal with selections that cross boundaries of different tags (like from h2 into p)
  
  var startNode = getCurrentBlock(selection.anchorNode);
  var endNode = getCurrentBlock(selection.focusNode);
  
  if(startNode == endNode){
    // https://stackoverflow.com/questions/6328718/how-to-wrap-surround-highlighted-text-with-an-element
    
    let sel = selection.getRangeAt(0);
      let selectedContent = sel.extractContents();
      var span = document.createElement("span");
      span.classList.add(name) 
      span.appendChild(selectedContent);
    sel.insertNode(span);
    
    
    // selection.anchorOffset
  }
  
  clearSelection();
}

bindFormattingListener("bold", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("italic", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("underline", function(name, e){
  applyFormatting(name);
});

// TODO: implement adding links to existing text
// TODO: implement removing links
// TODO: implement editing existing links
bindFormattingListener("link", function(name, e){
  console.log(name);
});

bindFormattingListener("highlighter", function(name, e){
  applyFormatting(name);
});

bindFormattingListener("remove-format", function(name, e){
  console.log(name);
  
  // Find any span tags within the selected region that include the classes bold, italic, underline, or highligher, and remove them. Don't just remove the classes - actually remove the entire tags.
  
  
  // process the text
  // (click event returns text node)
  
  selection = window.getSelection()
  console.log(activeArea);
  console.log(selection);
  
  // for now, can't deal with selections that cross boundaries of different tags (like from h2 into p)
  
  var startNode = getCurrentBlock(selection.anchorNode);
  var endNode = getCurrentBlock(selection.focusNode);
  
  if(startNode == endNode){
    console.log('node: ', startNode);
    
    
    
    
  }
  
  
  
  clearSelection();
});
