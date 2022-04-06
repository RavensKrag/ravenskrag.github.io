function bindButtonListener(id, fn){
  clickedArea = document.getElementById(id);
  clickedArea.addEventListener("click", (e) => { fn(clickedArea, e);}, false);
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
  
  editor_id = "editor-toolbar";
  
  toolbar_node = document.getElementById(editor_id);
  // => return 'null' if element with ID not found
  // console.log(toolbar_node);
  
  if(toolbar_node == null){
    // create a new toolbar
    node = document.getElementsByTagName("body")[0];
      toolbar_node = document.createElement("div");
      text_node = document.createTextNode("hello world!");
      toolbar_node.appendChild(text_node);
      toolbar_node.id = editor_id;
    node.appendChild(toolbar_node);
  }
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
