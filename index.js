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




console.log("init page");


bindButtonListener("editorjs", function(clickedArea, e){
  console.log("area clicked:", clickedArea, e);
  
  // 
  // enable editing
  // 
  
  clickedArea.setAttribute("contenteditable", true);
  
  
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
  
  // move the toolbar
  toolbar_node.setAttribute(
    "style", 
    `left: ${e.target.offsetLeft + e.target.offsetWidth/2 - toolbar_width/2}px; top: calc(${e.target.offsetTop}px - ${1.8*rem}px)`
  );
  
  
  
});



// TODO: currently applying styles with css only. may want to look into ways to make this more accessible / add more semantic tags.



// TODO: if the current formatting overlaps an existing region with the same formatting, need to merge the tags
  // (oh wait - it is possible that the core code can already do this, but I've forced the selection to only operate within the same tag, as to not break the formatting of the page. as such, I don't think there's any way to implement this right now... need to fix that)

// TODO: may also be situations where you need to split a tag - think of adding bold to the center of a region that is already italicized.

function applyFormatting(name){
  console.log(name);
  
  // process the text
  // (click event returns text node)
  
  selection = window.getSelection()
  // console.log(selection);
  
  // for now, can't deal with selections that cross boundaries of different tags (like from h2 into p)
  if(selection.anchorNode == selection.focusNode){
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
  
  
  clearSelection();
});
