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
  console.log(toolbar_node);
  
  if(toolbar_node == null){
    // create a new toolbar
    node = document.getElementsByTagName("body")[0];
      child = document.createElement("div");
      child.appendChild(document.createTextNode("hello world!"));
      child.id = editor_id;
    node.appendChild(child);
  }else{
    // do things with the toolbar
    toolbar_node.setAttribute(
      "style", 
      `left: ${e.clientX}px; top: ${e.clientY}px`
    );
  }
  
  
  
  x = window.getSelection()
  console.log(x);
  
  
    
  
});
