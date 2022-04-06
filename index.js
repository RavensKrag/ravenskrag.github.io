function bindButtonListener(id, fn){
  clickedArea = document.getElementById(id);
  clickedArea.addEventListener("click", (e) => { fn(clickedArea, e);}, false);
}

function bindFormattingListener(name, fn){
  node = document.querySelector(`#editor-toolbar > .fa-${name}`);
  node.addEventListener("click", (e) => { fn(name, e);}, false);
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
    `left: ${e.target.offsetLeft + e.target.offsetWidth/2 - toolbar_width/2}px; top: calc(${e.target.offsetTop}px - ${1.5*rem}px)`
  );
  
  
  
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
      span.style.backgroundColor = "lightpink";
      span.appendChild(selectedContent);
    sel.insertNode(span);
    
    
    // selection.anchorOffset
  }
  
});


bindFormattingListener("bold", function(name, e){
  console.log(name);
});

bindFormattingListener("italic", function(name, e){
  console.log(name);
});

bindFormattingListener("underline", function(name, e){
  console.log(name);
});

bindFormattingListener("link", function(name, e){
  console.log(name);
});
